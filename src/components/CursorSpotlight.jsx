import React, { useEffect, useRef, useState } from 'react';

export const CursorSpotlight = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotRef = useRef(null);
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on devices that support hover and pointer
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    setEnabled(true);

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mx = -200;
    let my = -200;
    let sx = -200;
    let sy = -200;
    let rx = -200;
    let ry = -200;
    let hasMoved = false;
    let animId = null;

    const points = [];
    const maxAge = 340; // trail duration in ms

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        sx = mx;
        sy = my;
        rx = mx;
        ry = my;
      }

      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }

      const now = performance.now();
      const lastPoint = points[points.length - 1];
      if (!lastPoint || Math.hypot(mx - lastPoint.x, my - lastPoint.y) > 3) {
        points.push({ x: mx, y: my, time: now });
      }
    };

    const handleMouseEnterInteractive = () => {
      if (ringRef.current) {
        ringRef.current.classList.add('cursor-ring-hover');
      }
    };

    const handleMouseLeaveInteractive = () => {
      if (ringRef.current) {
        ringRef.current.classList.remove('cursor-ring-hover');
      }
    };

    const loop = () => {
      // Smooth lerp for spotlight and ring
      sx += (mx - sx) * 0.08;
      sy += (my - sy) * 0.08;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${sx - 380}px, ${sy - 380}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }

      // Draw futuristic cyber trail on canvas
      if (ctx && canvas) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const now = performance.now();
        while (points.length > 0 && now - points[0].time > maxAge) {
          points.shift();
        }

        if (points.length > 1) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const elapsed = now - p2.time;
            const ratio = Math.max(0, Math.min(1, 1 - elapsed / maxAge));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = Math.max(0.6, ratio * 3.2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${ratio * 0.65})`;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
            ctx.shadowBlur = 8 * ratio;
            ctx.stroke();

            // Intermittent glowing cyber nodes
            if (i % 2 === 0) {
              ctx.beginPath();
              ctx.arc(p2.x, p2.y, ratio * 1.6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(16, 185, 129, ${ratio * 0.9})`;
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 10 * ratio;
              ctx.fill();
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    // Attach listeners for interactive link/button states
    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    attachHoverListeners();

    // Observe DOM mutations to bind new elements dynamically
    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Texture noise layer */}
      <div className="ambient-noise" aria-hidden="true" />

      {/* Global reactive spotlight */}
      <div id="spotlight-global" ref={spotRef} aria-hidden="true" />

      {/* Cursor trailing ribbon canvas */}
      <canvas ref={canvasRef} className="cursor-trail-canvas" aria-hidden="true" />

      {/* Interactive cursor elements */}
      <div id="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
};
