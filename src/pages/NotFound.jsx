import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between relative overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-[520px] pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30, 41, 59, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />

      <main className="max-w-4xl w-full mx-auto px-6 pt-20 sm:pt-28 pb-20 relative z-10 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2.5 self-start px-3 py-1.5 bg-[#ef4444]/10 border border-[#ef4444]/40 text-[#ef4444] font-mono text-xs uppercase tracking-[0.18em] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
          <span>HTTP_404 // ENDPOINT_UNREACHABLE</span>
        </div>

        <h1 className="font-display font-extrabold uppercase text-[clamp(3.2rem,9vw,6.5rem)] tracking-[-0.04em] leading-[0.92] mb-6 select-none">
          <span className="name-gradient-glow inline-block">404 {'//'}</span>{' '}
          <span className="text-[#ef4444]">NOT FOUND</span>
        </h1>

        <p className="text-[#94a3b8] text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          La ruta solicitada no existe en este clúster o fue movida a otro nodo. Verifica el path o regresa al portafolio principal.
        </p>

        <div className="border border-[#1e293b] bg-[#0c0e14] p-5 sm:p-6 font-mono text-xs sm:text-sm space-y-2 mb-10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-3 text-[#64748b] text-xs">
            <span>DIAGNÓSTICO DE ENRUTAMIENTO</span>
            <span className="text-[#ef4444]">STATUS: 404</span>
          </div>
          <div className="text-[#94a3b8]">
            <span className="text-[#10b981]">$ curl -I</span>{' '}
            <span className="text-white">{location.pathname}</span>
          </div>
          <div className="text-[#ef4444]">
            [ERR] No upstream route matched &quot;{location.pathname}&quot;
          </div>
          <div className="text-[#64748b]">
            [SYS] Sugerencia: regresar a /en o consultar /blog
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/en"
            className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-[#07080b] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>&larr;</span>
            <span>Volver al Home</span>
          </Link>
          <Link
            to="/blog"
            className="px-6 py-3 bg-[#0c0e14] border border-[#1e293b] hover:border-[#10b981]/60 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors"
          >
            Explorar Blog SRE
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
