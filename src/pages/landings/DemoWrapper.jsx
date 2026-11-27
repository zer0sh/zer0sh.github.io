import React from 'react';
import { Link } from 'react-router-dom';

export const DemoWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <Link
        to="/landings"
        className="fixed bottom-5 right-5 z-50 px-4 py-2 bg-white/95 text-slate-900 border border-slate-300 hover:border-[#dc2626] hover:text-[#dc2626] font-mono text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all flex items-center gap-2"
      >
        <span>&larr;</span>
        <span>Galería</span>
      </Link>
      {children}
    </div>
  );
};
