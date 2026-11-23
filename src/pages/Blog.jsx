import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const extractHeadings = (content) => {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({ level: match[1].length, text: match[2], id: slugify(match[2]) });
  }
  return headings;
};

const ArchitectureDiagram = () => {
  return (
    <div className="my-10 border border-[#1e293b] bg-[#080a0f] p-4 sm:p-6 font-mono text-xs select-none shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
          <span className="text-white font-bold tracking-wider uppercase text-xs sm:text-sm">
            TOPOLOGÍA DESCUBIERTA // CADENA DE SERVICIO Y VECTORES DE AMENAZA
          </span>
        </div>
        <span className="px-2.5 py-1 bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-[0.7rem] uppercase font-bold tracking-widest">
          INCIDENTE P1 // SERVIDOR EN CUARENTENA
        </span>
      </div>

      {/* Main Flow: Pipeline horizontal/vertical */}
      <div className="space-y-4">
        {/* Step 1: Internet & Perimeter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Node 1 */}
          <div className="border border-[#1e293b] bg-[#0c0e14] p-3.5 flex flex-col justify-between">
            <div>
              <div className="text-[#64748b] text-[0.7rem] uppercase mb-1">PUNTO DE ENTRADA</div>
              <div className="text-white font-bold text-sm">Internet / Clientes</div>
            </div>
            <div className="text-[#10b981] text-[0.7rem] mt-2 font-mono">Tráfico Web Público</div>
          </div>

          {/* Node 2 */}
          <div className="border border-[#1e293b] bg-[#0c0e14] p-3.5 flex flex-col justify-between">
            <div>
              <div className="text-[#64748b] text-[0.7rem] uppercase mb-1">EDGE WAF & DNS</div>
              <div className="text-white font-bold text-sm">Cloudflare Proxy</div>
            </div>
            <div className="text-[#10b981] text-[0.7rem] mt-2 font-mono">Terminación TLS + WAF</div>
          </div>

          {/* Node 3 */}
          <div className="border border-[#1e293b] bg-[#0c0e14] p-3.5 flex flex-col justify-between">
            <div>
              <div className="text-[#64748b] text-[0.7rem] uppercase mb-1">REVERSE PROXY CACHE</div>
              <div className="text-white font-bold text-sm">srv-horizonte-cache</div>
            </div>
            <div className="text-[#10b981] text-[0.7rem] mt-2 font-mono">10.10.10.15 (NGINX)</div>
          </div>
        </div>

        {/* Down Arrow / Connector */}
        <div className="flex items-center justify-center gap-2 py-1 text-[#ef4444] font-bold text-xs">
          <span>&darr;</span>
          <span className="bg-[#ef4444]/10 border border-[#ef4444]/30 px-3 py-1 uppercase tracking-wider text-[0.72rem]">
            proxy_pass :8080 (Tráfico real activo a /campanas-especiales/*)
          </span>
          <span>&darr;</span>
        </div>

        {/* The Compromised Node (Highlighted in Danger Red) */}
        <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-[#ef4444] text-[#07080b] font-black text-[0.7rem] tracking-wider uppercase">
            EPICENTRO DEL INCIDENTE
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-white font-black text-base sm:text-lg tracking-wide flex items-center gap-2">
                <span className="text-[#ef4444] font-black">[!]</span>
                <span>srv-legacy-2023</span>
                <span className="text-xs font-normal text-[#94a3b8]">(10.10.10.50 · Apache 2.4 + PHP 7.4)</span>
              </div>
              <div className="text-[#ef4444] font-bold text-xs uppercase tracking-wider mt-1">
                Estado documental: "CONGELADO" &rarr; Realidad: EN PRODUCCIÓN ACTIVA
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#ef4444]/30 text-xs">
            <div className="flex items-center gap-2 text-[#fca5a5]">
              <span className="text-[#ef4444] font-bold">&bull;</span>
              <span><strong>Backdoor activo:</strong> /usr/local/bin/uptime_check en puerto 5000</span>
            </div>
            <div className="flex items-center gap-2 text-[#fca5a5]">
              <span className="text-[#ef4444] font-bold">&bull;</span>
              <span><strong>Exposición pública:</strong> ufw 80/443 abierto a 0.0.0.0/0 (sin pasar por WAF)</span>
            </div>
          </div>
        </div>

        {/* Branching Connectors to Compromised Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Left Branch: Database Access */}
          <div className="border border-amber-500/40 bg-[#0c0e14] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <span>&rarr; CONEXIÓN NO AUTORIZADA // DB LEAK</span>
              </div>
              <div className="text-white font-bold text-sm mb-1">srv-horizonte-db (MySQL Prod)</div>
              <div className="text-[#94a3b8] text-xs">
                IP 10.10.10.20 &middot; Puerto 3306/tcp directo
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1e293b] text-[0.72rem] text-amber-300/80">
              [!] Regla de firewall huérfana sin comentario permitía acceso directo total a la base de datos de producción desde el host comprometido.
            </div>
          </div>

          {/* Right Branch: Attacker C2 */}
          <div className="border border-rose-500/40 bg-[#0c0e14] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <span>&larr; CANAL DE COMANDO Y CONTROL (C2)</span>
              </div>
              <div className="text-white font-bold text-sm mb-1">Atacante Externo / Botnet</div>
              <div className="text-[#94a3b8] text-xs">
                Socket 0.0.0.0:5000 &middot; Regla saliente 174.138.59.x:443
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1e293b] text-[0.72rem] text-rose-300/80">
              [!] Servicio systemd (Restart=always) vivo desde junio; canal de persistencia camuflado bajo tráfico falso de actualización de plugins.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Wp2shellTimeline = () => {
  const events = [
    {
      date: '2026-07-15',
      status: 'EXPUESTO',
      statusColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      dotColor: 'bg-amber-400',
      title: 'WordPress 6.9.1 en Producción',
      desc: 'Ambos portales corren versión dentro del rango vulnerable (6.9.0–6.9.4). Sin anomalías reportadas.',
    },
    {
      date: '2026-07-17 (Noche)',
      status: 'ZERO-DAY DISCLOSURE',
      statusColor: 'text-[#ef4444] border-red-500/40 bg-red-500/10',
      dotColor: 'bg-red-500 animate-pulse',
      title: 'Publicación Masiva del Exploit WP2Shell',
      desc: 'CVE-2026-63030 (confusión en REST API) + CVE-2026-60137 (SQLi). Ejecución Remota de Código (RCE) no autenticada.',
    },
    {
      date: '2026-07-19 → 07-21',
      status: 'BRECHA ACTIVA',
      statusColor: 'text-[#ef4444] border-red-500/40 bg-red-500/10',
      dotColor: 'bg-red-500 animate-pulse',
      title: 'Siembra Silenciosa de 11 Administradores Fantasma',
      desc: 'Aparece wp2_389809@wp2shell.invalid y 10 usuarios bot adicionales en live y test. Los atacantes ya tienen control administrativo.',
    },
    {
      date: '2026-07-23',
      status: 'FALSA SEGURIDAD',
      statusColor: 'text-[#38bdf8] border-sky-500/30 bg-sky-500/10',
      dotColor: 'bg-sky-400',
      title: 'Autopilot Actualiza el Núcleo a 7.0.2',
      desc: 'El ciclo semanal cierra la vulnerabilidad técnica, pero no purga usuarios. Las 11 cuentas de administrador sobreviven intactas.',
    },
    {
      date: '2026-08-25',
      status: 'ATAQUE INTERACTIVO',
      statusColor: 'text-[#f43f5e] border-rose-500/40 bg-rose-500/10',
      dotColor: 'bg-rose-500',
      title: 'Intento de Backdoors y Corrupción de Opciones',
      desc: 'Sesión desde Azure US East. Filesystem en read-only bloquea backdoors (renombrados a .php_.gif). El atacante vacía template/stylesheet en wp_options.',
    },
    {
      date: '2026-09-03',
      status: 'RESPUESTA SRE',
      statusColor: 'text-[#10b981] border-emerald-500/30 bg-emerald-500/10',
      dotColor: 'bg-emerald-400',
      title: 'Diagnóstico de Página en Blanco (HTTP 200, 0B) y Remediación',
      desc: 'Bisección de backups diarios, eliminación de admins falsos, restauración de tema en base de datos e invalidación masiva de sesiones.',
    },
  ];

  return (
    <div className="my-10 border border-[#1e293b] bg-[#080a0f] p-5 sm:p-7 font-mono text-xs select-none shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
          <span className="text-white font-bold tracking-wider uppercase text-xs sm:text-sm">
            CRONOLOGÍA FORENSE // SECUENCIA TEMPORAL DEL ATAQUE WP2SHELL
          </span>
        </div>
        <span className="px-2.5 py-1 bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-[0.7rem] uppercase font-bold tracking-widest">
          INCIDENT TIMELINE
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-red-500 before:to-emerald-500">
        {events.map((ev, idx) => (
          <div key={idx} className="relative group">
            <div className={`absolute -left-[29px] sm:-left-[33px] top-1.5 w-3 h-3 rounded-full ${ev.dotColor} border-2 border-[#080a0f]`}></div>
            <div className="border border-[#1e293b] bg-[#0c0e14] p-4 group-hover:border-[#38bdf8]/40 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-[#38bdf8] font-bold text-xs tracking-wider">{ev.date}</span>
                <span className={`px-2 py-0.5 border text-[0.68rem] font-bold tracking-wider uppercase ${ev.statusColor}`}>
                  {ev.status}
                </span>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base tracking-tight mb-1">
                {ev.title}
              </h4>
              <p className="text-[#94a3b8] text-xs leading-relaxed font-sans font-normal">
                {ev.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DefenseLayersDiagram = () => {
  const layers = [
    {
      num: 'CAPA 01',
      title: 'Límite Estricto de Contenedor (Docker cgroups)',
      metric: 'mem_limit: 640m · memswap_limit: 640m',
      desc: 'Si un worker entra en trashing o intenta consumir más memoria, Docker mata el proceso aislado sin colapsar el kernel del host.',
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    },
    {
      num: 'CAPA 02',
      title: 'Red de Seguridad en el Sistema Operativo (Swap)',
      metric: 'Swap 2 GB en SSD · swappiness = 10',
      desc: 'Evita que el kernel entre en freeze si la memoria llega al 90%. Absorbe picos transitorios y da tiempo de reacción al recolector de métricas.',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    },
    {
      num: 'CAPA 03',
      title: 'Sintonización Matemática de PHP-FPM',
      metric: 'max_children: 3 · memory_limit: 256M · max_requests: 500',
      desc: 'Incluso con todos los workers al máximo simultáneamente (3 × 256M = 768M), matemáticamente no pueden saturar los recursos del contenedor.',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    },
    {
      num: 'CAPA 04',
      title: 'Autorreparación Cloud (AWS CloudWatch Alarms)',
      metric: 'StatusCheckFailed_Instance > 5 min → EC2 Auto-Reboot',
      desc: 'Si el driver de red (ENA) o el kernel se traban por cualquier condición imprevista, AWS reinicia la instancia automáticamente sin intervención humana.',
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    },
  ];

  return (
    <div className="my-10 border border-[#1e293b] bg-[#080a0f] p-5 sm:p-7 font-mono text-xs select-none shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-white font-bold tracking-wider uppercase text-xs sm:text-sm">
            ARQUITECTURA DE CONTENCIÓN // BLINDAJE EN CUATRO NIVELES
          </span>
        </div>
        <span className="px-2.5 py-1 bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] text-[0.7rem] uppercase font-bold tracking-widest">
          DEFENSE IN DEPTH
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {layers.map((l, i) => (
          <div key={i} className="border border-[#1e293b] bg-[#0c0e14] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 border text-[0.68rem] font-bold ${l.color}`}>
                  {l.num}
                </span>
                <span className="text-white font-bold text-sm">{l.title}</span>
              </div>
              <p className="text-[#94a3b8] text-xs font-sans leading-relaxed pt-1">
                {l.desc}
              </p>
            </div>
            <div className="font-mono text-[0.72rem] text-[#10b981] bg-[#07080b] border border-[#1e293b] px-3 py-2 shrink-0">
              {l.metric}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const codeEl = React.Children.toArray(children)[0];
  const className = codeEl?.props?.className || '';

  if (className === 'language-architecture' || className.includes('architecture')) {
    return <ArchitectureDiagram />;
  }
  if (className === 'language-timeline' || className.includes('timeline')) {
    return <Wp2shellTimeline />;
  }
  if (className === 'language-defense-layers' || className.includes('defense') || className.includes('layers')) {
    return <DefenseLayersDiagram />;
  }

  const handleCopy = () => {
    const text = codeRef.current?.innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-6 border border-[#131722] bg-[#0c0e14]">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#07080b] border-b border-[#131722] text-xs font-mono text-[#64748b] select-none">
        <span className="uppercase tracking-wider">SHELL // SOURCE SNIPPET</span>
        <button
          onClick={handleCopy}
          className="text-[#10b981] hover:text-white transition-colors uppercase tracking-wider px-2.5 py-0.5 border border-[#131722] hover:border-[#10b981] font-mono text-xs"
          aria-label="Copy snippet to clipboard"
        >
          {copied ? '[COPIED!]' : '[COPY]'}
        </button>
      </div>
      <div ref={codeRef} className="p-4 overflow-x-auto font-mono text-sm text-[#e2e8f0] leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const AlertBlockquote = ({ children }) => {
  const elements = React.Children.toArray(children).filter(
    (c) => typeof c !== 'string' || c.trim() !== ''
  );
  const firstEl = elements[0];

  if (firstEl && firstEl.props && firstEl.props.children) {
    const pChildren = React.Children.toArray(firstEl.props.children);
    if (typeof pChildren[0] === 'string') {
      const match = pChildren[0].match(/^\[!(WARNING|NOTE|TIP|IMPORTANT|CAUTION)\]\s*/i);
      if (match) {
        const type = match[1].toUpperCase();
        const newFirstText = pChildren[0].slice(match[0].length);
        const newPChildren = [newFirstText, ...pChildren.slice(1)].filter((c) => c !== '');
        const newFirstP = React.cloneElement(
          firstEl,
          { className: 'mb-0 leading-relaxed text-[#d1d5db]' },
          ...newPChildren
        );
        const rest = elements.slice(1);

        const isWarning = type === 'WARNING' || type === 'CAUTION';
        const borderColor = isWarning ? 'border-amber-500/40' : 'border-[#10b981]/40';
        const bgHeader = isWarning ? 'bg-amber-500/15' : 'bg-[#10b981]/15';
        const textColor = isWarning ? 'text-amber-400' : 'text-[#10b981]';
        const borderHeader = isWarning ? 'border-amber-500/30' : 'border-[#10b981]/30';

        return (
          <aside
            className={`my-8 border ${borderColor} bg-[#0c0e14] relative overflow-hidden not-italic font-normal`}
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 ${bgHeader} border-b ${borderHeader} font-mono text-xs uppercase tracking-wider ${textColor} font-bold select-none`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                {type === 'WARNING'
                  ? 'ADVERTENCIA DE SEGURIDAD // CONFIDENCIALIDAD OPERATIVA'
                  : type}
              </span>
            </div>
            <div className="p-5 text-sm sm:text-base leading-relaxed space-y-3">
              {newFirstP}
              {rest}
            </div>
          </aside>
        );
      }
    }
  }

  return (
    <blockquote className="border-l-2 border-[#10b981] pl-4 my-6 text-[#8e99a8] italic">
      {children}
    </blockquote>
  );
};

export const Blog = () => {
  const { lang } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const listResponse = await fetch('/blog-posts/index.json');
        if (listResponse.ok) {
          const { posts: postList } = await listResponse.json();

          const postsWithContent = [];
          for (const post of postList) {
            const contentResponse = await fetch(`/blog-posts/${post.slug}.md`);
            if (contentResponse.ok) {
              const content = await contentResponse.text();
              const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
              const extract = (key) => {
                const m = frontmatter?.[1]?.match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
                return m ? m[1] : null;
              };
              const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
              postsWithContent.push({
                ...post,
                content: cleanContent,
                coverImage: post.coverImage || extract('coverImage'),
                coverAlt: post.coverAlt || extract('coverAlt'),
              });
            }
          }

          setPosts(postsWithContent);

          // If query param ?post=slug exists, open it directly
          const params = new URLSearchParams(location.search);
          const postSlug = params.get('post');
          if (postSlug) {
            const matched = postsWithContent.find((p) => p.slug === postSlug);
            if (matched) {
              setSelectedPost(matched);
            }
          }
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, [location.search]);

  // Reading progress tracking
  useEffect(() => {
    if (!selectedPost) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  // Categories list
  const categories = ['ALL', ...new Set(posts.map((p) => p.category).filter(Boolean))];

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (post.category && post.category.toUpperCase() === selectedCategory.toUpperCase());
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
      (post.content && post.content.toLowerCase().includes(q)) ||
      (post.category && post.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  if (selectedPost) {
    const readingTime = calculateReadingTime(selectedPost.content);
    const headings = extractHeadings(selectedPost.content);

    return (
      <div className="min-h-screen bg-[#07080b] text-white pt-10 pb-20">
        {/* Telemetry Reading Progress Bar */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 h-[2.5px] bg-[#10b981] z-50 transition-all duration-75 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
          {/* Back Navigation */}
          <button
            onClick={handleBackClick}
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors mb-12 flex items-center gap-2"
          >
            <span>&larr;</span>
            <span>{lang === 'es' ? 'Volver a las notas de campo' : 'Back to field notes'}</span>
          </button>

          <article>
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-4 font-mono text-[0.75rem] uppercase tracking-[0.15em] mb-4">
                <span className="text-[#ef4444]">{selectedPost.category || 'ANALYSIS'}</span>
                <span className="text-[#64748b]">·</span>
                <span className="text-[#64748b]">{selectedPost.date}</span>
                <span className="text-[#64748b]">·</span>
                <span className="text-[#10b981]">{readingTime} MIN READ</span>
                <span className="text-[#64748b]">·</span>
                <span className="text-[#64748b] font-mono">{Math.round(scrollProgress)}% {lang === 'es' ? 'LEÍDO' : 'READ'}</span>
              </div>

              <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-[-0.04em] leading-[1.0] text-white mb-6">
                {selectedPost.title}
              </h1>

              {selectedPost.excerpt && (
                <p className="text-xl leading-relaxed text-[#8e99a8] w-full text-justify hyphens-auto">
                  {selectedPost.excerpt}
                </p>
              )}
            </header>

            {selectedPost.coverImage && (
              <div className="mb-12 overflow-hidden border border-[#131722]">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.coverAlt || selectedPost.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {headings.length >= 2 && (
              <div className="mb-12 p-6 sm:p-7 border border-[#131722] bg-[#0c0e14]">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#131722]">
                  <span className="font-mono text-xs text-[#ef4444] font-bold tracking-widest">[INDEX]</span>
                  <p className="font-mono text-sm sm:text-base uppercase tracking-[0.2em] text-white font-extrabold">
                    Tabla de Contenido
                  </p>
                </div>
                <nav className="space-y-2.5 font-mono">
                  {headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })}
                      className={`group flex items-baseline text-left transition-all ${
                        h.level === 3
                          ? 'ml-6 text-sm sm:text-base text-[#8e99a8] hover:text-[#10b981]'
                          : 'text-base sm:text-lg font-bold text-[#e2e8f0] hover:text-[#10b981]'
                      }`}
                    >
                      <span className="text-[#10b981] font-black mr-3 shrink-0 group-hover:text-white transition-colors">
                        {h.level === 3 ? '##' : '#'}
                      </span>
                      <span className="group-hover:underline underline-offset-4">
                        {h.text}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Markdown Body with Custom CodeBlock copy support */}
            <div className="prose prose-invert prose-lg max-w-none text-[#d1d5db]
              prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-[-0.03em]
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[#d1d5db] prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-justify hyphens-auto
              prose-a:text-[#10b981] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[#10b981] prose-code:bg-[#0e1118] prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-blockquote:border-l-2 prose-blockquote:border-[#10b981] prose-blockquote:text-[#8e99a8] prose-blockquote:italic
              prose-ul:text-[#d1d5db] prose-li:mb-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                  blockquote: AlertBlockquote,
                  img: ({ src, alt, title }) => (
                    <figure className="my-8">
                      <img
                        src={src}
                        alt={alt}
                        title={title}
                        className="w-full h-auto border border-[#131722]"
                      />
                      {title && (
                        <figcaption className="text-center font-mono text-xs text-[#64748b] mt-2">
                          {title}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  h2: ({ children, ...props }) => {
                    const text = children?.toString() || '';
                    return <h2 id={slugify(text)} {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const text = children?.toString() || '';
                    return <h3 id={slugify(text)} {...props}>{children}</h3>;
                  },
                }}
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-12 pb-24">
      <div className="max-w-[1250px] mx-auto px-6 sm:px-8">
        {/* Navigation back */}
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors mb-16 inline-flex items-center gap-2"
        >
          <span>&larr;</span>
          <span>{lang === 'es' ? 'Volver al inicio' : 'Back to home'}</span>
        </Link>

        {/* Section Header */}
        <div className="mb-14">
          <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-3">
            INCIDENT_ANALYSES // SRE_FIELD_NOTES
          </p>
          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white uppercase mb-4">
            Field Dispatches
          </h1>
          <p className="text-lg text-[#64748b] max-w-[52ch]">
            {lang === 'es'
              ? 'Artículos técnicos, investigación de incidentes en producción, automatizaciones y arquitectura de sistemas.'
              : 'Technical articles, production incident investigations, automations, and systems architecture.'}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-14 space-y-6 pb-8 border-b border-[#131722]">
          {/* Search Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#10b981]">
                [>]
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'es' ? 'BUSCAR EN NOTAS DE CAMPO // TÍTULO, STACK O TEXTO...' : 'SEARCH IN FIELD NOTES // TITLE, STACK OR TEXT...'}
                className="w-full bg-[#0c0e14] border border-[#131722] focus:border-[#10b981] text-white font-mono text-xs sm:text-sm pl-10 pr-4 py-2.5 outline-none transition-colors placeholder:text-[#64748b]/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#64748b] hover:text-white"
                >
                  {lang === 'es' ? '[LIMPIAR]' : '[CLEAR]'}
                </button>
              )}
            </div>

            <div className="font-mono text-xs text-[#64748b]">
              {lang === 'es' ? 'MOSTRANDO' : 'SHOWING'} <span className="text-[#10b981] font-bold">{filteredPosts.length}</span> {lang === 'es' ? 'DE' : 'OF'} {posts.length} DISPATCHES
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.74rem] uppercase tracking-wider text-[#64748b] mr-2">
              {lang === 'es' ? 'CATEGORÍAS:' : 'CATEGORIES:'}
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-xs uppercase tracking-wider px-3 py-1 border transition-all ${
                    isSelected
                      ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]'
                      : 'bg-[#0c0e14] text-[#64748b] border-[#131722] hover:text-white hover:border-[#64748b]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts List */}
        <div className="grid row-gap-12 sm:row-gap-16">
          {posts.length === 0 ? (
            <div className="py-20 font-mono text-sm text-[#64748b]">
              {lang === 'es' ? 'CARGANDO REGISTRO DE DISPATCHES...' : 'LOADING DISPATCHES REGISTRY...'}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-16 text-center border border-[#131722] bg-[#0c0e14] p-8">
              <p className="font-mono text-sm text-[#ef4444] mb-3">
                {lang === 'es' ? '[!] NO SE ENCONTRARON DISPATCHES QUE COINCIDAN CON LOS CRITERIOS' : '[!] NO DISPATCHES FOUND MATCHING SEARCH CRITERIA'}
              </p>
              <p className="text-sm text-[#64748b] mb-5">
                {lang === 'es' ? 'Prueba buscando otros términos o resetea los filtros aplicados.' : 'Try searching different terms or reset active filters.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-[#131722] text-[#10b981] hover:bg-[#10b981] hover:text-[#07080b] transition-colors"
              >
                {lang === 'es' ? '[RESETEAR FILTROS]' : '[RESET FILTERS]'}
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const readingTime = calculateReadingTime(post.content);

              return (
                <article
                  key={post.slug}
                  onClick={() => handlePostClick(post)}
                  className="group cursor-pointer grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-6 pb-8 border-b border-[#131722]/60 last:border-b-0"
                >
                  <div className="font-mono text-xs text-[#64748b] uppercase tracking-wider">
                    <p className="text-[#ef4444] font-bold mb-1">{post.category || 'DISPATCH'}</p>
                    <p>{post.date}</p>
                    <p className="text-[#10b981] mt-1">{readingTime} MIN READ</p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-white group-hover:text-[#10b981] transition-colors mb-2.5">
                      {post.title} &rarr;
                    </h2>
                    <p className="text-base text-[#8e99a8] leading-relaxed w-full">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};