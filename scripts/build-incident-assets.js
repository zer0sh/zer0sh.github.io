const fs = require('fs');
const path = require('path');
const { generateTerminalSvg } = require('./generate-terminal-svg');

const INCIDENTS = [
  {
    slug: 'terminal-zsh-gotchas-noclobber-alias-trampas',
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Consola de terminal Unix con depuración de scripts interactivos en Zsh',
    svgFile: 'terminal-zsh-noclobber.svg',
    title: 'workstation — zsh /tmp/batch_pr_close.zsh',
    badge: 'ZSH NOCLOBBER',
    user: 'zero',
    host: 'arch-workstation',
    pathText: '~/scripts',
    command: 'zsh ./batch_pr_close.zsh',
    lines: [
      { spans: [{ cls: 'text-param', text: 'Cerrando PR #136... ' }, { cls: 'text-directive', text: '[OK] Comentario publicado y cerrado' }] },
      { spans: [{ cls: 'text-param', text: 'Cerrando PR #137... ' }] },
      { type: 'alert', text: 'zsh: file exists: /tmp/err.txt (exit status 1)' },
      { type: 'comment', text: '# ALERTA: La opción defensiva noclobber (set -C) bloqueó la redirección con ">"' },
      { type: 'comment', text: '# Las 37 iteraciones restantes se abortaron silenciosamente en el primer fallo' },
      { spans: [{ cls: 'text-directive', text: '# Solución universal: ' }, { cls: 'text-highlight', text: 'gh pr close "$pr" 2>| /tmp/err.txt' }, { cls: 'text-comment', text: ' (forzar sobreescritura con >|)' }] }
    ],
    markdownSearch: '### ¿Por qué falló?',
    caption: 'Autopsia de Zsh: la redirección defensiva noclobber bloqueando la iteración en archivos preexistentes'
  },
  {
    slug: 'dors-plataforma-despliegues-zombi-redis',
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Centro de datos y clúster de bases de datos Redis en producción',
    svgFile: 'terminal-redis-queue-drift.svg',
    title: 'bastion-core — redis-cli -p 6379',
    badge: 'REDIS QUEUE DRIFT',
    user: 'root',
    host: 'bastion-shared-01',
    pathText: '/var/log/celery',
    command: 'redis-cli LLEN queue:celery:deployments && redis-cli HGETALL worker:status',
    lines: [
      { spans: [{ cls: 'text-highlight', text: '(integer) 32184' }] },
      { type: 'alert', text: '# ALERTA: 32.184 tareas acumuladas en la cola sin consumidor activo' },
      { spans: [{ cls: 'text-param', text: 'worker:deploy-engine-prod: ' }, { cls: 'text-directive', text: 'last_heartbeat 1793201823' }, { cls: 'text-comment', text: ' (hace 23 días)' }] },
      { spans: [{ cls: 'text-keyword', text: 'PID 8192' }, { text: ' en estado ' }, { cls: 'text-ip', text: 'ZOMBIE (defunct)' }, { text: ' tras reinicio de socket' }] },
      { type: 'comment', text: '# El frontend seguía respondiendo HTTP 200 en healthcheck mientras la cola agonizaba' }
    ],
    markdownSearch: '### El hallazgo en Redis',
    caption: 'Diagnóstico en Redis: 32.000 tareas encoladas y proceso de despliegue zombi en el bastión'
  },
  {
    slug: 'dominio-huerfano-cuentas-claras-takeover',
    coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Cables de telecomunicaciones y enrutamiento DNS de dominios',
    svgFile: 'terminal-dns-takeover.svg',
    title: 'edge-dns-01 — dig +trace cuentasc-laras.org',
    badge: 'SUBDOMAIN TAKEOVER',
    user: 'zero',
    host: 'edge-resolver',
    pathText: '~',
    command: 'dig +trace cuentasc-laras.org CNAME && curl -sI https://cuentasc-laras.org',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'cuentasc-laras.org.' }, { text: ' 300 IN CNAME ' }, { cls: 'text-highlight', text: 's3-website-us-east-1.amazonaws.com.' }] },
      { type: 'alert', text: 'HTTP/1.1 404 Not Found — Code: NoSuchBucket (Bucket desprovisionado)' },
      { type: 'comment', text: '# VULNERABILIDAD CRÍTICA: Registro CNAME apuntaba a un recurso cloud borrado' },
      { spans: [{ cls: 'text-keyword', text: 'ATACANTE:' }, { text: ' Registró el bucket huérfano y sirvió streaming malicioso' }] },
      { spans: [{ cls: 'text-directive', text: 'Remediación:' }, { cls: 'text-param', text: ' Purgado de zonas DNS huérfanas con script automatizado Route53' }] }
    ],
    markdownSearch: '### La anatomía del takeover',
    caption: 'Inspección DNS: registro CNAME apuntando a bucket S3 inexistente permitiendo secuestro'
  },
  {
    slug: 'multidevs-pantheon-condicion-carrera-despliegues',
    coverUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Pipeline de despliegue continuo y orquestación de entornos efímeros',
    svgFile: 'terminal-pantheon-multidev-race.svg',
    title: 'github-runner — terminus multidev:create',
    badge: 'RACE CONDITION',
    user: 'runner',
    host: 'gh-runner-linux-04',
    pathText: '/workspace',
    command: 'terminus multidev:create arquia-portal.live pr-142 --wait',
    lines: [
      { spans: [{ cls: 'text-directive', text: '[notice]' }, { text: ' Forking database and codebase from live to pr-142...' }] },
      { type: 'alert', text: '[error] Environment limit reached (10/10) - job pr-141 en conflicto' },
      { spans: [{ cls: 'text-keyword', text: 'MySQL Error 1205:' }, { cls: 'text-ip', text: ' Lock wait timeout exceeded; try restarting transaction' }] },
      { type: 'comment', text: '# Condición de carrera: dos PRs disparados con 3 segundos de diferencia' },
      { spans: [{ cls: 'text-directive', text: 'Solución:' }, { cls: 'text-param', text: ' Mutex con flock en Actions y reciclaje FIFO de multidevs viejos' }] }
    ],
    markdownSearch: '### El punto de colisión',
    caption: 'Traza de concurrencia: colisión de entornos efímeros en PaaS y bloqueo de base de datos'
  },
  {
    slug: 'automatizaciones-tradicionales-vs-ia',
    coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Modelos de inteligencia artificial interactuando con automatizaciones deterministas',
    svgFile: 'terminal-ai-vs-scripts.svg',
    title: 'ai-orchestrator — python3 pipeline_hybrid.py',
    badge: 'AI VS DETERMINISM',
    user: 'zero',
    host: 'automation-node',
    pathText: '~/infra',
    command: 'python3 -m infra.orchestrator --validate-schema --ai-enrich',
    lines: [
      { spans: [{ cls: 'text-directive', text: '[PASS]' }, { text: ' Pydantic validator: 142 firewall rules parsed deterministically' }] },
      { spans: [{ cls: 'text-highlight', text: '[AI-INFERENCE]' }, { text: ' Analyzing anomaly cluster with LLM embedding engine...' }] },
      { spans: [{ cls: 'text-param', text: '[RESULT] Confidence: 0.982 — Suggested rule: ' }, { cls: 'text-ip', text: 'DROP AS209242' }] },
      { type: 'comment', text: '# Principio clave: Determinismo estricto para ejecución; IA para síntesis y contexto' }
    ],
    markdownSearch: '### El equilibrio práctico',
    caption: 'Orquestación híbrida: validación determinista de reglas enriquecida con análisis de patrones por IA'
  },
  {
    slug: 'github-actions-dependabot-ciclos-actualizacion',
    coverUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Integración continua y revisión de código en GitHub Actions',
    svgFile: 'terminal-dependabot-churn.svg',
    title: 'ci-bot — gh pr status --repo enterprise/core-apps',
    badge: 'DEPENDABOT CHURN',
    user: 'ci-admin',
    host: 'runner-controller',
    pathText: '~/ci',
    command: 'gh pr list --label dependencies --state open --limit 5',
    lines: [
      { spans: [{ cls: 'text-directive', text: '#142' }, { text: ' Bump pillow from 10.2.0 to 10.3.0 ' }, { cls: 'text-ip', text: '[CI: Failed - Py3.11]' }] },
      { spans: [{ cls: 'text-directive', text: '#143' }, { text: ' Bump certifi from 2024.2.2 to 2024.7.4 ' }, { cls: 'text-highlight', text: '[CI: Passing]' }] },
      { spans: [{ cls: 'text-directive', text: '#144' }, { text: ' Bump django from 4.2.11 to 5.0.4 ' }, { cls: 'text-ip', text: '[CI: Failed - Deprecations]' }] },
      { type: 'alert', text: '# SOBRECARGA: 48 PRs individuales compitiendo por runners de staging' },
      { type: 'comment', text: '# Solución: Agrupación en ciclos quincenales supervisados con dependabot grouped' }
    ],
    markdownSearch: '### La saturación de la cola',
    caption: 'Auditoría en GitHub CLI: saturación de runners provocada por decenas de micro-PRs de Dependabot'
  },
  {
    slug: 'mkdocs-documentacion-simple-y-efectiva',
    coverUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Documentación técnica estructurada y minimalista con MkDocs',
    svgFile: 'terminal-mkdocs-build.svg',
    title: 'docs-station — mkdocs build --strict',
    badge: 'MKDOCS DETERMINISM',
    user: 'zero',
    host: 'arch-station',
    pathText: '~/dotfiles',
    command: 'mkdocs build --clean && du -sh site/',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'INFO    -' }, { text: ' Cleaning site directory' }] },
      { spans: [{ cls: 'text-directive', text: 'INFO    -' }, { text: ' Building documentation to directory: /home/zero/dotfiles/site' }] },
      { spans: [{ cls: 'text-directive', text: 'INFO    -' }, { text: ' Documentation built in ' }, { cls: 'text-highlight', text: '0.74 seconds' }] },
      { spans: [{ cls: 'text-param', text: '12M     site/' }] },
      { type: 'comment', text: '# Cero dependencias dinámicas, búsqueda estática offline instantánea y control en Git' }
    ],
    markdownSearch: '### Por qué funciona',
    caption: 'Compilación estática en MkDocs: documentación técnica completa generada en milisegundos'
  },
  {
    slug: 'rotacion-llaves-sops-kms-secretos-huerfanos',
    coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Seguridad criptográfica, llaves KMS y cifrado con Mozilla SOPS',
    svgFile: 'terminal-sops-kms-rotation.svg',
    title: 'sops-vault — sops updatekeys secrets.enc.yaml',
    badge: 'SOPS KMS ROTATION',
    user: 'root',
    host: 'deploy-bastion',
    pathText: '/etc/infra-secrets',
    command: 'sops --decrypt secrets.enc.yaml | head -n 3',
    lines: [
      { spans: [{ cls: 'text-comment', text: '[SOPS] Decrypting with master KMS ARN: ' }, { cls: 'text-directive', text: 'arn:aws:kms:us-east-1:10101010:key/8a2f-1102' }] },
      { type: 'alert', text: '# ALERTA: La llave KMS antigua fue revocada pero 3 servicios usaban ciphertext viejo' },
      { spans: [{ cls: 'text-keyword', text: '[SOPS]' }, { text: ' Rotating recipients to new KMS key: ' }, { cls: 'text-highlight', text: 'arn:aws:kms:...:key/9b3c-2026' }] },
      { spans: [{ cls: 'text-directive', text: '[OK]' }, { text: ' 18 secrets re-encrypted with zero-downtime grace period' }] }
    ],
    markdownSearch: '### El protocolo de rotación',
    caption: 'Descifrado y rotación con SOPS: transición sin caída de llave KMS comprometida'
  },
  {
    slug: 'develop-caido-apache-opcache-symlink-deploy',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Monitoreo de servidores Apache y concurrencia de memoria en Linux',
    svgFile: 'terminal-opcache-symlink-desync.svg',
    title: 'srv-web-dev — journalctl -u apache2 -n 20',
    badge: 'OPCACHE DESYNC',
    user: 'root',
    host: 'srv-dev-web',
    pathText: '/var/log/apache2',
    command: 'tail -n 5 /var/log/apache2/error.log',
    lines: [
      { spans: [{ cls: 'text-directive', text: '[core:warn]' }, { text: ' AH00052: child process 14201 still did not exit, sending SIGHUP' }] },
      { type: 'alert', text: 'Fatal error: require(): Failed opening required \'/var/www/releases/20261011/init.php\'' },
      { type: 'comment', text: '# OPcache retuvo bytecode apuntando al release antiguo borrado tras el symlink switch' },
      { spans: [{ cls: 'text-directive', text: 'Solución:' }, { cls: 'text-highlight', text: ' systemctl reload php8.2-fpm' }, { cls: 'text-comment', text: ' atómico en pipeline de despliegue' }] }
    ],
    markdownSearch: '### El falso diagnóstico',
    caption: 'Error de OPcache en Apache: desincronización entre symlinks de release y caché de bytecode'
  },
  {
    slug: 'beaver-builder-wp-rocket-estilos-dinamicos-corruptos',
    coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Desarrollo web frontend, inspección de estilos CSS y maquetadores dinámicos',
    svgFile: 'terminal-css-specificity-audit.svg',
    title: 'browser-devtools — CSS Specificity Inspection',
    badge: 'CSS SPECIFICITY',
    user: 'zero',
    host: 'audit-workstation',
    pathText: '~/inspections',
    command: 'curl -sI https://portal-empresa.invalid/wp-content/cache/wp-rocket/style.css',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'Age:' }, { cls: 'text-highlight', text: ' 38290' }, { text: ' (Cache-Control: public, max-age=31536000)' }] },
      { type: 'alert', text: '# CONFLICTO: :where(.fl-builder-content) redujo especificidad a (0,0,0)' },
      { spans: [{ cls: 'text-keyword', text: 'Critical CSS:' }, { text: ' Inyectó estilos globales que sobreescribieron clases dinámicas del botón' }] },
      { type: 'comment', text: '# Solución: Excluir selectores dinámicos del pipeline de minificación agresiva' }
    ],
    markdownSearch: '### La colisión de especificidad',
    caption: 'Auditoría de cabeceras HTTP y colisión de especificidad CSS por minificación estática'
  },
  {
    slug: 'archivos-fantasma-sucuri-eval-edge',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Firewall de aplicaciones web WAF y ciberseguridad perimetral',
    svgFile: 'terminal-sucuri-eval-edge.svg',
    title: 'waf-auditor — grep -rn "eval(base64" /code/web',
    badge: 'EVAL REMOTE EDGE',
    user: 'sre',
    host: 'srv-app-audit',
    pathText: '/code/web/wp-content/uploads',
    command: 'grep -rn "eval(" . | grep -E "(base64|gzinflate)"',
    lines: [
      { spans: [{ cls: 'text-param', text: './2026/08/cache_thumb.png.php:1: ' }, { cls: 'text-ip', text: 'eval(gzinflate(base64_decode($payload)))' }] },
      { type: 'alert', text: '# HALLAZGO CRÍTICO: Backdoor polimórfico camuflado como archivo .png.php' },
      { type: 'comment', text: '# Sucuri WAF en el Edge no inspeccionó transferencias SFTP directas hacia el PaaS' },
      { spans: [{ cls: 'text-directive', text: 'Remediación:' }, { cls: 'text-highlight', text: ' Montaje de /uploads con noexec y bloqueo de .php en servidor web' }] }
    ],
    markdownSearch: '### El hallazgo forense',
    caption: 'Detección forense: backdoor remoto camuflado en carpeta de medios no inspeccionada por el WAF'
  },
  {
    slug: 'netdata-awk-1996-incompatibilidad-posix',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Monitoreo de métricas del sistema, Netdata y análisis de procesos en Linux',
    svgFile: 'terminal-posix-awk-fail.svg',
    title: 'srv-monitor-02 — custom-collector.sh',
    badge: 'POSIX AWK BUG',
    user: 'netdata',
    host: 'srv-node-debian',
    pathText: '/usr/libexec/netdata/plugins.d',
    command: 'awk --version | head -n 1 && ./custom-collector.sh',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'mawk 1.3.4 20200120' }, { text: ' (Debian package: 1.3.4.20200120-2)' }] },
      { type: 'alert', text: 'mawk: line 42: function gensub never defined (exit status 2)' },
      { type: 'comment', text: '# ERROR POSIX: El script asumió gawk estándar de Ubuntu; en Debian mawk rompió el colector' },
      { spans: [{ cls: 'text-directive', text: 'Solución:' }, { cls: 'text-highlight', text: ' Reescribir regex usando sub()/gsub() estrictamente compatibles con POSIX' }] }
    ],
    markdownSearch: '### El error en mawk',
    caption: 'Fallo de compatibilidad en awk: mawk en Debian rompiendo extensiones privativas de gawk'
  },
  {
    slug: 'recaptcha-split-configuracion-falsa-aprobacion',
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Pruebas de calidad QA, validación de APIs y formularios seguros',
    svgFile: 'terminal-recaptcha-split-brain.svg',
    title: 'qa-validator — diff config/environments/',
    badge: 'QA SPLIT-BRAIN',
    user: 'devops',
    host: 'ci-pipeline',
    pathText: '~/app/config',
    command: 'diff -u environments/qa.json environments/prod.json',
    lines: [
      { spans: [{ cls: 'text-ip', text: '- "recaptcha_secret": "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"' }, { cls: 'text-comment', text: ' (Test Key)' }] },
      { spans: [{ cls: 'text-highlight', text: '+ "recaptcha_secret": "6Ld2026_LIVE_SECRET_KEY_ENTERPRISE_KEY_XYZ"' }] },
      { type: 'alert', text: '# FALSO POSITIVO: En QA la llave de prueba de Google aprueba el 100% de peticiones' },
      { type: 'comment', text: '# En producción fallaba porque el hostname real no estaba autorizado en Google Cloud' }
    ],
    markdownSearch: '### La trampa de la llave de test',
    caption: 'Diferencial de configuraciones: llave de prueba aprobando todo en QA mientras producción fallaba'
  },
  {
    slug: 'runners-github-actions-rbac-cluster-dev',
    coverUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Clúster de Kubernetes, orquestación de contenedores y políticas RBAC',
    svgFile: 'terminal-k8s-rbac-leak.svg',
    title: 'k8s-auditor — kubectl auth can-i --list',
    badge: 'K8S RBAC ESCALATION',
    user: 'auditor',
    host: 'bastion-k8s',
    pathText: '~',
    command: 'kubectl auth can-i create secrets --all-namespaces --as=system:serviceaccount:ci:runner',
    lines: [
      { spans: [{ cls: 'text-ip', text: 'yes' }, { text: ' (Matching ClusterRoleBinding: ' }, { cls: 'text-highlight', text: 'ci-runner-cluster-admin' }, { text: ')' }] },
      { type: 'alert', text: '# GRAVE: ServiceAccount de runners efímeros tenía privilegios totales sobre el clúster' },
      { type: 'comment', text: '# Cualquier PR de un desarrollador junior podía dumpear secretos de producción' },
      { spans: [{ cls: 'text-directive', text: 'Corrección:' }, { cls: 'text-param', text: ' RoleBinding restringido a namespace aislado con permisos mínimos' }] }
    ],
    markdownSearch: '### La auditoría de RBAC',
    caption: 'Auditoría en Kubernetes: permisos cluster-admin excesivos en runners de integración continua'
  },
  {
    slug: 'deploy-manual-con-github-actions-caido-billing',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Servidores cloud globales, contingencia operativa y redes de infraestructura',
    svgFile: 'terminal-billing-freeze-deploy.svg',
    title: 'ops-emergency — ./emergency-deploy.sh',
    badge: 'BILLING FREEZE',
    user: 'zero',
    host: 'ops-workstation',
    pathText: '~/deployments',
    command: 'gh workflow run deploy.yml && ./emergency-deploy.sh --hotfix',
    lines: [
      { type: 'alert', text: 'HTTP 403 Forbidden: Spending limit reached for GitHub Actions minutes' },
      { type: 'comment', text: '# Pipeline congelado por tarjeta corporativa rechazada a las 18:30' },
      { spans: [{ cls: 'text-highlight', text: '[EMERGENCY]' }, { text: ' Inicializando túnel SSH y empaquetando git-archive...' }] },
      { spans: [{ cls: 'text-directive', text: '[SUCCESS]' }, { text: ' Hotfix desplegado en 4 minutos mediante playbook Bash de contingencia' }] }
    ],
    markdownSearch: '### La activación del protocolo',
    caption: 'Ejecución de contingencia: despliegue manual por Bash tras bloqueo de GitHub Actions por facturación'
  },
  {
    slug: 'mergeado-no-es-aplicado-traefik-helmfile',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Enrutamiento de tráfico con Traefik Proxy y orquestación Helmfile en Kubernetes',
    svgFile: 'terminal-helmfile-git-drift.svg',
    title: 'k8s-edge — helmfile -e production diff',
    badge: 'GIT-DRIFT DESYNC',
    user: 'zero',
    host: 'sre-bastion',
    pathText: '~/infra/helmfiles',
    command: 'helmfile -e production diff && kubectl get ingressroute -n traefik',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'Comparing release=traefik, chart=traefik/traefik' }] },
      { type: 'alert', text: '# DESINCRONIZACIÓN: PR #892 estaba mergeado pero nunca se corrió el helmfile apply' },
      { spans: [{ cls: 'text-ip', text: '- maxConnections: 100' }, { text: ' (Estado real en el clúster)' }] },
      { spans: [{ cls: 'text-highlight', text: '+ maxConnections: 5000' }, { text: ' (Estado deseado en Git)' }] },
      { type: 'comment', text: '# Falsa seguridad: El código estaba en main pero el clúster seguía con la config vieja' }
    ],
    markdownSearch: '### La trampa del merge sin apply',
    caption: 'Diferencial en Helmfile: divergencia entre el repositorio Git y la configuración viva en el clúster'
  },
  {
    slug: 'politicas-despliegue-cloudflare-actions-en-conflicto',
    coverUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Red perimetral Cloudflare, DNS y despliegues serverless',
    svgFile: 'terminal-cloudflare-actions-conflict.svg',
    title: 'edge-deploy — wrangler pages deployment list',
    badge: 'RACE IN EDGE DEPLOY',
    user: 'runner',
    host: 'gh-actions-runner',
    pathText: '~/repo',
    command: 'wrangler pages deployment list --project-name portal-web',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'ID: deploy-01' }, { text: ' | Commit: c38f2 | Cloudflare Git Integration: ' }, { cls: 'text-highlight', text: 'Building...' }] },
      { spans: [{ cls: 'text-directive', text: 'ID: deploy-02' }, { text: ' | Commit: c38f2 | GitHub Actions Wrangler: ' }, { cls: 'text-directive', text: 'Uploading...' }] },
      { type: 'alert', text: '# CONFLICTO: Dos artefactos generados en paralelo sobreescribiéndose en el CDN' },
      { type: 'comment', text: '# Solución: Desactivar la integración automática de Cloudflare y gobernar con Actions' }
    ],
    markdownSearch: '### La doble compilación',
    caption: 'Conflicto en Cloudflare Pages: carreras de despliegue entre la integración Git y GitHub Actions'
  },
  {
    slug: 'poc-ia-produccion-cuello-botella-concurrencia',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Servidor de modelos de inteligencia artificial y pruebas de carga con Locust',
    svgFile: 'terminal-uvicorn-deadlock.svg',
    title: 'uvicorn-cluster — locust -f load_test.py',
    badge: 'UVICORN DEADLOCK',
    user: 'sre',
    host: 'benchmarking-node',
    pathText: '~/tests',
    command: 'locust --headless -u 50 -r 5 -H http://127.0.0.1:8000 --run-time 30s',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'POST /api/v1/predict' }, { text: ' | Requests: 140 | ' }, { cls: 'text-ip', text: 'Fails: 98 (70.0%)' }] },
      { spans: [{ cls: 'text-param', text: 'Average Latency: ' }, { cls: 'text-ip', text: '8450 ms' }, { text: ' | Max Latency: ' }, { cls: 'text-ip', text: '31200 ms' }] },
      { type: 'alert', text: '# CUELLO DE BOTELLA: LLM inference síncrona bloqueó por completo el Event Loop de FastAPI' },
      { type: 'comment', text: '# Solución: Worker pool con Celery + Redis desacoplando la inferencia del servidor web' }
    ],
    markdownSearch: '### El colapso en la prueba de carga',
    caption: 'Resultados de Locust: colapso de latencia por llamadas bloqueantes en el event loop de Uvicorn'
  },
  {
    slug: 'hardening-ssh-sudoers-bloqueo-a-mitad-de-camino',
    coverUrl: 'https://images.unsplash.com/photo-1510519138171-cbe656418844?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Seguridad en servidores Linux, configuración de SSH y privilegios en sudoers',
    svgFile: 'terminal-sudoers-lockout.svg',
    title: 'srv-prod-bastion — visudo -c',
    badge: 'SUDOERS HARDENING',
    user: 'root',
    host: 'bastion-internal',
    pathText: '/etc/sudoers.d',
    command: 'bash -x /root/scripts/harden-ssh.sh',
    lines: [
      { spans: [{ cls: 'text-directive', text: '+ echo "PasswordAuthentication no" >> /etc/ssh/sshd_config' }] },
      { spans: [{ cls: 'text-directive', text: '+ echo "%sudo ALL=(ALL) ALL" > /etc/sudoers.d/99-corp-admin' }] },
      { type: 'alert', text: '>>> /etc/sudoers.d/99-corp-admin: syntax error near line 1 <<<' },
      { type: 'comment', text: '# ERROR DE SINTAXIS: El script cerró la sesión activa sin validar con visudo' },
      { spans: [{ cls: 'text-highlight', text: 'Regla de oro:' }, { cls: 'text-param', text: ' Nunca cerrar la sesión SSH actual hasta probar una nueva conexión en paralelo' }] }
    ],
    markdownSearch: '### La pérdida de control',
    caption: 'Error de sintaxis en sudoers: la sesión cerrada antes de verificar validez con visudo'
  },
  {
    slug: 'secret-scanning-push-protection-684-repos',
    coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Detección de secretos filtrados en código y auditoría de repositorios GitHub',
    svgFile: 'terminal-secret-scanning-trunc.svg',
    title: 'gh-audit — python3 audit_repos.py --org enterprise',
    badge: 'API PAGINATION TRUNC',
    user: 'security-eng',
    host: 'audit-box',
    pathText: '~/security',
    command: 'python3 audit_repos.py --org enterprise-corp',
    lines: [
      { spans: [{ cls: 'text-directive', text: '[INFO]' }, { text: ' Paginando repositorios vía GraphQL API...' }] },
      { spans: [{ cls: 'text-param', text: 'Auditados: ' }, { cls: 'text-highlight', text: '161 repositorios' }, { text: ' | Secret Scanning activo: 100%' }] },
      { type: 'alert', text: '# SILENT TRUNCATION: La organización tenía 684 repositorios; el bucle paró en 161' },
      { type: 'comment', text: '# Causa: Falta de cursor endCursor en paginación; 523 repos quedaron sin auditar' }
    ],
    markdownSearch: '### El script que mentía sin saberlo',
    caption: 'Truncamiento silencioso: bucle GraphQL deteniéndose prematuramente por error en cursor de paginación'
  },
  {
    slug: 'packagist-token-filtrado-pantheon-composer',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Desarrollo backend en PHP, gestión de dependencias con Composer y seguridad de tokens',
    svgFile: 'terminal-packagist-leak.svg',
    title: 'git-history — trufflehog git file:///code',
    badge: 'COMPOSER LEAK',
    user: 'security',
    host: 'audit-station',
    pathText: '/code',
    command: 'trufflehog git file:///code --only-verified',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'Found verified secret:' }, { text: ' Composer Private Packagist Token' }] },
      { spans: [{ cls: 'text-param', text: 'Commit: ' }, { cls: 'text-highlight', text: 'a48f219 (hace 3 años)' }, { text: ' | File: auth.json' }] },
      { type: 'alert', text: '# BORRADO DEFICIENTE: El archivo se borró en master pero seguía en el historial de Git' },
      { type: 'comment', text: '# Remediación: Revocación inmediata del token en Packagist + reescritura con git-filter-repo' }
    ],
    markdownSearch: '### El hallazgo en el árbol de Git',
    caption: 'Hallazgo con TruffleHog: token de Composer expuesto en commit antiguo del historial Git'
  },
  {
    slug: 'rm-comodin-carpetas-compartidas-autopsia',
    coverUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Línea de comandos de Linux, sistemas de archivos ext4 y recuperación forense de datos',
    svgFile: 'terminal-rm-wildcard-disaster.svg',
    title: 'workstation — zsh -x clean_screenshots.sh',
    badge: 'WILDCARD DISASTER',
    user: 'zero',
    host: 'workstation',
    pathText: '~/Workspace/projects',
    command: 'bash -x ./clean_screenshots.sh',
    lines: [
      { spans: [{ cls: 'text-directive', text: '+ TARGET_DIR=""' }, { cls: 'text-comment', text: ' (variable sin inicializar)' }] },
      { spans: [{ cls: 'text-ip', text: '+ rm -f /*.png' }, { cls: 'text-comment', text: ' -> resuelto a rm -f *.png en cwd actual' }] },
      { type: 'alert', text: '# DESASTRE: 70 diagramas y capturas de arquitectura borradas en 0.2 segundos' },
      { spans: [{ cls: 'text-highlight', text: 'Rescate:' }, { cls: 'text-param', text: ' Recuperación de inodos en ext4 con ext4magic + regla incondicional set -u' }] }
    ],
    markdownSearch: '### El segundo fatídico',
    caption: 'Ejecución del rm con comodín: variable vacía provocando borrado accidental en directorio actual'
  },
  {
    slug: 'postgres-ownership-migraciones-django-bloqueadas',
    coverUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Bases de datos PostgreSQL, esquemas relacionales y migraciones en Django',
    svgFile: 'terminal-postgres-ownership-lock.svg',
    title: 'pg-cluster — psql -U app_user -d core_production',
    badge: 'PG OWNERSHIP LOCK',
    user: 'django',
    host: 'srv-app-backend',
    pathText: '~/backend',
    command: 'python manage.py migrate --database=default',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'Operations to perform: Apply all migrations: billing, users' }] },
      { type: 'alert', text: 'ProgrammingError: must be owner of table orders_order (SQLSTATE 42501)' },
      { type: 'comment', text: '# CONFUSIÓN DE ROLES: app_user tenía ALL PRIVILEGES pero no era el OWNER' },
      { spans: [{ cls: 'text-highlight', text: 'Solución:' }, { cls: 'text-param', text: ' REASSIGN OWNED BY deployer_legacy TO app_user;' }] }
    ],
    markdownSearch: '### El error en consola',
    caption: 'Fallo de migración en PostgreSQL: incompatibilidad entre permisos USAGE y OWNER de tabla'
  },
  {
    slug: 'llave-ci-ssh-bastion-permisos-despliegue',
    coverUrl: 'https://images.unsplash.com/photo-1510519138171-cbe656418844?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Llaves criptográficas SSH, servidores bastion y autenticación segura',
    svgFile: 'terminal-ssh-permissions-bad.svg',
    title: 'ci-runner — ssh -v -i /tmp/deploy_key',
    badge: 'SSH PERMISSIONS',
    user: 'runner',
    host: 'ephemeral-runner-08',
    pathText: '/home/runner',
    command: 'ssh -i /tmp/deploy_key -o BatchMode=yes deploy@10.0.0.15',
    lines: [
      { type: 'alert', text: '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' },
      { type: 'alert', text: '@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @' },
      { spans: [{ cls: 'text-ip', text: 'Permissions 0644 for \'/tmp/deploy_key\' are too open.' }] },
      { spans: [{ cls: 'text-directive', text: 'Load key "/tmp/deploy_key": bad permissions' }] },
      { spans: [{ cls: 'text-highlight', text: 'Solución obligatoria:' }, { cls: 'text-param', text: ' chmod 600 /tmp/deploy_key en step de GitHub Actions' }] }
    ],
    markdownSearch: '### El error en el runner',
    caption: 'Rechazo de cliente SSH: clave privada con permisos 0644 abortando la conexión en el runner'
  },
  {
    slug: 'fail2ban-ubuntu-systemd-backend-falso-positivo',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    coverAlt: 'Protección contra intrusiones con Fail2ban, journald y firewalls en Linux',
    svgFile: 'terminal-fail2ban-silent-fail.svg',
    title: 'srv-ubuntu-24 — fail2ban-client status sshd',
    badge: 'FAIL2BAN SILENT FAIL',
    user: 'root',
    host: 'srv-gateway-01',
    pathText: '/etc/fail2ban',
    command: 'fail2ban-client status sshd && ls -l /var/log/auth.log',
    lines: [
      { spans: [{ cls: 'text-directive', text: 'Status for the jail: sshd' }] },
      { spans: [{ cls: 'text-param', text: '|- Filter: Currently failed: ' }, { cls: 'text-highlight', text: '0' }, { text: ' | Total failed: ' }, { cls: 'text-highlight', text: '0' }] },
      { spans: [{ cls: 'text-param', text: '`- Actions: Currently banned: ' }, { cls: 'text-highlight', text: '0' }, { text: ' | Total banned: ' }, { cls: 'text-highlight', text: '0' }] },
      { type: 'alert', text: 'ls: cannot access \'/var/log/auth.log\': No such file or directory' },
      { type: 'comment', text: '# Ubuntu 24.04 no incluye rsyslog por defecto; Fail2ban vigilaba un archivo inexistente' },
      { spans: [{ cls: 'text-directive', text: 'Solución:' }, { cls: 'text-highlight', text: ' backend = systemd' }, { cls: 'text-comment', text: ' en /etc/fail2ban/jail.local para leer journald' }] }
    ],
    markdownSearch: '### El descubrimiento en el log',
    caption: 'Falso positivo de Fail2ban: jail reportando 0 fallos mientras vigilaba un archivo auth.log inexistente'
  }
];

