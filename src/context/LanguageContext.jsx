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
      telemetry: 'PASSIONATE ABOUT LINUX · AUTOMATION · RELIABLE SYSTEMS',
      name: 'Steven Muñoz',
      handle: 'zer0sh — Systems & Reliability Engineer',
      learner: 'Lifelong learner',
      location: 'Colombia · Remote',
      doctrinePrimary: 'I love technology, understanding systems under the hood, and building things that just work.',
      doctrineSecondary: 'I enjoy moving between backend code, the Linux terminal, and production servers. What excites me most is solving real-world puzzles, automating everything repetitive with Bash and Python, and designing resilient pipelines so developers can ship code with confidence.',
    },
    about: {
      kicker: 'ABOUT ME & PHILOSOPHY',
      title: 'Curiosity, Systems, and Building Things That Last',
      description: 'I have a genuine passion for technology and well-crafted infrastructure. I love digging into how things work behind the scenes: from setting up Linux servers from scratch to containerizing environments with Docker and GitHub Actions. If a task has to be done by hand more than twice, I would rather automate it with Bash or Python so we can focus on building meaningful software.',
      experience: 'When something breaks in production, I see it as an opportunity to learn. I stay calm, trace logs and metrics to uncover the real root cause, and then automate the fix so it never happens again. For me, reliability is not just green dashboards—it is about giving the team peace of mind.',
    },
    dailyOps: {
      kicker: 'DAY-TO-DAY FOCUS',
      title: 'Hands-on in Production',
      subtitle: 'Real-world work: managing Linux servers, shipping code safely, and making sure things run smoothly.',
      op1: {
        code: 'OPS.01',
        title: 'Observability & Catching Anomalies Early',
        description: 'Tracking host health, memory saturation, and service metrics with Prometheus, Grafana, and Sentry to isolate issues and bottlenecks before users notice any hiccups.',
        tags: ['Prometheus', 'Grafana', 'Sentry', 'Proactive Health'],
      },
      op2: {
        code: 'OPS.02',
        title: 'Stress-Free Deployments & CI/CD',
        description: 'Building smooth GitHub Actions pipelines for Django, WordPress, Drupal, and React apps, with Docker layer caching and automated rollbacks if anything unexpected occurs.',
        tags: ['GitHub Actions', 'Docker', 'Automatic Rollback', 'Smooth Deploys'],
      },
      op3: {
        code: 'OPS.03',
        title: 'Calm Incident Triage & Root Cause Discovery',
        description: 'Digging into live production hiccups—like NGINX 502/504 timeouts, SSL renewals, DNS anomalies, or database connection spikes—with a clear head and blameless post-mortems.',
        tags: ['Incident Triage', 'NGINX', 'SSL/TLS', 'Cloudflare', 'Blameless Learning'],
      },
      op4: {
        code: 'OPS.04',
        title: 'Keeping Linux Servers & Containers Healthy',
        description: 'Maintaining Linux servers hosting 20+ isolated Docker Compose containers. Hardening SSH access, configuring Fail2ban and UFW firewalls, and keeping dependencies safe.',
        tags: ['Linux (Debian/Ubuntu)', 'Docker Compose', 'SSH Hardening', 'UFW / Fail2ban'],
      },
      op5: {
        code: 'OPS.05',
        title: 'Automating the Repetitive Stuff',
        description: 'Writing idempotent Bash and Python scripts for scheduled offsite backups, environment sync, log rotation, and self-healing cron jobs to get rid of boring manual work.',
        tags: ['Bash Scripting', 'Python Automation', 'DB Sync', 'Less Toil'],
      },
    },
    timeline: {
      kicker: 'HOW I WORK',
      title: 'A Typical Day Behind the Screen',
      subtitle: 'A realistic snapshot of how I spend my time between the terminal, code, and servers.',
      step1: {
        time: '08:30',
        status: 'COFFEE & CHECK-IN',
        statusType: 'ok',
        title: 'Morning Coffee & Preventive Health Checks',
        description: 'Starting the day with a quick pulse check: Grafana dashboards, recent Sentry alerts, and making sure VPS storage and database queues have plenty of breathing room.',
        tags: ['Grafana Dashboards', 'Sentry Alerts', 'System Vitals', 'Proactive Checks'],
      },
      step2: {
        time: '11:00',
        status: 'CODE & PIPELINES',
        statusType: 'active',
        title: 'Code Reviews & Delivery Pipelines',
        description: 'Checking pull requests, inspecting GitHub Actions runners, and rolling out updates with Docker and zero-downtime practices.',
        tags: ['GitHub Actions', 'Docker Buildx', 'Security Scans', 'Zero-Downtime Rollout'],
      },
      step3: {
        time: '14:00',
        status: 'DEEP DIVE & DEBUGGING',
        statusType: 'warn',
        title: 'Solving Production Quirks with a Clear Head',
        description: 'When an unexpected spike or error hits, I jump into the terminal to follow the trail: journalctl logs, open sockets, and memory limits until the bottleneck is pinpointed.',
        tags: ['SSH Bastion', 'systemd Logs', 'Socket Tracing', 'Root-Cause Discovery'],
      },
      step4: {
        time: '16:30',
        status: 'AUTOMATE & LEARN',
        statusType: 'commit',
        title: 'Turning Incidents into Better Automations',
        description: 'The best part: noting what we learned, tweaking alert thresholds, and putting an automated recovery script in Git so the same issue never happens twice.',
        tags: ['Blameless Learning', 'Smarter Alerts', 'Bash Automation', 'GitOps Commit'],
      },
    },
    work: {
      kicker: 'WHAT I LOVE DOING',
      title: 'Core Technologies & Interests',
      subtitle: 'The areas where I spend the most time tinkering, building, and solving real technical puzzles.',
      function1: {
        name: 'Kubernetes & Modern Platforms',
        description: 'Setting up lightweight clusters with K3s and Kubernetes, syncing state with ArgoCD GitOps, and keeping workloads resilient.',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps'],
      },
      function2: {
        name: 'Observability & Real-Time Metrics',
        description: 'Hooking up Prometheus, Grafana, Loki, and Sentry. Nothing beats having instant visibility into how an application actually behaves.',
        tags: ['Prometheus', 'Grafana', 'Loki', 'Observability'],
      },
      function3: {
        name: 'Automated CI/CD & Smooth Delivery',
        description: 'Crafting reliable workflows in GitHub Actions with Docker caching and automated rollbacks to make deployments frictionless.',
        tags: ['CI/CD', 'GitHub Actions', 'Docker', 'Automation'],
      },
      function4: {
        name: 'Calm Incident Response & Debugging',
        description: 'Tackling weird production bugs, NGINX bottlenecks, TLS certificate issues, and kernel tuning with method and patience.',
        tags: ['Incident Triage', 'Debugging', 'Security', 'Root Cause'],
      },
      function5: {
        name: 'Linux Systems Administration',
        description: 'Administering Linux servers, tweaking firewalls, hardening SSH, and making sure the operating system runs clean and fast.',
        tags: ['Linux', 'POSIX', 'Kernel', 'Security'],
      },
      function6: {
        name: 'Terminal Tools & Automation Scripts',
        description: 'Crafting fast TUI utilities in Rust and handy scripts in Bash to make everyday developer life much more enjoyable.',
        tags: ['Rust', 'Bash Scripting', 'TUI Tools', 'Productivity'],
      },
    },
    skills: {
      kicker: 'TOOLBOX',
      title: 'Tech Stack',
      infrastructure: {
        name: 'Cloud-Native & Orchestration',
        domain: 'CLOUD & CONTAINERS',
        status: 'GITOPS READY',
        items: ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
      },
      observability: {
        name: 'Observability & Telemetry',
        domain: 'METRICS & LOGS',
        status: 'LIVE STREAMS',
        items: ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Log Aggregation', 'Metric Alerts'],
      },
      systems: {
        name: 'Linux & Systems',
        domain: 'LINUX & TERMINAL',
        status: 'POSIX STRICT',
        items: ['Linux Administration', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Hardware Telemetry'],
      },
      reliability: {
        name: 'Reliability & Delivery',
        domain: 'DELIVERY & SECURITY',
        status: 'HARDENED',
        items: ['GitHub Actions', 'Trivy Scanning', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
      },
      fullstack: {
        name: 'Full-Stack Development',
        domain: 'WEB & BACKEND',
        status: 'REACT / DJANGO / NODE',
        items: ['React & Modern JavaScript', 'Python & Django / Flask', 'Node.js & Express', 'RESTful APIs', 'Tailwind CSS', 'SQL & Database Modeling'],
      },
      aiDevelopment: {
        name: 'AI-Assisted Development',
        domain: 'AGENTS & AUTOMATION',
        status: 'LLMs & MCP',
        items: ['Autonomous Agent Workflows', 'Model Context Protocol (MCP)', 'LLM API Integrations', 'AI Scaffolding & Code Gen', 'Automated Test Scenarios', 'Incident Triage with AI'],
      },
      codeOptimization: {
        name: 'Code Optimization',
        domain: 'PERFORMANCE & REFACTOR',
        status: 'LOW LATENCY',
        items: ['Profiling & Bottleneck Tracing', 'Database Query Tuning & Indexes', 'Caching & I/O Reduction', 'Clean Architecture', 'Proactive Refactoring', 'Concurrency & Async Pipelines'],
      },
      maintenance: {
        name: 'Updates & Maintenance',
        domain: 'LIFECYCLE & CVEs',
        status: 'PREVENTATIVE',
        items: ['Automated Dependency Upgrades', 'Dependabot & Renovate Config', 'Version Migrations (PHP, Node, Python)', 'CVE Security Auditing', 'Deprecated API Refactoring', 'Preventative Maintenance Cycles'],
      },
    },
    projects: {
      kicker: 'THINGS I BUILT',
      title: 'Featured Projects',
      subtitle: 'Hands-on platforms, operator tools, and automations I enjoy tinkering with and maintaining',
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
        description: 'My homelab playground to simulate production Kubernetes with K3s, GitOps syncing via ArgoCD, and end-to-end metrics with Prometheus, Grafana, and Loki.',
        tags: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Grafana', 'Loki', 'Shell'],
        link: 'https://github.com/zer0sh/k3s-lab',
      },
      project2: {
        name: 'sunim-tui',
        domain: 'Infrastructure Operations TUI (Rust)',
        description: 'A snappy, keyboard-driven terminal tool written in Rust to manage remote environments without clicking around, featuring async background jobs and Vim-style keys.',
        tags: ['Rust', 'Terminus CLI', 'Asynchronous POSIX', 'Vim-Style TUI'],
        link: 'https://github.com/zer0sh/sunim-tui',
      },
      project3: {
        name: 'zer0sh-site-health-monitor',
        domain: 'WordPress.org Plugin & Health Auditor',
        description: 'An open-source WordPress plugin published on WordPress.org. Built to quickly audit PHP runtime limits, HTTP security headers, and known CVEs with zero telemetry.',
        tags: ['WordPress Plugin', 'WordPress.org', 'PHP', 'Security Headers', 'WPVulnerability API', 'Zero Telemetry'],
        link: 'https://github.com/zer0sh/zer0sh-site-health-monitor',
        externalLink: 'https://wordpress.org/plugins/zer0sh-site-health-monitor/',
        externalLabel: 'WordPress.org Plugin',
      },
      project4: {
        name: 'cms-local-envs',
        domain: 'Reproducible Dev Environs & CI/CD',
        description: 'Clean Docker Compose development environments backed by automated GitHub Actions: image caching, parallel sanity checks, Trivy scans, and automatic rollback.',
        tags: ['Docker Compose', 'GitHub Actions', 'Trivy Security', 'Automatic Rollback', 'CI/CD'],
        link: 'https://github.com/zer0sh/cms-local-envs',
      },
      project5: {
        name: 'gh-runner-selfhosted-docker',
        domain: 'Containerized Runner Cluster',
        description: 'Self-hosted GitHub Actions runners running isolated in Docker. Great for testing workflows locally on own hardware with zero external dependencies.',
        tags: ['Docker', 'GitHub Actions', 'CI/CD Automation', 'Linux Isolation'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
      },
      project6: {
        name: 'dotfiles',
        domain: 'Personal Linux Workstation',
        description: 'My daily-driver Linux environment: Hyprland, Wayland, custom status monitors, and fast keyboard-centric workflows.',
        tags: ['Hyprland', 'Wayland', 'POSIX Shell', 'Declarative Config', 'Wiki'],
        link: 'https://github.com/zer0sh/dotfiles',
      },
      project7: {
        name: 'universal-appimage-installer',
        domain: 'AppImage Package Manager & XDG Integrator (Rust)',
        description: 'An interactive terminal tool (uai) written in Rust to inspect, install, and manage AppImage packages with zero-execution payload extraction and automatic XDG desktop launcher integration.',
        tags: ['Rust', 'AppImage', 'XDG Desktop', 'TUI', 'Wayland', 'Linux'],
        link: 'https://github.com/zer0sh/universal-appimage-installer',
      },
    },
    dispatches: {
      kicker: 'NOTES & EXPERIENCES',
      title: 'Field Notes & Articles',
      subtitle: 'Real-world incident breakdowns, Linux explorations, and practical lessons from production',
      readArticle: 'Read Article',
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
      kicker: 'GET IN TOUCH',
      title: 'Let\'s Connect & Chat',
      description: 'Always happy to talk about Linux, homelabs, infrastructure puzzles, cool open-source projects, or potential team collaborations.',
      email: 'Email',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      operator: 'Steven Muñoz',
      repo: 'github.com/zer0sh',
      career: 'linkedin.com/in/steven-munozl',
      status: 'ONLINE & BUILDING · REMOTE',
    },
    blog: {
      title: 'Field Notes & Articles',
      subtitle: 'Operating systems, incident investigations, and lessons from production',
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
      telemetry: 'PASIÓN POR LINUX · AUTOMATIZACIÓN · SISTEMAS QUE FUNCIONAN',
      name: 'Steven Muñoz',
      handle: 'zer0sh — Ingeniero de Sistemas & SRE',
      learner: 'Eterno aprendiz',
      location: 'Colombia · Remoto',
      doctrinePrimary: 'Me apasiona la tecnología, entender los sistemas a fondo y construir infraestructura que simplemente funcione.',
      doctrineSecondary: 'Disfruto moverme entre el desarrollo, la terminal y los servidores. Me encanta resolver problemas reales con Linux, automatizar todo lo repetitivo con Bash y Python, y diseñar pipelines para que el equipo pueda desplegar con total tranquilidad.',
    },
    about: {
      kicker: 'UN POCO SOBRE MÍ',
      title: 'Curiosidad, Sistemas y Crear Cosas que Duren',
      description: 'Soy un apasionado de la tecnología y de los sistemas bien hechos. Me fascina entender qué pasa por debajo del capó: desde configurar un servidor Linux desde cero hasta armar pipelines con Docker y GitHub Actions. En mi día a día me dedico a automatizar tareas con Bash y Python porque creo que el tiempo de un desarrollador debe estar en crear, no en lidiar con tareas manuales aburridas.',
      experience: 'Cuando algo falla en producción, lo tomo como una oportunidad de aprendizaje: me gusta mantener la cabeza fría, rastrear logs y métricas hasta encontrar la causa real del problema, y luego automatizar la solución para que no vuelva a ocurrir. Para mí, la fiabilidad no es solo números en un dashboard, es la tranquilidad del equipo.',
    },
    dailyOps: {
      kicker: 'EN EL DÍA A DÍA',
      title: 'Lo que Hago en Producción',
      subtitle: 'Manos en la masa: administrando servidores Linux, cuidando despliegues y asegurándome de que todo corra sin problemas.',
      op1: {
        code: 'OPS.01',
        title: 'Métricas en Vivo y Anticiparme a los Problemas',
        description: 'Reviso métricas con Prometheus, Grafana y Sentry para entender el comportamiento de los servidores y cazar cuellos de botella o anomalías antes de que los usuarios noten cualquier lentitud.',
        tags: ['Prometheus', 'Grafana', 'Sentry', 'Salud Preventiva'],
      },
      op2: {
        code: 'OPS.02',
        title: 'Despliegues Continuos sin Estrés',
        description: 'Armo flujos en GitHub Actions para que pasar código a producción sea rápido y seguro. Si algo inesperado ocurre, el rollback automático se encarga de proteger la aplicación mientras investigamos.',
        tags: ['GitHub Actions', 'Docker', 'Rollback Automático', 'Despliegues Ágiles'],
      },
      op3: {
        code: 'OPS.03',
        title: 'Diagnóstico con Cabeza Fría y Aprender del Error',
        description: 'Cuando salta una alerta (como un error 502 en NGINX, temas de certificados SSL o saturación de base de datos), me meto directo a investigar. Y lo más importante: documentar qué pasó sin buscar culpables, aprendiendo de cada incidente.',
        tags: ['Diagnóstico en Vivo', 'NGINX', 'SSL/TLS', 'Cloudflare', 'Post-Mortems Sin Culpas'],
      },
      op4: {
        code: 'OPS.04',
        title: 'Cuidando Servidores Linux y Contenedores',
        description: 'Mantengo servidores Linux limpios y al día alojando contenedores con Docker Compose. Me gusta tener las reglas de firewall (UFW), accesos SSH y permisos bien afinados para dormir tranquilo.',
        tags: ['Linux (Debian/Ubuntu)', 'Docker Compose', 'Seguridad SSH', 'UFW / Fail2ban'],
      },
      op5: {
        code: 'OPS.05',
        title: 'Automatizar lo Repetitivo',
        description: 'Si tengo que hacer algo manualmente más de dos veces, le escribo un script en Bash o Python. Automatizo copias de seguridad remotas, sincronización de bases de datos y tareas de mantenimiento para ahorrar dolores de cabeza.',
        tags: ['Scripts Bash', 'Automatización Python', 'Sincronización DB', 'Cero Tareas Aburridas'],
      },
    },
    timeline: {
      kicker: 'CÓMO TRABAJO',
      title: 'Un Vistazo a mi Rutina',
      subtitle: 'Así es un día habitual trabajando entre la terminal, el código y los servidores.',
      step1: {
        time: '08:30',
        status: 'CAFÉ Y CHEQUEO',
        statusType: 'ok',
        title: 'Café de la Mañana y Chequeo Preventivo',
        description: 'Comienzo el día dando un vistazo al estado general: tableros en Grafana, alertas en Sentry y que el almacenamiento en los servidores tenga buen margen. Que todo arranque en orden.',
        tags: ['Dashboards Grafana', 'Alertas Sentry', 'Salud de Servidores', 'Chequeo Preventivo'],
      },
      step2: {
        time: '11:00',
        status: 'CÓDIGO Y PIPELINES',
        statusType: 'active',
        title: 'Pull Requests, Código y Despliegues',
        description: 'Reviso pull requests, miro los logs de los runners en GitHub Actions y preparo ventanas de despliegue. Me aseguro de que las imágenes de Docker compilen limpias y sin fallos.',
        tags: ['GitHub Actions', 'Docker Buildx', 'Escaneo de Seguridad', 'Despliegues sin Caídas'],
      },
      step3: {
        time: '14:00',
        status: 'TERMINAL Y DEBUG',
        statusType: 'warn',
        title: 'Resolviendo Imprevistos y Rastreando Errores',
        description: 'Si salta algún problema en producción, abro la terminal y sigo la pista: revisar journalctl, sockets saturados o consumo de memoria. Encontrar el cuello de botella es de las partes más entretenidas.',
        tags: ['Bastión SSH', 'Logs systemd', 'Sockets de Red', 'Causa Raíz'],
      },
      step4: {
        time: '16:30',
        status: 'AUTOMATIZAR Y MEJORAR',
        statusType: 'commit',
        title: 'Anotar lo Aprendido y Dejarlo Automatizado',
        description: 'El cierre ideal: anotar qué aprendimos del incidente, afinar las alertas y dejar un script o regla para que si el error vuelve a intentar pasar, se resuelva solo.',
        tags: ['Aprendizaje Sin Culpas', 'Alertas Útiles', 'Scripts de Automatización', 'GitOps Commit'],
      },
    },
    work: {
      kicker: 'LO QUE MÁS DISFRUTO',
      title: 'Tecnologías y Enfoque',
      subtitle: 'Las áreas donde más tiempo paso experimentando, aprendiendo y resolviendo retos técnicos reales.',
      function1: {
        name: 'Kubernetes y Plataformas Modernas',
        description: 'Armar entornos con K3s, Kubernetes y sincronización GitOps con ArgoCD para que la infraestructura se maneje como código.',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps'],
      },
      function2: {
        name: 'Observabilidad y Métricas en Tiempo Real',
        description: 'Montar pipelines con Prometheus, Grafana, Loki y Sentry. Nada como tener visibilidad total de lo que está pasando en un servidor.',
        tags: ['Prometheus', 'Grafana', 'Loki', 'Observabilidad'],
      },
      function3: {
        name: 'CI/CD y Despliegues Ágiles',
        description: 'Crear flujos automáticos en GitHub Actions y Docker para que subir código a producción sea seguro y sin fricción.',
        tags: ['CI/CD', 'GitHub Actions', 'Docker', 'Automatización'],
      },
      function4: {
        name: 'Resolución de Incidentes con Calma',
        description: 'Diagnosticar con método caídas de servicio, temas de certificados SSL, NGINX o cuellos de botella en el kernel.',
        tags: ['Diagnóstico', 'Causa Raíz', 'Seguridad', 'Hardening'],
      },
      function5: {
        name: 'Administración de Servidores Linux',
        description: 'Operar servidores Linux, endurecer accesos SSH, configurar cortafuegos y asegurar que el sistema esté rápido y afinado.',
        tags: ['Linux', 'POSIX', 'Kernel', 'Seguridad'],
      },
      function6: {
        name: 'Herramientas de Terminal y Scripts',
        description: 'Construir utilidades en Rust y scripts en Bash para la terminal. Me encanta crear herramientas que hagan el trabajo del día a día más agradable.',
        tags: ['Rust', 'Bash Scripting', 'Herramientas TUI', 'Productividad'],
      },
    },
    skills: {
      kicker: 'HERRAMIENTAS',
      title: 'Stack Tecnológico',
      infrastructure: {
        name: 'Cloud-Native & Orquestación',
        domain: 'NUBE & CONTENEDORES',
        status: 'GITOPS READY',
        items: ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
      },
      observability: {
        name: 'Observabilidad & Telemetría',
        domain: 'MÉTRICAS & LOGS',
        status: 'TELEMETRÍA EN VIVO',
        items: ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Agregación de Logs', 'Alertas de Métricas'],
      },
      systems: {
        name: 'Linux & Sistemas',
        domain: 'LINUX & TERMINAL',
        status: 'POSIX & SCRIPTS',
        items: ['Administración Linux', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Telemetría Hardware'],
      },
      reliability: {
        name: 'Fiabilidad & Despliegue',
        domain: 'ENTREGA & SEGURIDAD',
        status: 'CI/CD BLINDADO',
        items: ['GitHub Actions', 'Escaneo Trivy', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
      },
      fullstack: {
        name: 'Desarrollo Fullstack',
        domain: 'WEB & BACKEND',
        status: 'REACT / DJANGO / NODE',
        items: ['React & JavaScript Moderno', 'Python & Django / Flask', 'Node.js & Express', 'APIs REST', 'Tailwind CSS', 'SQL & Modelado de Bases de Datos'],
      },
      aiDevelopment: {
        name: 'Desarrollo con IA',
        domain: 'AGENTES & AUTOMATIZACIÓN',
        status: 'LLMs & MCP',
        items: ['Flujos y Agentes Autónomos', 'Model Context Protocol (MCP)', 'Integración de APIs con LLMs', 'Scaffolding & Generación de Código', 'Generación Automática de Tests', 'Triage de Incidentes Asistido'],
      },
      codeOptimization: {
        name: 'Optimización de Código',
        domain: 'RENDIMIENTO & REFACTOR',
        status: 'BAJA LATENCIA',
        items: ['Profiling & Cuellos de Botella', 'Optimización de Consultas SQL e Índices', 'Estrategias de Caché & I/O', 'Arquitectura Limpia & Modular', 'Refactorización Proactiva', 'Concurrencia & Flujos Asíncronos'],
      },
      maintenance: {
        name: 'Actualizaciones & Mantenimiento',
        domain: 'CICLO DE VIDA & CVEs',
        status: 'PREVENTIVO',
        items: ['Actualización de Dependencias', 'Configuración de Dependabot', 'Migración de Versiones (PHP, Node, Python)', 'Auditoría y Mitigación de CVEs', 'Sustitución de APIs Obsoletas', 'Ciclos de Mantenimiento Preventivo'],
      },
    },
    projects: {
      kicker: 'COSAS QUE HE CONSTRUIDO',
      title: 'Proyectos Destacados',
      subtitle: 'Plataformas, herramientas para la terminal y proyectos personales en los que me encanta cacharrear',
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
        description: 'Mi laboratorio personal para simular un entorno cloud-native real con K3s, despliegues automáticos con ArgoCD y observabilidad completa con Prometheus y Grafana.',
        tags: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Grafana', 'Loki', 'Shell'],
        link: 'https://github.com/zer0sh/k3s-lab',
      },
      project2: {
        name: 'sunim-tui',
        domain: 'Operador de Infraestructura en Terminal (Rust)',
        description: 'Una interfaz de terminal rápida escrita en Rust para gestionar infraestructura remota desde el teclado, con tareas en segundo plano y atajos estilo Vim.',
        tags: ['Rust', 'Terminus CLI', 'Asynchronous POSIX', 'Vim-Style TUI'],
        link: 'https://github.com/zer0sh/sunim-tui',
      },
      project3: {
        name: 'zer0sh-site-health-monitor',
        domain: 'Plugin WordPress.org & Auditor en Runtime',
        description: 'Plugin de código abierto publicado en WordPress.org. Lo creé para auditar configuraciones de PHP, cabeceras de seguridad HTTP y vulnerabilidades conocidas, sin rastreo ni telemetría invasiva.',
        tags: ['Plugin WordPress', 'WordPress.org', 'PHP', 'Cabeceras HTTP', 'WPVulnerability API', 'Cero Telemetría'],
        link: 'https://github.com/zer0sh/zer0sh-site-health-monitor',
        externalLink: 'https://wordpress.org/plugins/zer0sh-site-health-monitor/',
        externalLabel: 'Plugin en WordPress.org',
      },
      project4: {
        name: 'cms-local-envs',
        domain: 'Entornos de Desarrollo con Rollback',
        description: 'Entornos de desarrollo con Docker Compose y pipelines en GitHub Actions: caché inteligente de capas, tests paralelos y rollback automático si algo sale mal.',
        tags: ['Docker Compose', 'GitHub Actions', 'Seguridad Trivy', 'Rollback Automático', 'CI/CD'],
        link: 'https://github.com/zer0sh/cms-local-envs',
      },
      project5: {
        name: 'gh-runner-selfhosted-docker',
        domain: 'Runners Aislados en Contenedores',
        description: 'Runners autoalojados de GitHub Actions corriendo en Docker para probar flujos de CI/CD en hardware propio de forma reproducible y segura.',
        tags: ['Docker', 'GitHub Actions', 'Automatización CI/CD', 'Aislamiento Linux'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
      },
      project6: {
        name: 'dotfiles',
        domain: 'Mi Entorno Diario en Linux',
        description: 'Mi configuración diaria de trabajo en Linux: Hyprland, Wayland, scripts en Bash y atajos de teclado pensados para trabajar cómodo y sin distracciones.',
        tags: ['Hyprland', 'Wayland', 'POSIX Shell', 'Configuración Declarativa', 'Wiki'],
        link: 'https://github.com/zer0sh/dotfiles',
      },
      project7: {
        name: 'universal-appimage-installer',
        domain: 'Gestor de AppImages e Integración XDG (Rust)',
        description: 'Herramienta de terminal interactiva (uai) desarrollada en Rust para descargar, inspeccionar e instalar paquetes AppImage con extracción segura sin ejecución e integración nativa con el escritorio XDG.',
        tags: ['Rust', 'AppImage', 'Integración XDG', 'TUI', 'Wayland / X11', 'Linux'],
        link: 'https://github.com/zer0sh/universal-appimage-installer',
      },
    },
    dispatches: {
      kicker: 'NOTAS Y EXPERIENCIAS',
      title: 'Artículos y Notas de Campo',
      subtitle: 'Análisis de incidentes reales, pruebas de herramientas y lo que voy aprendiendo en el camino.',
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
      kicker: 'HABLEMOS',
      title: '¿Charlamos?',
      description: 'Siempre con ganas de hablar de Linux, retos de infraestructura, cacharrear con homelabs, proyectos interesantes o simplemente intercambiar ideas de tecnología.',
      email: 'Correo',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      operator: 'Steven Muñoz',
      repo: 'github.com/zer0sh',
      career: 'linkedin.com/in/steven-munozl',
      status: 'EN LÍNEA & CONSTRUYENDO · REMOTO',
    },
    blog: {
      title: 'Artículos y Notas Técnicas',
      subtitle: 'Sistemas operativos, investigación de incidentes y reflexiones prácticas',
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
