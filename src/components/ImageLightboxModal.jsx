import React, { useEffect } from 'react';

/**
 * ImageLightboxModal
 *
 * Full-resolution preview lightbox for terminal screenshots with TUI window framing,
 * escape listener, background blur, and metadata display.
 */
export const ImageLightboxModal = ({ isOpen, onClose, imageSrc, alt, badge, tagline, title }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#07080b] border border-[#10b981]/50 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0c12] border-b border-[#131722] font-mono text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80 inline-block" />
            <span className="ml-2 text-white font-bold tracking-wider">
              VIEWPORT // {title || 'SCREENSHOT_INSPECTOR'}
            </span>
            {badge && (
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[0.65rem] uppercase">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#64748b] text-[0.68rem] hidden sm:inline font-mono">
              [ ESC TO CLOSE ]
            </span>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-white px-2 py-1 border border-[#131722] hover:border-[#10b981] text-[0.72rem] transition-colors cursor-pointer uppercase font-bold"
            >
              [ ✕ ]
            </button>
          </div>
        </div>

        {/* Image Content Container */}
        <div className="relative flex-1 overflow-auto bg-[#030406] flex items-center justify-center p-2 sm:p-4">
          <img
            src={imageSrc}
            alt={alt || 'Full preview'}
            className="max-w-full max-h-[75vh] object-contain border border-[#131722] shadow-2xl"
          />
        </div>

        {/* Modal Footer Info */}
        <div className="px-4 py-2 bg-[#0a0c12] border-t border-[#131722] font-mono text-[0.72rem] text-[#64748b] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[#10b981] font-semibold">{tagline || alt}</span>
          <span className="text-[0.68rem] uppercase">RAW_FRAME // 800x600 · TRUECOLOR_RGB</span>
        </div>
      </div>
    </div>
  );
};
