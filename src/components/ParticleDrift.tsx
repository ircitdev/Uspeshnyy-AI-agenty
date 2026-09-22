import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  colorIndex: number;
  angle: number;
  angleSpeed: number;
  oscillationAmp: number;
}

export const ParticleDrift: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let isDark = document.documentElement.classList.contains('dark');

    // Palettes for Light & Dark mode (Meng To signature styling)
    const getColors = (dark: boolean) => {
      if (dark) {
        return [
          { r: 56, g: 189, b: 248 },  // Electric Sky Blue (#38bdf8)
          { r: 14, g: 165, b: 233 },  // Azure (#0ea5e9)
          { r: 103, g: 232, b: 249 }, // Luminous Ice Cyan (#67e8f9)
          { r: 129, g: 140, b: 248 }, // Soft Indigo/Violet (#818cf8)
          { r: 52, g: 211, b: 153 },  // Emerald Mint (#34d399)
        ];
      } else {
        return [
          { r: 19, g: 111, b: 151 },  // Brand Ocean (#136f97)
          { r: 20, g: 122, b: 166 },  // Cyan Slate (#147aa6)
          { r: 2, g: 132, b: 199 },   // Deep Sky (#0284c7)
          { r: 79, g: 70, b: 229 },   // Indigo accent (#4f46e5)
          { r: 100, g: 116, b: 139 }, // Neutral slate (#64748b)
        ];
      }
    };

    let colors = getColors(isDark);

    // Watch for theme class changes on <html>
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      if (currentDark !== isDark) {
        isDark = currentDark;
        colors = getColors(isDark);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Track mouse for gentle interactive drift
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle pool
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 65;
    const MAX_DISTANCE = 115;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const baseRadius = Math.random() * 2 + 0.8;
        const baseAlpha = isDark 
          ? Math.random() * 0.45 + 0.25 
          : Math.random() * 0.35 + 0.15;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.4 - 0.2, // subtle upward drift
          baseRadius,
          radius: baseRadius,
          alpha: baseAlpha,
          baseAlpha,
          colorIndex: Math.floor(Math.random() * colors.length),
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.02,
          oscillationAmp: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        initParticles();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    handleResize();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation filaments between close particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const ratio = 1 - dist / MAX_DISTANCE;
            const lineAlpha = ratio * (isDark ? 0.18 : 0.08) * ((p1.alpha + p2.alpha) / 2);
            const c = colors[p1.colorIndex];

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic oscillation
        p.angle += p.angleSpeed;
        p.x += p.vx + Math.cos(p.angle) * p.oscillationAmp * 0.3;
        p.y += p.vy + Math.sin(p.angle) * p.oscillationAmp * 0.3;

        // Subtle interactive mouse repulsion / drift
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius && mdist > 0) {
          const force = (1 - mdist / mouse.radius) * 1.5;
          p.x += (mdx / mdist) * force;
          p.y += (mdy / mdist) * force;
        }

        // Screen wrap-around
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const c = colors[p.colorIndex];

        // Soft outer glow for larger particles
        if (p.baseRadius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.alpha * (isDark ? 0.18 : 0.08)})`;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none w-full h-full z-0 transition-opacity duration-700"
    />
  );
};
