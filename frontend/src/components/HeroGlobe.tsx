import React, { useEffect, useRef } from 'react';
import worldData from '../data/worldPoints.json';

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
    let targetRotY = rotY;
    let targetRotX = rotX;
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
      const heroEl = document.getElementById('topo');
      const maxScroll = heroEl ? Math.max(heroEl.offsetHeight * 0.85, 450) : window.innerHeight * 0.85;
      targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Procedural atmospheric clouds (billowing volumetric puffs during entry)
    interface CloudParticle {
      xRel: number;
      yRel: number;
      baseRadius: number;
      speedPhase: number;
      opacityMul: number;
      isCyan?: boolean;
    }
    const clouds: CloudParticle[] = [];
    for (let i = 0; i < 30; i++) {
      clouds.push({
        xRel: (Math.random() - 0.5) * 1.5,
        yRel: (Math.random() - 0.5) * 1.3,
        baseRadius: 160 + Math.random() * 240,
        speedPhase: Math.random() * Math.PI * 2,
        opacityMul: 0.60 + Math.random() * 0.40,
        isCyan: i % 3 === 0
      });
    }

    const planetRotateSpeed = -0.0020;
    let filmOrbitAngle = 0;
    const filmOrbitSpeed = 0.0036;

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
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.003;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const nx = e.clientX / width - 0.5;
        const ny = e.clientY / height - 0.5;
        targetRotX = -0.16 + ny * 0.12;
        targetRotY += nx * 0.0004;

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
        targetRotY += dx * 0.006;
        targetRotX += dy * 0.003;
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

      targetRotY += planetRotateSpeed;
      filmOrbitAngle += filmOrbitSpeed;

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      rotX = Math.max(-0.35, Math.min(0.1, rotX));

      mouseTiltX += (targetMouseTiltX - mouseTiltX) * 0.08;
      mouseTiltY += (targetMouseTiltY - mouseTiltY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // --- SCROLL INTERPOLATION & ZOOM INTO MOÇAMBIQUE ---
      if (Math.abs(targetScrollProgress - smoothScrollProgress) < 0.002) {
        smoothScrollProgress = targetScrollProgress;
      } else {
        smoothScrollProgress += (targetScrollProgress - smoothScrollProgress) * 0.12;
      }
      const sp = smoothScrollProgress < 0.003 ? 0 : smoothScrollProgress;

      // Update Hero Viewport Left Elements directly (smooth 60fps hardware accelerated)
      if (viewportRef?.current) {
        const vp = viewportRef.current;
        const fadeOut = Math.max(0, 1 - sp * 2.0);
        vp.style.opacity = fadeOut.toFixed(3);
        vp.style.transform = `translateY(${(-sp * 80).toFixed(1)}px)`;
        vp.style.pointerEvents = fadeOut < 0.1 ? 'none' : 'auto';
      }
      const badge = document.querySelector('.uc-floating-badge') as HTMLElement;
      if (badge) {
        badge.style.opacity = Math.max(0, 1 - sp * 2.2).toFixed(3);
      }
      const scrollInd = document.querySelector('.uc-hero-scroll-indicator') as HTMLElement;
      if (scrollInd) {
        scrollInd.style.opacity = Math.max(0, 1 - sp * 3.0).toFixed(3);
      }

      const easeP = sp * sp * (3 - 2 * sp); // Hermite smoothstep

      // --- 100% PERFECT CIRCUMFERENCE ALIGNED TO THE RIGHT AT REST, ZOOMING TO FULLSCREEN ---
      const isMobile = width < 900;
      const baseRadius = isMobile
        ? Math.min(width * 0.42, height * 0.32)
        : Math.min(height * 0.39, width * 0.26);

      // Colossal growth into Mozambique: up to 5.6x radius on scroll!
      const radius = baseRadius * (1 + easeP * 4.6);

      const defaultCX = isMobile ? width * 0.50 : width - baseRadius - 75;
      const defaultCY = isMobile ? height * 0.36 : height * 0.50;
      const targetCX = width * 0.50;
      const targetCY = height * 0.50;

      const cx = defaultCX + (targetCX - defaultCX) * easeP;
      const cy = defaultCY + (targetCY - defaultCY) * easeP;

      // Mathematically robust alignment to Mozambique (lon: 32.58°, lat: -25.96°)
      // Zero jump, zero drift, and 100% perfect reconstruction on scroll back!
      const targetMozRotY = -0.5686; // -(32.58 * Math.PI / 180)
      const twoPi = Math.PI * 2;
      const rawDiffY = ((targetMozRotY - rotY) % twoPi + twoPi) % twoPi;
      const shortestDiffY = rawDiffY > Math.PI ? rawDiffY - twoPi : rawDiffY;

      const currentRotY = rotY + shortestDiffY * easeP;
      const currentRotX = rotX + (0.35 - rotX) * easeP;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

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
        ctx.restore();
      }
    }

      // --- LAYER 3: 35MM FILM REEL INDEPENDENT COUNTER-ORBIT & INTERACTION ---
      const filmFrames = 54;
      const filmOrbitRadius = radius * (1.18 + sp * 0.45);
      const filmWidth = radius * 0.076;
      const filmInclination = -0.26;
      const filmAlpha = Math.max(0, 1 - sp * 2.2);

      interface FilmQuad {
        tl: { x: number; y: number; z: number };
        tr: { x: number; y: number; z: number };
        br: { x: number; y: number; z: number };
        bl: { x: number; y: number; z: number };
        centerZ: number;
        index: number;
        screenCenterX: number;
        screenCenterY: number;
      }

      const filmQuads: FilmQuad[] = [];
      const cosMouseY = Math.cos(mouseTiltY);
      const sinMouseY = Math.sin(mouseTiltY);
      const cosMouseX = Math.cos(rotX + mouseTiltX);
      const sinMouseX = Math.sin(rotX + mouseTiltX);

      for (let i = 0; i < filmFrames; i++) {
        const a1 = (i / filmFrames) * Math.PI * 2 - filmOrbitAngle;
        const a2 = ((i + 0.85) / filmFrames) * Math.PI * 2 - filmOrbitAngle;

        const getFilmEdge = (angle: number, offset: number) => {
          const ox = filmOrbitRadius * Math.cos(angle);
          const oz = filmOrbitRadius * Math.sin(angle);
          const x0 = ox;
          const y0 = oz * Math.sin(filmInclination) + offset * Math.cos(filmInclination);
          const z0 = oz * Math.cos(filmInclination) - offset * Math.sin(filmInclination);

          const xCam = x0 * cosMouseY + z0 * sinMouseY;
          const zCamTemp = -x0 * sinMouseY + z0 * cosMouseY;
          const yCam = y0 * cosMouseX - zCamTemp * sinMouseX;
          const zCam = y0 * sinMouseX + zCamTemp * cosMouseX;

          return { x: xCam, y: yCam, z: zCam };
        };

        const tl = getFilmEdge(a1, filmWidth * 0.5);
        const tr = getFilmEdge(a2, filmWidth * 0.5);
        const br = getFilmEdge(a2, -filmWidth * 0.5);
        const bl = getFilmEdge(a1, -filmWidth * 0.5);

        const centerZ = (tl.z + tr.z + br.z + bl.z) / 4;
        const screenCenterX = cx + (tl.x + tr.x + br.x + bl.x) / 4;
        const screenCenterY = cy + (tl.y + tr.y + br.y + bl.y) / 4;

        filmQuads.push({ tl, tr, br, bl, centerZ, index: i, screenCenterX, screenCenterY });
      }

      hoveredFilmIndex = -1;
      if (sp < 0.2) {
        let closestDist = 32;
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

      const drawFilmQuad = (q: FilmQuad, isBack: boolean) => {
        if (filmAlpha < 0.01) return;
        const isHovered = q.index === hoveredFilmIndex;
        const scale = isHovered ? 1.35 : 1.0;

        const centerX = (q.tl.x + q.tr.x + q.br.x + q.bl.x) / 4;
        const centerY = (q.tl.y + q.tr.y + q.br.y + q.bl.y) / 4;

        const scalePoint = (p: { x: number; y: number }) => ({
          px: cx + centerX + (p.x - centerX) * scale,
          py: cy + centerY + (p.y - centerY) * scale
        });

        const pTL = scalePoint(q.tl);
        const pTR = scalePoint(q.tr);
        const pBR = scalePoint(q.br);
        const pBL = scalePoint(q.bl);

        ctx.save();
        ctx.globalAlpha = isBack ? filmAlpha * 0.5 : filmAlpha;

        ctx.beginPath();
        ctx.moveTo(pTL.px, pTL.py);
        ctx.lineTo(pTR.px, pTR.py);
        ctx.lineTo(pBR.px, pBR.py);
        ctx.lineTo(pBL.px, pBL.py);
        ctx.closePath();

        ctx.fillStyle = isBack
          ? 'rgba(10, 10, 16, 0.50)'
          : (isHovered ? 'rgba(20, 20, 32, 0.98)' : 'rgba(14, 14, 20, 0.94)');
        ctx.fill();

        ctx.strokeStyle = isHovered
          ? '#00d4ff'
          : (isBack ? 'rgba(255, 140, 20, 0.25)' : 'rgba(255, 140, 40, 0.85)');
        ctx.lineWidth = isHovered ? 2.2 : 1;
        if (isHovered) {
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 12;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        const inset = 0.18;
        const wTLx = pTL.px + (pBL.px - pTL.px) * inset + (pTR.px - pTL.px) * 0.15;
        const wTLy = pTL.py + (pBL.py - pTL.py) * inset + (pTR.py - pTL.py) * 0.15;
        const wTRx = pTR.px + (pBR.px - pTR.px) * inset - (pTR.px - pTL.px) * 0.15;
        const wTRy = pTR.py + (pBR.py - pTR.py) * inset - (pTR.py - pTL.py) * 0.15;
        const wBRx = pBR.px - (pBR.px - pTR.px) * inset - (pTR.px - pTL.px) * 0.15;
        const wBRy = pBR.py - (pBR.py - pTR.py) * inset - (pTR.py - pTL.py) * 0.15;
        const wBLx = pBL.px - (pBL.px - pTL.px) * inset + (pTR.px - pTL.px) * 0.15;
        const wBLy = pBL.py - (pBL.py - pTL.py) * inset + (pTR.py - pTL.py) * 0.15;

        ctx.beginPath();
        ctx.moveTo(wTLx, wTLy);
        ctx.lineTo(wTRx, wTRy);
        ctx.lineTo(wBRx, wBRy);
        ctx.lineTo(wBLx, wBLy);
        ctx.closePath();

        const isCyan = q.index % 2 === 0;
        ctx.fillStyle = isHovered
          ? 'rgba(0, 212, 255, 0.45)'
          : (isCyan
            ? (isBack ? 'rgba(0, 212, 255, 0.10)' : 'rgba(0, 212, 255, 0.22)')
            : (isBack ? 'rgba(255, 120, 0, 0.10)' : 'rgba(255, 120, 0, 0.25)'));
        ctx.fill();

        if (isHovered) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          const midX = (wTLx + wTRx + wBRx + wBLx) / 4;
          const midY = (wTLy + wTRy + wBRy + wBLy) / 4;
          ctx.moveTo(midX - 4, midY - 6);
          ctx.lineTo(midX + 7, midY);
          ctx.lineTo(midX - 4, midY + 6);
          ctx.closePath();
          ctx.fill();

          ctx.font = '800 9.5px "Space Grotesk", sans-serif';
          const tipText = '▶ VER APRESENTAÇÃO MIZINE 4K';
          const tipW = ctx.measureText(tipText).width + 16;
          ctx.fillStyle = '#030408';
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 1.2;
          ctx.fillRect(midX - tipW / 2, midY - 32, tipW, 22);
          ctx.strokeRect(midX - tipW / 2, midY - 32, tipW, 22);

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(tipText, midX, midY - 18);
        }

        ctx.fillStyle = '#020205';
        const spTopX = pTL.px + (pTR.px - pTL.px) * 0.5 + (pBL.px - pTL.px) * 0.08;
        const spTopY = pTL.py + (pTR.py - pTL.py) * 0.5 + (pBL.py - pTL.py) * 0.08;
        ctx.beginPath();
        ctx.arc(spTopX, spTopY, 1.2 * scale, 0, Math.PI * 2);
        ctx.fill();

        const spBotX = pBL.px + (pBR.px - pBL.px) * 0.5 - (pBL.px - pTL.px) * 0.08;
        const spBotY = pBL.py + (pBR.py - pBL.py) * 0.5 - (pBL.py - pTL.py) * 0.08;
        ctx.beginPath();
        ctx.arc(spBotX, spBotY, 1.2 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // --- PHASE A: DRAW BACK HALF OF FILM REEL (Z < 0) ---
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

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const depth = pt.z;

        if (pt.moz) {
          const isBorder = pt.coast;
          const rMoz = (isBorder ? 1.55 : 1.2) * (0.65 + depth * 0.55);
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz, 0, Math.PI * 2);
          ctx.fillStyle = isBorder
            ? `rgba(255, 60, 48, ${Math.min(1, 0.98 * depth + 0.15)})`
            : `rgba(255, 95, 80, ${Math.min(1, 0.82 * depth + 0.10)})`;
          ctx.fill();
        } else {
          const isCoast = pt.coast;
          const r = (isCoast ? 1.35 : 1.05) * (0.6 + depth * 0.55);
          let alpha = (isCoast ? 0.95 : 0.65) * Math.pow(depth, 1.4);

          const dist = Math.hypot(pt.px - cx, pt.py - cy) / radius;
          if (dist > 0.85) alpha = Math.min(1, alpha * 1.4);

          ctx.beginPath();
          ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);
          ctx.fillStyle = isCoast
            ? `rgba(255, 255, 255, ${alpha * 0.95})`
            : `rgba(215, 225, 245, ${alpha * 0.80})`;
          ctx.fill();
        }
      }

      // --- PHASE D: "TUDO SAI DE MOÇAMBIQUE PARA O MUNDO" ARCS & STREAMING PACKETS ---
      for (let i = 0; i < GLOBAL_ARCS.length; i++) {
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

          const arcAlpha = Math.max(0.1, (rotFrom.z + rotTo.z + 1.2) / 2.4);

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

      // --- PHASE E: DRAW FRONT HALF OF FILM REEL (Z >= 0) ---
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ >= 0) {
          drawFilmQuad(filmQuads[i], false);
        }
      }

      // --- PHASE F: TECHNICAL LOCATION BADGES (ORIGINATING IN MOÇAMBIQUE) ---
      for (let i = 0; i < markerVectors.length; i++) {
        const m = markerVectors[i];
        const rot = rotate3D(m.vec, cosY, sinY, cosX, sinX);

        if (rot.z > 0.05) {
          const mx = cx + rot.x * radius;
          const my = cy + rot.y * radius;
          const alpha = Math.min(1, (rot.z - 0.05) * 2.8);

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

      // --- PHASE G: ATMOSPHERIC BLUE PENETRATION & VOLUMETRIC CLOUDS ---
      // "ao entrar no ponto moçambique azul ficam as nuvens"
      if (sp > 0.38) {
        const blueEntryProgress = Math.max(0, Math.min(1, (sp - 0.38) / 0.42));
        const auraR = radius * (1.1 + blueEntryProgress * 0.4);
        const blueGlow = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, auraR);
        blueGlow.addColorStop(0, `rgba(0, 212, 255, ${0.82 * blueEntryProgress})`);
        blueGlow.addColorStop(0.35, `rgba(0, 130, 255, ${0.62 * blueEntryProgress})`);
        blueGlow.addColorStop(0.70, `rgba(2, 10, 35, ${0.45 * blueEntryProgress})`);
        blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.save();
        ctx.fillStyle = blueGlow;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      let cloudAlpha = 0;
      if (sp >= 0.52 && sp <= 0.88) {
        cloudAlpha = (sp - 0.52) / 0.36; // 0 to 1
      } else if (sp > 0.88 && sp <= 1.0) {
        cloudAlpha = 1 - (sp - 0.88) / 0.12; // 1 to 0 (dissolving into Section 2)
      }
      cloudAlpha = Math.max(0, Math.min(1, cloudAlpha));

      if (cloudAlpha > 0.01) {
        ctx.save();
        for (let i = 0; i < clouds.length; i++) {
          const cl = clouds[i];
          const expandMul = 1 + (sp - 0.52) * 2.0;
          const clX = width * 0.5 + cl.xRel * width * 0.65 * expandMul + Math.sin(time * 0.6 + cl.speedPhase) * 20;
          const clY = height * 0.5 + cl.yRel * height * 0.65 * expandMul + Math.cos(time * 0.6 + cl.speedPhase) * 15;
          const clR = cl.baseRadius * expandMul;

          const cGrad = ctx.createRadialGradient(clX, clY, 0, clX, clY, clR);
          const cAlpha = cloudAlpha * cl.opacityMul * 0.90;
          if (cl.isCyan) {
            cGrad.addColorStop(0, `rgba(225, 248, 255, ${cAlpha})`);
            cGrad.addColorStop(0.4, `rgba(130, 210, 255, ${cAlpha * 0.75})`);
            cGrad.addColorStop(0.8, `rgba(15, 60, 140, ${cAlpha * 0.35})`);
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            cGrad.addColorStop(0, `rgba(255, 255, 255, ${cAlpha})`);
            cGrad.addColorStop(0.45, `rgba(235, 245, 255, ${cAlpha * 0.80})`);
            cGrad.addColorStop(0.85, `rgba(170, 205, 240, ${cAlpha * 0.30})`);
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(clX, clY, clR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Aerospace HUD Telemetry during descent into Mozambique
      if (sp > 0.42 && sp < 0.92) {
        const hudAlpha = Math.sin(Math.PI * ((sp - 0.42) / 0.50));
        ctx.save();
        ctx.globalAlpha = hudAlpha;
        const hudW = Math.min(width * 0.88, 380);
        const hudH = 50;
        const hudX = (width - hudW) / 2;
        const hudY = height - 90;

        ctx.fillStyle = 'rgba(2, 6, 18, 0.88)';
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1.2;
        ctx.fillRect(hudX, hudY, hudW, hudH);
        ctx.strokeRect(hudX, hudY, hudW, hudH);

        ctx.font = '800 10.5px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('🇲🇿 ENTRADA EM MOÇAMBIQUE [HQ]', width / 2, hudY + 18);

        ctx.font = '600 8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00d4ff';
        const altKm = Math.max(1, Math.round((1 - (sp - 0.42) / 0.50) * 650));
        ctx.fillText(`ALTITUDE: ${altKm}.000 KM • DESCIDA NA SEDE MIZINE • 25°57'S 32°35'E`, width / 2, hudY + 34);
        ctx.restore();
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
    };
  }, [onPlayVideo]);

  return (
    <div className="uc-globe-universe-wrapper">
      <canvas ref={canvasRef} className="uc-globe-universe-canvas" />
    </div>
  );
};
