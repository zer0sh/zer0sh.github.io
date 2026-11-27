import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

export const KestrelCloudDemo = () => {
  const [activeRegion, setActiveRegion] = useState('us-east');
  const [activeRuntime, setActiveRuntime] = useState('nextjs');
  const [selectedNode, setSelectedNode] = useState('api-gateway');
  const [deployStep, setDeployStep] = useState(0);
  const [vcpu, setVcpu] = useState(4);
  const [ramGb, setRamGb] = useState(8);
  const [activeDb, setActiveDb] = useState('postgres');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const dbEngines = {
    postgres: { name: 'PostgreSQL 16', specs: 'NVMe SSD · Point-in-Time Recovery · pgvector incluido', conn: 'postgresql://user:pass@pg-prod.kestrel.internal:5432/app' },
    redis: { name: 'Redis 7.2 Cluster', specs: 'Sub-millisecond reads · Persistencia AOF · Pub/Sub', conn: 'redis://default:pass@redis-edge.kestrel.internal:6379' },
    clickhouse: { name: 'ClickHouse Analytics', specs: 'Compresión columnar 10x · Consultas OLAP en ms', conn: 'https://ch-analytics.kestrel.internal:8443/?database=events' },
  };

  const estimatedCost = (vcpu * 4.5 + ramGb * 2.2).toFixed(2);

  const runtimeSnippets = {
    nextjs: { cmd: 'npx create-kestrel-app@latest', log: 'Detected Next.js 15 App Router · Edge SSR enabled' },
    rust: { cmd: 'cargo kestrel init --release', log: 'Compiled Axum binary (14.2 MB) · musl static target' },
    python: { cmd: 'kestrel deploy --fastapi', log: 'Detected FastAPI + Uvicorn · 4 async workers ready' },
  };

  const nodes = [
    { id: 'api-gateway', name: 'API Gateway', status: 'En línea · 12ms', cpu: '14% CPU · 128MB', env: 'EDGE_TLS=strict · REPLICAS=3', color: 'border-emerald-500/40' },
    { id: 'postgres', name: 'Postgres Primary', status: 'Sincronizado · 4.2GB', cpu: '28% RAM · SSD NVMe', env: 'PG_VERSION=16.4 · WAL_SYNC=on', color: 'border-violet-500/40' },
    { id: 'redis', name: 'Redis Cache', status: 'Acierto 99.4%', cpu: '8% RAM · Clúster', env: 'MAXMEMORY_POLICY=allkeys-lru', color: 'border-sky-500/40' },
    { id: 'worker', name: 'Worker Cron', status: 'Activo · Cada 2m', cpu: '4% CPU · Cola 0', env: 'CONCURRENCY=12 · QUEUE=default', color: 'border-amber-500/40' },
  ];

  const activeNodeObj = nodes.find((n) => n.id === selectedNode) || nodes[0];

  const regionCoords = {
    'us-east': { cx: 210, cy: 135, label: 'US East (Virginia)', ping: '12ms', replicas: '4 réplicas' },
    'eu-central': { cx: 410, cy: 110, label: 'EU Central (Frankfurt)', ping: '24ms', replicas: '3 réplicas' },
    'ap-south': { cx: 590, cy: 185, label: 'AP South (Singapore)', ping: '38ms', replicas: '2 réplicas' },
  };

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#0b0d14] text-white selection:bg-violet-500/30"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Announcement Strip */}
        <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-violet-950 border-b border-violet-500/20 py-2 px-4 text-center text-xs text-violet-200">
          <span className="font-semibold text-white">Kestrel v4.2:</span> PostgreSQL 16 con réplicas de lectura instantáneas ya disponible en 18 regiones &rarr;
        </div>

        {/* Rich Nav */}
        <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-[#0b0d14]/90">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5 font-bold tracking-tight text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30">
                  K
                </span>
                <span>Kestrel</span>
              </div>
              <nav className="hidden lg:flex items-center gap-1 text-sm text-slate-300">
                <button onClick={() => scrollTo('kestrel-platform')} className="px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer flex items-center gap-1.5">
                  Plataforma <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">New</span>
                </button>
                <button onClick={() => scrollTo('kestrel-databases')} className="px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Bases de Datos</button>
                <button onClick={() => scrollTo('kestrel-regions')} className="px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Regiones</button>
                <button onClick={() => scrollTo('kestrel-pricing')} className="px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Precios</button>
                <button onClick={() => scrollTo('kestrel-docs')} className="px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Docs</button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span>Buscar docs</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300">⌘K</kbd>
              </span>
              <span className="text-sm text-slate-300 hidden md:inline cursor-pointer px-2">Login</span>
              <button className="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors shadow-lg shadow-violet-600/25">
                Desplegar gratis
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="kestrel-platform" className="relative overflow-hidden pt-20 pb-20 px-6">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.35), transparent 55%), radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 28px 28px',
            }}
          />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nuevo motor v4.2 — Despliegues instantáneos sin configuración</span>
            </div>
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Despliega código, <br /> no infraestructura.
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Kestrel detecta tu stack, aprovisiona bases de datos y escala tus servicios automáticamente en segundos. Sin archivos YAML interminables.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setDeployStep((s) => (s + 1) % 3)}
                className="px-7 py-3.5 rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-200 transition-colors"
              >
                Simular Deploy en Vivo
              </button>
              <button className="px-7 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-medium hover:bg-white/10 transition-colors text-sm">
                Ver documentación
              </button>
            </div>
          </div>

          {/* Interactive Node Graph Canvas */}
          <div className="max-w-5xl mx-auto mt-16 rounded-3xl border border-white/10 bg-[#11131f]/95 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>production-cluster ({activeRegion})</span>
              </div>
              <span className="text-xs text-violet-400 font-medium">Haz clic en un nodo para inspeccionar</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`text-left rounded-2xl border ${
                    selectedNode === node.id ? 'border-violet-500 ring-2 ring-violet-500/30 bg-[#1a1e33]' : `${node.color} bg-[#171a2b]`
                  } p-4 hover:-translate-y-1 transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{node.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xs text-slate-300 mb-1">{node.status}</div>
                  <div className="text-[11px] text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{node.cpu}</div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-[#090b12] border border-white/10 p-4 text-xs text-slate-300 space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-violet-300 border-b border-white/10 pb-2">
                <span>Inspector: {activeNodeObj.name}</span>
                <span>{activeNodeObj.env}</span>
              </div>
              <div><span className="text-emerald-400">✓ Build #{142 + deployStep}:</span> Detectado Next.js 15 + PostgreSQL 16 + Redis</div>
              <div><span className="text-violet-400">→ Deploy:</span> Aprovisionando réplica en {activeRegion}... listo (1.8s)</div>
              <div><span className="text-sky-400">★ Live:</span> https://api.kestrel.app recibiendo tráfico con TLS 1.3</div>
            </div>
          </div>
        </section>

        {/* Managed Databases Section */}
        <section id="kestrel-databases" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">Bases de Datos Gestionadas</span>
              <h2 className="text-3xl font-bold mt-2 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Motores listos en 1 clic con backups automáticos
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Aprovisiona instancias aisladas con almacenamiento NVMe, snapshots horarios y conexión privada sin salir del dashboard.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dbEngines).map(([key, db]) => (
                  <button
                    key={key}
                    onClick={() => setActiveDb(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeDb === key ? 'bg-violet-600 text-white' : 'bg-[#121521] text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {db.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#10121d] border border-white/10 p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-white">{dbEngines[activeDb].name}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">HA Replica Ready</span>
                </div>
                <p className="text-sm text-slate-400">{dbEngines[activeDb].specs}</p>
                <div className="rounded-xl bg-[#08090e] border border-white/10 p-4 text-xs text-violet-300 break-all" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  DATABASE_URL=&quot;{dbEngines[activeDb].conn}&quot;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Regions Interactive SVG Map */}
        <section id="kestrel-regions" className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">Red Global Anycast</span>
              <h2 className="text-3xl font-bold mt-2 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Latencia mínima en cada continente</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Selecciona una región para visualizar el enrutamiento en tiempo real y el estado de las réplicas.
              </p>
              <div className="space-y-2.5">
                {Object.entries(regionCoords).map(([id, r]) => (
                  <button
                    key={id}
                    onClick={() => setActiveRegion(id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-sm transition-all ${
                      activeRegion === id
                        ? 'bg-violet-600/20 border-violet-500 text-white font-medium'
                        : 'bg-[#121521] border-white/10 text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-emerald-400 font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.ping} · {r.replicas}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-[#10121d] p-6 relative overflow-hidden">
                <svg viewBox="0 0 800 320" className="w-full h-64">
                  <defs>
                    <pattern id="dotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" fill="rgba(148,163,184,0.2)" />
                    </pattern>
                  </defs>
                  <rect width="800" height="320" fill="url(#dotGrid)" />
                  <path d="M 210 135 Q 310 55 410 110" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 410 110 Q 500 95 590 185" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="2" strokeDasharray="6 6" />
                  {Object.entries(regionCoords).map(([id, pt]) => (
                    <g key={id} onClick={() => setActiveRegion(id)} className="cursor-pointer">
                      {activeRegion === id && (
                        <circle cx={pt.cx} cy={pt.cy} r="22" fill="rgba(139,92,246,0.25)" className="animate-ping" />
                      )}
                      <circle cx={pt.cx} cy={pt.cy} r="8" fill={activeRegion === id ? '#a78bfa' : '#334155'} stroke="#fff" strokeWidth="2" />
                      <text x={pt.cx} y={pt.cy + 24} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="JetBrains Mono">
                        {id}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Runtime CLI Switcher / Docs */}
        <section id="kestrel-docs" className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">Zero-Config CLI</span>
              <h2 className="text-3xl font-bold mt-2 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cualquier lenguaje, cero fricción</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Cambia de runtime y mira cómo Kestrel empaqueta y optimiza tu aplicación automáticamente sin escribir Dockerfiles complejos.
              </p>
              <div className="flex gap-2">
                {[
                  { id: 'nextjs', label: 'Next.js 15' },
                  { id: 'rust', label: 'Rust / Axum' },
                  { id: 'python', label: 'FastAPI' },
                ].map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setActiveRuntime(rt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeRuntime === rt.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-[#121521] text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#08090e] border border-white/10 p-6 text-xs space-y-3 shadow-xl" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2">kestrel-cli — zsh</span>
                </div>
                <div className="text-white">$ {runtimeSnippets[activeRuntime].cmd}</div>
                <div className="text-emerald-400">✓ {runtimeSnippets[activeRuntime].log}</div>
                <div className="text-violet-400">→ Desplegado en https://app.kestrel.run (1.6s)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Usage Cost Estimator + Pricing */}
        <section id="kestrel-pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="rounded-3xl bg-[#121521] border border-violet-500/30 p-8 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Calcula tu consumo por segundo</h2>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>vCPU Asignados</span>
                  <span className="font-bold text-violet-400">{vcpu} vCPU</span>
                </div>
                <input type="range" min="1" max="16" value={vcpu} onChange={(e) => setVcpu(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Memoria RAM</span>
                  <span className="font-bold text-violet-400">{ramGb} GB RAM</span>
                </div>
                <input type="range" min="1" max="64" value={ramGb} onChange={(e) => setRamGb(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#090b12] rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Costo mensual estimado</div>
              <div className="text-5xl font-extrabold text-white tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ${estimatedCost}
              </div>
              <div className="text-xs text-emerald-400 mt-2">Facturación exacta por segundo de uso</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Hobby', price: '$5', desc: 'Ideal para side-projects y prototipos.', items: ['512MB RAM por servicio', 'Preview environments', 'SSL automático'] },
              { name: 'Pro', price: '$20', desc: 'Para equipos en producción.', items: ['Hasta 32GB RAM', 'Réplicas multi-región', 'Soporte prioritario 24/7'], highlight: true },
              { name: 'Enterprise', price: 'Custom', desc: 'Infraestructura dedicada y SLA.', items: ['VPC Peering & PrivateLink', 'SOC2 & HIPAA BAA', 'Account Manager dedicado'] },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-7 border ${
                  tier.highlight ? 'bg-violet-950/30 border-violet-500 shadow-xl shadow-violet-500/10' : 'bg-[#121521] border-white/10'
                }`}
              >
                <div className="text-xs text-violet-400 uppercase font-semibold mb-2">{tier.name}</div>
                <div className="text-4xl font-extrabold mb-2">{tier.price}<span className="text-sm font-normal text-slate-400">/mes</span></div>
                <p className="text-sm text-slate-400 mb-6">{tier.desc}</p>
                <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                  {tier.items.map((it) => (
                    <li key={it} className="flex items-center gap-2">
                      <span className="text-emerald-400">&#10003;</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-semibold text-sm ${tier.highlight ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
                  Seleccionar {tier.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-14 px-6 bg-[#08090f]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-bold text-white mb-3">Kestrel Cloud</div>
              <p className="text-xs text-slate-500 leading-relaxed">Infraestructura moderna para equipos de ingeniería que valoran su tiempo.</p>
            </div>
            <div>
              <div className="font-semibold text-slate-300 mb-3">Producto</div>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Despliegues</li>
                <li>Bases de Datos</li>
                <li>Cron Jobs</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-300 mb-3">Recursos</div>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Documentación</li>
                <li>Estado del servicio</li>
                <li>Changelog</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-300 mb-3">Legal</div>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Privacidad</li>
                <li>Términos de uso</li>
                <li>Seguridad</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </DemoWrapper>
  );
};
