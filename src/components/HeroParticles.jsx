import React, { useEffect, useRef } from 'react';

export const HeroParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let pts = [];
    const mouse = { x: -9999, y: -9999 };
    let animId = null;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = window.devicePixelRatio || 1;
      W = parent.offsetWidth;
      H = parent.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const n = Math.min(85, Math.max(25, Math.floor(W / 16)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5,
        isEmerald: Math.random() < 0.38,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const draw = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Update and draw particles
      for (const p of pts) {
        // Soft mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);

        if (d < 140 && d > 1) {
          p.vx += (dx / d) * 0.03;
          p.vy += (dy / d) * 0.03;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isEmerald ? 'rgba(16, 185, 129, 0.85)' : 'rgba(255, 255, 255, 0.32)';
        ctx.shadowColor = p.isEmerald ? '#10b981' : 'transparent';
        ctx.shadowBlur = p.isEmerald ? 6 : 0;
        ctx.fill();
      }

      // Draw faint interconnecting network lines between neighboring nodes
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);

          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const lineAlpha = (1 - d / 115) * 0.16;
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.shadowBlur = 0;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw dynamic constellation connection lines to the cursor
      if (mouse.x > 0 && mouse.y > 0 && mouse.x < W && mouse.y < H) {
        for (const p of pts) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < 175) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const tetherAlpha = (1 - d / 175) * 0.45;
            ctx.strokeStyle = `rgba(16, 185, 129, ${tetherAlpha})`;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
            ctx.shadowBlur = 6;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles-canvas" aria-hidden="true" />;
};
