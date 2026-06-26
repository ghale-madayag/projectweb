"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   ShaderBackground — premium procedural WebGL background.

   Soft white translucent diagonal ridges (folded frosted glass /
   satin) with pearlescent iridescence that shifts pink → purple →
   cyan → green → gold. Movement is very slow and elegant. No
   textures — fully procedural GLSL via OGL.

   Reusable: <ShaderBackground className="..." />
   - reduced-motion: renders one static frame (no RAF loop)
   - pauses when offscreen / tab hidden (perf)
   - DPR-capped + responsive for steady 60 FPS
   - WebGL failure leaves the element empty (CSS fallback shows)
   ============================================================ */

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  /* --- Ashima simplex noise 2D (public domain) --- */
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                        dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  /* Brand purple family only — no other hues. */
  const vec3 PURPLE = vec3(0.592, 0.447, 0.800); // #9772cc
  const vec3 LILAC  = vec3(0.820, 0.740, 0.930); // soft light purple

  void main(){
    vec2 uv = vUv;
    vec2 p = uv;
    p.x *= uResolution.x / max(uResolution.y, 1.0); // aspect correct

    float t = uTime * 0.045; // extremely slow, elegant drift

    // Gentle LOW-frequency warp only — keeps the ridges clean & straight
    // (just enough to vary their width organically, not noisy).
    float warp = snoise(p * 0.6 + vec2(t * 0.5, t * 0.35));

    // Diagonal ridge coordinate — stripes run top-left -> bottom-right.
    vec2 dir = normalize(vec2(1.0, -1.0));
    float d = dot(p, dir);
    float phase = d * 40.0 + warp * 1.7;

    // Satin band: rounded light across each fold, staying mostly bright.
    float band = 0.5 + 0.5 * sin(phase);
    float shade = mix(0.87, 1.0, smoothstep(0.0, 1.0, pow(band, 0.8)));

    // Soft brand-purple blooms only (vary between light lilac and brand purple).
    float hue = snoise(p * 0.5 + vec2(-t * 0.3, t * 0.2) + 4.0);
    float amt = snoise(p * 0.42 + vec2(t * 0.25, t * 0.4) + 19.0);
    float bloomMask = smoothstep(0.2, 0.9, amt);
    vec3 bloom = mix(LILAC, PURPLE, 0.5 + 0.5 * hue);

    // Sharp, thin fold edges — bright with only a faint purple tint.
    float edge = pow(abs(cos(phase)), 18.0);
    vec3 edgeCol = mix(vec3(1.0), PURPLE, 0.35);

    vec3 col = vec3(1.0);
    col = mix(col, bloom, bloomMask * 0.42); // soft purple washes
    col *= shade;                             // satin light/dark ridges

    // Cursor-follow purple shade (aspect-corrected, soft radial falloff).
    vec2 m = uMouse;
    m.x *= uResolution.x / max(uResolution.y, 1.0);
    float glow = smoothstep(0.6, 0.0, distance(p, m));
    col = mix(col, PURPLE, glow * glow * 0.55);

    col += edgeCol * edge * 0.55;             // crisp purple-tinted fold lines

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export default function ShaderBackground({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer, gl, program, mesh, raf;
    let running = false;
    let timeStart = performance.now();
    let elapsed = 0;
    let cleanup = () => {};

    // OGL may throw if WebGL is unavailable — fail silently to the CSS fallback.
    try {
      const { Renderer, Program, Mesh, Triangle } = require("ogl");

      renderer = new Renderer({
        alpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      gl = renderer.gl;
      gl.clearColor(1, 1, 1, 1);

      const canvas = gl.canvas;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      container.appendChild(canvas);

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uMouse: { value: [0.5, 0.5] },
        },
      });
      mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };
      window.addEventListener("resize", resize);
      resize();

      // Cursor-follow glow. The canvas has pointer-events:none, so listen on
      // window and map to the hero rect; smoothed each frame for elegant lag.
      const target = [0.5, 0.5];
      const mouse = [0.5, 0.5];
      const onMove = (e) => {
        const r = container.getBoundingClientRect();
        if (!r.width || !r.height) return;
        target[0] = (e.clientX - r.left) / r.width;
        target[1] = 1.0 - (e.clientY - r.top) / r.height; // flip Y for uv space
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      const render = () => renderer.render({ scene: mesh });

      const frame = (now) => {
        if (!running) return;
        elapsed = (now - timeStart) / 1000;
        mouse[0] += (target[0] - mouse[0]) * 0.06;
        mouse[1] += (target[1] - mouse[1]) * 0.06;
        program.uniforms.uTime.value = elapsed;
        program.uniforms.uMouse.value = mouse;
        render();
        raf = requestAnimationFrame(frame);
      };

      const startLoop = () => {
        if (running || reduce) return;
        running = true;
        timeStart = performance.now() - elapsed * 1000; // resume from where we paused
        raf = requestAnimationFrame(frame);
      };
      const stopLoop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      };

      if (reduce) {
        // One elegant static frame, no animation loop.
        program.uniforms.uTime.value = 9.0;
        render();
      } else {
        startLoop();
      }

      // Pause when the tab is hidden.
      const onVisibility = () =>
        document.hidden ? stopLoop() : startLoop();
      document.addEventListener("visibilitychange", onVisibility);

      // Pause when scrolled out of view.
      let io;
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            const visible = entries[0].isIntersecting;
            if (visible) startLoop();
            else stopLoop();
          },
          { threshold: 0 }
        );
        io.observe(container);
      }

      cleanup = () => {
        stopLoop();
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("visibilitychange", onVisibility);
        if (io) io.disconnect();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      };
    } catch (err) {
      // WebGL unsupported — leave the container empty so the CSS fallback shows.
      cleanup = () => {};
    }

    return () => cleanup();
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
