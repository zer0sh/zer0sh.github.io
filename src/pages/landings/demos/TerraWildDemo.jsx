import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const SANCTUARIES = [
  { id: 'patagonia', name: 'Valle de los Glaciares', region: 'Patagonia Sur', coords: "50°56'S 73°24'W", progress: 84, species: 'Cóndor Andino · Huemul', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80' },
  { id: 'tropico', name: 'Bosque de Niebla', region: 'Costa Rica', coords: "08°32'N 83°34'W", progress: 92, species: 'Jaguar · Quetzal Resplandeciente', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80' },
  { id: 'canon', name: 'Cañón del Silencio', region: 'Utah, USA', coords: "37°17'N 113°01'W", progress: 68, species: 'Águila Real · Puma concolor', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80' },
];

const COLOMBIA_ZONES = [
  {
    id: 'sierra',
    name: 'Sierra Nevada de Santa Marta',
    coords: "10°50'N 73°41'W",
    elevation: '0 – 5,775 msnm',
    hectares: '383,000 ha',
    species: 'Cóndor Andino · Rana Arlequín',
    desc: 'La montaña costera más alta del mundo, refugio de especies endémicas y nacimientos de 36 ríos.',
    cx: 195,
    cy: 62,
  },
  {
    id: 'choco',
    name: 'Chocó Biogeográfico',
    coords: "05°41'N 76°39'W",
    elevation: '0 – 1,200 msnm',
    hectares: '520,000 ha',
    species: 'Ballena Jorobada · Rana Dorada',
    desc: 'Uno de los corredores de mayor pluviosidad y biodiversidad por kilómetro cuadrado del planeta.',
    cx: 128,
    cy: 165,
  },
  {
    id: 'chingaza',
    name: 'Páramo de Chingaza',
    coords: "04°31'N 73°45'W",
    elevation: '3,200 – 4,020 msnm',
    hectares: '76,600 ha',
    species: 'Oso de Anteojos · Frailejón',
    desc: 'Fábrica natural de agua que abastece al 80% de Bogotá y protege ecosistemas de alta montaña.',
    cx: 190,
    cy: 185,
  },
  {
    id: 'amazonia',
    name: 'Serranía de Chiribiquete',
    coords: "00°55'N 72°47'W",
    elevation: '200 – 1,000 msnm',
    hectares: '4,268,000 ha',
    species: 'Jaguar · Águila Harpía',
    desc: 'Patrimonio mixto de la humanidad con tepuyes milenarios, arte rupestre y selva virgen.',
    cx: 225,
    cy: 265,
  },
];

export const TerraWildDemo = () => {
  const [selectedSanctuary, setSelectedSanctuary] = useState('patagonia');
  const [selectedColZone, setSelectedColZone] = useState('chingaza');
  const [expFilter, setExpFilter] = useState('Todas');
  const [subscribed, setSubscribed] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activePark = SANCTUARIES.find((s) => s.id === selectedSanctuary) || SANCTUARIES[0];
  const activeColZone = COLOMBIA_ZONES.find((z) => z.id === selectedColZone) || COLOMBIA_ZONES[0];

  const expeditions = [
    { date: '12–19 Mayo', title: 'Censo de Cóndor Andino', place: 'Torres del Paine', cat: 'Patagonia' },
    { date: '04–10 Julio', title: 'Reforestación de Manglares', place: 'Península de Osa', cat: 'Trópico' },
    { date: '18–25 Septiembre', title: 'Mapeo Acústico Nocturno', place: 'Reserva Amazónica', cat: 'Trópico' },
  ].filter((e) => expFilter === 'Todas' || e.cat === expFilter);

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#f4f1ea] text-[#14332b]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="bg-[#14332b] text-[#f4f1ea] text-xs py-2 px-4 text-center">
          Campaña 2026: Ayúdanos a proteger 15,000 hectáreas nuevas en la Patagonia Sur &rarr;
        </div>
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-[#14332b]/15">
          <div className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>TerraWild</div>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollTo('tw-reservas')} className="hover:text-amber-800 cursor-pointer">Reservas Naturales</button>
            <button onClick={() => scrollTo('tw-expediciones')} className="hover:text-amber-800 cursor-pointer">Expediciones</button>
            <button onClick={() => scrollTo('tw-impacto')} className="hover:text-amber-800 cursor-pointer">Impacto 2026</button>
            <button onClick={() => scrollTo('tw-guardaparques')} className="hover:text-amber-800 cursor-pointer">Guardaparques</button>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-semibold text-[#14332b]/70 cursor-pointer">Tienda Solidaria</span>
            <button className="px-5 py-2.5 rounded-full bg-[#14332b] text-[#f4f1ea] text-xs font-bold uppercase tracking-wider hover:bg-[#1f4d41] transition-colors">
              Donar Ahora
            </button>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
            <div className="lg:col-span-6">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-4">
                Conservación Activa · 420,000 Hectáreas
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold leading-[1.05] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
                Protegiendo los últimos santuarios salvajes.
              </h1>
              <p className="text-[#14332b]/80 text-lg mb-8 leading-relaxed">
                Trabajamos junto a comunidades locales para restaurar corredores biológicos, financiar guardaparques y preservar ecosistemas únicos.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-7 py-3.5 rounded-full bg-[#14332b] text-white font-semibold text-sm hover:bg-[#1e4a3e] transition-colors">
                  Explorar Parques
                </button>
                <button className="px-7 py-3.5 rounded-full border border-[#14332b] text-[#14332b] font-semibold text-sm hover:bg-[#14332b]/5 transition-colors">
                  Reporte Anual 2026
                </button>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl h-[420px] relative">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
                  alt="Mountain Sanctuary"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-[#14332b]/90 text-[#f4f1ea] px-4 py-2 rounded-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  50°56'S 73°24'W · 1,420m
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sanctuary Explorer */}
          <div id="tw-reservas" className="mb-20">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Fraunces', serif" }}>Santuarios Prioritarios 2026</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {SANCTUARIES.map((park) => (
                <button
                  key={park.id}
                  onClick={() => setSelectedSanctuary(park.id)}
                  className={`text-left group bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all ${
                    selectedSanctuary === park.id ? 'border-[#14332b] shadow-lg -translate-y-1' : 'border-[#14332b]/10'
                  }`}
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={park.img}
                      alt={park.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-amber-800 uppercase font-bold tracking-wider">{park.region}</div>
                    <div className="text-xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif" }}>{park.name}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Sanctuary Dossier */}
            <div className="bg-[#14332b] text-[#f4f1ea] rounded-3xl p-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <div className="text-xs text-amber-300 uppercase font-bold mb-1">Dossier Activo · {activePark.coords}</div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{activePark.name}</div>
              </div>
              <div>
                <div className="text-xs text-[#f4f1ea]/70 mb-1">Especies Indicadoras</div>
                <div className="font-semibold text-sm">{activePark.species}</div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Meta de Protección 2026</span>
                  <span className="font-bold text-amber-300">{activePark.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-300 transition-all duration-500" style={{ width: `${activePark.progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Colombia Conservation Map */}
          <div id="tw-impacto" className="bg-white rounded-3xl p-8 sm:p-10 border border-[#14332b]/10 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-xs bg-[#f4f1ea] rounded-3xl p-5 border border-[#14332b]/10">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#14332b]/60 mb-2 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  CORREDORES DE COLOMBIA
                </div>
                <svg viewBox="0 0 360 400" className="w-full h-72">
                  {/* Stylized Colombia Silhouette */}
                  <path
                    d="M 195 30 L 235 38 L 222 72 L 258 108 L 295 142 L 325 182 L 308 232 L 285 268 L 265 342 L 235 365 L 210 315 L 155 290 L 122 248 L 105 188 L 118 128 L 152 82 L 172 45 Z"
                    fill="#14332b"
                    fillOpacity="0.12"
                    stroke="#14332b"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Connecting corridor lines */}
                  <path d="M 195 62 L 128 165 L 190 185 L 225 265" fill="none" stroke="#b45309" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  {COLOMBIA_ZONES.map((z) => {
                    const isSelected = z.id === selectedColZone;
                    return (
                      <g key={z.id} onClick={() => setSelectedColZone(z.id)} className="cursor-pointer">
                        {isSelected && <circle cx={z.cx} cy={z.cy} r="18" fill="#b45309" fillOpacity="0.25" className="animate-ping" />}
                        <circle
                          cx={z.cx}
                          cy={z.cy}
                          r={isSelected ? 8 : 6}
                          fill={isSelected ? '#b45309' : '#14332b'}
                          stroke="#f4f1ea"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">Mapa Interactivo · Colombia</span>
                <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  Nodos de Biodiversidad en Colombia
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {COLOMBIA_ZONES.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedColZone(z.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      selectedColZone === z.id ? 'bg-[#14332b] text-white' : 'bg-[#f4f1ea] text-[#14332b] hover:bg-[#e7e2d6]'
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>

              <div className="bg-[#f4f1ea] rounded-2xl p-6 space-y-3 border border-[#14332b]/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{activeColZone.name}</h3>
                  <span className="text-xs text-amber-800 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeColZone.coords}</span>
                </div>
                <p className="text-sm text-[#14332b]/80 leading-relaxed">{activeColZone.desc}</p>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#14332b]/10 text-xs">
                  <div>
                    <div className="text-[#14332b]/60">Extensión</div>
                    <div className="font-bold">{activeColZone.hectares}</div>
                  </div>
                  <div>
                    <div className="text-[#14332b]/60">Altitud</div>
                    <div className="font-bold">{activeColZone.elevation}</div>
                  </div>
                  <div>
                    <div className="text-[#14332b]/60">Especies</div>
                    <div className="font-bold">{activeColZone.species}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filterable Expeditions */}
          <div id="tw-expediciones" className="bg-white rounded-3xl p-8 sm:p-10 border border-[#14332b]/10 mb-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Próximas Expediciones de Campo</h2>
              <div className="flex gap-2">
                {['Todas', 'Patagonia', 'Trópico'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setExpFilter(cat)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                      expFilter === cat ? 'bg-[#14332b] text-white' : 'bg-[#f4f1ea] text-[#14332b]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-[#14332b]/10 text-sm">
              {expeditions.map((exp) => (
                <div key={exp.title} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-base">{exp.title}</span>
                    <span className="text-[#14332b]/60 ml-3">{exp.place}</span>
                  </div>
                  <span className="font-semibold text-amber-800">{exp.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guardaparques Section */}
          <div id="tw-guardaparques" className="mb-20">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Fraunces', serif" }}>Guardaparques en Terreno</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Mateo Ríos', zone: 'Páramo de Chingaza', role: 'Monitoreo de Oso Andino · 11 años' },
                { name: 'Valeria Córdoba', zone: 'Chocó Biogeográfico', role: 'Bióloga Marina & Manglares · 8 años' },
                { name: 'Julián Torres', zone: 'Chiribiquete', role: 'Cartografía Satelital & Drones · 6 años' },
              ].map((r) => (
                <div key={r.name} className="bg-white rounded-2xl p-6 border border-[#14332b]/10">
                  <div className="text-xs font-bold uppercase text-amber-800 mb-1">{r.zone}</div>
                  <div className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>{r.name}</div>
                  <p className="text-xs text-[#14332b]/75">{r.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-[#14332b] text-[#f4f1ea] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Crónicas desde el terreno</h3>
              <p className="text-sm text-[#f4f1ea]/75">Recibe un boletín mensual con reportes fotográficos y avances de conservación.</p>
            </div>
            {subscribed ? (
              <div className="px-6 py-3 rounded-full bg-amber-300 text-[#14332b] font-bold text-sm">
                ✓ ¡Suscripción confirmada!
              </div>
            ) : (
              <div className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm outline-none flex-1 md:w-64"
                />
                <button
                  onClick={() => setSubscribed(true)}
                  className="px-6 py-3 rounded-full bg-amber-300 text-[#14332b] font-bold text-sm hover:bg-amber-200 transition-colors shrink-0"
                >
                  Suscribirme
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-[#14332b]/15 py-14 px-6 bg-[#eae6dc]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#14332b]/70">
            <div className="font-bold text-lg text-[#14332b]" style={{ fontFamily: "'Fraunces', serif" }}>TerraWild Foundation</div>
            <div className="flex gap-6">
              <span>Transparencia</span>
              <span>Voluntariado</span>
              <span>contacto@terrawild.org</span>
            </div>
          </div>
        </footer>
      </div>
    </DemoWrapper>
  );
};
