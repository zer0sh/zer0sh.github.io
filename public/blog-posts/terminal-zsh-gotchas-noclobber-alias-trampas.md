---
title: "La terminal que no era la mía: noclobber, pkill suicida y las trampas de Zsh en scripts interactivos"
date: "2026-11-10"
category: "Shell & Productividad"
excerpt: "Asumir que toda terminal Linux o macOS se comporta como Bash estándar es la causa raíz de errores insólitos: desde bucles que fallan en el primer archivo por noclobber hasta comandos pkill que se matan a sí mismos o filtros sed que exponen tokens en pantalla. Autopsia de tropiezos en la consola."
coverImage: "/blog-posts/images/shell-builtins.png"
coverAlt: "Línea de comandos de Unix, depuración de scripts en Zsh y buenas prácticas de terminal"
---

> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*


---


Los ingenieros de infraestructura pasamos la mayor parte del día dentro de un emulador de terminal. Con el tiempo desarrollamos memoria muscular: comandos rápidos, atajos de teclado y tuberías complejas escritas en segundos.

Pero esa misma familiaridad esconde una trampa psicológica: **asumir que el entorno de shell en la máquina de trabajo se comportará exactamente igual que un Bash estándar de producción.**

Entre septiembre y noviembre registramos una serie de tropiezos desconcertantes mientras ejecutábamos tareas de mantenimiento mediante sesiones automatizadas e interactivas. Todos compartían el mismo origen: las particularidades y opciones avanzadas de **Zsh** (la shell predeterminada en macOS y en muchas estaciones de trabajo con personalizaciones de Oh-My-Zsh).

Esta es la crónica de tres errores reales, cómo los diagnosticamos y las reglas defensivas que adoptamos.

---

## 1. El bucle que cerró 1 de 38 Pull Requests: la trampa de `noclobber`

Durante una sesión de limpieza masiva de repositorios institucionales, necesitábamos cerrar 38 Pull Requests obsoletos de dependencias. Escribí un bucle sencillo:

```zsh
for pr in ${(f)"$(cat pr_list.txt)"}; do
    echo "Cerrando PR $pr..."
    gh pr close "$pr" --comment "Cierre programado por ciclo de dependencias" 2> /tmp/err.txt
done
```

Al revisar la consola, el script recorrió los 38 números imprimiendo mensajes de progreso. Parecía una victoria rápida.

Al consultar la API de GitHub para verificar:
- El primer PR (`#136`) estaba cerrado exitosamente.
- **Los otros 37 Pull Requests seguían totalmente abiertos.**

### ¿Por qué falló?
En Zsh, muchas configuraciones tienen activa la opción defensiva `noclobber` (`set -C`):
> *`noclobber`: Impide que la redirección con `>` sobrescriba un archivo existente sin confirmación explícita.*

1. En la primera iteración, `/tmp/err.txt` no existía; el comando se ejecutó y creó el archivo.
2. En la segunda iteración, `/tmp/err.txt` ya existía. En lugar de vaciarlo y escribir, **Zsh abortó la ejecución del comando inmediatamente** arrojando:  
   `zsh: file exists: /tmp/err.txt`.
3. El comando `gh pr close` ni siquiera llegó a ejecutarse en las 37 iteraciones restantes.

### La solución defensiva
Para forzar la sobreescritura en cualquier shell sin importar la configuración de `noclobber`, se debe utilizar el operador con barra vertical `>|`:

```zsh
# Sobreescritura garantizada en Zsh y Bash
gh pr close "$pr" 2>| /tmp/err.txt
```

O mejor aún: capturar la salida en una variable de memoria sin tocar el disco:
```zsh
out=$(gh pr close "$pr" 2>&1) || echo "Error en PR $pr: $out"
```

---

## 2. El comando de redacción que imprimió el secreto

Para auditar la configuración de paquetes sin comprometer credenciales en la pantalla compartida de una sesión, ejecuté un comando para redactar las contraseñas:

