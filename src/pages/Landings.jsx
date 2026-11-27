import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { LANDINGS_DATA } from '../data/landingsData';

const CATEGORIES = [
  'TODAS',
  'INFRA & CLOUD',
  'AI & SAAS',
  'EVENTS',
  'AGENCY',
  'NONPROFIT',
  'AEROSPACE',
  'ARCHITECTURE',
  'FINTECH',
  'ECOMMERCE',
];

const LandingCard = ({ template, onOpen, isFeatured = false }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -5, y: x * 5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <article
      ref={cardRef}
      onClick={() => onOpen(template.slug)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`group relative cursor-pointer bg-white border border-slate-200 hover:border-[#dc2626] transition-colors duration-300 shadow-sm hover:shadow-[0_14px_35px_-10px_rgba(220,38,38,0.18)] overflow-hidden ${
        isFeatured ? 'mb-10 grid grid-cols-1 lg:grid-cols-12' : 'flex flex-col justify-between'
      }`}
    >
      {/* Screenshot Preview */}
      <div
        className={`relative overflow-hidden bg-slate-100 border-b border-slate-200 ${
          isFeatured ? 'lg:col-span-6 lg:border-b-0 lg:border-r min-h-[260px]' : 'h-48'
        }`}
      >
        <img
          src={template.screenshot}
          alt={template.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="font-mono text-[0.68rem] font-bold px-2 py-0.5 bg-white/95 border border-slate-200 text-[#dc2626] tracking-widest shadow-sm">
            {template.id}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider px-2 py-0.5 bg-white/95 border border-slate-200 text-slate-600 shadow-sm">
            {template.style}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className={`p-6 sm:p-7 flex flex-col justify-between ${isFeatured ? 'lg:col-span-6' : 'flex-1'}`}>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/25">
              {template.category}
            </span>
            {isFeatured && (
              <span className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
                ★ FEATURED_DEMO
              </span>
            )}
          </div>

          <h2
            className={`font-extrabold tracking-tight text-slate-900 group-hover:text-[#dc2626] transition-colors mb-2.5 ${
              isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {template.title}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">{template.description}</p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {template.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[0.68rem] px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">/{template.slug}</span>
            <span className="text-[#dc2626] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              ABRIR DEMO &rarr;
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const Landings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const navigate = useNavigate();

  const filteredTemplates = LANDINGS_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'TODAS' || item.category.toUpperCase() === selectedCategory.toUpperCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.stack.some((s) => s.toLowerCase().includes(q)) ||
      item.style.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const showFeatured = selectedCategory === 'TODAS' && !searchQuery.trim();
  const featuredTemplate = showFeatured ? filteredTemplates.find((t) => t.featured) : null;
  const gridTemplates = featuredTemplate
    ? filteredTemplates.filter((t) => t.id !== featuredTemplate.id)
    : filteredTemplates;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-10 pb-24 relative overflow-hidden">
      {/* Background Light Cyber/Grid Texture (White + Red Zero Theme) */}
      <div
        className="absolute top-0 inset-x-0 h-[480px] pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 38, 38, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Navigation back */}
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#dc2626] hover:text-slate-900 transition-colors mb-10 inline-flex items-center gap-2 select-none group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
          <span>Volver al portafolio</span>
        </Link>

        {/* Section Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs mb-3.5">
            <span className="px-2.5 py-1 bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] font-bold uppercase tracking-widest text-[0.68rem] flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
              ZERO_VAULT // LANDING_SHOWCASE
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-600 uppercase tracking-wider text-[0.7rem]">
              {LANDINGS_DATA.length} DEMOS INTERACTIVOS
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[#dc2626] uppercase tracking-wider text-[0.7rem] font-semibold">
              ACCESO DIRECTO
            </span>
          </div>

          <h1 className="text-[clamp(2.4rem,5.5vw,4.4rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-slate-900 uppercase mb-4">
            Galería de Landings // Zero Edition
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-[65ch] leading-relaxed">
            Colección privada de demos visuales de landing pages. Haz clic en cualquier tarjeta para abrir la experiencia completa en vivo.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-12 space-y-5 pb-8 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#dc2626] font-bold">
                [&gt;]
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="BUSCAR POR NOMBRE, ESTILO O STACK..."
                className="w-full bg-white border border-slate-200 focus:border-[#dc2626] text-slate-900 font-mono text-xs sm:text-sm pl-10 pr-10 py-2.5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 hover:text-[#dc2626] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="font-mono text-xs text-slate-500 shrink-0">
              MOSTRANDO{' '}
              <span className="text-[#dc2626] font-bold">{filteredTemplates.length}</span>{' '}
              DE {LANDINGS_DATA.length} DEMOS
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-slate-500 mr-1">
              FILTRAR:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();
              const count =
                cat === 'TODAS'
                  ? LANDINGS_DATA.length
                  : LANDINGS_DATA.filter((t) => t.category.toUpperCase() === cat.toUpperCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-[0.72rem] uppercase tracking-wider px-3 py-1.5 border transition-all duration-200 flex items-center gap-2 select-none ${
                    isSelected
                      ? 'bg-[#dc2626] text-white font-bold border-[#dc2626] shadow-[0_4px_14px_rgba(220,38,38,0.3)]'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-[#dc2626]/50'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="py-16 text-center border border-slate-200 bg-white p-8 max-w-xl mx-auto shadow-sm">
            <p className="font-mono text-sm text-[#dc2626] font-bold mb-3">
              [!] NO SE ENCONTRARON DEMOS QUE COINCIDAN
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Prueba con otros términos o resetea el filtro de categorías.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('TODAS');
              }}
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-slate-50 text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-colors border border-[#dc2626]/40"
            >
              [RESETEAR FILTROS]
            </button>
          </div>
        ) : (
          <div>
            {featuredTemplate && (
              <LandingCard
                template={featuredTemplate}
                onOpen={(slug) => navigate(`/landings/${slug}`)}
                isFeatured={true}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {gridTemplates.map((template) => (
                <LandingCard
                  key={template.id}
                  template={template}
                  onOpen={(slug) => navigate(`/landings/${slug}`)}
                  isFeatured={false}
                />
              ))}
            </div>
          </div>
        )}
        {/* Custom CTA Banner */}
        <div className="mt-20 border border-[#dc2626]/30 bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#dc2626]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#dc2626] font-bold block mb-2">
                PROYECTOS A MEDIDA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                ¿Te gusta lo que ves? Contáctame
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl">
                Podemos ajustarlo o hacer algo totalmente a tu medida, preguntar no vale nada.
              </p>
            </div>
            <a
              href="mailto:steven.jm357@gmail.com?subject=Consulta%20Landing%20Page%20a%20Medida"
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#dc2626]/20"
            >
              <span>Enviar Correo</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
