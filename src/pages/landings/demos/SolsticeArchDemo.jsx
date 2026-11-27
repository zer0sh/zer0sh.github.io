import React, { useState, useEffect } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const GALLERY_ITEMS = [
  {
    name: 'Casa Monolito',
    meta: '2026 · Madrid',
    area: '840 m²',
    desc: 'Residencia unifamiliar articulada alrededor de un patio central de encinas y muros de hormigón visto.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Pabellón Kamo',
    meta: '2025 · Kyoto',
    area: '420 m²',
    desc: 'Estructura ligera en cedro japonés y vidrio templado con apertura total hacia el jardín de musgo.',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Villa Pedregal',
    meta: '2025 · CDMX',
    area: '1,120 m²',
    desc: 'Volúmenes en voladizo anclados sobre roca volcánica con iluminación cenital continua.',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Atrio del Norte',
    meta: '2024 · Oporto',
    area: '680 m²',
    desc: 'Rehabilitación de nave industrial convertida en galería de arte contemporáneo y estudio.',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  },
];

const LOCALE_COPY = {
  ES: {
    heroPre: 'Espacios en silencio,',
    heroEm: 'luz y concreto.',
    sub: 'Estudio de arquitectura residencial y pabellones culturales en Madrid, Kyoto y Ciudad de México.',
    worksTitle: 'Obras Seleccionadas',
  },
  EN: {
    heroPre: 'Spaces in silence,',
    heroEm: 'light and concrete.',
    sub: 'Residential architecture and cultural pavilions studio based in Madrid, Kyoto, and Mexico City.',
    worksTitle: 'Selected Works',
  },
  JP: {
    heroPre: '静寂の空間、',
    heroEm: '光とコンクリート。',
    sub: 'マドリード、京都、メキシコシティを拠点とする住宅建築および文化パビリオンのスタジオ。',
    worksTitle: '主な作品',
  },
};

