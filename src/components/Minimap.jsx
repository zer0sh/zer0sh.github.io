import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Minimap = () => {
  const { lang } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: lang === 'es' ? '00 // Inicio' : '00 // Top' },
    { id: 'projects', label: lang === 'es' ? '01 // Proyectos' : '01 // Projects' },
    { id: 'operations', label: lang === 'es' ? '02 // Operaciones' : '02 // Operations' },
    { id: 'routine', label: lang === 'es' ? '03 // Rutina SRE' : '03 // Routine' },
    { id: 'disciplines', label: lang === 'es' ? '04 // Disciplinas' : '04 // Disciplines' },
    { id: 'stack', label: lang === 'es' ? '05 // Sistemas' : '05 // Stack' },
    { id: 'about', label: lang === 'es' ? '06 // Filosofía' : '06 // Philosophy' },
    { id: 'dispatches', label: lang === 'es' ? '07 // Artículos' : '07 // Dispatches' },
    { id: 'contact', label: lang === 'es' ? '08 // Contacto' : '08 // Signals' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const scrollTo = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Section Minimap"
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end select-none"
    >
      {/* Telemetry vertical track dock */}
      <div className="bg-[#0c0e14]/90 backdrop-blur-md border border-[#131722] rounded-full p-1.5 flex flex-col items-center gap-1 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group relative w-7 h-7 flex items-center justify-center rounded-full focus:outline-none cursor-pointer"
              aria-label={`Jump to ${sec.label}`}
            >
              {/* Tooltip Label on Hover or Active */}
              <span
                className={`absolute right-10 pointer-events-none font-mono text-[0.72rem] tracking-wider uppercase px-2.5 py-1 bg-[#0c0e14] border text-white whitespace-nowrap shadow-xl transition-all duration-200 ${
                  isActive
                    ? 'opacity-100 text-[#10b981] border-[#10b981]/50'
                    : 'opacity-0 group-hover:opacity-100 text-[#94a3b8] border-[#131722]'
                }`}
              >
                {sec.label}
              </span>

              {/* Pill / Dot indicator */}
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-5 bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)] border border-emerald-300'
                    : 'w-2 h-2 bg-[#1e2433] group-hover:bg-[#10b981]/70 group-hover:scale-125 group-hover:w-2.5 group-hover:h-2.5'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