async function main() {
  console.log(`Iniciando generación de assets para ${INCIDENTS.length} posts...`);
  const imagesDir = path.join(__dirname, '../public/blog-posts/images');
  const postsDir = path.join(__dirname, '../public/blog-posts');

  for (const item of INCIDENTS) {
    console.log(`\n--- Procesando: ${item.slug} ---`);

    // 1. Generar Terminal SVG
    const svgPath = path.join(imagesDir, item.svgFile);
    generateTerminalSvg({
      title: item.title,
      badge: item.badge,
      user: item.user,
      host: item.host,
      pathText: item.pathText,
      command: item.command,
      lines: item.lines,
      outputFile: svgPath
    });

    // 2. Definir ruta de Cover Image
    const coverFileName = `cover-${item.slug}.jpg`;
    const coverPath = path.join(imagesDir, coverFileName);
    const coverWebPath = `/blog-posts/images/${coverFileName}`;

    // Descargar Cover si no existe
    if (!fs.existsSync(coverPath)) {
      console.log(`Descargando cover único desde Unsplash...`);
      const { execSync } = require('child_process');
      try {
        execSync(`curl -s -L "${item.coverUrl}" -o "${coverPath}"`, { timeout: 15000 });
        console.log(`[OK] Cover descargado en: ${coverFileName}`);
      } catch (err) {
        console.warn(`[WARN] Error descargando cover para ${item.slug}: ${err.message}`);
      }
    } else {
      console.log(`Cover ya existe en: ${coverFileName}`);
    }

    // 3. Modificar archivo Markdown
    const mdPath = path.join(postsDir, `${item.slug}.md`);
    if (fs.existsSync(mdPath)) {
      let content = fs.readFileSync(mdPath, 'utf8');

      // Actualizar coverImage y coverAlt en Frontmatter
      content = content.replace(/^coverImage:\s*"[^"]*"/m, `coverImage: "${coverWebPath}"`);
      content = content.replace(/^coverAlt:\s*"[^"]*"/m, `coverAlt: "${item.coverAlt}"`);

      // Inyectar ilustración SVG si no está ya presente
      if (!content.includes(item.svgFile)) {
        const svgEmbed = `\n\n![${item.caption}](/blog-posts/images/${item.svgFile} "${item.caption}")\n\n`;
        if (item.markdownSearch && content.includes(item.markdownSearch)) {
          content = content.replace(item.markdownSearch, `${item.markdownSearch}${svgEmbed}`);
        } else {
          // Buscar el primer encabezado H2 o H3
          content = content.replace(/(##\s+[^\n]+\n)/, `$1${svgEmbed}`);
        }
        console.log(`[OK] Ilustración SVG inyectada en: ${item.slug}.md`);
      }

      fs.writeFileSync(mdPath, content, 'utf8');
      console.log(`[OK] Markdown actualizado: ${item.slug}.md`);
    } else {
      console.error(`[ERROR] No se encontró archivo markdown: ${mdPath}`);
    }
  }

  // 4. Regenerar index.json
  console.log('\nRegenerando index.json...');
  const { execSync } = require('child_process');
  execSync('node scripts/generate-index.js', { stdio: 'inherit' });
  console.log('¡Todos los assets fueron generados con éxito!');
}

main().catch(console.error);
