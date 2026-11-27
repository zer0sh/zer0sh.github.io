import React, { useState, useEffect } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const MISSIONS = [
  {
    id: 'europa',
    code: 'MSN-01',
    name: 'Europa Clipper-X',
    target: 'Luna Europa · Júpiter',
    status: 'EN TRÁNSITO',
    distance: '4.2 AU',
    velocity: '34.8 km/s',
    latency: '38 min',
    summary:
      'Sonda de reconocimiento subglacial equipada con radar de penetración de hielo y espectrómetro de masa de alta resolución.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mars',
    code: 'MSN-02',
    name: 'Mars Sample Relay',
    target: 'Cráter Jezero · Marte',
    status: 'EN ÓRBITA',
    distance: '1.5 AU',
    velocity: '24.1 km/s',
    latency: '12 min',
    summary:
      'Satélite de enlace óptico láser y vehículo de retorno autónomo para cápsulas geológicas marcianas.',
    img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'titan',
    code: 'MSN-03',
    name: 'Titan Drone Pathfinder',
    target: 'Titán · Saturno',
    status: 'FASE II',
    distance: '9.5 AU',
    velocity: '41.2 km/s',
    latency: '79 min',
    summary:
      'Octocóptero nuclear autónomo diseñado para volar sobre los lagos de metano líquido y analizar química prebiótica.',
    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80',
  },
];

