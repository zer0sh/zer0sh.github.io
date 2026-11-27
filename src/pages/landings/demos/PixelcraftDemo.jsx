import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const PROJECTS = [
  { title: 'Kroma Design OS', cat: 'SaaS', label: 'Producto SaaS · Design System', year: '2026', impact: '+42% retención', badge: 'bg-pink-100 text-pink-700', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80' },
  { title: 'Momo Spatial Audio', cat: 'Branding', label: 'Branding · App Móvil', year: '2026', impact: '4.9★ App Store', badge: 'bg-amber-100 text-amber-800', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80' },
  { title: 'Looma Editorial', cat: 'Web / 3D', label: 'Web Interactiva · Tipografía', year: '2025', impact: '100/100 Lighthouse', badge: 'bg-sky-100 text-sky-800', img: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80' },
  { title: 'Veloce Mobility', cat: 'Web / 3D', label: 'E-Commerce · Configurador 3D', year: '2025', impact: '2.8x conversión', badge: 'bg-emerald-100 text-emerald-800', img: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80' },
];

export const PixelcraftDemo = () => {
  const [filter, setFilter] = useState('Todos');
  const [activeProcess, setActiveProcess] = useState(0);
  const [labTheme, setLabTheme] = useState('pink');
  const [labRadius, setLabRadius] = useState(24);
  const [labTilt, setLabTilt] = useState(0);
  const [labSurface, setLabSurface] = useState('solid');
  const [labFont, setLabFont] = useState('bricolage');
  const [labLikes, setLabLikes] = useState(128);
  const [selectedProj, setSelectedProj] = useState(null);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefSent, setBriefSent] = useState(false);
  const [briefType, setBriefType] = useState('Producto SaaS');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // 4 Extra Interactive Lab Widgets State
  const [deployBtnState, setDeployBtnState] = useState('idle');
  const [toggles, setToggles] = useState({ turbo: true, haptics: false, grid: true });
  const [activeHex, setActiveHex] = useState('#EC4899');
  const [copiedHex, setCopiedHex] = useState(false);
  const [miniTilt, setMiniTilt] = useState({ x: 0, y: 0 });

  const fontFamilies = {
    bricolage: "'Bricolage Grotesque', sans-serif",
    serif: "'Instrument Serif', serif",
    mono: "'JetBrains Mono', monospace",
  };

  const visibleProjects = PROJECTS.filter((p) => filter === 'Todos' || p.cat === filter);

  const processSteps = [
    { title: 'Inmersión', desc: 'Entendemos tu mercado, tus usuarios y lo que hace único a tu producto.', deliverable: 'Blueprint de Producto + Mapa de Flujos', bg: 'bg-amber-100', tag: '01' },
    { title: 'Prototipado', desc: 'Validamos flujos y micro-interacciones reales desde la primera semana.', deliverable: 'Prototipo Interactivo a 60fps', bg: 'bg-pink-100', tag: '02' },
    { title: 'Artesanía UI', desc: 'Cada píxel, transición y estado hover se pule hasta sentirse natural.', deliverable: 'Design System + Tokens Figma', bg: 'bg-sky-100', tag: '03' },
    { title: 'Lanzamiento', desc: 'Código limpio en React/Next.js listo para escalar a millones de visitas.', deliverable: 'Repo Producción · Lighthouse 100/100', bg: 'bg-emerald-100', tag: '04' },
  ];

  const themeColors = {
    pink: 'bg-pink-500 text-white',
    lime: 'bg-lime-400 text-slate-900',
    sky: 'bg-sky-500 text-white',
  };

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#faf9f6] text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-black text-xl tracking-tight flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              <span className="w-4 h-4 rounded-full bg-pink-500 inline-block" />
              <span>pixelcraft.</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button onClick={() => scrollTo('pc-trabajo')} className="px-3.5 py-1.5 rounded-full hover:bg-slate-200/60 hover:text-slate-900 cursor-pointer flex items-center gap-1.5">
                Trabajo <span className="px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">14</span>
              </button>
              <button onClick={() => scrollTo('pc-servicios')} className="px-3.5 py-1.5 rounded-full hover:bg-slate-200/60 hover:text-slate-900 cursor-pointer">Servicios</button>
              <button onClick={() => scrollTo('pc-proceso')} className="px-3.5 py-1.5 rounded-full hover:bg-slate-200/60 hover:text-slate-900 cursor-pointer">Proceso</button>
              <button onClick={() => scrollTo('pc-laboratorio')} className="px-3.5 py-1.5 rounded-full hover:bg-slate-200/60 hover:text-slate-900 cursor-pointer">Laboratorio</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Disponible Q2 2026
            </span>
            <button
              onClick={() => { setBriefOpen(true); setBriefSent(false); }}
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              Hablemos
            </button>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-5">
              Estudio de Producto Digital
            </span>
            <h1
              className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.98] mb-6"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Diseñamos software que se siente{' '}
              <span className="text-pink-600 italic font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                mágico.
              </span>
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
              Combinamos ingeniería frontend obsesiva con diseño lúdico para crear marcas, apps y sitios web memorables.
            </p>
          </div>

          {/* Filterable Portfolio Grid */}
          <div id="pc-trabajo" className="flex flex-wrap items-center gap-2 mb-8">
            {['Todos', 'SaaS', 'Branding', 'Web / 3D'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  filter === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-20">
            {visibleProjects.map((proj) => (
              <div
                key={proj.title}
                onClick={() => setSelectedProj(proj)}
                className="group cursor-pointer rounded-[2rem] overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{proj.title}</h3>
                    <p className="text-sm text-slate-500">{proj.label}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${proj.badge} text-xs font-bold`}>{proj.impact}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Services Section */}
          <div id="pc-servicios" className="mb-20">
            <h2 className="text-3xl font-black tracking-tight mb-8" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Servicios & Modalidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Product Sprint', time: '2–4 Semanas', desc: 'De idea a prototipo interactivo o rediseño completo de landing + sistema visual.' },
                { name: 'Design System & UI', time: '4–8 Semanas', desc: 'Librería de componentes en React + Figma Tokens listos para tu equipo.' },
                { name: 'Partner Mensual', time: 'Retainer', desc: 'Equipo senior integrado en tu Slack ejecutando mejoras continuas cada semana.' },
              ].map((srv) => (
                <div key={srv.name} className="rounded-[2rem] bg-white border border-slate-200 p-7 flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">{srv.time}</span>
                    <h3 className="text-xl font-black mt-4 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{srv.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Process Explorer */}
          <div id="pc-proceso" className="mb-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Nuestro Proceso Creativo
              </h2>
              <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold">
                Entregable: {processSteps[activeProcess].deliverable}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {processSteps.map((card, idx) => (
                <button
                  key={card.title}
                  onClick={() => setActiveProcess(idx)}
                  className={`text-left ${card.bg} rounded-[2rem] p-7 border-2 transition-all duration-300 ${
                    activeProcess === idx ? 'border-slate-900 -translate-y-2 shadow-lg' : 'border-transparent hover:-translate-y-1'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-500">{card.tag}</span>
                  <h3 className="text-xl font-extrabold mt-3 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{card.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{card.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Frontend Craft Sandbox */}
          <div id="pc-laboratorio" className="rounded-[2.5rem] bg-white border border-slate-200 p-8 sm:p-10 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">Laboratorio UI</span>
              <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Prueba nuestra obsesión por el detalle
              </h2>

              {/* Color Theme Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'pink', label: 'Candy Pink', dot: 'bg-pink-500' },
                  { id: 'lime', label: 'Acid Lime', dot: 'bg-lime-400' },
                  { id: 'sky', label: 'Electric Sky', dot: 'bg-sky-500' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLabTheme(t.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-2 transition-all ${
                      labTheme === t.id ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Surface & Font Switcher */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full w-fit">
                  {[
                    { id: 'solid', label: 'Sólido' },
                    { id: 'brutal', label: 'Neo-Brutal' },
                    { id: 'glass', label: 'Soft Shadow' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setLabSurface(s.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        labSurface === s.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full w-fit">
                  {[
                    { id: 'bricolage', label: 'Display' },
                    { id: 'serif', label: 'Editorial' },
                    { id: 'mono', label: 'Mono' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLabFont(f.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        labFont === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Styled Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold">Border Radius</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-900 tabular-nums">{labRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="36"
                    value={labRadius}
                    onChange={(e) => setLabRadius(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #ec4899 ${((labRadius - 4) / 32) * 100}%, #e2e8f0 ${((labRadius - 4) / 32) * 100}%)`,
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold">Inclinación 2D</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-900 tabular-nums">{labTilt}°</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    value={labTilt}
                    onChange={(e) => setLabTilt(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 ${((labTilt + 6) / 12) * 100}%, #e2e8f0 ${((labTilt + 6) / 12) * 100}%)`,
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div
                style={{ borderRadius: `${labRadius}px`, transform: `rotate(${labTilt}deg)` }}
                className={`w-full max-w-sm p-8 transition-all duration-200 ${themeColors[labTheme]} ${
                  labSurface === 'brutal'
                    ? 'border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a]'
                    : labSurface === 'glass'
                    ? 'shadow-[0_24px_50px_-12px_rgba(236,72,153,0.45)]'
                    : 'shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Live Token Preview</span>
                  <button
                    onClick={() => setLabLikes((n) => n + 1)}
                    className="px-3 py-1 rounded-full bg-black/15 hover:bg-black/25 text-xs font-bold transition-transform active:scale-90"
                  >
                    ♥ {labLikes}
                  </button>
                </div>
                <div className="text-2xl font-black mb-3" style={{ fontFamily: fontFamilies[labFont] }}>Micro-interacción 60fps</div>
                <p className="text-sm opacity-90 mb-4">Componente vivo controlado por tokens de diseño.</p>
                <div className="text-[11px] font-mono opacity-80 bg-black/10 rounded-xl px-3 py-2">
                  radius: {labRadius}px · rotate: {labTilt}deg · {labSurface}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Extra Interactive Lab Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {/* Widget 1: Stateful Elastic Button */}
            <div className="rounded-[2rem] bg-white border border-slate-200 p-7 flex flex-col justify-between">
              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600">01 · Micro-Estado</span>
                <h3 className="text-xl font-black mt-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Botón con Ciclo de Vida</h3>
                <p className="text-xs text-slate-500 mt-1">Haz clic para simular la transición de estado en producción.</p>
              </div>
              <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <button
                  onClick={() => {
                    if (deployBtnState === 'idle') setDeployBtnState('loading');
                    else if (deployBtnState === 'loading') setDeployBtnState('done');
                    else setDeployBtnState('idle');
                  }}
                  className={`px-6 py-3 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    deployBtnState === 'idle'
                      ? 'bg-slate-900 text-white hover:bg-pink-600'
                      : deployBtnState === 'loading'
                      ? 'bg-amber-400 text-slate-900 animate-pulse'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {deployBtnState === 'idle' && 'Publicar Cambios →'}
                  {deployBtnState === 'loading' && 'Compilando Assets...'}
                  {deployBtnState === 'done' && '✓ Publicado en Edge'}
                </button>
                <span className="text-[11px] font-mono text-slate-400">state: {deployBtnState}</span>
              </div>
            </div>

            {/* Widget 2: Tactile Spring Toggles */}
            <div className="rounded-[2rem] bg-white border border-slate-200 p-7 flex flex-col justify-between">
              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">02 · Controles Táctiles</span>
                <h3 className="text-xl font-black mt-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Switches con Física Spring</h3>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'turbo', label: 'Aceleración GPU 120Hz' },
                  { key: 'haptics', label: 'Feedback Háptico Visual' },
                  { key: 'grid', label: 'Snapping a Grilla 8px' },
                ].map((item) => {
                  const on = toggles[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                      <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                      <button
                        onClick={() => setToggles((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${on ? 'bg-slate-900' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget 3: Live Swatch & Contrast Picker */}
            <div className="rounded-[2rem] bg-white border border-slate-200 p-7 flex flex-col justify-between">
              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">03 · Color Tokens</span>
                <h3 className="text-xl font-black mt-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Selector de Paleta & Contraste</h3>
              </div>
              <div className="flex items-center gap-2.5 mb-4">
                {['#EC4899', '#84CC16', '#0EA5E9', '#F59E0B', '#0F172A'].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => { setActiveHex(hex); setCopiedHex(false); }}
                    style={{ backgroundColor: hex }}
                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                      activeHex === hex ? 'border-slate-900 scale-110 shadow-md' : 'border-white'
                    }`}
                  />
                ))}
              </div>
              <div
                style={{ backgroundColor: activeHex }}
                className="rounded-2xl p-4 text-white flex items-center justify-between transition-colors duration-300"
              >
                <span className="font-mono text-xs font-bold bg-black/25 px-2.5 py-1 rounded-lg">{activeHex}</span>
                <button
                  onClick={() => setCopiedHex(true)}
                  className="text-xs font-bold bg-white text-slate-900 px-3 py-1 rounded-full"
                >
                  {copiedHex ? 'Copiado ✓' : 'Copiar Hex'}
                </button>
              </div>
            </div>

            {/* Widget 4: 3D Pointer Tilt Card */}
            <div className="rounded-[2rem] bg-white border border-slate-200 p-7 flex flex-col justify-between">
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">04 · Perspectiva 3D</span>
                <h3 className="text-xl font-black mt-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tarjeta Reactiva al Cursor</h3>
              </div>
              <div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
                  const y = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
                  setMiniTilt({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
                }}
                onMouseLeave={() => setMiniTilt({ x: 0, y: 0 })}
                style={{ transform: `perspective(600px) rotateX(${miniTilt.x}deg) rotateY(${miniTilt.y}deg)` }}
                className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-pink-900 text-white p-6 transition-transform duration-100 cursor-crosshair select-none"
              >
                <div className="text-xs text-pink-300 font-mono mb-2">Mueve el cursor aquí</div>
                <div className="font-bold text-lg mb-1">3D Tilt Engine</div>
                <div className="text-[11px] font-mono text-slate-300">
                  rotateX({miniTilt.x}deg) · rotateY({miniTilt.y}deg)
                </div>
              </div>
            </div>
          </div>

          {/* Client Love */}
          <div className="rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-14 text-center mb-16">
            <p className="italic text-2xl sm:text-4xl max-w-3xl mx-auto leading-snug mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
              “Pixelcraft transformó nuestra herramienta técnica en un producto que nuestros clientes disfrutan abrir cada mañana.”
            </p>
            <div className="text-sm font-semibold text-pink-400">Clara Mendoza — Co-founder en Kroma OS</div>
          </div>

          {/* Discovery Call CTA */}
          <div className="rounded-[2.5rem] bg-gradient-to-r from-pink-100 via-amber-50 to-sky-100 p-10 sm:p-14 text-center border border-slate-200">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              ¿Tienes una idea ambiciosa?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-8">
              Abrimos 2 espacios por trimestre para nuevos lanzamientos y rediseños completos.
            </p>
            <button
              onClick={() => { setBriefOpen(true); setBriefSent(false); }}
              className="px-8 py-4 rounded-full bg-slate-900 hover:bg-pink-600 text-white font-bold text-sm transition-colors"
            >
              Reservar Llamada de Descubrimiento
            </button>
          </div>
        </section>

        {/* Project Brief Modal */}
        {briefOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBriefOpen(false)}>
            <div className="bg-white rounded-[2rem] max-w-md w-full p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Cuéntanos sobre tu proyecto</h3>
              {briefSent ? (
                <div className="py-6 text-center space-y-3">
                  <div className="text-emerald-600 font-bold text-lg">✓ ¡Brief recibido!</div>
                  <p className="text-xs text-slate-500">Te responderemos en menos de 24 horas con disponibilidad para {briefType}.</p>
                  <button onClick={() => setBriefOpen(false)} className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold">Cerrar</button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {['Producto SaaS', 'Web Interactiva', 'Design System'].map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setBriefType(tp)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          briefType === tp ? 'bg-pink-600 text-white border-pink-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                  <input type="email" placeholder="tu@correo.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-pink-500" />
                  <button onClick={() => setBriefSent(true)} className="w-full py-3 rounded-full bg-slate-900 hover:bg-pink-600 text-white font-bold text-sm transition-colors">
                    Enviar Brief &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedProj && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProj(null)}>
            <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <img src={selectedProj.img} alt={selectedProj.title} className="w-full h-56 object-cover" />
              <div className="p-7">
                <div className="text-xs font-bold text-pink-600 uppercase mb-1">{selectedProj.cat} · {selectedProj.year}</div>
                <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{selectedProj.title}</h3>
                <p className="text-sm text-slate-600 mb-5">Impacto medido en producción: <strong className="text-slate-900">{selectedProj.impact}</strong>.</p>
                <button onClick={() => setSelectedProj(null)} className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold">Cerrar</button>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-slate-200 py-14 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="font-black text-slate-900">pixelcraft.</div>
            <div className="flex gap-6 text-xs">
              <span>Madrid</span>
              <span>San Francisco</span>
              <span>hola@pixelcraft.studio</span>
            </div>
          </div>
        </footer>
      </div>
    </DemoWrapper>
  );
};
