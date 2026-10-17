import React, { useEffect } from 'react';

export const ShortcutsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j  or  ↓', action: 'Saltar a la siguiente sección (Down)' },
    { key: 'k  or  ↑', action: 'Saltar a la sección anterior (Up)' },
    { key: 'g g', action: 'Saltar al inicio de la plataforma (Hero)' },
    { key: 'G', action: 'Saltar al final de la plataforma (Contacto)' },
    { key: '~  or  `', action: 'Abrir / cerrar terminal SRE interactiva' },
    { key: '?', action: 'Abrir / cerrar esta guía de atajos de teclado' },
    { key: 'Esc', action: 'Cerrar cualquier ventana modal activa' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts Cheat Sheet"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#07080b] border-2 border-[#131722] shadow-[0_12px_40px_rgba(0,0,0,0.9)] p-6 font-mono text-xs sm:text-sm text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#131722]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="font-bold text-white uppercase tracking-wider">
              KEYBOARD NAVIGATION // VIM BINDINGS
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#ef4444] transition-colors font-bold px-1"
            aria-label="Close shortcuts"
          >
            [X]
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-3 mb-6">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between gap-4 py-1.5 border-b border-[#131722]/50 last:border-b-0"
            >
              <span className="text-[#8e99a8]">{sc.action}</span>
              <kbd className="px-2.5 py-1 bg-[#0c0e14] border border-[#1e2433] text-[#10b981] font-bold tracking-wider rounded-sm text-xs shrink-0 whitespace-pre">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-[#131722] flex items-center justify-between text-xs text-[#64748b]">
          <span>DIRECTION J TELEMETRY</span>
          <button
            onClick={onClose}
            className="text-[#10b981] hover:text-white transition-colors"
          >
            [ENTENDIDO]
          </button>
        </div>
      </div>
    </div>
  );
};