export const AetherisDemo = () => {
  const [selectedMissionId, setSelectedMissionId] = useState('europa');
  const [feedMode, setFeedMode] = useState('optical');
  const [countdown, setCountdown] = useState(15502);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openWikiIdx, setOpenWikiIdx] = useState(0);

  const wikiItems = [
    {
      tag: 'PROPULSIÓN',
      q: '¿Qué es el Impulso Específico (Isp) en motores iónicos de xenón?',
      a: 'El Isp mide la eficiencia de un propulsor espacial en segundos. Mientras un cohete químico alcanza ~450 s, nuestros propulsores de efecto Hall superan los 4,200 s, permitiendo misiones interplanetarias con una fracción del combustible tradicional.',
    },
    {
      tag: 'MECÁNICA ORBITAL',
      q: '¿Cómo funciona una órbita de transferencia de Hohmann?',
      a: 'Es la maniobra orbital más eficiente en energía para trasladar una nave entre dos órbitas circulares coplanares usando dos encendidos de motor: uno para entrar en la elipse de transferencia y otro para circularizar en el planeta destino.',
    },
    {
      tag: 'COMUNICACIONES',
      q: '¿Por qué usar enlace óptico láser de 1,550 nm en lugar de banda Ka?',
      a: 'El láser infrarrojo concentra el haz con una divergencia 40 veces menor que las ondas de radio, multiplicando por 10 el ancho de banda desde Marte o el cinturón de asteroides con antenas receptoras más compactas.',
    },
    {
      tag: 'NAVEGACIÓN AUTÓNOMA',
      q: '¿Cómo navega un rover a 120 FPS sin GPS en Europa o Marte?',
      a: 'Mediante SLAM visual-inercial: cámaras estéreo de alto rango dinámico triangulan cráteres y rocas en tiempo real sobre hardware resistente a radiación, evitando obstáculos sin esperar comandos desde la Tierra.',
    },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 15502)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(countdown / 3600)).padStart(2, '0');
  const m = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0');
  const s = String(countdown % 60).padStart(2, '0');

  const activeMission = MISSIONS.find((mis) => mis.id === selectedMissionId) || MISSIONS[0];

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#050811] text-white overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Live Deep Space Network Ticker */}
        <div
          className="bg-[#0a1122] border-b border-sky-500/20 py-2 px-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-sky-300 tabular-nums"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DSN GOLDSTONE-70M: ENLACE ACTIVO</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-400">
            <span>SOL 1,428 · JEZERO</span>
            <span>DOWNLINK: 1.24 GBPS</span>
            <span className="text-red-400 font-semibold">T-MINUS {h}:{m}:{s} LAUNCH WINDOW</span>
          </div>
        </div>

        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-[#050811]/85">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="font-bold tracking-wider text-sm flex items-center gap-2.5" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse inline-block" />
                <span>AETHERIS AEROSPACE</span>
              </div>
              <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-slate-400">
                <button onClick={() => scrollTo('ae-misiones')} className="hover:text-white cursor-pointer">Misiones</button>
                <button onClick={() => scrollTo('ae-propulsion')} className="hover:text-white cursor-pointer">Propulsión</button>
                <button onClick={() => scrollTo('ae-rovers')} className="hover:text-white cursor-pointer">Rovers</button>
                <button onClick={() => scrollTo('ae-publicaciones')} className="hover:text-white cursor-pointer">Publicaciones</button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Telemetría en vivo
              </span>
              <button
                onClick={() => setDrawerOpen(true)}
                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Centro de Misión
              </button>
            </div>
          </div>
        </header>

        {/* Interactive Mission Hero */}
        <section id="ae-misiones" className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full border border-sky-500/10 pointer-events-none animate-[spin_45s_linear_infinite]" />
          <div className="absolute -top-12 -right-12 w-[380px] h-[380px] rounded-full border border-red-500/10 pointer-events-none animate-[spin_30s_linear_infinite_reverse]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 relative z-10">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{activeMission.code} · {activeMission.target}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.02] mb-5" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                {activeMission.name}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                {activeMission.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {MISSIONS.map((mis) => (
                  <button
                    key={mis.id}
                    onClick={() => setSelectedMissionId(mis.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedMissionId === mis.id
                        ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:border-sky-400/50'
                    }`}
                  >
                    {mis.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-bold text-white">{activeMission.distance}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Distancia</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-bold text-sky-400">{activeMission.velocity}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Velocidad</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">{activeMission.latency}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Latencia Señal</div>
                </div>
              </div>
            </div>

            {/* Dual-Mode Optical / Trajectory Card */}
            <div className="lg:col-span-6">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setFeedMode('optical')}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold ${feedMode === 'optical' ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-slate-300'}`}
                >
                  Feed Óptico
                </button>
                <button
                  onClick={() => setFeedMode('trajectory')}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold ${feedMode === 'trajectory' ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-slate-300'}`}
                >
                  Trayectoria SVG
                </button>
              </div>
              <div className="rounded-3xl overflow-hidden border border-sky-500/25 bg-[#0a1020] p-2.5 shadow-2xl shadow-sky-950/50 relative group">
                {feedMode === 'optical' ? (
                  <img
                    src={activeMission.img}
                    alt={activeMission.name}
                    className="w-full h-[350px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-[350px] rounded-2xl bg-[#060913] flex items-center justify-center p-6">
                    <svg viewBox="0 0 400 220" className="w-full h-full">
                      <ellipse cx="200" cy="110" rx="160" ry="75" fill="none" stroke="rgba(56,189,248,0.25)" strokeDasharray="4 4" />
                      <ellipse cx="200" cy="110" rx="95" ry="45" fill="none" stroke="rgba(239,68,68,0.3)" />
                      <circle cx="200" cy="110" r="14" fill="#f59e0b" />
                      <circle cx="105" cy="110" r="6" fill="#38bdf8" />
                      <circle cx="360" cy="110" r="7" fill="#ef4444" className="animate-pulse" />
                      <text x="105" y="132" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="IBM Plex Mono">TIERRA</text>
                      <text x="360" y="132" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="IBM Plex Mono">{activeMission.code}</text>
                    </svg>
                  </div>
                )}
                <div className="p-4 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{activeMission.name} — {feedMode === 'optical' ? 'Feed Óptico' : 'Órbita Hohmann'}</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {activeMission.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Divisions */}
          <div id="ae-propulsion" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 border-t border-white/10 pt-14 mb-16">
            {[
              { title: 'Propulsión Iónica', desc: 'Motores de xenón de alto impulso específico para trayectorias interplanetarias.', metric: '4,200 s Isp' },
              { title: 'Rovers Autónomos', desc: 'Navegación visual sin GPS sobre terrenos rocosos y cráteres lunares.', metric: '120 FPS SLAM' },
              { title: 'Enlace Óptico', desc: 'Transmisión láser de 10 Gbps desde el cinturón de asteroides.', metric: '1,550 nm Láser' },
              { title: 'Sensores Criogénicos', desc: 'Espectrómetros operando a 4 Kelvin para detectar trazas de agua.', metric: '4.0 K Estables' },
            ].map((div) => (
              <div key={div.title} className="rounded-2xl bg-[#0b1121] border border-white/10 hover:border-sky-500/40 p-6 transition-all hover:-translate-y-1">
                <div className="text-xs text-sky-400 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{div.metric}</div>
                <h3 className="font-bold text-base mb-2 text-white">{div.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{div.desc}</p>
              </div>
            ))}
          </div>

          {/* Autonomous Rovers Fleet */}
          <div id="ae-rovers" className="border-t border-white/10 pt-14 mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>Flota de Rovers Planetarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Nomad Mk-IV', mass: '890 kg', power: 'MMRTG Nuclear', terrain: 'Regolito Lunar' },
                { name: 'Helios Scout', mass: '140 kg', power: 'Solar + Li-S', terrain: 'Dunas Marcianas' },
                { name: 'Cryo-Mole V2', mass: '320 kg', power: 'Térmico Láser', terrain: 'Hielo Europa' },
              ].map((rv) => (
                <div key={rv.name} className="rounded-2xl bg-[#0b1121] border border-white/10 p-6 space-y-3">
                  <div className="font-bold text-lg text-white">{rv.name}</div>
                  <div className="text-xs text-sky-400 font-mono">{rv.terrain}</div>
                  <div className="pt-3 border-t border-white/10 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Masa: {rv.mass}</span>
                    <span>{rv.power}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Launch & Reports */}
          <div id="ae-publicaciones" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-t border-white/10 pt-16">
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/10 relative group">
                <img
                  src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=900&q=80"
                  alt="Rocket Launch"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#050811]/85 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-red-400 font-bold uppercase">Próximo Lanzamiento</div>
                    <div className="text-sm font-bold">Vehículo Heavy-Lift Aether IX</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">Pad 39A</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <span className="text-xs text-red-500 font-semibold uppercase tracking-widest">Publicaciones Recientes</span>
              <h2 className="text-3xl font-bold mt-2 mb-6" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>Reportes de Ingeniería Aeroespacial</h2>
              <div className="space-y-4">
                {[
                  { date: 'Nov 2026', title: 'Reducción del 34% en masa térmica para escudos de reentrada' },
                  { date: 'Oct 2026', title: 'Pruebas en cámara de vacío del propulsor de xenón X-9' },
                  { date: 'Sep 2026', title: 'Sincronización óptica láser a 400 millones de kilómetros' },
                ].map((pub) => (
                  <div key={pub.title} className="p-4 rounded-2xl bg-[#0b1121] border border-white/10 hover:border-sky-500/40 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-medium text-slate-200">{pub.title}</span>
                    <span className="text-xs text-sky-400 shrink-0 font-semibold">{pub.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Aerospace Concepts Wiki & Q&A Toggle */}
          <div className="border-t border-white/10 pt-16 mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs text-sky-400 font-semibold uppercase tracking-widest">Base de Conocimiento</span>
                <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                  Wiki de Conceptos &amp; Preguntas Frecuentes
                </h2>
              </div>
              <span className="text-xs text-slate-400" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {wikiItems.length} ARTÍCULOS TÉCNICOS
              </span>
            </div>
            <div className="space-y-3">
              {wikiItems.map((item, idx) => {
                const isOpen = openWikiIdx === idx;
                return (
                  <div key={item.q} className="rounded-2xl bg-[#0b1121] border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenWikiIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          {item.tag}
                        </span>
                        <span className="font-bold text-sm sm:text-base text-white">{item.q}</span>
                      </div>
                      <span className="text-sky-400 font-mono text-lg shrink-0">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/5">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end" onClick={() => setDrawerOpen(false)}>
            <div className="w-full max-w-md bg-[#0b1121] border-l border-white/15 p-7 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>Centro de Misión</h3>
                <button onClick={() => setDrawerOpen(false)} className="text-xs text-slate-400 hover:text-white">Cerrar ✕</button>
              </div>
              <div className="space-y-3 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between"><span>PROPULSIÓN XENÓN</span><span className="text-emerald-400">NOMINAL</span></div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between"><span>ESCUDO TÉRMICO</span><span className="text-emerald-400">100%</span></div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between"><span>ENLACE LÁSER</span><span className="text-sky-400">1.24 GBPS</span></div>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-white/10 py-12 px-6 text-center text-xs text-slate-500">
          Aetheris Aerospace Laboratory · Pasadena, California · Deep Space Exploration
        </footer>
      </div>
    </DemoWrapper>
  );
};
