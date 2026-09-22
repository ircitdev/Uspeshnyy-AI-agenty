import React, { useEffect, useRef } from 'react';

interface RibbonConfig {
  baseYPercent: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phaseOffset: number;
  thickness: number;
  colorIndex: number;
}

export const AetherRibbonMesh: React.FC<{ className?: string }> = ({ className = '' }) => {
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
    let time = 0;
    let isDark = document.documentElement.classList.contains('dark');

    // Color definitions for Light & Dark mode (Daiwiik Harihar Aether palette)
    const getPalette = (dark: boolean) => {
      if (dark) {
        return [
          { stroke: 'rgba(56, 189, 248, 0.45)', fill: 'rgba(56, 189, 248, 0.05)', rib: 'rgba(56, 189, 248, 0.22)' }, // Sky Blue
          { stroke: 'rgba(14, 165, 233, 0.40)', fill: 'rgba(14, 165, 233, 0.04)', rib: 'rgba(14, 165, 233, 0.20)' }, // Azure
          { stroke: 'rgba(99, 102, 241, 0.35)', fill: 'rgba(99, 102, 241, 0.03)', rib: 'rgba(99, 102, 241, 0.18)' }, // Violet
          { stroke: 'rgba(45, 212, 191, 0.40)', fill: 'rgba(45, 212, 191, 0.04)', rib: 'rgba(45, 212, 191, 0.19)' }, // Teal
        ];
      } else {
        return [
          { stroke: 'rgba(19, 111, 151, 0.35)', fill: 'rgba(19, 111, 151, 0.035)', rib: 'rgba(19, 111, 151, 0.16)' }, // Brand Ocean
          { stroke: 'rgba(2, 132, 199, 0.30)', fill: 'rgba(2, 132, 199, 0.03)', rib: 'rgba(2, 132, 199, 0.14)' },   // Cerulean
          { stroke: 'rgba(79, 70, 229, 0.25)', fill: 'rgba(79, 70, 229, 0.025)', rib: 'rgba(79, 70, 229, 0.12)' },  // Deep Iris
          { stroke: 'rgba(13, 148, 136, 0.28)', fill: 'rgba(13, 148, 136, 0.025)', rib: 'rgba(13, 148, 136, 0.13)' },// Pine Teal
        ];
      }
    };

    let palette = getPalette(isDark);

    // Watch for theme toggles
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      if (currentDark !== isDark) {
        isDark = currentDark;
        palette = getPalette(isDark);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Interactive mouse warp
    let mouse = { x: -1000, y: -1000 };

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

    // Multi-layer ribbon configurations
    const ribbons: RibbonConfig[] = [
      {
        baseYPercent: 0.28,
        amplitude: 45,
        frequency: 0.0022,
        speed: 0.012,
        phaseOffset: 0,
        thickness: 55,
        colorIndex: 0
      },
      {
        baseYPercent: 0.50,
        amplitude: 55,
        frequency: 0.0018,
        speed: -0.009,
        phaseOffset: 2.1,
        thickness: 70,
        colorIndex: 1
      },
      {
        baseYPercent: 0.72,
        amplitude: 40,
        frequency: 0.0025,
        speed: 0.015,
        phaseOffset: 4.2,
        thickness: 50,
        colorIndex: 2
      },
      {
        baseYPercent: 0.40,
        amplitude: 35,
        frequency: 0.003,
        speed: 0.008,
        phaseOffset: 1.2,
        thickness: 45,
        colorIndex: 3
      }
    ];

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
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    handleResize();

    // Render Aether Ribbon Mesh
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.8;
      const stepX = 22; // Distance between mesh rib lines

      ribbons.forEach((ribbon) => {
        const style = palette[ribbon.colorIndex % palette.length];
        const baseY = height * ribbon.baseYPercent;

        const pointsTop: { x: number; y: number }[] = [];
        const pointsBottom: { x: number; y: number }[] = [];

        // Sample wave function across screen width
        for (let x = -stepX; x <= width + stepX; x += stepX) {
          const t = time * ribbon.speed + ribbon.phaseOffset;
          
          // Harmonized trigonometric wave for organic aether flow
          let waveOffset =
            Math.sin(x * ribbon.frequency + t) * ribbon.amplitude +
            Math.cos(x * ribbon.frequency * 1.5 - t * 0.7) * (ribbon.amplitude * 0.4) +
            Math.sin(x * 0.0008 + t * 0.3) * (ribbon.amplitude * 0.25);

          // Interactive mouse warp factor
          const dx = x - mouse.x;
          const dy = baseY + waveOffset - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const warpFactor = (1 - dist / 180) * 22;
            waveOffset += Math.sin(dist * 0.05 - time * 0.05) * warpFactor;
          }

          // Undulating ribbon thickness along length
          const localThickness =
            ribbon.thickness * (0.8 + 0.4 * Math.sin(x * 0.003 + t * 0.8));

          pointsTop.push({ x, y: baseY + waveOffset - localThickness / 2 });
          pointsBottom.push({ x, y: baseY + waveOffset + localThickness / 2 });
        }

        // 1. Draw Mesh Volume (Translucent gradient fill between ribbons)
        ctx.beginPath();
        if (pointsTop.length > 0) {
          ctx.moveTo(pointsTop[0].x, pointsTop[0].y);
          for (let i = 1; i < pointsTop.length; i++) {
            ctx.lineTo(pointsTop[i].x, pointsTop[i].y);
          }
          for (let i = pointsBottom.length - 1; i >= 0; i--) {
            ctx.lineTo(pointsBottom[i].x, pointsBottom[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = style.fill;
          ctx.fill();
        }

        // 2. Draw Transverse Mesh Ribs (The "Aether Mesh" grid rungs)
        ctx.beginPath();
        ctx.strokeStyle = style.rib;
        ctx.lineWidth = 1;
        for (let i = 0; i < pointsTop.length; i += 2) {
          const pT = pointsTop[i];
          const pB = pointsBottom[i];
          ctx.moveTo(pT.x, pT.y);
          ctx.lineTo(pB.x, pB.y);
        }
        ctx.stroke();

        // 3. Draw Upper Spline Boundary
        ctx.beginPath();
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = isDark ? 1.5 : 1.25;
        if (pointsTop.length > 0) {
          ctx.moveTo(pointsTop[0].x, pointsTop[0].y);
          for (let i = 1; i < pointsTop.length; i++) {
            ctx.lineTo(pointsTop[i].x, pointsTop[i].y);
          }
        }
        ctx.stroke();

        // 4. Draw Lower Spline Boundary
        ctx.beginPath();
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = isDark ? 1.5 : 1.25;
        if (pointsBottom.length > 0) {
          ctx.moveTo(pointsBottom[0].x, pointsBottom[0].y);
          for (let i = 1; i < pointsBottom.length; i++) {
            ctx.lineTo(pointsBottom[i].x, pointsBottom[i].y);
          }
        }
        ctx.stroke();
      });

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
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 transition-opacity duration-700 ${className}`}
    />
  );
};
