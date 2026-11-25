---
title: "El Fail2ban que nunca baneó a nadie: journald, rsyslog ausente y la falsa seguridad en Linux"
date: "2026-08-20"
category: "Linux & Ciberseguridad"
excerpt: "El servicio de protección contra fuerza bruta figuraba como activo en el servidor de base de datos de producción, pero en tres años no había bloqueado una sola IP. Tras una actualización de sistema operativo descubrimos la causa: rsyslog ya no existía y fail2ban leía un archivo de logs vacío."
coverImage: "/blog-posts/images/shell-builtins.png"
coverAlt: "Hardening de SSH, configuración de Fail2ban y gestión de logs con systemd-journald"
---

> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*


---


En seguridad defensiva existe un principio aterrador: **una herramienta de protección mal configurada es infinitamente más peligrosa que no tener ninguna herramienta, porque te brinda una falsa sensación de tranquilidad.**

Esto fue exactamente lo que descubrimos en el servidor central de base de datos (`srv-horizonte-db`), un nodo crítico que alojaba instancias de MySQL y PostgreSQL para múltiples proyectos institucionales.

Durante una auditoría de seguridad post-intrusión, revisamos el estado del servicio **Fail2ban**, la clásica utilidad que inspecciona intentos fallidos de conexión por SSH y aplica bloqueos automáticos en el firewall con `iptables` / `nftables`.

El comando de estado arrojaba una respuesta impecable:
```bash
$ sudo systemctl status fail2ban
● fail2ban.service - Fail2Ban Service
     Loaded: loaded (/lib/systemd/system/fail2ban.service; enabled)
     Active: active (running) since Tue 2026-08-04 10:14:22 UTC
```

Pero al revisar las estadísticas de los bloqueos reales:

```bash
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- File list:        /var/log/auth.log
`- Actions
   |- Currently banned: 0
   `- Total banned:     0
```

En un servidor expuesto con el puerto SSH accesible desde internet, **el contador de intentos fallidos era exactamente CERO después de semanas de actividad.**

Cualquier administrador sabe que internet es un mar turbulento de bots atacando el puerto 22 a razón de cientos de intentos por hora. Un contador en cero no significaba que nadie nos atacara: **significaba que Fail2ban estaba completamente sordo y ciego.**

---

## 1. El misterio del archivo vacío: la muerte silenciosa de `rsyslog`

Al revisar el archivo que Fail2ban decía estar vigilando:

```bash
$ ls -lh /var/log/auth.log
-rw-r----- 1 syslog adm 0B Aug  4 10:00 /var/log/auth.log
```

El archivo `/var/log/auth.log` tenía un tamaño exacto de **0 bytes**. Llevaba semanas vacío.

### ¿Por qué? La transición de Ubuntu 18.04 a 22.04
El servidor había sido actualizado recientemente desde Ubuntu 18.04 LTS (Bionic) hacia Ubuntu 22.04 LTS (Jammy). 

En las versiones modernas de Ubuntu y Debian:
- El paquete clásico de registro de eventos en texto plano (`rsyslog`) **ya no viene instalado por defecto** en imágenes de nube mínimas.
- Todo el registro de autenticación y eventos del kernel es capturado exclusivamente por el demonio binario **`systemd-journald`**.

Como `rsyslog` no estaba corriendo, `/var/log/auth.log` nunca recibía datos. Fail2ban abría el archivo vacío, leía cero líneas y se quedaba esperando pacientemente en silencio mientras los bots probaban contraseñas en el demonio SSH sin ninguna resistencia.

---

## 2. El segundo tropiezo: el bug de `journalmatch` en versiones antiguas

El intento inmediato de corrección fue modificar `/etc/fail2ban/jail.local` para indicarle a Fail2ban que utilizara el backend de `systemd`:

```ini
[sshd]
enabled = true
backend = systemd
```

Reiniciamos el servicio:
```bash
$ sudo systemctl restart fail2ban
ERROR   Failed to initialize any backend for jail 'sshd'
```

Al investigar la versión instalada en el sistema heredado (`fail2ban 0.10.2`):
La versión contenía un bug histórico conocido en upstream (Issue `#959` de Fail2ban): la librería de enlace con Python de `systemd` fallaba si la directiva `journalmatch` no coincidía exactamente con el identificador del socket en distribuciones que migraron de `/usr/sbin/sshd` a socket-activation.

---

## 3. La remediación definitiva y la prueba de fuego

Para resolver el problema de raíz sin parches frágiles:

### Paso 1: Instalación de `python3-systemd` y actualización
Aseguramos los paquetes necesarios para la comunicación nativa entre Python y journald:

```bash
sudo apt update
sudo apt install -y fail2ban python3-systemd
```

### Paso 2: Configuración del backend nativo de `systemd`
Configuramos la celda (`jail`) en `/etc/fail2ban/jail.d/defaults-debian.conf`:

```ini
[DEFAULT]
# Usar la API binaria de systemd-journald en lugar de archivos de texto
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd[journalflags=1]
maxretry = 3
findtime = 600
bantime = 86400
action = iptables-multiport[name=SSH, port="ssh", protocol=tcp]
```

### Paso 3: Verificación con tráfico real
Reiniciamos el servicio y verificamos de inmediato:

```bash
$ sudo fail2ban-client restart
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed: 4
|  |- Total failed:     28
|  `- Backend:          systemd
`- Actions
   |- Currently banned: 2
   `- Banned IP list:   198.51.100.142 203.0.113.89
```

En menos de tres minutos, Fail2ban interceptó los primeros cuatro intentos de inicio de sesión automatizados y aplicó los baneos correspondientes en la tabla de `iptables`.

---

## 4. Lecciones aprendidas

1. **Nunca midas la salud de un servicio solo por `systemctl is-active`:** Que el proceso esté arriba en memoria no significa que esté haciendo su trabajo. Para utilidades de seguridad, valida siempre sus métricas de acción (ataques detectados, reglas insertadas en firewall).
2. **Entiende la evolución del subsistema de logs en Linux:** Si migras servidores antiguos a distribuciones modernas (Ubuntu 22.04+, Debian 12+, RHEL 9+), recuerda que los archivos de texto en `/var/log/*.log` están siendo reemplazados por el journal binario de `systemd`.
3. **Ejecuta pruebas de penetración sintéticas tras cada configuración:** No esperes a que un bot ataque para saber si Fail2ban funciona. Ejecuta un intento de conexión fallido intencional desde una IP secundaria y verifica que tu propia IP quede baneada en el acto.
