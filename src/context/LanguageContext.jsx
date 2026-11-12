import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    nav: {
      systems: 'Systems',
      architecture: 'Architecture',
      operations: 'Operations',
      routine: 'Routine',
      projects: 'Projects',
      dispatches: 'Dispatches',
      contact: 'Contact',
      blog: 'Blog',
    },
    hero: {
      kicker: 'INFRASTRUCTURE',
      kickerLine1: 'INFRA',
      kickerLine2: 'STRUCTURE',
      telemetry: 'SYSTEMS & RELIABILITY ENGINEERING · LINUX · AUTOMATION',
      name: 'Steven Muñoz',
      handle: 'zer0sh — Site Reliability Engineer',
      doctrinePrimary: 'I build reliable software and practical infrastructure for production environments.',
      doctrineSecondary: 'My work spans full-stack development, Linux administration, and proactive reliability. I focus on clean architecture, automated CI/CD pipelines, and pragmatic observability to keep applications fast, resilient, and easy to maintain.',
    },
    about: {
      kicker: 'BACKGROUND & FOCUS',
      title: 'Pragmatic Engineering & Reliable Systems',
      description: 'Systems engineer focused on the intersection between application development and dependable infrastructure. In my day-to-day work, I maintain Linux servers, design reproducible CI/CD pipelines with GitHub Actions and Docker, and write automated tools in Bash and Python to eliminate repetitive operational toil.',
      experience: 'I approach reliability through hands-on rigor: tracking actionable metrics in Prometheus and Grafana, debugging production incidents calmly down to their root cause, and documenting blameless post-mortems so that every issue turns into automated safeguards and lasting resilience.',
    },
    dailyOps: {
      kicker: 'PRODUCTION // RUNBOOKS & OPERATIONS',
      title: 'Production Experience',
      subtitle: 'Hands-on responsibilities in live environments: Linux fleet administration, CI/CD orchestration, and platform reliability.',
      op1: {
        code: 'OPS.01',
        title: 'Active Telemetry & Alert Triage',
        description: 'Monitoring host health, CPU/RAM saturation, disk I/O, and service telemetry via Prometheus, Grafana, and Sentry. Correlating real-time error spikes, checking SLIs/SLOs, and isolating anomalies before customer disruption.',
        tags: ['Prometheus', 'Grafana', 'Sentry', 'SLI/SLO Auditing'],
      },
      op2: {
        code: 'OPS.02',
        title: 'Production Deployments & CI/CD Pipelines',
        description: 'Managing continuous delivery pipelines across Linode VPS nodes, dedicated bare-metal, and managed PaaS. Driving multi-service builds for Django, WordPress, Drupal, and React runtimes with Docker caching and automated rollback triggers.',
        tags: ['GitHub Actions', 'Docker', 'Rollback Hooks', 'Multi-Env Delivery'],
      },
      op3: {
        code: 'OPS.03',
        title: 'Incident Response & Root-Cause Analysis (RCA)',
        description: 'Diagnosing live production incidents: NGINX upstream 502/504 timeouts, SSL/TLS certificate renewal failures, DNS and Cloudflare proxy edge anomalies, database connection pool exhaustion, and memory leaks. Documenting blameless post-mortems.',
        tags: ['Incident Response', 'NGINX', 'SSL/TLS', 'Cloudflare', 'Blameless RCA'],
      },
      op4: {
        code: 'OPS.04',
        title: 'Linux Host Administration & Docker Fleet',
        description: 'Administering Linux servers hosting 20+ isolated Docker Compose containers. Hardening security posture via SSH bastion policies, Fail2ban, UFW firewall configurations, regular security kernel updates, and strict POSIX file permissions.',
        tags: ['Linux (Debian/Ubuntu)', 'Docker Compose', 'SSH Hardening', 'UFW / Fail2ban'],
      },
      op5: {
        code: 'OPS.05',
        title: 'Toil Elimination & Operational Automation',
        description: 'Writing idempotent Bash and Python utilities for automated offsite database backups, environment database sanitization and synchronization, log rotation pruning, and self-healing cron jobs to permanently eradicate manual toil.',
        tags: ['Bash Scripting', 'Python Automation', 'DB Sync', 'Toil Elimination'],
      },
    },
    timeline: {
      kicker: 'OPERATIONAL WORKFLOW',
      title: 'Operational Workflow & Triage',
      subtitle: 'A practical overview of a typical operational flow: from proactive telemetry checks to calm incident triage and automation that prevents recurring failures.',
      step1: {
        time: '08:30',
        status: 'OBSERVABILITY & HEALTH',
        statusType: 'ok',
        title: 'Morning Telemetry Inspection & Health Checks',
        description: 'First protocol: review Grafana dashboards, check Sentry exception streams, and verify synthetic uptime probes. Check queue depths, disk headroom across VPS nodes, and ensure zero stale locks in production databases.',
        tags: ['Grafana Dashboards', 'Sentry Streams', 'Host Health', 'SLO Budget'],
      },
      step2: {
        time: '11:00',
        status: 'CI/CD & DEPLOYMENTS',
        statusType: 'active',
        title: 'CI/CD Pipelines & Scheduled Releases',
        description: 'Review merge requests, inspect GitHub Actions runner logs, and oversee scheduled release windows. Monitor Docker image layers, ensure security scans pass without critical CVEs, and verify zero-downtime container rollouts.',
        tags: ['GitHub Actions', 'Docker Buildx', 'Trivy CVE Scan', 'Zero-Downtime Rollout'],
      },
      step3: {
        time: '14:00',
        status: 'INCIDENT RESPONSE',
        statusType: 'warn',
        title: 'Incident Response, Socket Tracing & Live Debugging',
        description: 'When high-priority alerts fire (such as upstream 502 gateway timeouts), trace the root cause calmly: inspect systemd logs, examine socket backlog exhaustion, diagnose worker starvation, apply hotfixes, and confirm latency returns to normal.',
        tags: ['SSH Bastion', 'systemd Journal', 'Network Sockets', 'Root-Cause Discovery'],
      },
      step4: {
        time: '16:30',
        status: 'POST-MORTEM & TOIL',
        statusType: 'commit',
        title: 'Post-Mortem Documentation & Systematic Automation',
        description: 'Turn incidents into permanent resilience: write a blameless post-mortem document, fine-tune alerting rules, and craft automated recovery scripts into the repository to prevent the same failure from happening again.',
        tags: ['Blameless Post-Mortem', 'Alerting Rules', 'Idempotent Automation', 'GitOps Commit'],
      },
    },
    work: {
      kicker: 'TECHNICAL CAPABILITIES',
      title: 'Core Competencies',
      subtitle: 'Engineering focus across distributed systems, automation, and operational resilience',
      function1: {
        name: 'Kubernetes Platform Operations',
        description: 'Orchestrating production workloads with K3s and Kubernetes, implementing GitOps synchronization via ArgoCD, and maintaining self-healing cluster states.',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps'],
      },
      function2: {
        name: 'Telemetry & Observability',
        description: 'Deploying end-to-end telemetry pipelines with Prometheus, Grafana, Loki, and Sentry for real-time metrics, distributed tracing, and centralized log auditing.',
        tags: ['Prometheus', 'Grafana', 'Loki', 'Telemetry'],
      },
      function3: {
        name: 'Automated CI/CD Delivery',
        description: 'Architecting continuous delivery pipelines with GitHub Actions, container layer caching, parallel smoke testing, and zero-downtime deployment strategies with automatic rollback.',
        tags: ['CI/CD', 'GitHub Actions', 'Docker', 'Automation'],
      },
      function4: {
        name: 'Incident Response & Root-Cause Analysis',
        description: 'Systematic diagnosis of production anomalies: kernel process inspection, network socket exhaustion, NGINX SSL/TLS termination, and CVE vulnerability mitigation.',
        tags: ['Incident Response', 'RCA', 'Hardening', 'Security'],
      },
      function5: {
        name: 'Linux Systems Administration',
        description: 'Operating Linux production servers, bare-metal nodes, and containerized runtime clusters. Implementing firewall policies, Fail2ban, SSH key hardening, and POSIX permissions.',
        tags: ['Linux', 'POSIX', 'Kernel', 'Security'],
      },
      function6: {
        name: 'Systems Tooling & Automation',
        description: 'Building high-performance CLI/TUI utilities in Rust and resilient automation scripts in Bash, reducing operational toil and enforcing deterministic infrastructure states.',
        tags: ['Rust', 'Bash Scripting', 'Toil Reduction', 'TUI Tooling'],
      },
    },
    skills: {
      kicker: 'TECHNICAL MATRIX',
      title: 'Technical Stack',
      infrastructure: {
        name: 'Cloud-Native & Orchestration',
        items: ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
      },
      observability: {
        name: 'Observability & Telemetry',
        items: ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Log Aggregation', 'Metric Alerts'],
      },
      systems: {
        name: 'Linux & Systems',
        items: ['Linux Administration', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Hardware Telemetry'],
      },
      reliability: {
        name: 'Reliability & Delivery',
        items: ['GitHub Actions', 'Trivy Scanning', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
      },
    },
    projects: {
      kicker: 'PORTFOLIO // SYSTEMS ENGINEERING',
      title: 'Featured Projects',
      subtitle: 'Engineering platforms, operator tooling, and production infrastructure automation',
      viewAll: 'Explore all repositories on GitHub',
      tabPreview: 'PREVIEW',
      tabTopology: 'TOPOLOGY',
      tabSpecs: 'SPECS',
      viewReadme: 'README // DOCS',
      viewCode: 'SOURCE CODE',
      runtimeStatus: 'SYSTEM_OK',
      project1: {
        name: 'k3s-lab',
        domain: 'Cloud-Native Platform Simulation',
        description: 'Automated development platform simulating production cloud-native operations with GitOps reconciliation, centralized logging, and end-to-end metrics observability.',
        tags: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Grafana', 'Loki', 'Shell'],
        link: 'https://github.com/zer0sh/k3s-lab',
      },
      project2: {
        name: 'sunim-tui',
        domain: 'Infrastructure Operations TUI (Rust)',
        description: 'Keyboard-driven terminal interface written in Rust for remote platform environment lifecycle, featuring non-blocking background executions, cache-first hydration, and graceful signal recovery.',
        tags: ['Rust', 'Terminus CLI', 'Asynchronous POSIX', 'Vim-Style TUI'],
        link: 'https://github.com/zer0sh/sunim-tui',
      },
      project3: {
        name: 'zer0sh-site-health-monitor',
        domain: 'WordPress.org Plugin & Runtime Reliability Engine',
        description: 'Open-source, ultra-lightweight, 100% read-only WordPress plugin published on WordPress.org. Diagnoses PHP runtime constraints, HTTP security headers, WP-Cron/loopback health, and scans CVEs via WPVulnerability API with zero telemetry and transient caching.',
        tags: ['WordPress Plugin', 'WordPress.org', 'PHP', 'Security Headers', 'WPVulnerability API', 'Zero Telemetry'],
        link: 'https://github.com/zer0sh/zer0sh-site-health-monitor',
        externalLink: 'https://wordpress.org/plugins/zer0sh-site-health-monitor/',
        externalLabel: 'WordPress.org Plugin',
      },
      project4: {
        name: 'cms-local-envs',
        domain: 'Automated Delivery & Rollback Pipeline',
        description: 'Containerized multi-service development environments with automated GitHub Actions delivery: Buildx image caching, parallel smoke testing, Trivy vulnerability scanning, and automatic deployment rollback.',
        tags: ['Docker Compose', 'GitHub Actions', 'Trivy Security', 'Automatic Rollback', 'CI/CD'],
        link: 'https://github.com/zer0sh/cms-local-envs',
      },
      project5: {
        name: 'gh-runner-selfhosted-docker',
        domain: 'Containerized Runner Infrastructure',
        description: 'Containerized, self-hosted CI/CD execution cluster providing reproducible build environments, reduced attack surfaces, and local workflow verification.',
        tags: ['Docker', 'GitHub Actions', 'CI/CD Automation', 'Linux Isolation'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
      },
      project6: {
        name: 'dotfiles',
        domain: 'Declarative Workstation Configuration',
        description: 'Engineered personal computing environment emphasizing modal workflows, custom telemetry, and low-latency system interactions.',
        tags: ['Hyprland', 'Wayland', 'POSIX Shell', 'Declarative Config', 'Wiki'],
        link: 'https://github.com/zer0sh/dotfiles',
      },
    },
    dispatches: {
      kicker: 'RESEARCH // FIELD NOTES',
      title: 'Field Dispatches & Research',
      subtitle: 'Real production post-mortems, systems engineering investigations, and reliability practices',
      readArticle: 'Read Dispatch',
      post1: {
        title: 'Post-Mortem: NGINX Socket Exhaustion & Kernel Tuning',
        tag: 'P1 Post-Mortem',
        description: 'Analyzing a live production P1: how sudden traffic surges saturated TCP listen queues (somaxconn) triggering 502 Bad Gateways, and the kernel remedies applied.',
        slug: 'postmortem-nginx-socket-exhaustion',
      },
      post2: {
        title: 'Shell Builtins Deep Dive',
        tag: 'POSIX Internals',
        description: 'POSIX shell internals, kernel process execution, and memory management constraints in container runtimes.',
        slug: 'shell-builtins',
      },
      post3: {
        title: 'CVE-2026-9860 Analysis',
        tag: 'Security Advisory',
        description: 'Vulnerability analysis, exposure vectors, and preventative infrastructure hardening at scale.',
        slug: 'cve-2026-9860',
      },
    },
    contact: {
      kicker: 'DIRECT SIGNALS',
      title: 'Contact & Signals',
      description: 'Available for Site Reliability Engineering, distributed infrastructure, and systems platform challenges.',
      email: 'Email',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      operator: 'Steven Muñoz',
      repo: 'github.com/zer0sh',
      career: 'linkedin.com/in/steven-munozl',
      status: 'AVAILABILITY 99.99% · LATAM / REMOTE',
    },
    blog: {
      title: 'Technical Field Dispatches',
      subtitle: 'Operating systems, incident investigations, and reliability engineering',
    },
  },
  es: {
    nav: {
      systems: 'Stack',
      architecture: 'Especialidades',
      operations: 'Operaciones',
      routine: 'Flujo Operativo',
      projects: 'Proyectos',
      dispatches: 'Artículos',
      contact: 'Contacto',
      blog: 'Blog',
    },
    hero: {
      kicker: 'INFRAESTRUCTURA',
      kickerLine1: 'INFRA',
      kickerLine2: 'ESTRUCTURA',
      telemetry: 'INGENIERÍA DE SISTEMAS Y CONFIABILIDAD · LINUX · AUTOMATIZACIÓN',
      name: 'Steven Muñoz',
      handle: 'zer0sh — Site Reliability Engineer',
      doctrinePrimary: 'Construyo software fiable e infraestructura práctica para entornos en producción.',
      doctrineSecondary: 'Mi trabajo abarca desarrollo de software, administración de servidores Linux y fiabilidad operativa. Priorizo arquitecturas limpias, pipelines de CI/CD automatizados y observabilidad pragmática para que las aplicaciones funcionen de forma estable y sin fricciones.',
    },
    about: {
      kicker: 'TRAYECTORIA Y ENFOQUE',
      title: 'Ingeniería Pragmática & Sistemas Fiables',
      description: 'Ingeniero de sistemas enfocado en el punto de encuentro entre el desarrollo de aplicaciones y una infraestructura predecible. En mi día a día administro servidores Linux, diseño pipelines de CI/CD reproducibles con GitHub Actions y Docker, y creo herramientas de automatización en Bash y Python para eliminar el trabajo manual repetitivo.',
      experience: 'Entiendo la fiabilidad desde la práctica: supervisar métricas claras con Prometheus y Grafana, diagnosticar incidentes en producción con calma hasta encontrar la causa raíz y documentar post-mortems sin culpas para que cada problema se traduzca en defensas automáticas que evitan su repetición.',
    },
    dailyOps: {
      kicker: 'PRODUCCIÓN // RUNBOOKS & OPERACIONES',
      title: 'Experiencia en Producción',
      subtitle: 'Responsabilidades reales en entornos vivos: administración de flotas Linux, orquestación de despliegues y fiabilidad de plataforma.',
      op1: {
        code: 'OPS.01',
        title: 'Telemetría Activa y Triage de Alertas',
        description: 'Monitoreo de saturación de CPU/RAM, I/O de disco y telemetría de servicios vía Prometheus, Grafana y Sentry. Correlación de picos de error en tiempo real, validación de SLIs/SLOs y aislamiento de anomalías antes de afectar al usuario final.',
        tags: ['Prometheus', 'Grafana', 'Sentry', 'Auditoría SLI/SLO'],
      },
      op2: {
        code: 'OPS.02',
        title: 'Despliegues en Producción y Pipelines CI/CD',
        description: 'Gestión de flujos de entrega continua en nodos Linode VPS, bare-metal y PaaS gestionados. Despliegues para entornos Django, WordPress, Drupal y React con caché de capas Docker y disparadores automáticos de rollback.',
        tags: ['GitHub Actions', 'Docker', 'Rollback Automático', 'Entrega Multi-Entorno'],
      },
      op3: {
        code: 'OPS.03',
        title: 'Respuesta a Incidentes y Causa Raíz (RCA)',
        description: 'Diagnóstico en caliente de incidentes en producción: timeouts 502/504 en NGINX, fallos de renovación en certificados SSL/TLS, anomalías en DNS/Cloudflare, saturación del pool de conexiones de base de datos y fugas de memoria. Documentación de post-mortems sin culpa.',
        tags: ['Respuesta a Incidentes', 'NGINX', 'SSL/TLS', 'Cloudflare', 'RCA Sin Culpa'],
      },
      op4: {
        code: 'OPS.04',
        title: 'Administración de Servidores Linux y Flota Docker',
        description: 'Operación de servidores Linux que albergan más de 20 contenedores aislados con Docker Compose. Fortalecimiento de seguridad mediante políticas de bastión SSH, Fail2ban, reglas UFW, parches de seguridad de kernel y permisos POSIX estrictos.',
        tags: ['Linux (Debian/Ubuntu)', 'Docker Compose', 'Hardening SSH', 'UFW / Fail2ban'],
      },
      op5: {
        code: 'OPS.05',
        title: 'Eliminación de Toil y Automatización Operativa',
        description: 'Desarrollo de scripts idempotentes en Bash y Python para backups remotos programados de bases de datos, sanitización y sincronización de datos entre entornos, rotación de logs y crons defensivos para erradicar el trabajo manual repetitivo.',
        tags: ['Scripts Bash', 'Automatización Python', 'Sincronización DB', 'Eliminación de Toil'],
      },
    },
    timeline: {
      kicker: 'METODOLOGÍA DE TRABAJO',
      title: 'Flujo Operativo & Rutina',
      subtitle: 'Recorrido práctico por un flujo de trabajo típico: desde la revisión preventiva de métricas hasta la atención de incidentes y la automatización definitiva para evitar fallos recurrentes.',
      step1: {
        time: '08:30',
        status: 'OBSERVABILIDAD & SALUD',
        statusType: 'ok',
        title: 'Inspección de Métricas Matutina y Chequeo de Salud',
        description: 'Comienzo de jornada: revisar tableros de Grafana, analizar excepciones recientes en Sentry y verificar monitores de uptime. Comprobar márgenes de almacenamiento en VPS y descartar bloqueos residuales en bases de datos.',
        tags: ['Dashboards Grafana', 'Streams Sentry', 'Salud de Hosts', 'Presupuesto de SLO'],
      },
      step2: {
        time: '11:00',
        status: 'CI/CD & DESPLIEGUES',
        statusType: 'active',
        title: 'Pipelines CI/CD y Ventanas de Despliegue',
        description: 'Revisión de pull requests, inspección de logs de runners en GitHub Actions y supervisión de ventanas de liberación. Monitoreo de capas en Docker, validación de escaneos de seguridad y verificación de despliegue sin caída.',
        tags: ['GitHub Actions', 'Docker Buildx', 'Escaneo Trivy CVE', 'Despliegue Zero-Downtime'],
      },
      step3: {
        time: '14:00',
        status: 'TRIAGE & RESPUESTA',
        statusType: 'warn',
        title: 'Respuesta a Incidentes y Diagnóstico en Caliente',
        description: 'Ante alertas críticas (como errores 502 de NGINX en APIs), diagnóstico enfocado en causa raíz: inspección de logs con journalctl, revisión de saturación de sockets, optimización de workers y confirmación de restablecimiento de servicio.',
        tags: ['Bastión SSH', 'Logs systemd', 'Sockets de Red', 'Causa Raíz'],
      },
      step4: {
        time: '16:30',
        status: 'POST-MORTEM & TOIL',
        statusType: 'commit',
        title: 'Documentación Post-Mortem y Automatización',
        description: 'Convertir cada incidente en estabilidad a largo plazo: redacción de post-mortem sin culpas, ajuste de reglas de alerta en Prometheus y desarrollo de scripts en Bash para automatizar la mitigación si el escenario vuelve a presentarse.',
        tags: ['Post-Mortem Sin Culpa', 'Reglas de Alerta', 'Automatización Idempotente', 'Commit GitOps'],
      },
    },
    work: {
      kicker: 'CAPACIDADES TÉCNICAS',
      title: 'Áreas de Especialidad',
      subtitle: 'Enfoque de ingeniería en sistemas distribuidos, automatización y resiliencia operativa',
      function1: {
        name: 'Operaciones en Kubernetes',
        description: 'Orquestación de cargas con K3s y Kubernetes, sincronización declarativa GitOps mediante ArgoCD y mantenimiento de clústeres auto-reparables.',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps'],
      },
      function2: {
        name: 'Telemetría y Observabilidad',
        description: 'Implementación de pipelines de observabilidad de extremo a extremo con Prometheus, Grafana, Loki y Sentry para métricas, tracing y auditoría de logs.',
        tags: ['Prometheus', 'Grafana', 'Loki', 'Telemetría'],
      },
      function3: {
        name: 'Entrega Continua CI/CD',
        description: 'Arquitectura de pipelines en GitHub Actions con caché de capas en Docker, pruebas paralelas de humo y estrategias de despliegue sin caída con rollback automático.',
        tags: ['CI/CD', 'GitHub Actions', 'Docker', 'Automatización'],
      },
      function4: {
        name: 'Respuesta a Incidentes y Causa Raíz',
        description: 'Diagnóstico metódico de fallos en producción: inspección de procesos en kernel, saturación de sockets, terminación SSL/TLS en NGINX y mitigación de vulnerabilidades CVE.',
        tags: ['Incidentes', 'Causa Raíz', 'Hardening', 'Seguridad'],
      },
      function5: {
        name: 'Administración de Sistemas Linux',
        description: 'Operación de servidores de producción Linux, nodos dedicados y entornos en contenedores. Configuración de cortafuegos, Fail2ban, hardening de SSH y permisos POSIX.',
        tags: ['Linux', 'POSIX', 'Kernel', 'Seguridad'],
      },
      function6: {
        name: 'Tooling de Sistemas y Automatización',
        description: 'Desarrollo de utilidades de terminal (TUI) de alto rendimiento en Rust y automatizaciones defensivas en Bash, eliminando toil operativo y garantizando estados reproducibles.',
        tags: ['Rust', 'Bash Scripting', 'Reducción de Toil', 'TUI Tooling'],
      },
    },
    skills: {
      kicker: 'MATRIZ TÉCNICA',
      title: 'Stack Tecnológico',
      infrastructure: {
        name: 'Cloud-Native & Orquestación',
        items: ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
      },
      observability: {
        name: 'Observabilidad & Telemetría',
        items: ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Agregación de Logs', 'Alertas de Métricas'],
      },
      systems: {
        name: 'Linux & Sistemas',
        items: ['Administración Linux', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Telemetría Hardware'],
      },
      reliability: {
        name: 'Fiabilidad & Despliegue',
        items: ['GitHub Actions', 'Escaneo Trivy', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
      },
    },
    projects: {
      kicker: 'PORTFOLIO // INGENIERÍA DE SISTEMAS',
      title: 'Proyectos Destacados',
      subtitle: 'Plataformas de ingeniería, herramientas para operadores y automatización de infraestructura en producción',
      viewAll: 'Explorar todos los repositorios en GitHub',
      tabPreview: 'VISTA PREVIA',
      tabTopology: 'TOPOLOGÍA',
      tabSpecs: 'ESPECIFICACIONES',
      viewReadme: 'README // DOCS',
      viewCode: 'CÓDIGO FUENTE',
      runtimeStatus: 'SISTEMA_OK',
      project1: {
        name: 'k3s-lab',
        domain: 'Simulación Cloud-Native & GitOps',
        description: 'Plataforma automatizada que simula operaciones cloud-native en producción con reconciliación GitOps mediante ArgoCD, centralización de logs y observabilidad completa de métricas.',
        tags: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Grafana', 'Loki', 'Shell'],
        link: 'https://github.com/zer0sh/k3s-lab',
      },
      project2: {
        name: 'sunim-tui',
        domain: 'Operador de Infraestructura en Terminal (Rust)',
        description: 'Interfaz de terminal orientada al teclado desarrollada en Rust para la gestión de entornos de infraestructura remota, con ejecuciones asíncronas en segundo plano y recuperación segura de señales.',
        tags: ['Rust', 'Terminus CLI', 'Asynchronous POSIX', 'Vim-Style TUI'],
        link: 'https://github.com/zer0sh/sunim-tui',
      },
      project3: {
        name: 'zer0sh-site-health-monitor',
        domain: 'Plugin WordPress.org & Motor de Diagnóstico en Runtime',
        description: 'Plugin de código abierto para WordPress, ultra ligero y 100% de solo lectura publicado en WordPress.org. Diagnostica restricciones de PHP, cabeceras de seguridad HTTP, salud de WP-Cron/loopback y analiza CVEs vía WPVulnerability API sin telemetría y con caché nativa.',
        tags: ['Plugin WordPress', 'WordPress.org', 'PHP', 'Cabeceras HTTP', 'WPVulnerability API', 'Cero Telemetría'],
        link: 'https://github.com/zer0sh/zer0sh-site-health-monitor',
        externalLink: 'https://wordpress.org/plugins/zer0sh-site-health-monitor/',
        externalLabel: 'Plugin en WordPress.org',
      },
      project4: {
        name: 'cms-local-envs',
        domain: 'Pipeline de Entrega Automatizada con Rollback',
        description: 'Entornos de desarrollo multicontenedor con entrega continua en GitHub Actions: caché de capas Docker, pruebas paralelas, análisis de seguridad con Trivy y rollback automático en caso de fallo.',
        tags: ['Docker Compose', 'GitHub Actions', 'Seguridad Trivy', 'Rollback Automático', 'CI/CD'],
        link: 'https://github.com/zer0sh/cms-local-envs',
      },
      project5: {
        name: 'gh-runner-selfhosted-docker',
        domain: 'Infraestructura de Runners Aislados',
        description: 'Clúster de ejecución para runners autoalojados de GitHub Actions en Docker, garantizando entornos de compilación reproducibles, menor superficie de ataque y pruebas locales de CI/CD.',
        tags: ['Docker', 'GitHub Actions', 'Automatización CI/CD', 'Aislamiento Linux'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
      },
      project6: {
        name: 'dotfiles',
        domain: 'Entorno Unix Declarativo',
        description: 'Entorno de trabajo personal altamente optimizado con flujos modales de teclado, telemetría personalizada y latencia mínima de interacción con el sistema.',
        tags: ['Hyprland', 'Wayland', 'POSIX Shell', 'Configuración Declarativa', 'Wiki'],
        link: 'https://github.com/zer0sh/dotfiles',
      },
    },
    dispatches: {
      kicker: 'INVESTIGACIÓN // NOTAS DE CAMPO',
      title: 'Artículos & Notas de Campo',
      subtitle: 'Análisis de incidentes reales en producción, ingeniería de fiabilidad e investigaciones de sistemas',
      readArticle: 'Leer Artículo',
      post1: {
        title: 'Post-Mortem: Agotamiento de Sockets en NGINX y Kernel Linux',
        tag: 'Post-Mortem P1',
        description: 'Análisis de un incidente real en producción: cómo una ráfaga de tráfico saturó el backlog de sockets TCP (somaxconn) generando errores 502, y el tuning de kernel aplicado.',
        slug: 'postmortem-nginx-socket-exhaustion',
      },
      post2: {
        title: 'Shell Builtins Deep Dive',
        tag: 'Internals POSIX',
        description: 'Internals de la shell POSIX, ejecución de procesos en el kernel y gestión de memoria en runtimes de contenedores.',
        slug: 'shell-builtins',
      },
      post3: {
        title: 'CVE-2026-9860 Analysis',
        tag: 'Aviso de Seguridad',
        description: 'Análisis de vulnerabilidad, vectores de exposición y mitigación preventiva a escala.',
        slug: 'cve-2026-9860',
      },
    },
    contact: {
      kicker: 'CANALES DIRECTOS',
      title: 'Contacto & Canales Directos',
      description: 'Disponible para roles de SRE, ingeniería de plataforma y consultoría de fiabilidad e infraestructura cloud-native.',
      email: 'Correo',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      operator: 'Steven Muñoz',
      repo: 'github.com/zer0sh',
      career: 'linkedin.com/in/steven-munozl',
      status: 'DISPONIBILIDAD 99.99% · LATAM / REMOTO',
    },
    blog: {
      title: 'Artículos y Notas Técnicas',
      subtitle: 'Sistemas operativos, investigación de incidentes y fiabilidad',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path) => {
    const val = path.split('.').reduce((obj, key) => obj?.[key], translations[lang]);
    return val !== undefined ? val : '';
  };

  const changeLang = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
