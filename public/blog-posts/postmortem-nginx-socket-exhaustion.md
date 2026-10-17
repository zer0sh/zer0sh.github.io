---
title: "Post-Mortem: Diagnóstico de Timeouts 502 en NGINX y Agotamiento de Sockets en Kernel Linux"
date: "2026-10-16"
category: "Reliability & Linux"
excerpt: "Análisis técnico de un incidente real en producción: cómo una ráfaga de tráfico saturó el backlog de sockets TCP en el kernel Linux, generando errores 502 Bad Gateway intermitentes, y cómo lo remediamos."
coverImage: "/blog-posts/images/shell-builtins.png"
coverAlt: "Auditoría de sockets en kernel Linux y logs de NGINX"
---

Los incidentes en sistemas distribuidos rara vez ocurren por una sola causa. Con frecuencia, son el resultado de la fricción entre la capa de aplicación y los límites por defecto del sistema operativo subyacente.

En este post-mortem documento un incidente real en producción donde una ráfaga de tráfico legítimo provocó respuestas intermitentes `502 Bad Gateway` en NGINX. La causa no fue una caída del contenedor ni un fallo en el código, sino la saturación silenciosa de las colas de escucha TCP en el subsistema de red del kernel Linux.

---

## 1. Resumen Ejecutivo

- **Fecha:** 16 de Octubre de 2026
- **Severidad:** P1 (Degradación de Servicio)
- **Impacto en SLO:** El 1.8% de las peticiones HTTP entrantes fueron rechazadas durante una ventana de 25 minutos. Se consumió un 0.04% del presupuesto de error mensual (*Error Budget*).
- **Causa Raíz:** Desbordamiento de la cola de conexiones pendientes (*listen queue overflow*) del socket Unix/TCP debido a que los límites `net.core.somaxconn` y la directiva `backlog` de NGINX se encontraban en sus valores conservadores por defecto ante una ráfaga repentina de conexiones concurrentes.
- **Resolución:** Incremento dinámico de `somaxconn` y `tcp_max_syn_backlog` en sysctl, ajuste de `backlog` en los bloques `listen` de NGINX, y despliegue de una regla de alerta en Prometheus para detectar desbordamientos antes de que afecten a usuarios.

---

## 2. Cronología Operativa

- **14:02 UTC:** La sonda de monitoreo sintético y Prometheus disparan la alerta `High5xxHttpRate` (> 1% de errores en ventana de 2 minutos).
- **14:05 UTC:** El ingeniero on-call se conecta al bastión SSH del clúster e inspecciona el log de errores de NGINX:
  ```text
  connect() failed (111: Connection refused) while connecting to upstream, client: 198.51.100.24, server: api.internal, upstream: "http://127.0.0.1:8000/v1/telemetry"
  ```
- **14:08 UTC:** Verificación del estado de los contenedores Docker mediante `docker ps` y `docker stats`. El contenedor backend se encuentra en estado `Up` con un consumo de CPU del 35% y memoria al 48%. No hay OOMKills ni reinicios de proceso.
- **14:12 UTC:** Inspección de sockets de red mediante `ss -lnt` y métricas del kernel:
  ```bash
  $ netstat -s | grep -i "listen"
  14,820 times the listen queue of a socket overflowed
  14,820 SYNs to LISTEN sockets dropped
  ```
  Se confirma que el kernel está descartando paquetes SYN entrantes porque la cola de aceptación (*accept queue*) está completamente saturada.
- **14:18 UTC:** Aplicación de mitigación inmediata en vivo incrementando las capacidades de colas de sockets en el kernel Linux sin reiniciar el servidor:
  ```bash
  sudo sysctl -w net.core.somaxconn=8192
  sudo sysctl -w net.ipv4.tcp_max_syn_backlog=8192
  ```
- **14:22 UTC:** Actualización del archivo de configuración de NGINX para aumentar el parámetro de backlog en la directiva `listen`:
  ```nginx
  listen 80 backlog=8192;
  listen 443 ssl backlog=8192;
  ```
- **14:24 UTC:** Recarga segura de NGINX sin pérdida de conexiones activas:
  ```bash
  sudo nginx -t && sudo nginx -s reload
  ```
- **14:27 UTC:** La tasa de errores `502` cae inmediatamente a 0.00%. La latencia P99 se estabiliza en 16ms. Fin del incidente.

---

## 3. Análisis de Causa Raíz (Deep Dive Técnico)

Para comprender por qué ocurrió este fallo, es necesario revisar cómo gestiona el kernel Linux las conexiones TCP entrantes durante el *three-way handshake*.

El kernel mantiene dos colas separadas para cada socket en estado `LISTEN`:

1. **SYN Queue (Cola Incompleta):** Almacena las conexiones que han enviado un paquete `SYN` pero aún no han completado el apretón de manos con el último `ACK`. El tamaño máximo de esta cola está gobernado por `net.ipv4.tcp_max_syn_backlog`.
2. **Accept Queue (Cola Completa):** Almacena las conexiones que completaron el handshake TCP de 3 vías y están listas para que el proceso de usuario (en este caso, NGINX o el worker backend) las recoja mediante la llamada al sistema `accept()`.

