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

const MARKERS: Marker3D[] = [
  {
    name: 'MOÇAMBIQUE [HQ]',
    sub: 'Sede & Berço da Mizine',
    lat: -25.96,
    lon: 32.58,
    color: '#ff3b30',
    isHQ: true
  },
  {
    name: 'SOUTH AFRICA',
    sub: 'África Austral',
    lat: -29.0,
    lon: 26.0,
    color: '#ff9500'
  },
  {
    name: 'KENYA',
    sub: 'África Oriental',
    lat: -1.28,
    lon: 36.82,
    color: '#ff9500'
  },
  {
    name: 'EGYPT',
    sub: 'Norte de África',
    lat: 30.04,
    lon: 31.23,
    color: '#ff9500'
  },
  {
    name: 'EUROPE & UK',
    sub: 'Parcerias Audiovisuais',
    lat: 51.5,
    lon: -0.12,
    color: '#00d4ff'
  },
  {
    name: 'AMÉRICAS',
    sub: 'Reels & Viral Retenção',
    lat: -23.55,
    lon: -46.63,
    color: '#ff9500'
  },
  {
    name: 'TURKEY & ASIA',
    sub: 'Expansão & Audiovisual',
    lat: 39.93,
    lon: 32.85,
    color: '#af52de'
  }
];

const GLOBAL_ARCS = [
  { fromLat: -25.96, fromLon: 32.58, toLat: 51.5, toLon: -0.12, color: '#ff9500' }, // Maputo -> Europe
  { fromLat: -25.96, fromLon: 32.58, toLat: -23.55, toLon: -46.63, color: '#ff9500' }, // Maputo -> Americas
  { fromLat: 30.04, fromLon: 31.23, toLat: -1.28, toLon: 36.82, color: '#ff9500' }, // Egypt -> Kenya
  { fromLat: 51.5, fromLon: -0.12, toLat: 39.93, toLon: 32.85, color: '#ff9500' }, // Europe -> Turkey
  { fromLat: -25.96, fromLon: 32.58, toLat: -29.0, toLon: 26.0, color: '#ff3b30' } // Maputo -> South Africa
];

interface CameraFlashStar {
  xNorm: number; // 0 to 1 inside cosmic void
  yNorm: number;
  lastFlash: number;
  interval: number;
  color: string;
  size: number;
}

