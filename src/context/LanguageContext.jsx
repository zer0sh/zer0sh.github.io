import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

// Calculate years of experience dynamically from August 2023
const getYearsOfExperience = () => {
  const startDate = new Date(2023, 7, 1); // August 2023 (month is 0-indexed)
  const today = new Date();
  const years = ((today - startDate) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
  return years;
};

const getCurrentYear = () => new Date().getFullYear();

const translations = {
  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      blog: 'Blog',
      others: 'Others',
    },
    hero: {
      title: 'DevOps & Systems Engineer',
      subtitle: 'I build and operate production systems focused on automation, scalability, and zero-downtime deployments.\nI also work on backend development and application improvements, bridging the gap between code and infrastructure.',
      cta: 'Explore My Work',
    },
    about: {
      title: 'About Me',
      description: 'Specialist with formal role as Level 1 Technical Support, with practical experience in operating production environments and a strong focus on DevOps practices, automation, and systems administration. I work in managing Linux-based infrastructure, deploying and maintaining web applications, and resolving production incidents.',
      experience: 'I have an integral vision that connects development, infrastructure, and support, allowing me to diagnose complex problems and propose efficient, scalable, and secure solutions across the entire stack.',
    },
    work: {
      title: 'What I Do',
      subtitle: 'My day-to-day responsibilities as a DevOps & Systems Engineer',
      function1: {
        name: 'Kubernetes Orchestration',
        description: 'Orchestrating instances on Kubernetes with ArgoCD, reviewing failures, applying optimizations and monitoring logs.',
        tags: ['Kubernetes', 'ArgoCD', 'DevOps'],
      },
      function2: {
        name: 'CI/CD & Deployments',
        description: 'Deploying to production and staging environments with GitHub Actions, on dedicated servers, Pantheon and multiple technologies like Django, WordPress, Drupal and React.',
        tags: ['CI/CD', 'GitHub Actions', 'Deployments'],
      },
      function3: {
        name: 'Monitoring & Observability',
        description: 'Setting up monitoring services such as Sentry and Grafana, and reviewing application logs.',
        tags: ['Monitoring', 'Grafana', 'Sentry', 'Logs'],
      },
      function4: {
        name: 'Application Support',
        description: 'Handling and resolving production application tickets. Supporting PHP, WordPress, Drupal, Django and Node.js apps, investigating errors in apps, APIs and integrations, analyzing logs and system behavior, and escalating to dev/N2 when code intervention is required.',
        tags: ['Support', 'PHP', 'WordPress', 'Drupal', 'Django', 'Node.js'],
      },
      function5: {
        name: 'Incident Investigation',
        description: 'Investigating incidents and finding root causes, not just fixing the symptom. Troubleshooting NGINX, SSL certificates, DNS/Cloudflare, databases, migrations, Linux servers, containers and deployments.',
        tags: ['Incidents', 'Root Cause', 'NGINX', 'SSL', 'DNS'],
      },
      function6: {
        name: 'Infrastructure & Servers',
        description: 'Administering Linux servers, VPS and dedicated servers with Linode, bastion hosts and Docker/Docker Compose across more than 20 containers. Configuring NGINX, SSH, Fail2Ban and access controls, and hardening server security.',
        tags: ['Linux', 'Docker', 'Linode', 'Security', 'Hardening'],
      },
      function7: {
        name: 'Database Administration',
        description: 'Working with PostgreSQL and MySQL: creating and installing databases on servers and Docker, diagnosing issues, and participating in migrations and production troubleshooting.',
        tags: ['Databases', 'PostgreSQL', 'MySQL', 'Migrations'],
      },
      function8: {
        name: 'Automation & Scripting',
        description: 'Writing Bash scripts and Python/JavaScript when appropriate, automating repetitive infrastructure and support tasks such as deployments, backups and environment creation.',
        tags: ['Automation', 'Bash', 'Python', 'Scripting'],
      },
    },
    skills: {
      title: 'Tech Stack',
      infrastructure: {
        name: 'Infrastructure & Cloud',
        items: ['Kubernetes', 'Docker', 'Linode', 'Linux Administration', 'Self-hosted', 'DigitalOcean'],
      },
      backend: {
        name: 'Backend & Frameworks',
        items: ['WordPress', 'Drupal', 'Django', 'Python', 'PHP', 'JAVA', 'C++', 'PostgreSQL', 'MySQL'],
      },
      devops: {
        name: 'DevOps & Automation',
        items: ['GitHub Actions', 'Bash Scripting', 'NGINX', 'Terraform', 'ArgoCD', 'Helm', 'SSL/TLS'],
      },
      languages: {
        name: 'Programming Languages',
        items: ['Python', 'Bash', 'Java', 'C++', 'PHP', 'JavaScript'],
      },
    },
    projects: {
      title: 'Key Projects',
      viewMore: 'View More',
      viewAll: 'View all repositories',
      project1: {
        name: 'GitHub Self-Hosted Runner (Docker)',
        description: 'Built and deployed a self-hosted GitHub Actions runner using Docker, enabling custom CI/CD execution environments and local workflow testing',
        tags: ['Docker', 'GitHub Actions', 'CI/CD', 'DevOps', 'Self-Hosted'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
      },
      project2: {
        name: 'RESTful API with Spring Boot',
        description: 'Designed and implemented a RESTful API using Spring Boot, featuring layered architecture, JPA-based persistence, and unit testing to ensure code quality',
        tags: ['Java', 'Spring Boot', 'REST API', 'JPA', 'Development'],
        link: 'https://github.com/zer0sh/crud-java'
      },
      project3: {
        name: 'K3s Dev Platform Lab (In progress)',
        description: 'Built a Kubernetes-based development platform using K3s, implementing GitOps with ArgoCD, and integrating observability with Prometheus, Grafana, and Loki to simulate a cloud-native environment for DevOps practices',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps', 'Grafana', 'Prometheus', 'Loki', 'DevOps'],
        link: 'https://github.com/zer0sh/k3s-lab'
      },
    },
    contact: {
      title: 'Get In Touch',
      description: 'Let\'s work together. Connect with me through:',
      email: 'Email',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      copyright: `© ${getCurrentYear()} Steven Muñoz | ↄ Licensed under GPL v3`,
      madewith: 'Made with React & Tailwind CSS',
      yearsExp: `${getYearsOfExperience()} years experience`,
    },
    blog: {
      subtitle: 'Writing about DevOps, Cybersecurity and Development',
    },
  },
  es: {
    nav: {
      about: 'Sobre mí',
      skills: 'Skills',
      projects: 'Proyectos',
      contact: 'Contacto',
      blog: 'Blog',
      others: 'Otros',
    },
    hero: {
      title: 'Especialista DevOps & Sistemas',
      subtitle: 'Construyo y opero sistemas en producción enfocados en automatización, escalabilidad y despliegues sin downtime.\nTambién trabajo en desarrollo backend y mejora continua de aplicaciones, conectando el desarrollo con la infraestructura.',
      cta: 'Explora mi trabajo',
    },
    about: {
      title: 'Sobre mí',
      description: 'Especialista de TI con rol formal de Soporte Técnico Nivel 1, con experiencia práctica en la operación de entornos productivos y un fuerte enfoque en prácticas DevOps, automatización y administración de sistemas. Trabajo en la gestión de infraestructura basada en Linux, despliegue y mantenimiento de aplicaciones web, así como en la resolución de incidentes en producción.',
      experience: 'Tengo una visión integral que conecta desarrollo, infraestructura y soporte, lo que me permite diagnosticar problemas complejos y proponer soluciones eficientes, escalables y seguras. Mi experiencia abarca desde soporte técnico hasta automatización de procesos, orquestación de contenedores y mantenimiento de plataformas en entornos reales.',
    },
    work: {
      title: 'Lo que hago',
      subtitle: 'Mis funciones diarias como Especialista DevOps & Sistemas',
      function1: {
        name: 'Orquestación Kubernetes',
        description: 'Orquesto instancias en Kubernetes con ArgoCD, reviso fallos, aplico optimizaciones y superviso logs.',
        tags: ['Kubernetes', 'ArgoCD', 'DevOps'],
      },
      function2: {
        name: 'CI/CD y Despliegues',
        description: 'Despliego a producción y entornos de prueba con GitHub Actions, en servidores dedicados, Pantheon y múltiples tecnologías como Django, WordPress, Drupal y React.',
        tags: ['CI/CD', 'GitHub Actions', 'Despliegues'],
      },
      function3: {
        name: 'Monitorización y Observabilidad',
        description: 'Configuro servicios de monitorización como Sentry y Grafana, y reviso logs de aplicaciones.',
        tags: ['Monitorización', 'Grafana', 'Sentry', 'Logs'],
      },
      function4: {
        name: 'Soporte de Aplicaciones',
        description: 'Atiendo y resuelvo tickets de aplicaciones en producción. Doy soporte a aplicaciones PHP, WordPress, Drupal, Django y Node.js, investigo errores de apps, APIs e integraciones, analizo logs y comportamiento del sistema, y escalo a desarrollo/N2 cuando requiere intervención de código.',
        tags: ['Soporte', 'PHP', 'WordPress', 'Drupal', 'Django', 'Node.js'],
      },
      function5: {
        name: 'Investigación de Incidentes',
        description: 'Investigo incidentes y busco la causa raíz, no solo el síntoma. Atiendo problemas de NGINX, certificados SSL, DNS/Cloudflare, bases de datos, migraciones, servidores Linux, contenedores y despliegues.',
        tags: ['Incidentes', 'Causa raíz', 'NGINX', 'SSL', 'DNS'],
      },
      function6: {
        name: 'Infraestructura y Servidores',
        description: 'Administro servidores Linux, VPS y dedicados con Linode, bastion hosts y Docker/Docker Compose con más de 20 contenedores. Configuro NGINX, SSH, Fail2Ban y controles de acceso, y participo en el hardening y la seguridad de servidores.',
        tags: ['Linux', 'Docker', 'Linode', 'Seguridad', 'Hardening'],
      },
      function7: {
        name: 'Administración de Bases de Datos',
        description: 'Trabajo con PostgreSQL y MySQL: creación e instalación en servidores y Docker, diagnóstico de problemas y participación en migraciones y resolución de fallos en producción.',
        tags: ['Bases de datos', 'PostgreSQL', 'MySQL', 'Migraciones'],
      },
      function8: {
        name: 'Automatización y Scripting',
        description: 'Creo scripts principalmente con Bash, además de Python/JavaScript cuando corresponde, automatizando tareas repetitivas de infraestructura y soporte como despliegues, backups y creación de entornos.',
        tags: ['Automatización', 'Bash', 'Python', 'Scripting'],
      },
    },
    skills: {
      title: 'Stack Tecnológico',
      infrastructure: {
        name: 'Infraestructura & Cloud',
        items: ['Kubernetes', 'Docker', 'Linode', 'Administración Linux', 'Self-hosted', 'DigitalOcean'],
      },
      backend: {
        name: 'Backend & Frameworks',
        items: ['WordPress', 'Drupal', 'Django', 'Python', 'PHP', 'PostgreSQL', 'MySQL'],
      },
      devops: {
        name: 'DevOps & Automatización',
        items: ['GitHub Actions', 'Bash Scripting', 'NGINX', 'Terraform', 'ArgoCD', 'Helm', 'SSL/TLS'],
      },
      languages: {
        name: 'Lenguajes de Programación',
        items: ['Python', 'Bash', 'Java', 'C++', 'PHP', 'JavaScript'],
      },
    },
    projects: {
      title: 'Proyectos Principales',
      viewMore: 'Ver más',
      viewAll: 'Ver todos los repositorios',
      project1: {
        name: 'Runner Autohosteado de GitHub (Docker)',
        description: 'Construcción y despliegue de un runner autoalojado de GitHub Actions usando Docker, permitiendo entornos de ejecución personalizados y pruebas locales de flujos de trabajo',
        tags: ['Docker', 'GitHub Actions', 'CI/CD', 'DevOps', 'Self-Hosted'],
        link: 'https://github.com/zer0sh/gh-runner-selfhosted-docker'
      },
      project2: {
        name: 'API RESTful con Spring Boot',
        description: 'Diseño e implementación de una API RESTful usando Spring Boot, con arquitectura en capas, persistencia basada en JPA y pruebas unitarias para asegurar la calidad del código',
        tags: ['Java', 'Spring Boot', 'REST API', 'JPA', 'Development'],
        link: 'https://github.com/zer0sh/crud-java'
      },
      project3: {
        name: 'K3s Dev Platform Lab (In progress)',
        description: 'Diseño e implementación de una plataforma cloud-native basada en Kubernetes con K3s, incorporando flujos GitOps con ArgoCD, monitoreo centralizado y logging, y despliegues automatizados de aplicaciones',
        tags: ['Kubernetes', 'K3s', 'ArgoCD', 'GitOps', 'Grafana', 'Prometheus', 'Loki', 'DevOps'],
        link: 'https://github.com/zer0sh/k3s-lab'
      },
    },
    contact: {
      title: 'Contacto',
      description: 'Trabajemos juntos. Conecta conmigo a través de:',
      email: 'Correo',
      discord: 'Discord',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: {
      copyright: `© ${getCurrentYear()} Steven Muñoz | ↄ Licensed under GPL v3`,
      madewith: 'Hecho con React & Tailwind CSS',
      yearsExp: `${getYearsOfExperience()} años de experiencia`,
    },
    blog: {
      subtitle: 'Escribiendo sobre DevOps, Ciberseguridad y Desarrollo',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], translations[lang]) || '';
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
