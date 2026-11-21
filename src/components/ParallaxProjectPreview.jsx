import React, { useState, useRef, useCallback } from 'react';

/**
 * ParallaxProjectPreview
 *
 * Implements a 3D perspective parallax tilt effect with mouse tracking:
 * - Default state: 80% opacity, slightly muted/desaturated (0.8 opacity, grayscale 35%).
 * - Hover state: 100% full opacity, vibrant 100% color, 3D tilt towards cursor,
 *   floating HUD layers with translateZ depth, and an emerald holographic specular glare.
 * - Clickable: opens the screenshot in high-resolution lightbox.
 */
export const ParallaxProjectPreview = ({
  src,
  alt,
  badge,
  tagline,
  onImageClick,
}) => {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Subtle, elegant tilt angles (max 10 degrees)
    const maxTilt = 10;
    const rotateY = normX * maxTilt;
    const rotateX = -normY * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform({
      rotateX,
      rotateY,
      glareX,
      glareY,
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onImageClick && onImageClick(src, alt, badge, tagline)}
      className="relative aspect-[16/10] w-full cursor-pointer select-none group"
      style={{
        perspective: '1000px',
      }}
      title="Click to inspect full resolution preview"
    >
      <div
        className={`relative w-full h-full overflow-hidden border transition-all ${
          isHovered
            ? 'border-[#10b981]/60 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.22)]'
            : 'border-[#131722] shadow-lg'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.08s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Screenshot Image with 80% default opacity -> 100% full vibrant color on hover */}
        <div
          className="w-full h-full transition-all duration-500 ease-out"
          style={{
            transform: 'translateZ(0px)',
            opacity: isHovered ? 1 : 0.8,
            filter: isHovered
              ? 'grayscale(0%) contrast(105%) brightness(105%)'
              : 'grayscale(35%) contrast(95%) brightness(90%)',
          }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.src = '/images/og-preview.png';
            }}
          />
        </div>

        {/* Dynamic Holographic Glare / Specular Sheen (follows cursor) */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(16, 185, 129, 0.28) 0%, rgba(255, 255, 255, 0.12) 30%, transparent 70%)`,
              opacity: 0.9,
              transform: 'translateZ(15px)',
            }}
          />
        )}

        {/* Soft bottom vignette for readable overlay text */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080b]/90 via-[#07080b]/25 to-transparent transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.75 : 0.55,
          }}
        />

        {/* Floating HUD Chip (3D Layer Depth) */}
        <div
          className="absolute top-2.5 right-2.5 transition-transform duration-300 pointer-events-none"
          style={{
            transform: isHovered ? 'translateZ(32px)' : 'translateZ(0px)',
          }}
        >
          <span
            className={`font-mono text-[0.68rem] tracking-wider px-2 py-1 border uppercase backdrop-blur-sm shadow-md transition-all ${
              isHovered
                ? 'bg-[#07080b]/95 border-[#10b981] text-[#10b981] font-bold shadow-[#10b981]/20'
                : 'bg-[#07080b]/80 border-[#131722] text-[#94a3b8]'
            }`}
          >
            {badge}
          </span>
        </div>

        {/* Floating Zoom Indicator on Hover */}
        <div
          className="absolute top-2.5 left-2.5 transition-all duration-300 pointer-events-none"
          style={{
            transform: isHovered ? 'translateZ(28px)' : 'translateZ(0px)',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <span className="font-mono text-[0.64rem] tracking-wider px-2 py-0.5 bg-[#0a0c12]/95 border border-[#10b981]/50 text-[#10b981] uppercase backdrop-blur-sm inline-flex items-center gap-1 shadow-md">
            <span>[ ⤢ ZOOM ]</span>
          </span>
        </div>

        {/* Bottom Tagline Overlay (3D Layer Depth) */}
        <div
          className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[0.68rem] px-2.5 py-1.5 bg-[#07080b]/85 border border-[#131722]/80 backdrop-blur-sm transition-transform duration-300 pointer-events-none"
          style={{
            transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
          }}
        >
          <span
            className={`font-bold uppercase truncate mr-2 transition-colors ${
              isHovered ? 'text-[#10b981]' : 'text-[#94a3b8]'
            }`}
          >
            {tagline}
          </span>
          <span className="text-[#64748b] hidden sm:inline shrink-0 text-[0.64rem]">
            {isHovered ? '3D_PARALLAX // ACTIVE' : '3D_PARALLAX // 80%'}
          </span>
        </div>
      </div>
    </div>
  );
};
