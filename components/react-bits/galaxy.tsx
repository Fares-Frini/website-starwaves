"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * A living star field drawn on the GPU — React Bits' "Galaxy"
 * (reactbits.dev, by David Haz), adapted for this site.
 *
 * What changed from the original, and why:
 * - it stops drawing when it is off screen or the tab is hidden, instead of
 *   running a frame loop forever;
 * - under reduced motion it draws one still frame and nothing moves;
 * - the pointer is read from the window, because the sky sits *behind* the
 *   hero's words and never receives pointer events itself; touch is ignored;
 * - it resizes with its box (ResizeObserver), at a pixel ratio capped at 1.25
 *   (soft glows gain nothing from more), and draws at most 30 frames a second
 *   — the field turns too slowly for more to show, and it halves the GPU work;
 * - if WebGL is unavailable it does nothing, and the CSS sky underneath stays;
 * - `onReady` fires after the first frame, so the caller can fade it in;
 * - the light-mode branch is gone (the site's sky is always night).
 *
 * The props are read once: the caller passes constants.
 */

const vertexShader = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uMouseActiveFactor;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  // A gentle parallax towards the pointer.
  vec2 mouseNorm = uMouse - vec2(0.5);
  uv += mouseNorm * 0.1 * uMouseActiveFactor;

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  float alpha = smoothstep(0.0, 0.3, length(col));
  gl_FragColor = vec4(col, min(alpha, 1.0));
}
`;

type GalaxyProps = {
  /** Where the field is centred, as fractions of the box. */
  focal?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  className?: string;
  onReady?: () => void;
};

export default function Galaxy({
  focal = [0.5, 0.5],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1,
  glowIntensity = 0.3,
  saturation = 0,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  className,
  onReady,
}: GalaxyProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  // Read once, at mount: the field is set up a single time.
  const initial = useRef({ focal, starSpeed, density, hueShift, speed, glowIntensity, saturation, twinkleIntensity, rotationSpeed, onReady });

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const p = initial.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      });
    } catch {
      return; // No WebGL: the CSS sky stays on its own.
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array(p.focal) },
        uRotation: { value: new Float32Array([1, 0]) },
        uStarSpeed: { value: p.starSpeed },
        uDensity: { value: p.density },
        uHueShift: { value: p.hueShift },
        uSpeed: { value: p.speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: p.glowIntensity },
        uSaturation: { value: p.saturation },
        uTwinkleIntensity: { value: p.twinkleIntensity },
        uRotationSpeed: { value: p.rotationSpeed },
        uMouseActiveFactor: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    box.appendChild(canvas);

    const resize = () => {
      renderer.setSize(box.offsetWidth, box.offsetHeight);
      program.uniforms.uResolution.value = new Color(canvas.width, canvas.height, canvas.width / canvas.height);
    };
    resize();

    const mouse = { x: 0.5, y: 0.5, active: 0 };
    const target = { x: 0.5, y: 0.5, active: 0 };
    let raf = 0;
    let visible = true;
    let readySent = false;
    // A clock that only advances while drawing, so the sky resumes where it
    // stopped instead of jumping ahead after being off screen.
    let clock = 0;
    let last = 0;

    const draw = (now: number) => {
      if (last) clock += Math.min(now - last, 50);
      last = now;
      const t = clock * 0.001;
      program.uniforms.uTime.value = t;
      program.uniforms.uStarSpeed.value = (t * p.starSpeed) / 10;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      mouse.active += (target.active - mouse.active) * 0.05;
      program.uniforms.uMouse.value[0] = mouse.x;
      program.uniforms.uMouse.value[1] = mouse.y;
      program.uniforms.uMouseActiveFactor.value = mouse.active;
      renderer.render({ scene: mesh });
      if (!readySent) {
        readySent = true;
        p.onReady?.();
      }
    };

    // 30 frames a second: skip any frame that comes sooner than ~33 ms.
    let lastDraw = 0;
    const loop = (now: number) => {
      raf = 0;
      if (now - lastDraw >= 32) {
        lastDraw = now;
        draw(now);
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    sizeObserver.observe(box);

    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewObserver.observe(box);

    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = box.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      target.active = inside ? 1 : 0;
      if (inside) {
        target.x = (event.clientX - rect.left) / rect.width;
        target.y = 1 - (event.clientY - rect.top) / rect.height;
      }
    };
    if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduce) draw(0);
    else start();

    return () => {
      cancelAnimationFrame(raf);
      sizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={boxRef} aria-hidden className={className} />;
}
