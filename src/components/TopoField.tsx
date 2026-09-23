import React, { useEffect, useRef } from 'react';

/**
 * Анимированный фон hero: тонкая сетка и топографические линии, плывущие
 * по шуму Перлина. Шейдер взят из TopoField (MengTo/threeui, MIT), но
 * вместо изолированного iframe с Tailwind CDN и GSAP — свой canvas:
 * страница и так тяжёлая, лишние сотни килобайт в первом экране ни к чему.
 *
 * Фон прозрачный, цвет линий приходит параметром, поэтому компонент
 * работает на обеих темах без подмены разметки.
 */

const VS = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;
uniform vec3 u_color;
uniform float u_grid;
uniform float u_topo;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  float gridSize = 48.0 * u_dpr;
  vec2 gridFract = fract(gl_FragCoord.xy / gridSize);
  float lineThickness = 1.0 / gridSize;
  float gridLines = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);
  gridLines = clamp(gridLines, 0.0, 1.0) * u_grid;

  vec2 noisePos = st * 1.4 + vec2(u_time * 0.015, u_time * 0.025);
  float n = snoise(noisePos) * 0.5 + 0.5;
  float triangleWave = abs(fract(n * 10.0) - 0.5) * 2.0;
  float topoLines = smoothstep(0.025, 0.0, triangleWave) * u_topo;

  // Линии гаснут к нижнему краю: под текстом hero фон должен быть чище.
  float fade = smoothstep(0.0, 0.55, st.y * 0.85 + 0.15);

  float alpha = clamp(gridLines + topoLines, 0.0, 1.0) * fade;
  gl_FragColor = vec4(u_color * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
}

interface TopoFieldProps {
  className?: string;
}

export const TopoField: React.FC<TopoFieldProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: true });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uDpr = gl.getUniformLocation(program, 'u_dpr');
    const uColor = gl.getUniformLocation(program, 'u_color');
    const uGrid = gl.getUniformLocation(program, 'u_grid');
    const uTopo = gl.getUniformLocation(program, 'u_topo');

    // На светлой теме линии должны быть темнее и плотнее, иначе теряются
    // на светлой подложке; на тёмной — наоборот, еле заметное свечение.
    const applyTheme = () => {
      const dark = document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        gl.uniform3f(uColor, 0.2, 0.64, 0.83);
        gl.uniform1f(uGrid, 0.1);
        gl.uniform1f(uTopo, 0.42);
      } else {
        gl.uniform3f(uColor, 0.07, 0.43, 0.59);
        gl.uniform1f(uGrid, 0.07);
        gl.uniform1f(uTopo, 0.3);
      }
    };

    const resize = () => {
      // Плотность пикселей ограничиваем: на ретине полноэкранный шейдер
      // в 3x — заметная нагрузка на слабых телефонах.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
    };

    applyTheme();
    resize();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    window.addEventListener('resize', resize, { passive: true });

    // Рисуем только пока hero в экране: дальше по странице кадры не нужны.
    let visible = true;
    const io = new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const render = (t: number) => {
      raf = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      gl.uniform1f(uTime, (t - start) * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};