```
Cliente                 Kernel Linux (Host)               Proceso (NGINX/App)
   |                             |                                  |
   |--- SYN -------------------->| [SYN Queue]                      |
   |<-- SYN-ACK -----------------|                                  |
   |--- ACK -------------------->| (Handshake Completo)             |
   |                             |   |                              |
   |                             |   v                              |
   |                             | [Accept Queue] (somaxconn)       |
   |                             |   |                              |
   |                             |   |---- accept() syscall ------->|
```

### El Cuello de Botella

El tamaño máximo de la **Accept Queue** se determina tomando el menor valor entre dos parámetros:
$$\min(\text{backlog}_{\text{código}}, \text{net.core.somaxconn})$$

En el host afectado:
- El valor del kernel `net.core.somaxconn` estaba fijado en su límite histórico de **`512`**.
- La aplicación backend llamaba a `listen(fd, 512)`.

Durante una ráfaga de 3,500 conexiones concurrentes generada por la sincronización simultánea de clientes móviles, la cola de 512 ranuras se llenó en cuestión de milisegundos. Cuando la cola de aceptación se llena, el kernel de Linux descarta silenciosamente los nuevos paquetes `SYN` o envía paquetes `RST` (según `tcp_abort_on_overflow`), haciendo que NGINX reciba `Connection refused` al intentar conectar con el upstream.

---

## 4. Mitigación y Hardening Permanente

Para asegurar que esta condición de carrera y saturación no vuelva a ocurrir, se implementaron los siguientes cambios permanentes en la infraestructura:

### A. Tuning del Kernel (`/etc/sysctl.d/99-network-tuning.conf`)

```ini
# Capacidad máxima de la cola accept de sockets
net.core.somaxconn = 8192

# Capacidad de la cola de conexiones TCP medio abiertas (SYN)
net.ipv4.tcp_max_syn_backlog = 8192

# Reutilización rápida de sockets en estado TIME_WAIT para conexiones salientes
net.ipv4.tcp_tw_reuse = 1

# Buffer de recepción y transmisión TCP
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
```

Se aplicaron los cambios con:
```bash
sudo sysctl -p /etc/sysctl.d/99-network-tuning.conf
```

### B. Optimización de NGINX Upstream Keepalive

Además del backlog, se descubrió que NGINX abría y cerraba una conexión TCP por cada solicitud hacia el upstream, agravando la saturación de sockets en el bucle local (`localhost`).

Se configuró un pool de conexiones persistentes (*keepalive*):

```nginx
upstream backend_cluster {
    server 127.0.0.1:8000 max_fails=3 fail_timeout=10s;
    
    # Mantener abiertas hasta 64 conexiones inactivas hacia el backend
    keepalive 64;
}

server {
    listen 443 ssl http2 backlog=8192;
    server_name api.zer0sh.com;

    location / {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Connection ""; # Habilita HTTP Keepalive
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}
```

---

## 5. Telemetría y Detección Proactiva

En SRE, un incidente solo se considera resuelto cuando el sistema cuenta con la instrumentación necesaria para alertar antes de que se produzca un impacto visible para el usuario.

Se añadió la siguiente regla de alerta en **Prometheus Alertmanager**:

```yaml
groups:
  - name: network_socket_alerts
    rules:
      - alert: TcpListenQueueOverflow
        expr: rate(node_netstat_TcpExt_ListenOverflows[2m]) > 0
        for: 1m
        labels:
          severity: warning
          tier: infrastructure
        annotations:
          summary: "TCP Listen Queue Overflow detectado en {{ $labels.instance }}"
          description: "El kernel está descartando paquetes TCP debido a saturación en la cola de escucha. Verificar somaxconn y procesos backend."
```

---

## 6. Lecciones Aprendidas

1. **Los valores por defecto del kernel no son aptos para producción moderna:** Los sistemas operativos Linux para servidores suelen venir configurados con parámetros conservadores para garantizar compatibilidad con hardware limitado. En cualquier entorno de contenedores o proxy inverso, auditar `somaxconn`, `tcp_max_syn_backlog` y descriptores de archivo (`nofile`) es una tarea fundamental del Día 1.
2. **`docker stats` no cuenta toda la historia:** La CPU y la memoria estaban en niveles normales durante todo el incidente. Si solo observas las métricas tradicionales de host, el fallo era invisible. La verdadera causa estaba en los contadores del kernel (`/proc/net/netstat`).
3. **El keepalive en NGINX reduce drásticamente el estrés del kernel:** Al reutilizar conexiones TCP existentes entre el proxy inverso y los microservicios locales, se reduce en más del 80% la necesidad de abrir nuevos sockets y negociar handshakes.
