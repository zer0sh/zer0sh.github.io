const fs = require('fs');
const path = require('path');
const { generateTerminalSvg } = require('./generate-terminal-svg');

const imagesDir = path.join(__dirname, '../public/blog-posts/images');

// 1. terminal-drift-autopsy.svg
generateTerminalSvg({
  title: 'workstations — pip install -r requirements.txt',
  badge: 'DRIFT COLLISION',
  user: 'dev-team',
  host: 'multi-os-env',
  pathText: '~/core-api',
  command: 'pip install -r requirements.txt && ./scripts/entrypoint.sh',
  lines: [
    { type: 'comment', text: '# === [DEV 1: WINDOWS 11] — Fallo de compilacion nativa C y CRLF ===' },
    { spans: [{ cls: 'text-keyword', text: 'building' }, { cls: 'text-param', text: " 'psycopg2._psycopg' extension" }] },
    { type: 'alert', text: 'error: Microsoft Visual C++ 14.0 or greater is required (MSVC tools missing)' },
    { type: 'alert', text: 'bash: ./scripts/entrypoint.sh: /bin/bash^M: bad interpreter: No such file or directory' },
    { type: 'comment', text: '' },
    { type: 'comment', text: '# === [DEV 2: ARCH LINUX] — Incompatibilidad C-API en Python 3.13 ===' },
    { spans: [{ cls: 'text-directive', text: '$ python3 --version' }, { cls: 'text-param', text: ' -> Python 3.13.0 (glibc 2.40)' }] },
    { type: 'alert', text: '[1]    48291 segmentation fault (core dumped)  uvicorn app.main:app --reload' },
    { type: 'comment', text: '# Causa forense: PyLongObject->ob_digit deprecado en C-API Python 3.13' },
    { type: 'comment', text: '' },
    { type: 'comment', text: '# === [DEV 3: DEBIAN 12 STABLE] — Conflictos de tipos y PEP 668 ===' },
    { spans: [{ cls: 'text-directive', text: '$ python3.11 -m pytest' }] },
    { type: 'alert', text: "TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'" },
    { type: 'comment', text: '# Causa: Suite de linters estáticos desalineada con el toolchain de Debian' },
    { type: 'comment', text: '' },
    { type: 'comment', text: '# === [DEV 4: UBUNTU 22.04 + PPA] — Choque de simbolos ABI OpenSSL ===' },
    { spans: [{ cls: 'text-directive', text: '$ python3.12 -c "import cryptography"' }] },
    { type: 'alert', text: 'ImportError: /usr/lib/x86_64-linux-gnu/libssl.so.3: version OPENSSL_3.2.0 not found' },
    { type: 'comment', text: '# Causa: El paquete wheel exige OpenSSL 3.2+ incompatible con libssl3 de Ubuntu 22.04' }
  ],
  outputFile: path.join(imagesDir, 'terminal-drift-autopsy.svg')
});

// 2. terminal-docker-compose-up.svg
generateTerminalSvg({
  title: 'sre-cluster — docker compose up -d --wait',
  badge: 'DOCKER DETERMINISM',
  user: 'zer0',
  host: 'sre-node-01',
  pathText: '~/projects/core-api',
  command: 'docker compose up -d --wait && docker compose ps',
  lines: [
    { type: 'comment', text: '# Despliegue determinista del stack completo con salud verificada' },
    { spans: [{ cls: 'text-directive', text: '[+] Running 6/6' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Network core_mesh        ' }, { cls: 'text-directive', text: 'Created' }, { cls: 'text-semicolon', text: '                             0.04s' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Volume core_pgdata       ' }, { cls: 'text-directive', text: 'Created' }, { cls: 'text-semicolon', text: '                             0.01s' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Container core-db        ' }, { cls: 'text-highlight', text: 'Started (postgres:16-alpine)   ' }, { cls: 'text-prompt-user', text: '[healthy]' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Container core-redis     ' }, { cls: 'text-highlight', text: 'Started (redis:7.2-alpine)     ' }, { cls: 'text-prompt-user', text: '[healthy]' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Container core-api       ' }, { cls: 'text-highlight', text: 'Started (python:3.11-slim)     ' }, { cls: 'text-prompt-user', text: '[healthy]' }] },
    { spans: [{ cls: 'text-prompt-user', text: ' ✔ ' }, { cls: 'text-param', text: 'Container core-worker    ' }, { cls: 'text-highlight', text: 'Started (celery:5.3.6)         ' }, { cls: 'text-prompt-user', text: '[healthy]' }] },
    { type: 'comment', text: '' },
    { spans: [{ cls: 'text-directive', text: 'NAME            IMAGE                 COMMAND                  SERVICE   STATUS              PORTS' }] },
    { spans: [{ cls: 'text-param', text: 'core-api        python:3.11-slim      "uvicorn app.main:app…"  api       Up (healthy)        0.0.0.0:8000->8000/tcp' }] },
    { spans: [{ cls: 'text-param', text: 'core-db         postgres:16-alpine    "docker-entrypoint.s…"  db        Up (healthy)        0.0.0.0:5432->5432/tcp' }] },
    { spans: [{ cls: 'text-param', text: 'core-redis      redis:7.2-alpine      "docker-entrypoint.s…"  cache     Up (healthy)        0.0.0.0:6379->6379/tcp' }] },
    { spans: [{ cls: 'text-param', text: 'core-worker     python:3.11-slim      "celery -A app.tasks…"  worker    Up (healthy)' }] },
    { type: 'comment', text: '' },
    { spans: [{ cls: 'text-prompt-user', text: '# PARIDAD CONFIRMADA: ' }, { cls: 'text-param', text: 'Identico en Windows (WSL2), macOS (Apple Silicon), Arch y Debian' }] }
  ],
  outputFile: path.join(imagesDir, 'terminal-docker-compose-up.svg')
});

// 3. ejemplo-terminal.svg
generateTerminalSvg({
  title: 'srv-demo — /etc/systemd/system/app.service',
  badge: 'SYSTEMD UNIT',
  user: 'root',
  host: 'srv-node-01',
  pathText: '/etc/systemd/system',
  command: 'cat app.service',
  lines: [
    { type: 'comment', text: '# Demostración de configuración de servicio' },
    { spans: [{ cls: 'text-keyword', text: '[Unit]' }] },
    { spans: [{ cls: 'text-directive', text: 'Description' }, { text: '=Demo Service Daemon' }] },
    { spans: [{ cls: 'text-directive', text: 'After' }, { text: '=network.target' }] },
    { type: 'comment', text: '' },
    { spans: [{ cls: 'text-keyword', text: '[Service]' }] },
    { spans: [{ cls: 'text-directive', text: 'Type' }, { text: '=simple' }] },
    { spans: [{ cls: 'text-directive', text: 'ExecStart' }, { cls: 'text-highlight', text: '=/usr/local/bin/demo-daemon' }] },
    { spans: [{ cls: 'text-directive', text: 'Restart' }, { cls: 'text-ip', text: '=always' }] }
  ],
  outputFile: path.join(imagesDir, 'ejemplo-terminal.svg')
});

console.log('SVGs legados corregidos con éxito.');
