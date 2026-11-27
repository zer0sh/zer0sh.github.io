import React, { useState, useEffect } from 'react';
import { DemoWrapper } from '../DemoWrapper';

export const ForgeConfDemo = () => {
  const [selectedDay, setSelectedDay] = useState('day1');
  const [roomFilter, setRoomFilter] = useState('Todos');
  const [savedTalks, setSavedTalks] = useState(['Keynote: El futuro de la web compilada']);
  const [secondsLeft, setSecondsLeft] = useState(412840);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const schedules = {
    day1: [
      { time: '09:30', title: 'Keynote: El futuro de la web compilada', speaker: 'Marcus Chen', room: 'Main Hall' },
      { time: '11:15', title: 'Arquitecturas Local-First en producción', speaker: 'Sofia Lindqvist', room: 'Track A' },
      { time: '14:00', title: 'Animaciones declarativas sin sacrificar LCP', speaker: 'Devon Brooks', room: 'Main Hall' },
      { time: '16:30', title: 'Edge Streaming a escala global', speaker: 'Elena Vance', room: 'Track B' },
    ],
    day2: [
      { time: '10:00', title: 'Sub-50ms Desktop Sync con CRDTs', speaker: 'Nadia Patel', room: 'Main Hall' },
      { time: '12:00', title: 'Rust Tooling para bundlers de nueva generación', speaker: 'Lucas Meyer', room: 'Track A' },
      { time: '15:00', title: 'Panel: Ingeniería de Producto en 2026', speaker: 'Todos los Speakers', room: 'Main Hall' },
    ],
  };

  const toggleSave = (title) => {
    setSavedTalks((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  };

  const visibleTalks = schedules[selectedDay].filter((s) => roomFilter === 'Todos' || s.room === roomFilter);

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#120e1e] text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-8">
            <div className="font-black text-2xl tracking-tighter uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
              FORGE<span className="text-[#ff4d4d]">CONF</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
              <button onClick={() => scrollTo('forge-speakers')} className="px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer">Speakers</button>
              <button onClick={() => scrollTo('forge-agenda')} className="px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer">Agenda ({savedTalks.length})</button>
              <button onClick={() => scrollTo('forge-workshops')} className="px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer">Workshops</button>
              <button onClick={() => scrollTo('forge-venue')} className="px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer">Sede Austin</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold">
              Últimos 42 pases
            </span>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Comprar Entradas
            </button>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 text-[#ff4d4d] text-xs font-bold uppercase tracking-wider mb-6">
                <span>14–16 Octubre 2026 · Austin, TX</span>
                <span className="text-amber-300 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {days}d {String(hours).padStart(2, '0')}h {String(mins).padStart(2, '0')}m {String(secs).padStart(2, '0')}s
                </span>
              </div>
              <h1
                className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.92] mb-6"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Build The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] to-amber-400">
                  Next Web.
                </span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl">
                Tres días de charlas técnicas profundas, workshops en vivo y networking con más de 1,200 ingenieros de software y creadores de producto.
              </p>
            </div>

            {/* VIP 3D Pass Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#2a1b3d] via-[#1c162d] to-[#3b1525] border border-[#ff4d4d]/40 p-7 shadow-2xl hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">VIP ALL-ACCESS PASS</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff4d4d] text-white text-[10px] font-bold">2026</span>
                </div>
                <div className="text-2xl font-black mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>FORGECONF AUSTIN</div>
                <div className="text-xs text-slate-400 mb-8">3 Días · 24 Charlas · 6 Workshops</div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-300">Early Bird</span>
                  <span className="text-lg font-black text-[#ff4d4d]">$349 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speakers Grid */}
          <h2 id="forge-speakers" className="text-3xl font-black tracking-tight mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>Speakers Confirmados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[
              { name: 'Elena Vance', role: 'Staff Engineer en Vercel', talk: 'Edge Streaming at Scale', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
              { name: 'Marcus Chen', role: 'Creador de VoltJS', talk: 'Zero-Runtime Reactivity', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
              { name: 'Sofia Lindqvist', role: 'Principal Architect', talk: 'Distributed SQLite', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
              { name: 'Devon Brooks', role: 'Design Systems Lead', talk: '60fps Motion Systems', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
              { name: 'Nadia Patel', role: 'VP Infra en Raycast', talk: 'Sub-50ms Desktop Sync', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
              { name: 'Lucas Meyer', role: 'Core Maintainer', talk: 'Rust Tooling for JS', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
            ].map((sp) => (
              <div key={sp.name} className="group bg-[#1c162d] rounded-2xl border border-white/10 overflow-hidden hover:border-[#ff4d4d]/60 transition-all shadow-lg">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={sp.img}
                    alt={sp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c162d] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="font-bold text-xl">{sp.name}</div>
                  <div className="text-xs font-semibold text-amber-400 mt-1">{sp.role}</div>
                  <div className="text-sm text-slate-300 mt-3 pt-3 border-t border-white/10">“{sp.talk}”</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filterable Schedule with Bookmarking */}
          <div id="forge-agenda" className="bg-[#1c162d] rounded-3xl border border-white/10 p-6 sm:p-8 mb-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Agenda del Evento</h2>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Main Hall', 'Track A', 'Track B'].map((rm) => (
                  <button
                    key={rm}
                    onClick={() => setRoomFilter(rm)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      roomFilter === rm ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    {rm}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedDay('day1')}
                  className={`px-4 py-1 rounded-full text-xs font-bold ${selectedDay === 'day1' ? 'bg-[#ff4d4d] text-white' : 'bg-white/10 text-slate-300'}`}
                >
                  Día 1
                </button>
                <button
                  onClick={() => setSelectedDay('day2')}
                  className={`px-4 py-1 rounded-full text-xs font-bold ${selectedDay === 'day2' ? 'bg-[#ff4d4d] text-white' : 'bg-white/10 text-slate-300'}`}
                >
                  Día 2
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/10 text-sm">
              {visibleTalks.map((slot) => {
                const isSaved = savedTalks.includes(slot.title);
                return (
                  <div key={slot.time} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[#ff4d4d] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{slot.time}</span>
                      <span className="font-semibold text-white">{slot.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{slot.speaker}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-amber-300">{slot.room}</span>
                      <button
                        onClick={() => toggleSave(slot.title)}
                        className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                          isSaved ? 'bg-[#ff4d4d] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {isSaved ? '★ Guardada' : '☆ Guardar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Workshops Prácticos */}
          <div id="forge-workshops" className="mb-20">
            <h2 className="text-3xl font-black tracking-tight mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>Workshops Prácticos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Zero-Runtime CSS & Design Tokens', instructor: 'Devon Brooks', seats: '8 cupos' },
                { title: 'Distributed SQLite & Local-First Sync', instructor: 'Sofia Lindqvist', seats: '5 cupos' },
                { title: 'Rust WebAssembly para Apps Web', instructor: 'Lucas Meyer', seats: '12 cupos' },
              ].map((ws) => (
                <div key={ws.title} className="rounded-3xl bg-[#1c162d] border border-white/10 p-7 flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-bold">{ws.seats}</span>
                    <h3 className="text-xl font-bold mt-4 mb-2">{ws.title}</h3>
                    <p className="text-xs text-slate-400 mb-6">Con {ws.instructor} · 4 horas de código en vivo</p>
                  </div>
                  <button onClick={() => setIsTicketModalOpen(true)} className="w-full py-2.5 rounded-full bg-white/10 hover:bg-[#ff4d4d] text-xs font-bold uppercase tracking-wider transition-colors">
                    Reservar Cupo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Austin Experience */}
          <div id="forge-venue" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#1c162d] rounded-3xl border border-white/10 p-6 sm:p-10 mb-20">
            <div className="lg:col-span-6">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">La Sede</span>
              <h2 className="text-3xl font-black mt-2 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Austin Convention Center</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                En el corazón del distrito tecnológico de Austin. Salas equipadas con audio espacial, zonas de coworking, barra de café de especialidad y afterparties junto al río.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="px-3 py-1.5 rounded-full bg-white/10">Wi-Fi 10Gbps Dedicado</span>
                <span className="px-3 py-1.5 rounded-full bg-white/10">Almuerzo & Café Incluido</span>
                <span className="px-3 py-1.5 rounded-full bg-white/10">Traducción Simultánea</span>
              </div>
            </div>
            <div className="lg:col-span-6">
              <img
                src="https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=900&q=80"
                alt="Austin Skyline"
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>
          </div>
        </section>

        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsTicketModalOpen(false)}>
            <div className="bg-[#1c162d] border border-white/15 rounded-3xl max-w-md w-full p-7" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-black mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Reservar Pase ForgeConf 2026</h3>
              <p className="text-xs text-slate-300 mb-5">Selecciona tu modalidad de entrada para Austin, TX.</p>
              <div className="space-y-3 mb-6 text-sm">
                <div className="p-3.5 rounded-2xl border border-[#ff4d4d] bg-[#ff4d4d]/10 flex justify-between">
                  <span className="font-bold">Full Pass + Workshops</span>
                  <span className="font-black">$599</span>
                </div>
                <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 flex justify-between">
                  <span className="font-bold">Early Bird (3 Días)</span>
                  <span className="font-black">$349</span>
                </div>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="w-full py-3 rounded-full bg-[#ff4d4d] text-white font-bold text-xs uppercase tracking-wider">
                Confirmar Selección
              </button>
            </div>
          </div>
        )}

        <footer className="border-t border-white/10 py-14 px-6 bg-[#0c0914]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="font-black text-base text-white">FORGE<span className="text-[#ff4d4d]">CONF</span> 2026</div>
            <div className="flex gap-6">
              <span>Austin Convention Center</span>
              <span>Código de Conducta</span>
              <span>Sponsors</span>
            </div>
          </div>
        </footer>
      </div>
    </DemoWrapper>
  );
};