export const SolsticeArchDemo = () => {
  const [locale, setLocale] = useState('ES');
  const [daylight, setDaylight] = useState('zenith');
  const [cityFilter, setCityFilter] = useState('Todas');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % GALLERY_ITEMS.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  const copy = LOCALE_COPY[locale];

  const themeBg =
    daylight === 'zenith'
      ? 'bg-[#f5f2eb] text-[#1c1b18]'
      : daylight === 'dusk'
      ? 'bg-[#ebe3d3] text-[#1c1b18]'
      : 'bg-[#171614] text-[#f5f2eb]';

  const works = [
    { name: 'Museo del Aire', city: 'Ciudad de México', year: '2026', area: '4,200 m²' },
    { name: 'Residencia Bruma', city: 'Oporto', year: '2025', area: '680 m²' },
    { name: 'Galería Horikawa', city: 'Kyoto', year: '2024', area: '1,150 m²' },
    { name: 'Casa Monolito', city: 'Madrid', year: '2026', area: '840 m²' },
  ].filter((w) => cityFilter === 'Todas' || w.city === cityFilter);

  return (
    <DemoWrapper>
      <div
        className={`min-h-screen transition-colors duration-500 ${themeBg}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-current/10">
          <div className="text-xs uppercase tracking-[0.25em] font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            SOLSTICE STUDIO
          </div>
          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest opacity-75">
            <button onClick={() => scrollTo('sol-obras')} className="hover:opacity-100 cursor-pointer">Obras (24)</button>
            <button onClick={() => scrollTo('sol-materialidad')} className="hover:opacity-100 cursor-pointer">Materialidad</button>
            <button onClick={() => scrollTo('sol-premios')} className="hover:opacity-100 cursor-pointer">Premios</button>
            <button onClick={() => scrollTo('sol-estudio')} className="hover:opacity-100 cursor-pointer">Estudio</button>
          </nav>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
            <div className="flex gap-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {['ES', 'EN', 'JP'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 transition-opacity ${locale === l ? 'font-bold underline underline-offset-4 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 border border-current hover:opacity-80 transition-opacity font-semibold">
              Contacto
            </button>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-16">
          {/* Daylight Simulator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-current/10 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span className="uppercase tracking-widest opacity-60">Simulador Solar · Luz Cenital</span>
            <div className="flex gap-2">
              {[
                { id: 'zenith', label: 'Cenit 13:00' },
                { id: 'dusk', label: 'Ocaso 18:45' },
                { id: 'night', label: 'Nocturno 22:00' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDaylight(d.id)}
                  className={`px-3 py-1.5 border transition-all ${
                    daylight === d.id ? 'border-current font-bold' : 'border-current/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-8">
              <h1 className="text-5xl sm:text-7xl font-light tracking-tight leading-[0.98]">
                {copy.heroPre} <br />
                <span className="font-semibold italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {copy.heroEm}
                </span>
              </h1>
            </div>
            <div className="lg:col-span-4 text-sm opacity-75 leading-relaxed">
              {copy.sub}
            </div>
          </div>

          <div id="sol-obras" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {GALLERY_ITEMS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => setLightboxIndex(idx)}
                className="text-left group overflow-hidden border border-current/10 cursor-pointer relative"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span
                    className="absolute top-4 right-4 px-3 py-1 bg-[#1c1b18]/80 text-[#f5f2eb] text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Ampliar &rarr;
                  </span>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <span className="font-semibold text-base">{p.name}</span>
                  <span className="text-xs opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{p.meta}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Philosophy */}
          <div id="sol-materialidad" className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-current/15 pt-14 mb-16">
            {[
              { title: 'Hormigón Visto', desc: 'Superficies honestas que envejecen con dignidad bajo la lluvia y el sol.' },
              { title: 'Madera de Cedro', desc: 'Calidez táctil que equilibra la sobriedad estructural de cada estancia.' },
              { title: 'Luz Cenital', desc: 'Aberturas calculadas según la trayectoria solar de cada latitud.' },
            ].map((mat) => (
              <div key={mat.title}>
                <h3 className="italic text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{mat.title}</h3>
                <p className="text-sm opacity-75 leading-relaxed">{mat.desc}</p>
              </div>
            ))}
          </div>

          {/* Filterable Selected Works Index */}
          <div className="border-t border-current/15 pt-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="text-xs uppercase tracking-widest opacity-60 font-semibold">{copy.worksTitle}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Todas', 'Madrid', 'Kyoto', 'Ciudad de México', 'Oporto'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`px-3 py-1 border transition-opacity ${
                      cityFilter === c ? 'border-current font-bold opacity-100' : 'border-current/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-current/10 text-sm">
              {works.map((w) => (
                <div key={w.name} className="py-4 flex items-center justify-between">
                  <span className="font-semibold">{w.name}</span>
                  <div className="flex items-center gap-8 text-xs opacity-60 tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    <span className="hidden sm:inline">{w.city}</span>
                    <span>{w.area}</span>
                    <span>{w.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Studios */}
          <div id="sol-premios" className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-current/15 pt-14">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-50 mb-4 font-semibold">Reconocimientos</div>
              <ul className="space-y-3 text-sm tabular-nums">
                <li className="flex justify-between"><span>Bienal de Arquitectura de Venecia</span><span className="opacity-60">2025</span></li>
                <li className="flex justify-between"><span>Premio Mies van der Rohe (Finalista)</span><span className="opacity-60">2024</span></li>
                <li className="flex justify-between"><span>ArchDaily Building of the Year</span><span className="opacity-60">2024</span></li>
              </ul>
            </div>
            <div id="sol-estudio" className="border border-current/15 p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest opacity-50 mb-2 font-semibold">Nuevos Encargos</div>
                <h3 className="italic text-3xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Conversemos sobre tu próximo espacio</h3>
                <p className="text-sm opacity-75 mb-6">Aceptamos proyectos residenciales, culturales y pabellones en Europa, América y Japón.</p>
              </div>
              <button className="self-start px-6 py-3 border border-current text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity">
                Solicitar Dossier
              </button>
            </div>
          </div>
        </section>

        {/* Lightbox Gallery Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-[#141311]/95 text-[#f5f2eb] backdrop-blur-md flex flex-col justify-between p-5 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs uppercase tracking-widest" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <span>0{lightboxIndex + 1} / 0{GALLERY_ITEMS.length} — {GALLERY_ITEMS[lightboxIndex].meta}</span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="px-4 py-2 border border-white/25 hover:bg-white hover:text-black transition-colors"
              >
                Cerrar [ESC]
              </button>
            </div>

            <div className="max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4" onClick={(e) => e.stopPropagation()}>
              <div className="lg:col-span-8 relative">
                <img
                  src={GALLERY_ITEMS[lightboxIndex].img}
                  alt={GALLERY_ITEMS[lightboxIndex].name}
                  className="w-full max-h-[62vh] object-cover border border-white/10"
                />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <div className="text-xs opacity-60 uppercase tracking-widest" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {GALLERY_ITEMS[lightboxIndex].area} · {GALLERY_ITEMS[lightboxIndex].meta}
                </div>
                <h3 className="text-3xl sm:text-4xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {GALLERY_ITEMS[lightboxIndex].name}
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {GALLERY_ITEMS[lightboxIndex].desc}
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
                    className="px-5 py-2.5 border border-white/25 hover:bg-white hover:text-black text-xs uppercase tracking-widest transition-colors"
                  >
                    &larr; Anterior
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length)}
                    className="px-5 py-2.5 border border-white/25 hover:bg-white hover:text-black text-xs uppercase tracking-widest transition-colors"
                  >
                    Siguiente &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-5xl w-full mx-auto flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              {GALLERY_ITEMS.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-16 h-11 overflow-hidden border transition-all ${
                    i === lightboxIndex ? 'border-white scale-105' : 'border-white/20 opacity-50 hover:opacity-85'
                  }`}
                >
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <footer className="border-t border-current/10 py-12 px-6 text-center text-xs opacity-50">
          Solstice Architecture Studio — Madrid · Kyoto · Ciudad de México
        </footer>
      </div>
    </DemoWrapper>
  );
};