export const HeroGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Stable planetary tilt (~16 deg)
    let rotX = -0.16;
    // Initial Y rotation so Mozambique (-25.96 lat, 32.58 lon) faces front & center
    let rotY = -Math.PI * 0.10;
    let targetRotY = rotY;
    let targetRotX = rotX;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Mouse parallax tilt angles
    let mouseTiltX = 0;
    let mouseTiltY = 0;
    let targetMouseTiltX = 0;
    let targetMouseTiltY = 0;

    // Counter-rotation speeds:
    // Planet rotates to the LEFT (negative rotY)
    const planetRotateSpeed = -0.0020;
    // Film reel orbits to the RIGHT (opposite direction)
    let filmOrbitAngle = 0;
    const filmOrbitSpeed = 0.0036;

    // Mathematically correct conversion: North Pole at TOP (-Y in screen space), South Pole at BOTTOM (+Y)
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

    // Precompute 3D unit vectors for world points
    const worldPoints = (worldData as WorldPoint[]).map(pt => ({
      ...pt,
      vec: latLonToVec(pt.lat, pt.lon)
    }));

    // Precompute marker vectors
    const markerVectors = MARKERS.map(m => ({
      ...m,
      vec: latLonToVec(m.lat, m.lon)
    }));

    // Initialize Camera LED Flash Stars in the cosmic void between moon and planet
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

    // Canvas resize to parent container
    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse & Touch interaction
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
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

    // 3D Rotation function
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

      // Continuous Leftward Planet Spin
      targetRotY += planetRotateSpeed;
      // Continuous Rightward Film Reel Orbit
      filmOrbitAngle += filmOrbitSpeed;

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      rotX = Math.max(-0.35, Math.min(0.1, rotX));

      mouseTiltX += (targetMouseTiltX - mouseTiltX) * 0.08;
      mouseTiltY += (targetMouseTiltY - mouseTiltY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // --- FULL SPHERE VISIBILITY ALIGNED TO THE RIGHT ---
      // The whole sphere is 100% visible, fully circular, aligned to the right margin!
      const isMobile = width < 900;
      const radius = isMobile
        ? Math.min(width * 0.42, height * 0.32)
        : Math.min(height * 0.39, width * 0.26);

      const cx = isMobile ? width * 0.50 : width - radius - 70;
      const cy = isMobile ? height * 0.36 : height * 0.50;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // --- LAYER 1: CELESTIAL MOON AS [ 🔴 REC ] ALIGNED TO THE LEFT ---
      const wrapMargin = Math.max(30, (width - 1340) / 2);
      const moonX = isMobile ? 55 : Math.max(65, wrapMargin + 30);
      const moonY = isMobile ? 110 : 135;
      const moonR = isMobile ? 14 : 18;

      // Soft Deep Cosmic Red Lunar Halo
      const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.3, moonX, moonY, moonR * 3.5);
      moonHalo.addColorStop(0, 'rgba(255, 59, 48, 0.45)');
      moonHalo.addColorStop(0.5, 'rgba(255, 45, 85, 0.16)');
      moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = moonHalo;
      ctx.fill();

      // Glowing Lunar Sphere (Crimson Cinema Red with surface texture)
      const moonGrad = ctx.createRadialGradient(moonX - 5, moonY - 5, 2, moonX, moonY, moonR);
      moonGrad.addColorStop(0, '#ff453a');
      moonGrad.addColorStop(0.65, '#d32f2f');
      moonGrad.addColorStop(1, '#500202');
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Camera Viewfinder Corners around the Moon [ 🔴 REC ]
      const vfW = isMobile ? 74 : 88;
      const vfH = isMobile ? 46 : 54;
      const vfX = moonX - vfW / 2;
      const vfY = moonY - vfH / 2;
      const cLen = 10;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.3;

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
      ctx.font = '800 11.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isRecBlink ? '#ffffff' : 'rgba(255, 255, 255, 0.35)';
      ctx.textAlign = 'left';
      ctx.fillText('REC', moonX + moonR + 9, moonY + 4);

      // Micro Camera Telemetry
      ctx.font = '600 8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      const sec = Math.floor(time) % 60;
      const fr = Math.floor((time * 24) % 24);
      const tcStr = `TC 00:04:${sec.toString().padStart(2, '0')}:${fr.toString().padStart(2, '0')}`;
      ctx.fillText(`● LUA / REC • 4K DCI`, vfX, vfY + vfH + 13);
      ctx.fillText(tcStr, vfX, vfY + vfH + 23);
      ctx.restore();

      // --- LAYER 2: CAMERA LED FLASH STARS (Pop in the void between Moon and Planet) ---
      const voidMinX = moonX + vfW * 0.6;
      const voidMaxX = cx - radius - 20;

      if (voidMaxX > voidMinX) {
        for (let i = 0; i < flashStars.length; i++) {
          const star = flashStars[i];
          const starX = voidMinX + star.xNorm * (voidMaxX - voidMinX);
          const starY = star.yNorm * height;

          // Check if star should trigger a flash
          if (time - star.lastFlash > star.interval) {
            star.lastFlash = time;
            star.interval = 1.5 + Math.random() * 3.5;
          }

          const flashAge = time - star.lastFlash;
          const flashDuration = 0.32; // Quick camera strobe flash

          if (flashAge >= 0 && flashAge < flashDuration) {
            const progress = flashAge / flashDuration;
            // Sudden bright rise, exponential decay
            const flashIntensity = Math.pow(1 - progress, 2.5);

            ctx.save();
            // 1. Soft Circular Flash Corona
            const coronaR = (star.size * 5) * flashIntensity;
            const coronaGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, coronaR);
            coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            coronaGrad.addColorStop(0.3, star.color);
            coronaGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = coronaGrad;
            ctx.beginPath();
            ctx.arc(starX, starY, coronaR, 0, Math.PI * 2);
            ctx.fill();

            // 2. Anamorphic Horizontal Lens Flare Ray
            const rayW = (32 + star.size * 8) * flashIntensity;
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.9 * flashIntensity) + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(starX - rayW, starY);
            ctx.lineTo(starX + rayW, starY);
            ctx.stroke();

            // 3. Vertical Cross Flare Spikes
            const rayH = (14 + star.size * 4) * flashIntensity;
            ctx.beginPath();
            ctx.moveTo(starX, starY - rayH);
            ctx.lineTo(starX, starY + rayH);
            ctx.stroke();

            // 4. Center Hot White Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(starX, starY, star.size * 0.9 * flashIntensity, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          } else {
            // Subtle resting twinkle star
            const twinkle = 0.25 + Math.sin(time * 2 + i) * 0.15;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + twinkle + ')';
            ctx.beginPath();
            ctx.arc(starX, starY, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // --- LAYER 3: ATMOSPHERIC NEON RIM GLOWS FOR THE SPHERE ---
      // Solar Orange Rim (Top-Right)
      const orangeGlow = ctx.createRadialGradient(
        cx + radius * 0.35, cy - radius * 0.45, radius * 0.25,
        cx, cy, radius * 1.35
      );
      orangeGlow.addColorStop(0, 'rgba(255, 120, 0, 0.45)');
      orangeGlow.addColorStop(0.45, 'rgba(255, 55, 0, 0.18)');
      orangeGlow.addColorStop(0.85, 'rgba(255, 20, 0, 0.03)');
      orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      // Deep Blue Rim Crescent (Bottom-Left)
      const blueGlow = ctx.createRadialGradient(
        cx - radius * 0.45, cy + radius * 0.4, radius * 0.2,
        cx, cy, radius * 1.40
      );
      blueGlow.addColorStop(0, 'rgba(0, 160, 255, 0.55)');
      blueGlow.addColorStop(0.45, 'rgba(0, 210, 255, 0.22)');
      blueGlow.addColorStop(0.8, 'rgba(0, 90, 220, 0.05)');
      blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 4: 35MM FILM REEL INDEPENDENT COUNTER-ORBIT ---
      const filmFrames = 54;
      const filmOrbitRadius = radius * 1.18;
      const filmWidth = radius * 0.076;
      const filmInclination = -0.26; // Stable celestial tilt

      interface FilmQuad {
        tl: { x: number; y: number; z: number };
        tr: { x: number; y: number; z: number };
        br: { x: number; y: number; z: number };
        bl: { x: number; y: number; z: number };
        centerZ: number;
        index: number;
      }

      const filmQuads: FilmQuad[] = [];
      const cosMouseY = Math.cos(mouseTiltY);
      const sinMouseY = Math.sin(mouseTiltY);
      const cosMouseX = Math.cos(rotX + mouseTiltX);
      const sinMouseX = Math.sin(rotX + mouseTiltX);

      for (let i = 0; i < filmFrames; i++) {
        // Counter-orbit: minus filmOrbitAngle moves front frames from LEFT to RIGHT!
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
        filmQuads.push({ tl, tr, br, bl, centerZ, index: i });
      }

      const projectFilmPoint = (p: { x: number; y: number }) => ({
        px: cx + p.x,
        py: cy + p.y
      });

      const drawFilmQuad = (q: FilmQuad, isBack: boolean) => {
        const pTL = projectFilmPoint(q.tl);
        const pTR = projectFilmPoint(q.tr);
        const pBR = projectFilmPoint(q.br);
        const pBL = projectFilmPoint(q.bl);

        ctx.save();

        // Celluloid Film Frame Body
        ctx.beginPath();
        ctx.moveTo(pTL.px, pTL.py);
        ctx.lineTo(pTR.px, pTR.py);
        ctx.lineTo(pBR.px, pBR.py);
        ctx.lineTo(pBL.px, pBL.py);
        ctx.closePath();

        ctx.fillStyle = isBack ? 'rgba(10, 10, 16, 0.50)' : 'rgba(14, 14, 20, 0.94)';
        ctx.fill();

        ctx.strokeStyle = isBack ? 'rgba(255, 140, 20, 0.25)' : 'rgba(255, 140, 40, 0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner Film Exposure Window
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
        ctx.fillStyle = isCyan
          ? (isBack ? 'rgba(0, 212, 255, 0.10)' : 'rgba(0, 212, 255, 0.22)')
          : (isBack ? 'rgba(255, 120, 0, 0.10)' : 'rgba(255, 120, 0, 0.25)');
        ctx.fill();

        // 35mm Sprocket Holes
        ctx.fillStyle = '#020205';
        const spTopX = pTL.px + (pTR.px - pTL.px) * 0.5 + (pBL.px - pTL.px) * 0.08;
        const spTopY = pTL.py + (pTR.py - pTL.py) * 0.5 + (pBL.py - pTL.py) * 0.08;
        ctx.beginPath();
        ctx.arc(spTopX, spTopY, 1.2, 0, Math.PI * 2);
        ctx.fill();

        const spBotX = pBL.px + (pBR.px - pBL.px) * 0.5 - (pBL.px - pTL.px) * 0.08;
        const spBotY = pBL.py + (pBR.py - pBL.py) * 0.5 - (pBL.py - pTL.py) * 0.08;
        ctx.beginPath();
        ctx.arc(spBotX, spBotY, 1.2, 0, Math.PI * 2);
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
      const coreGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      coreGrad.addColorStop(0, 'rgba(2, 3, 6, 0.99)');
      coreGrad.addColorStop(0.75, 'rgba(2, 3, 7, 0.97)');
      coreGrad.addColorStop(1, 'rgba(3, 6, 14, 0.85)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Sharp Neon Blue Crescent Edge Stroke
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0.35 * Math.PI, 1.2 * Math.PI);
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.85)';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Sharp Neon Fiery Amber Top Arc Stroke
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 1.3 * Math.PI, 1.95 * Math.PI);
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.9)';
      ctx.shadowColor = '#ff6b00';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      // --- PHASE C: 8,000+ REAL CONTINENT & AUTHENTIC MOZAMBIQUE BORDER POINTS ---
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

      // Sort points back-to-front
      projectedPoints.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const depth = pt.z;

        if (pt.moz) {
          // AUTHENTIC MOZAMBIQUE: Both ocean and continental border dots
          const isBorder = pt.coast;
          const rMoz = (isBorder ? 1.55 : 1.2) * (0.65 + depth * 0.55);
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz, 0, Math.PI * 2);
          ctx.fillStyle = isBorder
            ? `rgba(255, 60, 48, ${Math.min(1, 0.98 * depth + 0.15)})`
            : `rgba(255, 95, 80, ${Math.min(1, 0.82 * depth + 0.10)})`;
          ctx.fill();
        } else {
          // Standard Continent Dot
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

      // --- PHASE D: GLOBAL CONNECTION ARCS ---
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

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(fromPX, fromPY);
          ctx.quadraticCurveTo(midPX, midPY, toPX, toPY);
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = 0.42 * arcAlpha;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Traveling photon packet
          const packetPhase = (time * 0.6 + i * 0.22) % 1;
          const inv = 1 - packetPhase;
          const curPX = inv * inv * fromPX + 2 * inv * packetPhase * midPX + packetPhase * packetPhase * toPX;
          const curPY = inv * inv * fromPY + 2 * inv * packetPhase * midPY + packetPhase * packetPhase * toPY;

          ctx.beginPath();
          ctx.arc(curPX, curPY, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = arcAlpha;
          ctx.fill();
          ctx.restore();
        }
      }

      // --- PHASE E: DRAW FRONT HALF OF FILM REEL (Z >= 0) ---
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ >= 0) {
          drawFilmQuad(filmQuads[i], false);
        }
      }

      // --- PHASE F: TECHNICAL LOCATION BADGES ---
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
            // MOÇAMBIQUE HQ BEACON PIN
            const pulse = 1 + Math.sin(time * 3.5) * 0.25;

            // Concentric radar waves
            const wave1 = (time * 1.6) % 1.5;
            ctx.beginPath();
            ctx.arc(mx, my, 8 + wave1 * 22, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 59, 48, ${Math.max(0, 1 - wave1 / 1.5)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Center Pin
            ctx.beginPath();
            ctx.arc(mx, my, 5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#ff3b30';
            ctx.shadowColor = '#ff3b30';
            ctx.shadowBlur = 16;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(mx, my, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Leader line angled safely away from the orbital film
            const lineEndX = mx + 28;
            const lineEndY = my + 26;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.lineTo(lineEndX + 22, lineEndY);
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Sharp Mozambique HQ Badge Box
            const padX = 10;
            ctx.font = '800 11px "Space Grotesk", sans-serif';
            const hqTitle = 'MOÇAMBIQUE [HQ]';
            const textWidth = ctx.measureText(hqTitle).width;
            const boxW = Math.max(textWidth + padX * 2, 175);
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
            ctx.fillText('Conexão Global • 4K • Redes Sociais', boxX + padX, boxY + 39);
          } else {
            // Standard Rectangular Black Location Tag
            const pulse = 1 + Math.sin(time * 3 + i) * 0.2;
            ctx.beginPath();
            ctx.arc(mx, my, 4 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = m.color;
            ctx.shadowColor = m.color;
            ctx.shadowBlur = 8;
            ctx.fill();

            const isRight = rot.x >= 0;
            const lineEndX = mx + (isRight ? 22 : -22);
            const lineEndY = my - 12;

            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const padX = 7;
            ctx.font = '700 9px "JetBrains Mono", monospace';
            const textWidth = ctx.measureText(m.name).width;
            const boxW = textWidth + padX * 2;
            const boxH = 19;
            const boxX = isRight ? lineEndX + 3 : lineEndX - boxW - 3;
            const boxY = lineEndY - 9;

            ctx.fillStyle = '#030408';
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 1;
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(m.name, boxX + padX, boxY + 13);
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="uc-globe-universe-wrapper">
      <canvas ref={canvasRef} className="uc-globe-universe-canvas" />
    </div>
  );
};
