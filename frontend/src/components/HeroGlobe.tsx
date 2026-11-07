import React, { useEffect, useRef } from 'react';
import worldData from '../data/worldPoints.json';
import { CLIENT_BRANDS } from '../data/clientBrands';

interface WorldPoint {
  lat: number;
  lon: number;
  moz?: boolean;
  coast?: boolean;
}

interface Marker3D {
  name: string;
  sub: string;
  lat: number;
  lon: number;
  color: string;
  isHQ?: boolean;
}

// "TUDO SAI DE MOÇAMBIQUE PARA O MUNDO" — GESTÃO DE REDES SOCIAIS & AUDIOVISUAL GLOBAL
const MARKERS: Marker3D[] = [
  {
    name: 'MOÇAMBIQUE [HQ]',
    sub: 'Sede & Berço • Epicentro Global',
    lat: -25.96,
    lon: 32.58,
    color: '#ff3b30',
    isHQ: true
  },
  {
    name: 'REELS VIRAIS [AMÉRICAS]',
    sub: 'Gestão de Redes • +100k Reach',
    lat: -23.55,
    lon: -46.63,
    color: '#ff9500'
  },
  {
    name: 'PRODUÇÃO 4K [EUROPA]',
    sub: 'Showreels & Cinema de Marca',
    lat: 51.5,
    lon: -0.12,
    color: '#00d4ff'
  },
  {
    name: 'CAMPANHAS [ORIENTE]',
    sub: 'Tráfego Pago & Estratégia',
    lat: 25.20,
    lon: 55.27,
    color: '#af52de'
  },
  {
    name: 'MIZINE CELEBRATE [ÁFRICA]',
    sub: 'Convites Digitais Interativos',
    lat: -26.20,
    lon: 28.04,
    color: '#ff3b30'
  },
  {
    name: 'DISTRIBUIÇÃO [GLOBAL]',
    sub: 'Alcance Multimédia 24/7',
    lat: 39.93,
    lon: 32.85,
    color: '#34c759'
  }
];

// TODOS OS ARCOS PARTEM ESTRITAMENTE DE MOÇAMBIQUE PARA O MUNDO!
const GLOBAL_ARCS = [
  { fromLat: -25.96, fromLon: 32.58, toLat: -23.55, toLon: -46.63, color: '#ff9500' }, // Maputo -> Américas (Reels Virais)
  { fromLat: -25.96, fromLon: 32.58, toLat: 51.5, toLon: -0.12, color: '#00d4ff' },    // Maputo -> Europa (Produção 4K)
  { fromLat: -25.96, fromLon: 32.58, toLat: 25.20, toLon: 55.27, color: '#af52de' },    // Maputo -> Médio Oriente (Campanhas)
  { fromLat: -25.96, fromLon: 32.58, toLat: -26.20, toLon: 28.04, color: '#ff3b30' },   // Maputo -> África Austral (Celebrate)
  { fromLat: -25.96, fromLon: 32.58, toLat: 39.93, toLon: 32.85, color: '#34c759' }    // Maputo -> Ásia / Turquia (Distribuição)
];

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// --- Procedural value-noise (para nuvens realistas geradas uma única vez) ---
const hash2 = (x: number, y: number, seed: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const valueNoise = (x: number, y: number, seed: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number, seed: number) => {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < 6; o++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + o * 13);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
};