```bash
composer config -g --list | sed 's/key=.*/key=REDACTED/'
```

El script asumía que `composer config` imprime las llaves en formato clásico `clave=valor`.

Sin embargo, el formato real de salida de Composer en esa versión era:
```text
[repositories.packagist.repo.packagist.com/acme.token] ghp_SecretToken2026Real
```

Como la expresión regular buscaba `key=`, **el filtro de `sed` no coincidió con ninguna línea**. El token de la organización quedó impreso en texto plano en la pantalla de la terminal.

### La regla aprendida
Nunca confíes en un filtro de sanitización en el extremo derecho de una tubería (`cmd | sed`) a menos que conozcas exactamente la gramática del comando origen. Para verificar la presencia de secretos sin imprimirlos, usa condiciones booleanas:

```bash
if grep -q "token" ~/.config/composer/auth.json; then
    echo "[OK] Credenciales presentes y configuradas."
fi
```

---

## 3. El `pkill -f` suicida que mató la sesión

Durante una sesión de depuración en segundo plano, varios procesos de Node.js y scripts de espera (`wait_dev.sh`) habían quedado huérfanos consumiendo memoria.

Para limpiar rápidamente, ejecuté:
```bash
pkill -f wait_dev.sh
```

Instantáneamente, **la ventana de la terminal se cerró sola y la sesión SSH se desconectó** con código de salida `144`.

### ¿Por qué se mató a sí mismo?
La herramienta de automatización envuelve cada comando que el usuario digita en una subshell:
```text
/bin/zsh -c "eval 'pkill -f wait_dev.sh'"
```

El comando `pkill -f` busca el patrón de texto en la **línea de comandos completa** de todos los procesos del sistema (`argv`). 

Al buscar la cadena `wait_dev.sh`, el proceso encontró:
1. El script huérfano en segundo plano (`PID 4120: /bin/bash wait_dev.sh`).
2. **El propio proceso de la subshell que estaba ejecutando el comando** (`PID 8590: /bin/zsh -c eval pkill -f wait_dev.sh`).

`pkill` le envió una señal `SIGTERM` a su propio proceso padre antes de terminar de ejecutarse, matando la terminal en el acto.

---

## 4. La solución para búsquedas de procesos

Para evitar el suicidio accidental de procesos:

1. **Inspeccionar antes de matar (`pgrep` primero):**
   ```bash
   pgrep -fl wait_dev.sh  # Muestra los PIDs y sus nombres exactos
   kill <PID>             # Mata solo el proceso deseado
   ```
2. **Coincidencia exacta de binario (`-x` en lugar de `-f`):**
   ```bash
   pkill -x node          # Busca coincidencia exacta con el nombre del ejecutable
   ```
3. **El truco de la clase de corchetes en expresiones regulares:**
   ```bash
   # La expresión [w]ait_dev.sh coincide con "wait_dev.sh", pero la línea del propio pkill contiene "[w]", no coincidiendo consigo misma
   pkill -f "[w]ait_dev.sh"
   ```

---

## 5. Lecciones aprendidas

1. **La portabilidad comienza en tu máquina:** Si escribes scripts de una línea en la terminal destinados a compartirse con el equipo o ejecutarse en servidores, añade siempre `#!/usr/bin/env bash` y ejecuta con `bash -euo pipefail`.
2. **Cuidado con las palabras sin comillas en Zsh:** A diferencia de Bash, en Zsh una variable sin comillas (`$var`) **no se divide automáticamente en palabras** si contiene espacios, a menos que uses el flag `${=var}`. Esto rompe bucles que asumen separación por espacios.
3. **Re-consulta el estado real después de cada lote:** Si ejecutas un comando en bucle sobre 30 recursos, nunca asumas que terminó con éxito solo porque no viste errores en pantalla. Consulta la API o el estado en base de datos para confirmar que los 30 recursos fueron modificados.
