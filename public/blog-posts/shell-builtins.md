---
title: "Top 15 de shell builtins clásicos de Linux"
date: "2026-08-10"
category: "Linux & Shell"
excerpt: "Los shell builtins son comandos integrados en el propio shell. Los 15 clásicos ordenados por frecuencia de uso y presencia en Bash/Unix."
coverImage: "/blog-posts/images/shell-builtins.png"
coverAlt: "Shell builtins clásicos de Linux en una terminal"
---

Los **shell builtins** (comandos integrados) son funciones que vienen incluidas dentro del propio shell, como Bash o SH. A diferencia de los binarios externos, no necesitan ejecutar un proceso adicional: el shell los resuelve directamente, por lo que suelen ser más rápidos y siempre están disponibles sin importar el PATH.

Conocerlos es clave para escribir scripts más eficientes y portables, porque no dependen de herramientas externas instaladas.

Esta es una selección de los **15 shell builtins clásicos**, ordenados por frecuencia de uso y su presencia universal en Bash/Unix.

---

## 1. cd

Cambiar de directorio de trabajo.

```bash
cd /etc
cd ..     # subir un nivel
cd -      # volver al directorio anterior
cd ~      # ir al home
```

Usar `cd ..` con espacios correctos es relevante en Bash.

> Consejo: en Bash, `cd -` imprime y cambia al último directorio. Muy práctico.

---

## 2. echo

Imprimir texto y variables.

```bash
echo "Hola, mundo"
echo $HOME
echo "$USER está en $PWD"
```

Sin comillas dobles las variables se expanden igual, pero las comillas protegen espacios. Recomiendo **siempre** comillar: `echo "texto $var"`.

---

## 3. export

Exportar variables de entorno para que los procesos hijos las hereden.

```bash
export EDITOR=vim
export PATH="$PATH:/opt/bin"
```

`export` hace que una variable de shell pase a ser de entorno. Sin él, no se propaga a subprocesos.

---

## 4. exit

Salir del shell.

```bash
exit        # sale con el último código
exit 0      # salida con éxito
exit 1      # salida con error
```

El código de salida es importante en scripts: los otros comandos y herramientas lo leen para saber si algo falló.

---

## 5. read

Leer entrada desde stdin o desde archivos.

```bash
read nombre
read -p "Nombre: " nombre
while read linea; do echo "$linea"; done < archivo.txt
```

Su uso en bucles para parsear archivos es de los más comunes en scripting.

---

## 6. set

Configurar variables de opciones del shell.

```bash
set -e        # salir ante cualquier error
set -u        # error si usas variables sin definir
set -x        # trazar comandos ejecutados
set -o pipefail
```

`set -euo pipefail` es casi obligatorio en scripts robustos.

---

## 7. test / [ ]

Evaluar condiciones. `[` es un alias de `test`.

```bash
[ -f archivo.txt ] && echo "existe"
[ "$a" = "$b" ] && echo "iguales"
[ -d /etc ] && echo "es un directorio"
```

Muy usado en `if`, con `-f` (archivo), `-d` (directorio), `-z` (vacío), `-eq` (numérico).

---

## 8. source / .

Ejecutar un script en el shell actual.

```bash
source ~/.bashrc
. ~/.bashrc
```

La diferencia con ejecutar un script normal (`. /script.sh`) es que `source` no abre un subshell: las variables y cambios persisten en la sesión.

---

## 9. alias

Crear alias (atajos) para comandos.

```bash
alias ll='ls -lah'
alias gs='git status'
unalias ll
```

Los alias solo se aplican cuando el shell usa modo interactivo, no en scripts. Para eso están las funciones.

---

## 10. unset

Eliminar variables o funciones.

```bash
unset VAR
unset -f funcion   # eliminar función
```

Útil para "limpiar" el entorno y evitar que variables con nombre común interfieran.

---

## 11. printf

Salida con formato. Más potente y predecible que `echo`.

```bash
printf "%s = %d\n" "edad" 30
printf "%-10s %5d\n" "item" 42
```

En Bash es un builtin (antes externo). Muy recomendado para scripting serio por su control de formato.

---

## 12. return

Retornar un valor desde una función o script.

```bash
mi_funcion() {
  [ -f $1 ] && return 0
  return 1
}
```

El valor de retorno se usa para controlar flujo: 0 = éxito, distinto de 0 = error.

---

## 13. shift

Desplazar los parámetros posicionales `$1`, `$2`, etc.

```bash
while [ $# -gt 0 ]; do
  echo "argumento: $1"
  shift
done
```

`$1` pasa a ser el viejo `$2`, y así sucesivamente. Clásico para iterar argumentos.

---

## 14. exec

Reemplazar el proceso actual del shell por otro comando.

```bash
exec vim
exec > log.txt   # redirigir el resto de la salida del script
```

Cuando un shell se va a convertir en otro proceso, `exec` evita crear un proceso intermedio. Muy usado en la inicialización de contenedores.

---

## 15. trap

Capturar señales y eventos del sistema.

```bash
trap 'echo "limpiando..."' EXIT
trap 'echo "Ctrl+C"; exit 1' INT
```

Esencial para hacer scripts robustos: permite ejecutar limpieza al salir o manejar interrupciones con elegancia.

---

## Bonus: cómo saber si es un builtin

Ante la duda de si un comando es un builtin o un binario externo:

```bash
type cd         # cd is a shell builtin
type -a echo
```

`type` responde de inmediato. Si no es builtin, te mostrará la ruta del binario (por ejemplo, `/usr/bin/ls`).

---

## Cierre

Los builtins son la base sobre la que se construyen los scripts de shell: rápidos, portables y presentes en cualquier sistema Unix que tenga Bash o SH.

Dominar esta lista es dar un buen paso para pasar de "escribir comandos" a "escribir scripts que se comportan igual en todos lados".

*Basado en la selección clásica de shell builtins con criterio de frecuencia de uso + presencia en Bash/Unix.*