// Gera um "sprite" de cúmulo realista: vários "novelos" (couve-flor) sobrepostos numa cúpula de base plana,
// erodidos por ruído fractal, com auto-sombra calculada na direcção do sol (cima-esquerda),
// sombra azulada na base, e orla prateada onde a nuvem é fina.
const makeCloudSprite = (w: number, h: number, seed: number): HTMLCanvasElement => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return c;

  // 1. Novelos: um núcleo grande + anéis de bolhas mais pequenas ao longo da cúpula
  const rnd = (k: number) => hash2(k, seed * 7.3, seed);
  const puffs: { x: number; y: number; r: number }[] = [];
  const count = 16;
  for (let k = 0; k < count; k++) {
    const t = k / (count - 1);
    const px = lerp(-0.72, 0.72, t) + (rnd(k) - 0.5) * 0.12;
    const dome = Math.sqrt(Math.max(0, 1 - px * px * 1.4));
    const r = 0.16 + dome * 0.24 + rnd(k + 40) * 0.08;
    const py = 0.32 - dome * 0.5 + (rnd(k + 80) - 0.5) * 0.12;
    puffs.push({ x: px, y: py, r });
  }
  for (let k = 0; k < 7; k++) {
    puffs.push({ x: (rnd(k + 120) - 0.5) * 0.9, y: -0.2 - rnd(k + 160) * 0.35, r: 0.14 + rnd(k + 200) * 0.14 });
  }

  // 2. Campo de densidade (uma passagem) — guardado para a iluminação por amostragem
  const dens = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const v = (y / h) * 2 - 1;
    for (let x = 0; x < w; x++) {
      const u = (x / w) * 2 - 1;
      let d = 0;
      for (let k = 0; k < puffs.length; k++) {
        const p = puffs[k];
        const dx = (u - p.x) / p.r;
        const dy = (v - p.y) / p.r;
        const q = 1 - (dx * dx + dy * dy);
        if (q > 0) d = Math.max(d, q) + q * 0.18; // união suave dos novelos
      }
      // base plana: corta por baixo como um cúmulo real
      d *= smoothstep(0.62, 0.36, v);
      const n = fbm(u * 3.2 + seed * 3.1, v * 3.2 + seed * 1.7, seed);
      const fine = valueNoise(u * 14 + seed, v * 14 - seed, seed + 7);
      d = d * 1.15 + (n - 0.5) * 0.55 + (fine - 0.5) * 0.12;
      // margem de segurança: nunca há rectângulos visíveis
      d *= smoothstep(0.99, 0.82, Math.abs(u)) * smoothstep(0.99, 0.8, Math.abs(v));
      dens[y * w + x] = d;
    }
  }

  // 3. Iluminação: luz rasante do sol (cima-esquerda) — amostra a densidade "entre o pixel e o sol"
  const img = g.createImageData(w, h);
  const data = img.data;
  const sx = -Math.round(w * 0.018);
  const sy = -Math.round(h * 0.035);
  const at = (x: number, y: number) => {
    const xx = Math.min(w - 1, Math.max(0, x));
    const yy = Math.min(h - 1, Math.max(0, y));
    return dens[yy * w + xx];
  };
  for (let y = 0; y < h; y++) {
    const v = (y / h) * 2 - 1;
    for (let x = 0; x < w; x++) {
      const d = dens[y * w + x];
      const alpha = smoothstep(0.04, 0.36, d);
      if (alpha <= 0.003) continue;
      // densidade acumulada na direcção do sol → auto-sombra
      const occl = (at(x + sx, y + sy) + at(x + sx * 2, y + sy * 2) * 0.7 + at(x + sx * 3, y + sy * 3) * 0.45) / 2.15;
      let light = 1 - Math.max(0, occl - d * 0.35) * 1.05;
      light -= smoothstep(-0.1, 0.55, v) * 0.42; // ventre da nuvem mais escuro
      light = Math.max(0, Math.min(1, light));
      // orla prateada onde a nuvem é fina (contraluz)
      const rim = (1 - smoothstep(0.04, 0.3, d)) * 0.35;
      const l = Math.min(1, light + rim);
      const idx = (y * w + x) * 4;
      // sombra azul-acinzentada do céu ↔ branco quente do sol
      data[idx] = Math.round(lerp(150, 255, l));
      data[idx + 1] = Math.round(lerp(166, 253, l));
      data[idx + 2] = Math.round(lerp(196, 248, l));
      data[idx + 3] = Math.round(alpha * 255);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
};

interface CameraFlashStar {
  xNorm: number;
  yNorm: number;
  lastFlash: number;
  interval: number;
  color: string;
  size: number;
}

interface HeroGlobeProps {
  onPlayVideo?: (title: string, videoUrl: string) => void;
  viewportRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeroGlobe: React.FC<HeroGlobeProps> = ({ onPlayVideo, viewportRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    let rotX = -0.16;
    let rotY = -Math.PI * 0.10;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let mouseTiltX = 0;
    let mouseTiltY = 0;
    let targetMouseTiltX = 0;
    let targetMouseTiltY = 0;

    let currentMouseX = -9999;
    let currentMouseY = -9999;
    let isHoveringMoon = false;
    let hoveredFilmIndex = -1;
    let shutterFlash = 0;

    // --- SCROLL-DRIVEN TRANSITION: ENTRANDO EM MOÇAMBIQUE [HQ] ---
    let targetScrollProgress = 0;
    let smoothScrollProgress = 0;

    const onScroll = () => {
      const track = document.querySelector('.uc-hero-scroll-track') as HTMLElement;
      if (!track) {
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
        targetScrollProgress = Math.min(1, Math.max(0, scrollY / 600));
        return;
      }
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) {
        targetScrollProgress = 0;
        return;
      }
      const scrolled = -rect.top;
      targetScrollProgress = Math.min(1, Math.max(0, scrolled / trackHeight));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Nuvens realistas: sprites procedurais (fbm noise) gerados uma vez,
    // depois a câmara "voa" através delas em perspectiva durante a descida.
    const cloudSprites: HTMLCanvasElement[] = [];
    for (let s = 0; s < 6; s++) {
      cloudSprites.push(makeCloudSprite(360, 210, s * 1.37 + 0.5));
    }

    interface FlyCloud {
      x: number; // -1.6..1.6 (lateral)
      y: number; // -0.4..0.9 (vertical, positivo = abaixo do horizonte)
      z: number; // profundidade inicial
      size: number;
      sprite: number;
      flip: boolean;
      drift: number;
    }
    const flyClouds: FlyCloud[] = [];
    for (let i = 0; i < 46; i++) {
      flyClouds.push({
        x: (Math.random() - 0.5) * 3.2,
        y: -0.35 + Math.random() * 1.25,
        z: 0.15 + (i / 46) * 1.35 + Math.random() * 0.05,
        size: 0.55 + Math.random() * 0.75,
        sprite: i % cloudSprites.length,
        flip: Math.random() > 0.5,
        drift: (Math.random() - 0.5) * 0.04
      });
    }

    // Mar de nuvens no horizonte (camadas que sobem e cobrem a transição)
    interface DeckCloud { x: number; row: number; size: number; sprite: number; flip: boolean }
    const deckClouds: DeckCloud[] = [];
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 9; k++) {
        deckClouds.push({
          x: k / 9 + Math.random() * 0.06,
          row,
          size: 0.9 + Math.random() * 0.5,
          sprite: (row * 9 + k) % cloudSprites.length,
          flip: Math.random() > 0.5
        });
      }
    }

    let filmOrbitAngle = 0;
    const filmOrbitSpeed = 0.0030;

    const latLonToVec = (lat: number, lon: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180;
      const cosPhi = Math.cos(phi);
      return {
        x: cosPhi * Math.sin(theta),
        y: -Math.sin(phi),
        z: cosPhi * Math.cos(theta)
      };
    };

    const worldPoints = (worldData as WorldPoint[]).map(pt => ({
      ...pt,
      vec: latLonToVec(pt.lat, pt.lon)
    }));

    const markerVectors = MARKERS.map(m => ({
      ...m,
      vec: latLonToVec(m.lat, m.lon)
    }));

    const flashStars: CameraFlashStar[] = [];
    const flashColors = ['#ffffff', '#e0f7ff', '#fff3e0', '#ffeb3b'];
    for (let i = 0; i < 22; i++) {
      flashStars.push({
        xNorm: Math.random(),
        yNorm: 0.08 + Math.random() * 0.84,
        lastFlash: -Math.random() * 5,
        interval: 1.8 + Math.random() * 3.5,
        color: flashColors[i % flashColors.length],
        size: 2.5 + Math.random() * 2.5
      });
    }

    // Preload client brand logos for interconnected 24mm film reel
    const clientLogoImages: { name: string; img: HTMLImageElement | null }[] = [];
    CLIENT_BRANDS.forEach(item => {
      let img: HTMLImageElement | null = null;
      if (item.logo) {
        img = new Image();
        img.src = item.logo;
      }
      clientLogoImages.push({ name: item.name, img });
    });

    // Fita DOM de aterragem: o canvas controla a sua posição; o hover pausa a fita
    let stripHover = false;
    const stripEl = document.getElementById('heroLandingStrip');
    const onStripEnter = () => { stripHover = true; };
    const onStripLeave = () => { stripHover = false; };
    stripEl?.addEventListener('mouseenter', onStripEnter);
    stripEl?.addEventListener('mouseleave', onStripLeave);

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (isHoveringMoon) {
        shutterFlash = 1.0;
        onPlayVideo?.(
          'Mizine Multimédia — Apresentação 4K DCI',
          '/media/videos/showreel.mp4'
        );
        return;
      }

      if (hoveredFilmIndex >= 0) {
        shutterFlash = 1.0;
        onPlayVideo?.(
          'Mizine Multimédia — O Que É A Mizine [4K DCI]',
          '/media/videos/showreel.mp4'
        );
        return;
      }

      if (clickX > width * 0.38) {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMouseX = e.clientX - rect.left;
      currentMouseY = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        rotY += dx * 0.005;
        rotX += dy * 0.003;
        rotX = Math.max(-0.35, Math.min(0.15, rotX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const nx = e.clientX / width - 0.5;
        const ny = e.clientY / height - 0.5;
        targetMouseTiltX = ny * 0.08;
        targetMouseTiltY = nx * 0.12;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const rect = canvas.getBoundingClientRect();
        currentMouseX = e.touches[0].clientX - rect.left;
        currentMouseY = e.touches[0].clientY - rect.top;

        if (isHoveringMoon || hoveredFilmIndex >= 0) {
          onPlayVideo?.('Mizine Multimédia — Apresentação 4K', '/media/videos/showreel.mp4');
          return;
        }

        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        rotY += dx * 0.006;
        rotX += dy * 0.003;
        rotX = Math.max(-0.35, Math.min(0.15, rotX));
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const rotate3D = (v: { x: number; y: number; z: number }, cosY: number, sinY: number, cosX: number, sinX: number) => {
      const x1 = v.x * cosY + v.z * sinY;
      const z1 = -v.x * sinY + v.z * cosY;
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    let time = 0;

    const render = () => {
      time += 0.015;
      // Depois de aterrar, a fita abranda para os logos se lerem; o hover pausa-a
      const settled = smoothstep(0.8, 0.97, smoothScrollProgress);
      if (!(stripHover && settled > 0.99)) {
        filmOrbitAngle += filmOrbitSpeed * (1 - 0.8 * settled);
      }

      // Continuous natural planet rotation (slows down as the camera locks onto Mozambique)
      if (!isDragging) {
        rotY -= 0.0022 * (1 - smoothstep(0, 0.35, smoothScrollProgress));
      }

      mouseTiltX += (targetMouseTiltX - mouseTiltX) * 0.08;
      mouseTiltY += (targetMouseTiltY - mouseTiltY) * 0.08;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.clearRect(0, 0, width, height);

      // --- SCROLL INTERPOLATION & ZOOM INTO MOÇAMBIQUE ---
      if (targetScrollProgress === 0) {
        if (smoothScrollProgress < 0.05) {
          smoothScrollProgress = 0;
        } else {
          smoothScrollProgress += (0 - smoothScrollProgress) * 0.28;
        }
      } else {
        smoothScrollProgress += (targetScrollProgress - smoothScrollProgress) * 0.12;
        if (Math.abs(targetScrollProgress - smoothScrollProgress) < 0.0015) smoothScrollProgress = targetScrollProgress;
      }
      const sp = smoothScrollProgress <= 0.001 ? 0 : smoothScrollProgress;

      // Update Hero Viewport Left Elements directly (smooth 60fps hardware accelerated)
      if (viewportRef?.current) {
        const vp = viewportRef.current;
        if (sp === 0) {
          vp.style.opacity = '1';
          vp.style.transform = 'translateY(0px)';
          vp.style.pointerEvents = 'auto';
        } else {
          const fadeOut = Math.max(0, 1 - sp * 2.6);
          vp.style.opacity = fadeOut.toFixed(3);
          vp.style.transform = `translateY(${(-sp * 60).toFixed(1)}px)`;
          vp.style.pointerEvents = fadeOut < 0.1 ? 'none' : 'auto';
        }
      }
      const badge = document.querySelector('.uc-floating-badge') as HTMLElement;
      if (badge) {
        badge.style.opacity = sp === 0 ? '1' : Math.max(0, 1 - sp * 1.8).toFixed(3);
      }
      const scrollInd = document.querySelector('.uc-hero-scroll-indicator') as HTMLElement;
      if (scrollInd) {
        scrollInd.style.opacity = sp === 0 ? '1' : Math.max(0, 1 - sp * 2.2).toFixed(3);
      }

      // ================= LINHA TEMPORAL DA DESCIDA (sp 0 → 1) =================
      // 0.00–0.35  câmara roda e centra Maputo
      // 0.02–0.52  mergulho exponencial até Moçambique preencher o ecrã
      // 0.30–0.68  atmosfera: preto → azul profundo → céu
      // 0.48–0.97  voo através das nuvens + mar de nuvens a subir
      // 0.76–0.92  luz do dia (#f8f9fc) — igual ao fundo da secção seguinte
      // 0.76–0.92  fita aterra exactamente sobre a fita real (fixa no ecrã); troca canvas→DOM 0.92–0.96
      // 0.84–0.94  "TRABALHAMOS COM MARCAS CORAJOSAS" aparece e aponta para a fita
      const rotP = smoothstep(0, 0.35, sp);
      const zoomP = smoothstep(0.02, 0.52, sp);
      const atmoP = smoothstep(0.30, 0.68, sp);
      const washP = smoothstep(0.76, 0.92, sp);
      const reelP = smoothstep(0.05, 0.76, sp);
      const landP = smoothstep(0.76, 0.92, sp);

      // Altímetro fixo (no <body>)
      const flightHudEl = document.getElementById('flightTelemetryHud');
      if (flightHudEl) {
        // também pela posição real (saltos pelo menu não mostram o altímetro a "rebobinar")
        if (sp > 0.03 && sp < 0.88 && targetScrollProgress < 0.9) {
          flightHudEl.classList.add('is-active');
          const altProgress = Math.min(1, (sp - 0.03) / 0.9);
          const altM = 24800 * Math.pow(1 - altProgress, 1.7);
          const altValEl = document.getElementById('hudAltitudeVal');
          const altUnitEl = document.getElementById('hudAltUnit');
          const machValEl = document.getElementById('hudMachVal');
          const tapeEl = document.getElementById('hudAltTape');
          const barEl = document.getElementById('hudAltBar');
          if (altValEl) altValEl.textContent = altM >= 1000 ? (altM / 1000).toFixed(1) : Math.round(altM).toString();
          if (altUnitEl) altUnitEl.textContent = altM >= 1000 ? 'KM' : 'M';
          if (machValEl) {
            const mach = 12.4 * Math.pow(1 - altProgress, 1.3);
            machValEl.textContent = mach >= 1 ? `MACH ${mach.toFixed(1)}` : `${Math.round(mach * 1225)} KM/H`;
          }
          if (tapeEl) tapeEl.style.backgroundPositionY = `${(altM / 40).toFixed(1)}px`;
          if (barEl) barEl.style.transform = `scaleX(${altProgress.toFixed(3)})`;
        } else {
          flightHudEl.classList.remove('is-active');
        }
      }

      // --- PLANETA À DIREITA EM REPOUSO, MERGULHO ATÉ MOÇAMBIQUE ---
      const isMobile = width < 900;
      const baseRadius = isMobile
        ? Math.min(width * 0.42, height * 0.32)
        : Math.min(height * 0.39, width * 0.26);

      // Zoom exponencial (sensação de velocidade constante): até 11x — Moçambique enche o ecrã
      const radius = baseRadius * Math.pow(11, zoomP);

      // Orientação alvo: Maputo (lat -25.96, lon 32.58) virado para a câmara
      const targetRotX = 0.4531;
      const baseTargetRotY = - (32.58 * Math.PI) / 180;
      const diffY = ((baseTargetRotY - rotY) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      const targetRotY = rotY + diffY;

      const currentRotY = rotY + (targetRotY - rotY) * rotP;
      const currentRotX = rotX + (targetRotX - rotX) * rotP;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const defaultCX = isMobile ? width * 0.50 : width - baseRadius - 75;
      const defaultCY = isMobile ? height * 0.36 : height * 0.50;

      // Centro do globo calculado para que Maputo fique EXACTAMENTE no centro do ecrã
      const mozVec = latLonToVec(-25.96, 32.58);
      const mozRot = rotate3D(mozVec, cosY, sinY, cosX, sinX);
      const centerP = smoothstep(0, 0.40, sp);
      const cx = lerp(defaultCX, width * 0.50 - mozRot.x * radius, centerP);
      const cy = lerp(defaultCY, height * 0.46 - mozRot.y * radius, centerP);

      // --- LAYER 1: ENLARGED MOON WITH DISCREET LUNAR PHASES & EASTER EGG ---
      const textPaddingLeft = Math.min(100, Math.max(40, width * 0.06));
      const moonX = isMobile ? 60 : textPaddingLeft + 25;
      const moonY = isMobile ? 65 : 75; // Placed high at top-left to guarantee ZERO text collision!
      const baseMoonR = isMobile ? 18 : 24;
      const vfW = isMobile ? 86 : (isHoveringMoon ? 120 : 105);
      const vfH = isMobile ? 54 : (isHoveringMoon ? 70 : 60);

      const moonAlpha = Math.max(0, 1 - sp * 2.8);
      if (moonAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = moonAlpha;

        const distToMoon = Math.hypot(currentMouseX - moonX, currentMouseY - moonY);
        isHoveringMoon = sp < 0.2 && distToMoon < baseMoonR * 1.8;
        const moonR = isHoveringMoon ? baseMoonR * 1.15 : baseMoonR;

      // Lunar Phase Calculation (Subtle, discreet, slow: 1 complete cycle every ~95s)
      const moonCycleSpeed = 0.035;
      const phaseNorm = (time * moonCycleSpeed) % 1; // 0 to 1
      const phaseAngle = phaseNorm * Math.PI * 2;
      const k = Math.cos(phaseAngle); // -1 (New Moon) -> +1 (Full Moon) -> -1 (New Moon)

      // Halo adapts subtly with the lunar phase illumination
      const illumFraction = (k + 1) * 0.5; // 0 (New) to 1 (Full)
      const haloAlpha = 0.20 + illumFraction * 0.25 + (isHoveringMoon ? 0.25 : 0);
      const haloMul = isHoveringMoon ? 4.5 : (3.2 + illumFraction * 0.5);

      const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.3, moonX, moonY, moonR * haloMul);
      moonHalo.addColorStop(0, `rgba(255, 59, 48, ${haloAlpha})`);
      moonHalo.addColorStop(0.5, `rgba(255, 45, 85, ${haloAlpha * 0.35})`);
      moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * haloMul, 0, Math.PI * 2);
      ctx.fillStyle = moonHalo;
      ctx.fill();

      // Draw Moon Sphere with Lunar Phase
      ctx.save();
      // 1. Dark side base
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = '#180202';
      ctx.fill();

      // 2. Illuminated portion (terminator curve)
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.clip(); // Constrain inside lunar disk

      ctx.beginPath();
      if (phaseNorm < 0.5) {
        // Waxing (crescente à direita)
        ctx.arc(moonX, moonY, moonR, -Math.PI / 2, Math.PI / 2, false);
        ctx.ellipse(moonX, moonY, Math.max(0.1, Math.abs(k) * moonR), moonR, 0, Math.PI / 2, -Math.PI / 2, k < 0);
      } else {
        // Waning (minguante à esquerda)
        ctx.arc(moonX, moonY, moonR, Math.PI / 2, -Math.PI / 2, false);
        ctx.ellipse(moonX, moonY, Math.max(0.1, Math.abs(k) * moonR), moonR, 0, -Math.PI / 2, Math.PI / 2, k < 0);
      }
      ctx.closePath();

      const moonGrad = ctx.createRadialGradient(moonX - moonR * 0.3, moonY - moonR * 0.3, 2, moonX, moonY, moonR);
      moonGrad.addColorStop(0, isHoveringMoon ? '#ff6961' : '#ff453a');
      moonGrad.addColorStop(0.65, '#d32f2f');
      moonGrad.addColorStop(1, '#500202');
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Subtle lunar crater texture
      ctx.beginPath();
      ctx.arc(moonX - moonR * 0.25, moonY - moonR * 0.2, moonR * 0.2, 0, Math.PI * 2);
      ctx.arc(moonX + moonR * 0.3, moonY + moonR * 0.15, moonR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fill();

      ctx.restore();

      // Camera Viewfinder Corners around the Moon [ 🔴 REC ]
      const vfX = moonX - vfW / 2;
      const vfY = moonY - vfH / 2;
      const cLen = isHoveringMoon ? 12 : 10;

      ctx.save();
      ctx.strokeStyle = isHoveringMoon ? '#00d4ff' : 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = isHoveringMoon ? 1.8 : 1.3;

      // Top-Left [
      ctx.beginPath();
      ctx.moveTo(vfX, vfY + cLen);
      ctx.lineTo(vfX, vfY);
      ctx.lineTo(vfX + cLen, vfY);
      ctx.stroke();

      // Top-Right ]
      ctx.beginPath();
      ctx.moveTo(vfX + vfW - cLen, vfY);
      ctx.lineTo(vfX + vfW, vfY);
      ctx.lineTo(vfX + vfW, vfY + cLen);
      ctx.stroke();

      // Bottom-Left [
      ctx.beginPath();
      ctx.moveTo(vfX, vfY + vfH - cLen);
      ctx.lineTo(vfX, vfY + vfH);
      ctx.lineTo(vfX + cLen, vfY + vfH);
      ctx.stroke();

      // Bottom-Right ]
      ctx.beginPath();
      ctx.moveTo(vfX + vfW - cLen, vfY + vfH);
      ctx.lineTo(vfX + vfW, vfY + vfH);
      ctx.lineTo(vfX + vfW, vfY + vfH - cLen);
      ctx.stroke();

      // Bold Blinking REC Label with glowing indicator
      const isRecBlink = Math.sin(time * 3.6) > -0.2;
      ctx.font = '800 12.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isHoveringMoon ? '#00d4ff' : (isRecBlink ? '#ffffff' : 'rgba(255, 255, 255, 0.35)');
      ctx.textAlign = 'left';
      ctx.fillText(isHoveringMoon ? 'REC ON' : 'REC', moonX + moonR + 10, moonY + 4);

      // Micro Camera Telemetry / Easter Egg
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isHoveringMoon ? '#00d4ff' : 'rgba(255, 255, 255, 0.65)';
      const sec = Math.floor(time) % 60;
      const fr = Math.floor((time * 24) % 24);
      const tcStr = `TC 00:04:${sec.toString().padStart(2, '0')}:${fr.toString().padStart(2, '0')}`;
      
      if (isHoveringMoon) {
        ctx.fillStyle = '#ff3b30';
        ctx.fillText(`● ESTÚDIO AO VIVO • CLIQUE PARA ASSISTIR ▶`, vfX - 8, vfY + vfH + 15);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(`4K DCI • 24.000FPS • ISO 800 • 1/48`, vfX - 8, vfY + vfH + 26);
      } else {
        ctx.fillText(`● LUA / REC • 4K DCI`, vfX, vfY + vfH + 14);
        ctx.fillText(tcStr, vfX, vfY + vfH + 24);
      }
      ctx.restore();
      ctx.restore();
    }

      // --- LAYER 2: CAMERA LED FLASH STARS IN THE COSMIC VOID ---
      const starsAlpha = Math.max(0, 1 - sp * 2.5);
      if (starsAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = starsAlpha;

        const voidMinX = moonX + vfW * 0.65;
        const voidMaxX = cx - radius - 20;

      if (voidMaxX > voidMinX) {
        for (let i = 0; i < flashStars.length; i++) {
          const star = flashStars[i];
          const starX = voidMinX + star.xNorm * (voidMaxX - voidMinX);
          const starY = star.yNorm * height;

          if (time - star.lastFlash > star.interval) {
            star.lastFlash = time;
            star.interval = 1.5 + Math.random() * 3.5;
          }

          const flashAge = time - star.lastFlash;
          const flashDuration = 0.32;

          if (flashAge >= 0 && flashAge < flashDuration) {
            const progress = flashAge / flashDuration;
            const flashIntensity = Math.pow(1 - progress, 2.5);

            ctx.save();
            const coronaR = (star.size * 5) * flashIntensity;
            const coronaGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, coronaR);
            coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            coronaGrad.addColorStop(0.3, star.color);
            coronaGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = coronaGrad;
            ctx.beginPath();
            ctx.arc(starX, starY, coronaR, 0, Math.PI * 2);
            ctx.fill();

            const rayW = (32 + star.size * 8) * flashIntensity;
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.9 * flashIntensity) + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(starX - rayW, starY);
            ctx.lineTo(starX + rayW, starY);
            ctx.stroke();

            const rayH = (14 + star.size * 4) * flashIntensity;
            ctx.beginPath();
            ctx.moveTo(starX, starY - rayH);
            ctx.lineTo(starX, starY + rayH);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(starX, starY, star.size * 0.9 * flashIntensity, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            const twinkle = 0.25 + Math.sin(time * 2 + i) * 0.15;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + twinkle + ')';
            ctx.beginPath();
            ctx.arc(starX, starY, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }

      // --- LAYER 3: FITA DE CINEMA REAL (base preta contínua + perfurações) QUE DESCE E ATERRA NA PÁGINA ---
      // Múltiplo exacto do nº de marcas → a sequência de logos não tem "costura" e coincide com a fita DOM
      const brandCount = Math.max(1, clientLogoImages.length);
      const filmFrames = brandCount * Math.max(1, Math.round(44 / brandCount));
      const frameAspect = 208 / 190; // mesma proporção da fita DOM (.cine-frame)
      const orbitR = lerp(baseRadius * 1.24, Math.max(width * 0.62, baseRadius * 1.6), reelP);
      const frameLen = (Math.PI * 2 * orbitR) / filmFrames;
      const filmW = frameLen / frameAspect;
      const reelCX = lerp(defaultCX, width * 0.5, smoothstep(0.05, 0.45, sp));
      // durante o mergulho a fita desce para não tapar Moçambique (centrado a ~46% da altura)
      const reelCY = lerp(defaultCY, height * 0.8, reelP);
      const filmInclination = lerp(-0.30, -0.07, reelP);
      // No espaço: película escura (negativo). Depois das nuvens, os fotogramas "revelam-se" com as marcas.
      const litP = smoothstep(0.56, 0.72, sp);

      // Alvo de aterragem: a fita real (DOM), fixa dentro da cena sticky — não se mexe durante a transição
      const landingStrip = document.getElementById('heroLandingStrip');
      const landingTrack = document.getElementById('heroLandingTrack');
      const landingHead = document.getElementById('heroLandingHead');
      let landY = height * 0.7;
      let landH = 190;
      let landFrameW = 208;
      let stripLeft = 0;
      if (landingStrip) {
        const r = landingStrip.getBoundingClientRect();
        const cr = canvas.getBoundingClientRect();
        landY = r.top - cr.top + r.height / 2;
        landH = r.height;
        stripLeft = r.left - cr.left;
        const fr = landingStrip.querySelector('.cine-frame') as HTMLElement | null;
        if (fr && fr.offsetWidth > 0) landFrameW = fr.offsetWidth;
      }
      const landFlatR = (landFrameW * filmFrames) / (Math.PI * 2);
      const reelAlpha = 1 - smoothstep(0.935, 0.965, sp);

      // Fita DOM: mesma fase que a fita do canvas (fotograma i do canvas ≡ fotograma k da DOM, k ≡ −i mod nº marcas)
      if (landingTrack) {
        const cycle = brandCount * landFrameW;
        const phase = ((filmOrbitAngle + Math.PI / 2) * filmFrames) / (Math.PI * 2);
        let tx = width * 0.5 - stripLeft + (phase - 1.002) * landFrameW;
        tx = (((tx % cycle) + cycle) % cycle) - cycle;
        landingTrack.style.transform = `translate3d(${tx.toFixed(2)}px, 0, 0)`;
      }
      if (landingStrip) {
        const o = smoothstep(0.92, 0.945, sp);
        landingStrip.style.opacity = o.toFixed(3);
        landingStrip.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      }
      const reelMeta = document.querySelector('.landing-reel .film-reel-meta-bar') as HTMLElement | null;
      if (reelMeta) reelMeta.style.opacity = smoothstep(0.9, 0.96, sp).toFixed(3);
      if (landingHead) {
        const ho = smoothstep(0.84, 0.94, sp);
        landingHead.style.opacity = ho.toFixed(3);
        landingHead.style.transform = `translateY(${((1 - ho) * 28).toFixed(1)}px)`;
        landingHead.style.pointerEvents = ho > 0.6 ? 'auto' : 'none';
      }

      interface ScreenPt { x: number; y: number; z: number }
      interface FilmQuad {
        tl: ScreenPt;
        tr: ScreenPt;
        br: ScreenPt;
        bl: ScreenPt;
        centerZ: number;
        index: number;
        screenCenterX: number;
        screenCenterY: number;
      }

      const filmQuads: FilmQuad[] = [];
      const cosMouseY = Math.cos(mouseTiltY);
      const sinMouseY = Math.sin(mouseTiltY);
      const cosMouseX = Math.cos(rotX * (1 - reelP) + mouseTiltX);
      const sinMouseX = Math.sin(rotX * (1 - reelP) + mouseTiltX);
      const cosIncl = Math.cos(filmInclination);
      const sinIncl = Math.sin(filmInclination);

      const getFilmEdge = (angle: number, offset: number): ScreenPt => {
        const ox = orbitR * Math.cos(angle);
        const oz = orbitR * Math.sin(angle);
        const y0 = oz * sinIncl + offset * cosIncl;
        const z0 = oz * cosIncl - offset * sinIncl;
        const xCam = ox * cosMouseY + z0 * sinMouseY;
        const zTmp = -ox * sinMouseY + z0 * cosMouseY;
        const yCam = y0 * cosMouseX - zTmp * sinMouseX;
        const zCam = y0 * sinMouseX + zTmp * cosMouseX;
        return { x: reelCX + xCam, y: reelCY + yCam, z: zCam };
      };

      for (let i = 0; i < filmFrames; i++) {
        const a1 = (i / filmFrames) * Math.PI * 2 - filmOrbitAngle;
        const a2 = ((i + 1.004) / filmFrames) * Math.PI * 2 - filmOrbitAngle;
        let tl = getFilmEdge(a1, filmW * 0.5);
        let tr = getFilmEdge(a2, filmW * 0.5);
        let br = getFilmEdge(a2, -filmW * 0.5);
        let bl = getFilmEdge(a1, -filmW * 0.5);

        // Aterragem: a fita "desenrola" e alinha-se pixel a pixel com a fita DOM
        if (landP > 0) {
          const aC = (a1 + a2) / 2;
          const daC = (((aC - Math.PI / 2 + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
          const fxC = width * 0.5 - daC * landFlatR;
          const fx1 = fxC + landFrameW / 2;
          const fx2 = fxC - landFrameW / 2;
          const fyA = landY + landH / 2;
          const fyB = landY - landH / 2;
          const mix = (p: ScreenPt, fx: number, fy: number): ScreenPt => ({
            x: lerp(p.x, fx, landP),
            y: lerp(p.y, fy, landP),
            z: lerp(p.z, Math.abs(daC) < Math.PI / 2 ? 1 : -1, landP)
          });
          tl = mix(tl, fx1, fyA);
          tr = mix(tr, fx2, fyA);
          br = mix(br, fx2, fyB);
          bl = mix(bl, fx1, fyB);
        }

        const centerZ = (tl.z + tr.z + br.z + bl.z) / 4;
        filmQuads.push({
          tl, tr, br, bl, centerZ, index: i,
          screenCenterX: (tl.x + tr.x + br.x + bl.x) / 4,
          screenCenterY: (tl.y + tr.y + br.y + bl.y) / 4
        });
      }

      hoveredFilmIndex = -1;
      if (sp < 0.2) {
        let closestDist = Math.max(28, frameLen * 0.5);
        for (let i = 0; i < filmQuads.length; i++) {
          const q = filmQuads[i];
          if (q.centerZ > 0) {
            const d = Math.hypot(currentMouseX - q.screenCenterX, currentMouseY - q.screenCenterY);
            if (d < closestDist) {
              closestDist = d;
              hoveredFilmIndex = q.index;
            }
          }
        }
      }

      if (isHoveringMoon || hoveredFilmIndex >= 0) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'default';
      }

      // Proporções idênticas às do CSS da fita DOM (fita 35mm real)
      const PERF_COUNT = 8;
      const PERF_W = 14 / 208;
      const PERF_V0 = 0.045;
      const PERF_V1 = 0.118;
      const WIN_U0 = 0.016;
      const WIN_V0 = 0.165;
      const WIN_V1 = 0.835;

      const drawFilmQuad = (q: FilmQuad, isBack: boolean) => {
        const backFade = isBack ? lerp(0.5, 0, smoothstep(0.25, 0.75, reelP)) : 1;
        const alpha = reelAlpha * backFade;
        if (alpha < 0.01) return;
        const isHovered = q.index === hoveredFilmIndex;
        const scale = isHovered ? 1.22 : 1.0;
        const mx = q.screenCenterX;
        const my = q.screenCenterY;

        // Ponto bilinear dentro do fotograma: u ao longo da fita, v através (0 = borda tl/tr)
        const P = (u: number, v: number) => {
          const topX = lerp(q.tl.x, q.tr.x, u);
          const topY = lerp(q.tl.y, q.tr.y, u);
          const botX = lerp(q.bl.x, q.br.x, u);
          const botY = lerp(q.bl.y, q.br.y, u);
          return {
            x: mx + (lerp(topX, botX, v) - mx) * scale,
            y: my + (lerp(topY, botY, v) - my) * scale
          };
        };
        const quadPath = (u0: number, u1: number, v0: number, v1: number) => {
          const a = P(u0, v0);
          const b = P(u1, v0);
          const c = P(u1, v1);
          const d = P(u0, v1);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.lineTo(d.x, d.y);
          ctx.closePath();
        };

        ctx.save();
        ctx.globalAlpha = alpha;

        // 1. Base de acetato preta contínua
        ctx.beginPath();
        quadPath(0, 1, 0, 1);
        ctx.fillStyle = isBack ? 'rgba(8, 8, 12, 0.85)' : '#0c0c10';
        if (isHovered) {
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 16;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // 2. Janela do fotograma (separada por linhas de fotograma pretas)
        ctx.beginPath();
        quadPath(WIN_U0, 1 - WIN_U0, WIN_V0, WIN_V1);
        // Espaço: celulóide escuro com tom âmbar de negativo; depois das nuvens: fotograma revelado (claro)
        const wr = Math.round(lerp(42, 245, litP));
        const wg = Math.round(lerp(31, 246, litP));
        const wb = Math.round(lerp(24, 249, litP));
        ctx.fillStyle = `rgb(${wr}, ${wg}, ${wb})`;
        ctx.fill();
        if (isHovered && !isBack) {
          ctx.fillStyle = 'rgba(0, 212, 255, 0.25)';
          ctx.fill();
        }
        // Brilho do celulóide (reflexo diagonal subtil)
        if (!isBack) {
          const g0 = P(0, WIN_V0);
          const g1 = P(1, WIN_V1);
          const sheen = ctx.createLinearGradient(g0.x, g0.y, g1.x, g1.y);
          sheen.addColorStop(0, 'rgba(255,255,255,0)');
          sheen.addColorStop(0.45, `rgba(200,206,220,${0.12 + 0.1 * litP})`);
          sheen.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = sheen;
          ctx.fill();
        }

        // 3. Perfurações (8 por fotograma, em cima e em baixo — como fita 35mm)
        ctx.beginPath();
        for (let k = 0; k < PERF_COUNT; k++) {
          const uc = (k + 0.5) / PERF_COUNT;
          quadPath(uc - PERF_W / 2, uc + PERF_W / 2, PERF_V0, PERF_V1);
          quadPath(uc - PERF_W / 2, uc + PERF_W / 2, 1 - PERF_V1, 1 - PERF_V0);
        }
        ctx.fillStyle = isBack
          ? 'rgba(200, 208, 225, 0.35)'
          : `rgba(${Math.round(lerp(205, 248, litP))}, ${Math.round(lerp(212, 249, litP))}, ${Math.round(lerp(228, 252, litP))}, 0.95)`;
        ctx.fill();

        // 4. Logótipo do cliente + nome (igual à fita DOM)
        if (!isBack) {
          const logoObj = clientLogoImages[q.index % clientLogoImages.length];
          const w0 = P(WIN_U0, WIN_V0);
          const w1 = P(1 - WIN_U0, WIN_V0);
          const w3 = P(WIN_U0, WIN_V1);
          const winW = Math.hypot(w1.x - w0.x, w1.y - w0.y);
          const winH = Math.hypot(w3.x - w0.x, w3.y - w0.y);
          const c = P(0.5, 0.5);
          // Layout idêntico ao .cine-frame-window da fita DOM (logo a 40%, nome a 77%, etiqueta a 89%)
          const showName = winH > 70;
          // as marcas só aparecem quando a película é revelada (depois das nuvens)
          ctx.globalAlpha = alpha * smoothstep(0.35, 0.9, litP);
          const ly = showName ? c.y - winH * 0.1 : c.y;
          const img = logoObj?.img;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (img && img.complete && img.naturalWidth > 0 && winW > 10) {
            const maxW = winW * 0.7;
            const maxH = winH * (showName ? 0.4 : 0.6);
            const aspect = img.naturalWidth / (img.naturalHeight || 1);
            let dw = maxW;
            let dh = dw / aspect;
            if (dh > maxH) {
              dh = maxH;
              dw = dh * aspect;
            }
            ctx.drawImage(img, c.x - dw / 2, ly - dh / 2, dw, dh);
          } else if (logoObj && !img && winW > 10) {
            // Logotipo tipográfico (marcas ainda sem ficheiro de logo)
            // mesma regra que o CSS (.cine-frame-wordmark): 16% da janela, reduzido para nomes longos
            const fs = Math.min(winH * 0.16, (winW * 0.8) / (0.62 * logoObj.name.length));
            ctx.font = `900 ${fs.toFixed(1)}px "Space Grotesk", sans-serif`;
            ctx.fillStyle = '#111218';
            ctx.fillText(logoObj.name, c.x, ly);
            ctx.fillStyle = '#ff3b30';
            ctx.fillRect(c.x - winW * 0.08, ly + fs * 0.62, winW * 0.16, Math.max(1.5, winH * 0.018));
          }
          if (showName && logoObj) {
            if (img) {
              ctx.font = `800 ${Math.max(8, Math.round(winH * 0.085))}px "Space Grotesk", sans-serif`;
              ctx.fillStyle = '#111218';
              ctx.fillText(logoObj.name, c.x, c.y + winH * 0.27);
            }
            ctx.font = `600 ${Math.max(6, Math.round(winH * 0.055))}px "JetBrains Mono", monospace`;
            ctx.fillStyle = '#ff3b30';
            ctx.fillText(CLIENT_BRANDS[q.index % brandCount]?.tag ?? '', c.x, c.y + winH * 0.39);
          }
          ctx.textBaseline = 'alphabetic';
        }

        if (isHovered && litP <= 0.35) {
          const c = P(0.5, 0.5);
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(c.x - 4, c.y - 6);
          ctx.lineTo(c.x + 7, c.y);
          ctx.lineTo(c.x - 4, c.y + 6);
          ctx.closePath();
          ctx.fill();

          ctx.font = '800 9.5px "Space Grotesk", sans-serif';
          const tipText = '▶ VER APRESENTAÇÃO MIZINE 4K';
          const tipW = ctx.measureText(tipText).width + 16;
          ctx.fillStyle = '#030408';
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 1.2;
          ctx.fillRect(c.x - tipW / 2, c.y - 44, tipW, 22);
          ctx.strokeRect(c.x - tipW / 2, c.y - 44, tipW, 22);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(tipText, c.x, c.y - 30);
        }

        ctx.restore();
      };

      // --- PHASE A: METADE DE TRÁS DA FITA (atrás do planeta) ---
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ < 0) {
          drawFilmQuad(filmQuads[i], true);
        }
      }

      // --- PHASE B: SOLID PLANET SPHERE CORE ---
      const coreGrad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius);
      coreGrad.addColorStop(0, 'rgba(2, 3, 6, 0.99)');
      coreGrad.addColorStop(0.75, 'rgba(2, 3, 7, 0.97)');
      coreGrad.addColorStop(1, 'rgba(3, 6, 14, 0.88)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Complete 360-degree Mathematical Circumference Outline
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sharp Neon Blue Crescent Edge Stroke
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0.35 * Math.PI, 1.2 * Math.PI);
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.85)';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Sharp Neon Fiery Amber Top Arc Stroke
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 1.3 * Math.PI, 1.95 * Math.PI);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.9)';
      ctx.shadowColor = '#ff6b00';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // --- PHASE C: REAL CONTINENTS & AUTHENTIC MOZAMBIQUE BORDER ---
      interface ProjPt {
        px: number;
        py: number;
        z: number;
        moz?: boolean;
        coast?: boolean;
      }

      const projectedPoints: ProjPt[] = [];

      for (let i = 0; i < worldPoints.length; i++) {
        const pt = worldPoints[i];
        const rot = rotate3D(pt.vec, cosY, sinY, cosX, sinX);

        if (rot.z > -0.05) {
          projectedPoints.push({
            px: cx + rot.x * radius,
            py: cy + rot.y * radius,
            z: rot.z,
            moz: pt.moz,
            coast: pt.coast
          });
        }
      }

      projectedPoints.sort((a, b) => a.z - b.z);

      // Território de Moçambique preenchido (os pontos fundem-se num só bloco ao aproximar)
      const mozFillA = smoothstep(0.06, 0.4, sp);
      if (mozFillA > 0.01) {
        const blobR = Math.max(2, radius * 0.0115);
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < projectedPoints.length; i++) {
          const pt = projectedPoints[i];
          if (!pt.moz || pt.z < 0.05) continue;
          ctx.moveTo(pt.px + blobR, pt.py);
          ctx.arc(pt.px, pt.py, blobR, 0, Math.PI * 2);
        }
        ctx.fillStyle = `rgba(255, 59, 48, ${0.30 * mozFillA})`;
        ctx.shadowColor = 'rgba(255, 59, 48, 0.9)';
        ctx.shadowBlur = 30 * mozFillA;
        ctx.fill();
        ctx.restore();
      }
      const dotGrow = 1 + zoomP * 1.6;

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const depth = pt.z;

        if (pt.moz) {
          const isBorder = pt.coast;
          const rMoz = (isBorder ? 1.55 : 1.2) * (0.65 + depth * 0.55) * dotGrow;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz, 0, Math.PI * 2);
          ctx.fillStyle = isBorder
            ? `rgba(255, 60, 48, ${Math.min(1, 0.95 * depth + 0.25)})`
            : `rgba(255, 95, 80, ${Math.min(1, 0.85 * depth + 0.20)})`;
          ctx.fill();
        } else {
          const isCoast = pt.coast;
          const r = (isCoast ? 1.4 : 1.1) * (0.65 + depth * 0.45) * dotGrow;
          let alpha = (isCoast ? 0.98 : 0.78) * (0.40 + depth * 0.60);

          const dist = Math.hypot(pt.px - cx, pt.py - cy) / radius;
          if (dist > 0.85) alpha = Math.min(1, alpha * 1.3);

          ctx.beginPath();
          ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);
          ctx.fillStyle = isCoast
            ? `rgba(255, 255, 255, ${alpha * 0.95})`
            : `rgba(215, 225, 245, ${alpha * 0.82})`;
          ctx.fill();
        }
      }

      // --- PHASE D: "TUDO SAI DE MOÇAMBIQUE PARA O MUNDO" ARCS & STREAMING PACKETS ---
      const arcFade = 1 - smoothstep(0.08, 0.35, sp);
      for (let i = 0; i < GLOBAL_ARCS.length && arcFade > 0.01; i++) {
        const arc = GLOBAL_ARCS[i];
        const fromVec = latLonToVec(arc.fromLat, arc.fromLon);
        const toVec = latLonToVec(arc.toLat, arc.toLon);

        const rotFrom = rotate3D(fromVec, cosY, sinY, cosX, sinX);
        const rotTo = rotate3D(toVec, cosY, sinY, cosX, sinX);

        if (rotFrom.z > -0.15 || rotTo.z > -0.15) {
          const fromPX = cx + rotFrom.x * radius;
          const fromPY = cy + rotFrom.y * radius;
          const toPX = cx + rotTo.x * radius;
          const toPY = cy + rotTo.y * radius;

          const midVec = {
            x: (rotFrom.x + rotTo.x) * 0.5 * 1.32,
            y: (rotFrom.y + rotTo.y) * 0.5 * 1.32,
            z: (rotFrom.z + rotTo.z) * 0.5 * 1.32
          };
          const midPX = cx + midVec.x * radius;
          const midPY = cy + midVec.y * radius;

          const arcAlpha = Math.max(0.1, (rotFrom.z + rotTo.z + 1.2) / 2.4) * arcFade;

          // Glowing Distribution Trajectory Arc
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(fromPX, fromPY);
          ctx.quadraticCurveTo(midPX, midPY, toPX, toPY);
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = 0.44 * arcAlpha;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // 2 Traveling Content/Social Media Packets Streaming FROM MOÇAMBIQUE OUTWARDS!
          for (let p = 0; p < 2; p++) {
            const packetPhase = (time * 0.65 + p * 0.5 + i * 0.18) % 1;
            const inv = 1 - packetPhase;
            const curPX = inv * inv * fromPX + 2 * inv * packetPhase * midPX + packetPhase * packetPhase * toPX;
            const curPY = inv * inv * fromPY + 2 * inv * packetPhase * midPY + packetPhase * packetPhase * toPY;

            ctx.beginPath();
            ctx.arc(curPX, curPY, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = arc.color;
            ctx.shadowBlur = 10;
            ctx.globalAlpha = arcAlpha;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // --- PHASE F: TECHNICAL LOCATION BADGES (ORIGINATING IN MOÇAMBIQUE) ---
      for (let i = 0; i < markerVectors.length; i++) {
        const m = markerVectors[i];
        const rot = rotate3D(m.vec, cosY, sinY, cosX, sinX);

        if (rot.z > 0.05) {
          const mx = cx + rot.x * radius;
          const my = cy + rot.y * radius;
          // as etiquetas desaparecem ao entrar na atmosfera (não ficam "fantasma" sobre as nuvens)
          const alpha = Math.min(1, (rot.z - 0.05) * 2.8) * (1 - smoothstep(0.42, 0.6, sp));
          if (alpha < 0.01) continue;

          ctx.save();
          ctx.globalAlpha = alpha;

          if (m.isHQ) {
            // MOÇAMBIQUE HQ BEACON PIN (BROADCASTING EPICENTER)
            const pulse = 1 + Math.sin(time * 3.5) * 0.25;

            // 3 Concentric broadcast waves radiating from Mozambique
            for (let w = 0; w < 3; w++) {
              const wavePhase = (time * 1.4 + w * 0.45) % 1.5;
              ctx.beginPath();
              ctx.arc(mx, my, 6 + wavePhase * 24, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 59, 48, ${Math.max(0, 1 - wavePhase / 1.5)})`;
              ctx.lineWidth = 1.3;
              ctx.stroke();
            }

            // Center Pin
            ctx.beginPath();
            ctx.arc(mx, my, 5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#ff3b30';
            ctx.shadowColor = '#ff3b30';
            ctx.shadowBlur = 18;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(mx, my, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Leader line angled safely downwards
            const lineEndX = mx + 28;
            const lineEndY = my + 26;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.lineTo(lineEndX + 22, lineEndY);
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Mozambique HQ Badge Box
            const padX = 10;
            ctx.font = '800 11px "Space Grotesk", sans-serif';
            const hqTitle = 'MOÇAMBIQUE [HQ]';
            const textWidth = ctx.measureText(hqTitle).width;
            const boxW = Math.max(textWidth + padX * 2, 185);
            const boxH = 46;
            const boxX = lineEndX + 4;
            const boxY = lineEndY - 14;

            ctx.fillStyle = '#030408';
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.2;
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText('🇲🇿 ' + hqTitle, boxX + padX, boxY + 16);

            ctx.font = '600 8.5px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ff3b30';
            ctx.fillText('SEDE & BERÇO DA MIZINE', boxX + padX, boxY + 28);

            ctx.font = '500 7.5px "JetBrains Mono", monospace';
            ctx.fillStyle = '#a3a3b2';
            ctx.fillText('Epicentro • Tudo Sai Daqui Para o Mundo', boxX + padX, boxY + 39);
          } else {
            const destFade = Math.max(0, 1 - sp * 2.2);
            if (destFade < 0.01) {
              ctx.restore();
              continue;
            }
            ctx.globalAlpha = alpha * destFade;

            // Global Social Media & Audiovisual Destination Tags
            const pulse = 1 + Math.sin(time * 3 + i) * 0.2;
            ctx.beginPath();
            ctx.arc(mx, my, 4 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = m.color;
            ctx.shadowColor = m.color;
            ctx.shadowBlur = 10;
            ctx.fill();

            const isRight = rot.x >= 0;
            const lineEndX = mx + (isRight ? 24 : -24);
            const lineEndY = my - 14;

            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Destination badge box with service details
            const padX = 8;
            ctx.font = '700 9px "JetBrains Mono", monospace';
            const textWidth = ctx.measureText(m.name).width;
            const boxW = textWidth + padX * 2;
            const boxH = 28;
            const boxX = isRight ? lineEndX + 3 : lineEndX - boxW - 3;
            const boxY = lineEndY - 14;

            ctx.fillStyle = '#030408';
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 1;
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(m.name, boxX + padX, boxY + 12);

            ctx.font = '500 7px "JetBrains Mono", monospace';
            ctx.fillStyle = m.color;
            ctx.fillText(m.sub, boxX + padX, boxY + 22);
          }

          ctx.restore();
        }
      }

      // --- PHASE G: ATMOSFERA (preto do espaço → azul profundo → céu de Maputo) ---
      const atmoA = smoothstep(0.30, 0.66, sp) * 0.86;
      if (atmoA > 0.001) {
        const t = atmoP;
        const sky = ctx.createLinearGradient(0, 0, 0, height);
        sky.addColorStop(0, `rgba(${Math.round(lerp(4, 92, t))}, ${Math.round(lerp(14, 150, t))}, ${Math.round(lerp(48, 222, t))}, ${atmoA})`);
        sky.addColorStop(0.55, `rgba(${Math.round(lerp(14, 160, t))}, ${Math.round(lerp(52, 200, t))}, ${Math.round(lerp(130, 240, t))}, ${atmoA * 0.82})`);
        sky.addColorStop(1, `rgba(${Math.round(lerp(40, 222, t))}, ${Math.round(lerp(96, 232, t))}, ${Math.round(lerp(170, 248, t))}, ${atmoA * 0.9})`);
        ctx.save();
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // --- PHASE G2: VOO ATRAVÉS DAS NUVENS (sprites procedurais em perspectiva) ---
      const cloudIn = smoothstep(0.48, 0.62, sp);
      if (cloudIn > 0.001) {
        const camZ = smoothstep(0.48, 0.97, sp) * 1.5;
        const horizonY = height * 0.44;
        ctx.save();
        for (let i = flyClouds.length - 1; i >= 0; i--) {
          const c = flyClouds[i];
          const d = c.z - camZ;
          if (d < 0.035) continue;
          const persp = 0.3 / d;
          const spr = cloudSprites[c.sprite];
          const cw = width * c.size * persp;
          const ch = cw * (spr.height / spr.width);
          const sx = width * 0.5 + (c.x + Math.sin(time * 0.05 + i) * c.drift) * width * persp * 0.5;
          const sy = horizonY + c.y * height * persp * 0.5;
          if (sx + cw / 2 < 0 || sx - cw / 2 > width || sy + ch / 2 < 0 || sy - ch / 2 > height) continue;
          const near = smoothstep(0.035, 0.2, d);
          const far = 1 - smoothstep(0.95, 1.45, d);
          const a = cloudIn * near * far;
          if (a < 0.01) continue;
          ctx.globalAlpha = a;
          if (c.flip) {
            ctx.save();
            ctx.translate(sx, sy);
            ctx.scale(-1, 1);
            ctx.drawImage(spr, -cw / 2, -ch / 2, cw, ch);
            ctx.restore();
          } else {
            ctx.drawImage(spr, sx - cw / 2, sy - ch / 2, cw, ch);
          }
        }
        ctx.restore();
      }

      // --- PHASE G3: MAR DE NUVENS QUE SOBE E ENVOLVE A TRANSIÇÃO ---
      const deckP = smoothstep(0.58, 0.93, sp);
      if (deckP > 0.001) {
        ctx.save();
        let lowestTop = height;
        for (let row = 0; row < 4; row++) {
          const rowScale = 0.55 + row * 0.3;
          const rowTop = lerp(height * 1.3, height * (0.46 + row * 0.12), deckP);
          lowestTop = Math.min(lowestTop, rowTop);
          for (let k = 0; k < deckClouds.length; k++) {
            const c = deckClouds[k];
            if (c.row !== row) continue;
            const spr = cloudSprites[c.sprite];
            const cw = width * 0.36 * c.size * rowScale;
            const ch = cw * (spr.height / spr.width);
            const span = width + cw;
            const sx = ((((c.x + time * 0.0025 * (row + 1)) % 1) + 1) % 1) * span - cw / 2;
            const sy = rowTop + ch * 0.12;
            ctx.globalAlpha = deckP * (0.75 + row * 0.08);
            if (c.flip) {
              ctx.save();
              ctx.translate(sx, sy);
              ctx.scale(-1, 1);
              ctx.drawImage(spr, -cw / 2, -ch / 2, cw, ch);
              ctx.restore();
            } else {
              ctx.drawImage(spr, sx - cw / 2, sy - ch / 2, cw, ch);
            }
          }
          // Corpo denso por baixo de cada camada (sem buracos para o espaço)
          const bodyTop = rowTop + width * 0.36 * rowScale * 0.25;
          if (bodyTop < height) {
            const body = ctx.createLinearGradient(0, bodyTop - 40, 0, height);
            body.addColorStop(0, 'rgba(236, 240, 247, 0)');
            body.addColorStop(0.25, `rgba(236, 240, 247, ${deckP * 0.92})`);
            body.addColorStop(1, `rgba(244, 246, 250, ${deckP})`);
            ctx.globalAlpha = 1;
            ctx.fillStyle = body;
            ctx.fillRect(0, bodyTop - 40, width, height - bodyTop + 40);
          }
        }
        ctx.restore();
      }

      // --- PHASE H: LUZ DO DIA — termina exactamente na cor da secção seguinte (#f8f9fc) ---
      if (washP > 0.001) {
        ctx.save();
        ctx.fillStyle = `rgba(248, 249, 252, ${washP})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // --- PHASE I: FITA DA FRENTE (por cima de tudo — desce e aterra na fita real) ---
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ >= 0) {
          drawFilmQuad(filmQuads[i], false);
        }
      }

      if (shutterFlash > 0.02) {
        ctx.fillStyle = `rgba(255, 255, 255, ${shutterFlash * 0.85})`;
        ctx.fillRect(0, 0, width, height);
        shutterFlash *= 0.82;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      stripEl?.removeEventListener('mouseenter', onStripEnter);
      stripEl?.removeEventListener('mouseleave', onStripLeave);
    };
  }, [onPlayVideo]);

  return (
    <div className="uc-globe-universe-wrapper">
      <canvas ref={canvasRef} className="uc-globe-universe-canvas" />
    </div>
  );
};
