import React, { useEffect, useRef, useState } from 'react';

/**
 * GARGANTUA — buraco negro de Schwarzschild renderizado em WebGL (ray-marching com lente gravitacional).
 * Cada pixel lança um raio de luz que é curvado pela gravidade (a = -1.5·h²·x / r⁵, unidades de rs);
 * quando cruza o plano do disco de acreção acumula emissão (turbulência fbm + anéis + Doppler),
 * se cair no horizonte fica preto, senão amostra o céu estrelado deformado.
 * `pullRef` (0→1) acelera o disco e aquece a luz à medida que os reels são engolidos.
 */
interface Props {
  pullRef?: React.MutableRefObject<number>;
  onUnsupported?: () => void;
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPull;
uniform vec2 uMouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}

vec3 sky(vec3 d) {
  vec2 uv = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0))) * 90.0;
  vec2 id = floor(uv);
  vec2 f = fract(uv) - 0.5;
  float h = hash(id);
  vec2 off = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6;
  float star = step(0.982, h) * smoothstep(0.14, 0.0, length(f + off));
  vec3 tint = mix(vec3(0.65, 0.75, 1.0), vec3(1.0, 0.86, 0.7), hash(id + 11.0));
  float neb = fbm(uv * 0.018 + 4.0);
  return tint * star * (0.6 + h * 1.6) + vec3(0.22, 0.09, 0.05) * neb * neb * 0.35;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // câmara ligeiramente acima do plano do disco (como em Interstellar)
  float incl = 0.085 + uMouse.y * 0.06;
  float yaw = uMouse.x * 0.22;
  float dist = 17.0;
  vec3 ro = vec3(sin(yaw) * cos(incl), sin(incl), -cos(yaw) * cos(incl)) * dist;
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 vel = normalize(fw * 1.55 + uv.x * rt + uv.y * up);
  vec3 pos = ro;

  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  bool captured = false;
  float spin = 1.0 + uPull * 1.6;

  for (int i = 0; i < 260; i++) {
    float r2 = dot(pos, pos);
    float r = sqrt(r2);
    float stp = clamp(0.055 * r, 0.018, 0.7);
    vec3 acc = -1.5 * h2 * pos / (r2 * r2 * r);
    vec3 npos = pos + vel * stp;
    vel += acc * stp;

    if (pos.y * npos.y < 0.0) {
      float t = pos.y / (pos.y - npos.y);
      vec3 p = mix(pos, npos, t);
      float pr = length(p.xz);
      if (pr > 2.4 && pr < 14.0) {
        float ang = atan(p.z, p.x);
        float omega = 2.6 / pow(pr, 1.5);
        float a2 = ang + uTime * omega * spin;
        vec2 q = vec2(cos(a2), sin(a2)) * pr;
        // gás turbulento esticado pela rotação (filamentos), não anéis regulares
        float n = fbm(q * 0.8 + vec2(0.0, uTime * 0.05));
        float streaks = fbm(vec2(pr * 3.1, a2 * 1.3) + n * 1.5);
        float fil = pow(clamp(streaks * 1.35 - 0.15, 0.0, 1.0), 1.6);
        float rings = 0.82 + 0.18 * sin(pr * 5.0 + streaks * 7.0);
        float dens = smoothstep(2.4, 3.1, pr) * pow(smoothstep(14.0, 3.0, pr), 1.4) * (0.15 + 1.25 * fil) * rings * (0.6 + 0.6 * n);
        float temp = clamp(smoothstep(14.0, 2.4, pr) + uPull * 0.15, 0.0, 1.0);
        vec3 c = mix(vec3(0.45, 0.08, 0.01), vec3(1.0, 0.45, 0.1), temp);
        c = mix(c, vec3(1.0, 0.92, 0.78), pow(temp, 3.0));
        vec3 vdir = normalize(vec3(-p.z, 0.0, p.x));
        float dop = 1.0 + 0.6 * dot(vdir, -normalize(vel));
        c *= dop * dop * dop;
        float a = clamp(dens * 0.95, 0.0, 1.0);
        col += (1.0 - alpha) * c * a * (1.35 + uPull * 0.9);
        alpha += (1.0 - alpha) * a;
      }
    }
    pos = npos;
    if (r < 1.0) { captured = true; break; }
    if (r > 60.0 || alpha > 0.985) break;
  }

  if (!captured) col += (1.0 - alpha) * sky(normalize(vel));

  // tonemapping filmico (a sombra fica preta absoluta)
  col = 1.0 - exp(-col * 1.15);
  col = pow(col, vec3(0.92));
  // vinheta
  col *= smoothstep(1.35, 0.35, length(uv * vec2(0.85, 1.0)));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const GargantuaGL: React.FC<Props> = ({ pullRef, onUnsupported }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      setFailed(true);
      onUnsupported?.();
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
    } catch (e) {
      console.warn('[GargantuaGL]', e);
      setFailed(true);
      onUnsupported?.();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uPull = gl.getUniformLocation(prog, 'uPull');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');

    // resolução interna reduzida (o shader é pesado); o CSS estica com suavidade
    let scale = 0.62;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(2, Math.round(r.width * dpr * scale));
      canvas.height = Math.max(2, Math.round(r.height * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    let lastFrame = performance.now();
    let slowFrames = 0;
    const loop = () => {
      const now = performance.now();
      // adaptação: se estiver lento, baixa a resolução interna
      if (now - lastFrame > 40) {
        if (++slowFrames > 20 && scale > 0.38) { scale -= 0.08; slowFrames = 0; resize(); }
      } else slowFrames = Math.max(0, slowFrames - 1);
      lastFrame = now;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uPull, pullRef ? Math.min(1, Math.max(0, pullRef.current)) : 0.6);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !visible) { visible = true; lastFrame = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!en.isIntersecting) { visible = false; cancelAnimationFrame(raf); }
    }, { rootMargin: '20% 0px' });
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [pullRef, onUnsupported]);

  if (failed) return null;
  return <canvas ref={canvasRef} className="gargantua-canvas" aria-hidden="true" />;
};
