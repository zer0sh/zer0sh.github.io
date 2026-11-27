import React, { useState, useRef, useCallback } from 'react';

/**
 * ParallaxBlogCard
 *
 * High-craft SRE/Cyber tactile card with interactive 3D perspective parallax tilt:
 * - 3D Tilt tracking cursor coordinates (rotateX, rotateY)
 * - Holographic specular glare that glides across the card
 * - Kinetic image zoom, desaturation-to-vibrancy transition on hover
 * - Tactical HUD corner crosshairs that illuminate in emerald
 * - Monospace metadata telemetry with depth
 */
export const ParallaxBlogCard = ({
  post,
  readingTime,
  onClick,
  isFeatured = false,
  lang = 'es',
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Subtle, snappy tilt (max 7 degrees for large cards, 5 for featured)
    const maxTilt = isFeatured ? 4 : 7;
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
  }, [isFeatured]);

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

  const coverUrl = post.coverImage || '/blog-posts/images/cover-terminal-zsh-gotchas-noclobber-alias-trampas.jpg';

  if (isFeatured) {
    return (
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="relative group cursor-pointer w-full select-none mb-10"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative bg-[#0c0e14] border border-[#1e293b] group-hover:border-[#10b981] transition-all duration-300 overflow-hidden shadow-2xl"
          style={{
            transform: isHovered
              ? `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(1.008)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
            boxShadow: isHovered
              ? '0 20px 45px -10px rgba(16, 185, 129, 0.22), 0 0 1px 1px rgba(16, 185, 129, 0.4)'
              : '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
            transition: isHovered
              ? 'transform 0.08s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
              : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease',
          }}
        >
          {/* Specular glare overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(16, 185, 129, 0.16) 0%, transparent 65%)`,
            }}
          />

          {/* Tactical Corner Crosshairs */}
          <div className="absolute top-2 left-2 font-mono text-[10px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
          <div className="absolute top-2 right-2 font-mono text-[10px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
          <div className="absolute bottom-2 left-2 font-mono text-[10px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Cover Image (7 cols) */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[260px] lg:min-h-[360px] overflow-hidden bg-[#07080b]">
              <img
                src={coverUrl}
                alt={post.coverAlt || post.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out transform"
                style={{
                  filter: isHovered
                    ? 'grayscale(0%) contrast(108%) brightness(102%)'
                    : 'grayscale(25%) contrast(100%) brightness(88%)',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                }}
                loading="lazy"
              />
              {/* Scanline / Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              {/* Vignette fade to dark */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0c0e14] pointer-events-none" />

              {/* Status Badge Over Image */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#07080b]/90 backdrop-blur-md border border-[#ef4444]/60 text-[#ef4444] font-mono text-[0.68rem] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
                  ARTÍCULO DESTACADO // ÚLTIMA AUTOPSIA
                </span>
              </div>
            </div>

            {/* Right Content Section (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative z-10 bg-[#0c0e14]">
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#1e293b]/60 font-mono text-xs">
                  <span className="px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] font-bold tracking-wider text-[0.7rem] uppercase">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-[#64748b]">
                    <span>{post.date}</span>
                    <span>&middot;</span>
                    <span className="text-[#38bdf8] font-bold">{readingTime} MIN DE LECTURA</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold tracking-tight text-white group-hover:text-[#10b981] transition-colors leading-[1.25] mb-3">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-[#94a3b8] leading-relaxed line-clamp-4 font-normal">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="pt-6 mt-6 border-t border-[#1e293b]/60 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-[0.72rem] tracking-wider uppercase">AUTOPSIA DISPONIBLE</span>
                </div>
                <span className="text-[#10b981] font-bold tracking-wider flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-200">
                  LEER ARTÍCULO
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Grid Card (2-column layout)
  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative group cursor-pointer w-full select-none h-full flex flex-col"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative flex-1 flex flex-col bg-[#0c0e14] border border-[#1e293b]/70 group-hover:border-[#10b981] transition-all duration-300 overflow-hidden shadow-xl"
        style={{
          transform: isHovered
            ? `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 18px 40px -10px rgba(16, 185, 129, 0.22), 0 0 1px 1px rgba(16, 185, 129, 0.4)'
            : '0 8px 24px -10px rgba(0, 0, 0, 0.6)',
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.22s ease, border-color 0.22s ease'
            : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease',
        }}
      >
        {/* Specular Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(16, 185, 129, 0.16) 0%, transparent 60%)`,
          }}
        />

        {/* Tactical Corner Crosshairs */}
        <div className="absolute top-2 left-2 font-mono text-[9px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
        <div className="absolute top-2 right-2 font-mono text-[9px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
        <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>
        <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#334155] group-hover:text-[#10b981] transition-colors z-20 pointer-events-none">+</div>

        {/* Card Cover Image with 16:9 Aspect Ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#07080b]">
          <img
            src={coverUrl}
            alt={post.coverAlt || post.title}
            className="w-full h-full object-cover transition-all duration-600 ease-out transform"
            style={{
              filter: isHovered
                ? 'grayscale(0%) contrast(108%) brightness(102%)'
                : 'grayscale(30%) contrast(100%) brightness(85%)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            loading="lazy"
          />
          {/* Subtle Scanline Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          {/* Bottom gradient fade into card body */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0e14] to-transparent pointer-events-none" />

          {/* Floating Category Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2.5 py-1 bg-[#07080b]/90 backdrop-blur-md border border-[#1e293b] group-hover:border-[#10b981]/60 text-[#10b981] font-mono text-[0.66rem] font-bold tracking-wider uppercase shadow-md transition-colors">
              {post.category}
            </span>
          </div>

          {/* Reading Time Pill */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2 py-0.5 bg-[#07080b]/85 backdrop-blur-md border border-[#1e293b] text-[#94a3b8] font-mono text-[0.65rem] tracking-wider uppercase">
              {readingTime} MIN LECTURA
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Date line */}
            <div className="flex items-center gap-2 font-mono text-xs text-[#64748b] mb-2.5">
              <span>{post.date}</span>
              <span>&middot;</span>
              <span className="text-[#38bdf8] text-[0.7rem] uppercase tracking-wider">AUTOPSIA SRE</span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#10b981] transition-colors leading-snug mb-2.5 line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-sm text-[#8e99a8] leading-relaxed line-clamp-3 font-normal">
              {post.excerpt}
            </p>
          </div>

          {/* Bottom Card Footer */}
          <div className="pt-4 mt-4 border-t border-[#1e293b]/60 flex items-center justify-between font-mono text-xs">
            <span className="text-[0.7rem] text-[#64748b] group-hover:text-[#94a3b8] transition-colors">
              [CASO FORENSE // VERIFICADO]
            </span>
            <span className="text-[#10b981] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              LEER ARTÍCULO &rarr;
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
