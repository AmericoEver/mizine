import React, { useEffect, useRef } from 'react';
import worldData from '../data/worldPoints.json';

interface WorldPoint {
  lat: number;
  lon: number;
  moz?: boolean;
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
    name: 'EUROPA & UK',
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
    name: 'MÉDIO ORIENTE & ASIA',
    sub: 'Campanhas & Expansão',
    lat: 25.20,
    lon: 55.27,
    color: '#af52de'
  },
  {
    name: 'ÁFRICA AUSTRAL',
    sub: 'Cobertura Regional 4K',
    lat: -26.20,
    lon: 28.04,
    color: '#34c759'
  }
];

const GLOBAL_ARCS = [
  { targetLat: 51.5, targetLon: -0.12, color: '#00d4ff' },   // Europe/London
  { targetLat: -23.55, targetLon: -46.63, color: '#ff9500' }, // Americas/SP
  { targetLat: 25.20, targetLon: 55.27, color: '#af52de' },  // Middle East/Dubai
  { targetLat: -26.20, targetLon: 28.04, color: '#34c759' }  // Regional Africa/JHB
];

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

    // Stable planetary tilt: natural Earth axial tilt (~16 deg)
    let rotX = -0.16;
    // Initial Y rotation so Mozambique (-25.96 lat, 32.58 lon) is visible and facing front
    let rotY = -Math.PI * 0.12;
    let targetRotY = rotY;
    let targetRotX = rotX;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Counter-rotation: Planet rotates to the LEFT, film reel orbits to the RIGHT
    const planetRotateSpeed = -0.0022; // Planet rotates left
    let filmOrbitAngle = 0;
    const filmOrbitSpeed = 0.0046; // Film orbits right (opposite direction)

    // Mathematically correct conversion: North Pole at TOP (-Y in screen space), South Pole at BOTTOM (+Y)
    const latLonToVec = (lat: number, lon: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180;
      const cosPhi = Math.cos(phi);
      return {
        x: cosPhi * Math.sin(theta),
        y: -Math.sin(phi), // Negative so North (+lat) points UP on computer screen
        z: cosPhi * Math.cos(theta)
      };
    };

    // Precompute 3D unit vectors for all 3,500+ real continent points
    const worldPoints = (worldData as WorldPoint[]).map(pt => ({
      ...pt,
      vec: latLonToVec(pt.lat, pt.lon)
    }));

    // Precompute marker vectors
    const markerVectors = MARKERS.map(m => ({
      ...m,
      vec: latLonToVec(m.lat, m.lon)
    }));

    const hqVec = latLonToVec(-25.96, 32.58);

    // Canvas resize
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
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
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / width - 0.5;
        const ny = (e.clientY - rect.top) / height - 0.5;
        // Subtle, stable response to mouse (NO wild vertical flapping)
        targetRotX = -0.16 + ny * 0.10;
        targetRotY += nx * 0.0006;
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

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
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

      // Planet spins to the left
      targetRotY += planetRotateSpeed;
      // Film reel counter-orbits to the right (opposite direction)
      filmOrbitAngle += filmOrbitSpeed;

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      // Clamp tilt so the planet always stays upright with North at the top
      rotX = Math.max(-0.35, Math.min(0.1, rotX));

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.54;
      const cy = height * 0.52;
      const radius = Math.min(width, height) * 0.43;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // --- LAYER 1: ATMOSPHERIC NEON RIM GLOWS (Space Ambient) ---
      // Fiery Orange/Amber Solar Rim (Top-Right)
      const orangeGlow = ctx.createRadialGradient(
        cx + radius * 0.35, cy - radius * 0.45, radius * 0.25,
        cx, cy, radius * 1.3
      );
      orangeGlow.addColorStop(0, 'rgba(255, 120, 0, 0.45)');
      orangeGlow.addColorStop(0.45, 'rgba(255, 55, 0, 0.18)');
      orangeGlow.addColorStop(0.85, 'rgba(255, 20, 0, 0.03)');
      orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      // Electric Cyan/Blue Deep Rim Crescent (Bottom-Left)
      const blueGlow = ctx.createRadialGradient(
        cx - radius * 0.45, cy + radius * 0.4, radius * 0.2,
        cx, cy, radius * 1.35
      );
      blueGlow.addColorStop(0, 'rgba(0, 160, 255, 0.58)');
      blueGlow.addColorStop(0.45, 'rgba(0, 210, 255, 0.25)');
      blueGlow.addColorStop(0.8, 'rgba(0, 90, 220, 0.05)');
      blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 2: 35MM FILM REEL ORBIT CALCULATION ---
      // 52 celluloid frames forming a closed 3D ribbon loop
      const filmFrames = 52;
      const filmOrbitRadius = radius * 1.25;
      const filmWidth = radius * 0.085;
      const filmInclination = 0.28; // ~16 deg stable celestial orbit (NO wild wobbling)

      interface FilmQuad {
        tl: { x: number; y: number; z: number };
        tr: { x: number; y: number; z: number };
        br: { x: number; y: number; z: number };
        bl: { x: number; y: number; z: number };
        centerZ: number;
        index: number;
      }

      const filmQuads: FilmQuad[] = [];

      for (let i = 0; i < filmFrames; i++) {
        // Orbit to the right (filmOrbitAngle positive)
        const a1 = (i / filmFrames) * Math.PI * 2 + filmOrbitAngle;
        const a2 = ((i + 0.85) / filmFrames) * Math.PI * 2 + filmOrbitAngle;

        const getFilmEdge = (angle: number, offset: number) => {
          const ox = filmOrbitRadius * Math.cos(angle);
          const oz = filmOrbitRadius * Math.sin(angle);
          // Fixed celestial inclination (stable planetary ring)
          const x0 = ox;
          const y0 = oz * Math.sin(filmInclination) + offset * Math.cos(filmInclination);
          const z0 = oz * Math.cos(filmInclination) - offset * Math.sin(filmInclination);
          // Apply subtle viewer perspective rotation
          return rotate3D({ x: x0, y: y0, z: z0 }, cosY, sinY, cosX, sinX);
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

      // Smooth, natural rendering function (NO hard cuts!)
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

        ctx.fillStyle = isBack ? 'rgba(10, 10, 16, 0.55)' : 'rgba(14, 14, 20, 0.94)';
        ctx.fill();

        ctx.strokeStyle = isBack ? 'rgba(255, 140, 20, 0.3)' : 'rgba(255, 140, 40, 0.85)';
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

        // 35mm Sprocket Holes (Perforações da fita de gravação)
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
      // Drawn behind the planet
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ < 0) {
          drawFilmQuad(filmQuads[i], true);
        }
      }

      // --- PHASE B: SOLID PLANET SPHERE CORE ---
      // Opaque planetary sphere that naturally and smoothly passes IN FRONT of the back film ring!
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
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.85)';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Sharp Neon Fiery Amber Top Arc Stroke
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 1.3 * Math.PI, 1.95 * Math.PI);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.9)';
      ctx.shadowColor = '#ff6b00';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      // --- PHASE C: 3,500+ REAL CONTINENTAL POINTS ---
      interface ProjPt {
        px: number;
        py: number;
        z: number;
        moz?: boolean;
      }

      const projectedPoints: ProjPt[] = [];

      for (let i = 0; i < worldPoints.length; i++) {
        const pt = worldPoints[i];
        const rot = rotate3D(pt.vec, cosY, sinY, cosX, sinX);

        // Only draw points on the front/visible hemisphere of the planet
        if (rot.z > -0.05) {
          projectedPoints.push({
            px: cx + rot.x * radius,
            py: cy + rot.y * radius,
            z: rot.z,
            moz: pt.moz
          });
        }
      }

      // Sort points back-to-front
      projectedPoints.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        const depth = pt.z;

        if (pt.moz) {
          // --- ULTRA-DETAILED MOÇAMBIQUE HIGHLIGHT (Sede & Berço Mizine) ---
          const pulse = 1 + Math.sin(time * 4) * 0.25;
          const rMoz = 2.4 * pulse * (0.8 + depth * 0.4);

          ctx.save();
          // Glowing red aura
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 59, 48, ${0.45 * depth})`;
          ctx.fill();

          // Solid bright red core dot
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz, 0, Math.PI * 2);
          ctx.fillStyle = '#ff3b30';
          ctx.shadowColor = '#ff2d55';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        } else {
          // Standard Continent Dot
          const r = 1.15 * (0.6 + depth * 0.55);
          let alpha = Math.pow(depth, 1.4) * 0.85;

          const dist = Math.hypot(pt.px - cx, pt.py - cy) / radius;
          if (dist > 0.85) alpha = Math.min(1, alpha * 1.4);

          ctx.beginPath();
          ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 235, 250, ${alpha * 0.85})`;
          ctx.fill();
        }
      }

      // --- PHASE D: GLOBAL CONNECTION ARCS (Maputo HQ to World) ---
      const rotHQ = rotate3D(hqVec, cosY, sinY, cosX, sinX);
      const hqPX = cx + rotHQ.x * radius;
      const hqPY = cy + rotHQ.y * radius;

      for (let i = 0; i < GLOBAL_ARCS.length; i++) {
        const arc = GLOBAL_ARCS[i];
        const destVec = latLonToVec(arc.targetLat, arc.targetLon);
        const rotDest = rotate3D(destVec, cosY, sinY, cosX, sinX);

        if (rotHQ.z > -0.15 || rotDest.z > -0.15) {
          const destPX = cx + rotDest.x * radius;
          const destPY = cy + rotDest.y * radius;

          const midVec = {
            x: (rotHQ.x + rotDest.x) * 0.5 * 1.30,
            y: (rotHQ.y + rotDest.y) * 0.5 * 1.30,
            z: (rotHQ.z + rotDest.z) * 0.5 * 1.30
          };
          const midPX = cx + midVec.x * radius;
          const midPY = cy + midVec.y * radius;

          const arcAlpha = Math.max(0.1, (rotHQ.z + rotDest.z + 1.2) / 2.4);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(hqPX, hqPY);
          ctx.quadraticCurveTo(midPX, midPY, destPX, destPY);
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = 0.3 * arcAlpha;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Photon packet traveling along arc
          const packetPhase = (time * 0.6 + i * 0.25) % 1;
          const inv = 1 - packetPhase;
          const curPX = inv * inv * hqPX + 2 * inv * packetPhase * midPX + packetPhase * packetPhase * destPX;
          const curPY = inv * inv * hqPY + 2 * inv * packetPhase * midPY + packetPhase * packetPhase * destPY;

          ctx.beginPath();
          ctx.arc(curPX, curPY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = arcAlpha;
          ctx.fill();
          ctx.restore();
        }
      }

      // --- PHASE E: DRAW FRONT HALF OF FILM REEL (Z >= 0) ---
      // Passes smoothly IN FRONT of the planet and continental points!
      for (let i = 0; i < filmQuads.length; i++) {
        if (filmQuads[i].centerZ >= 0) {
          drawFilmQuad(filmQuads[i], false);
        }
      }

      // --- PHASE F: MOÇAMBIQUE HQ & GLOBAL TECHNICAL PINS ---
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
            // --- PROMINENT MOÇAMBIQUE HQ BEACON PIN ---
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

            // HUD Leader Line
            const lineEndX = mx + 42;
            const lineEndY = my - 24;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.lineTo(lineEndX + 45, lineEndY);
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.font = '700 11px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText('🇲🇿 MOÇAMBIQUE [HQ]', lineEndX + 4, lineEndY - 6);

            ctx.font = '600 9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ff3b30';
            ctx.fillText('SEDE & BERÇO DA MIZINE', lineEndX + 4, lineEndY + 10);

            ctx.font = '400 8.5px "Inter", sans-serif';
            ctx.fillStyle = '#a3a3a3';
            ctx.fillText('Conexão Global • 4K • Redes Sociais', lineEndX + 4, lineEndY + 22);
          } else {
            // Standard Global Markers
            const pulse = 1 + Math.sin(time * 3 + i) * 0.2;
            ctx.beginPath();
            ctx.arc(mx, my, 3.5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = m.color;
            ctx.shadowColor = m.color;
            ctx.shadowBlur = 8;
            ctx.fill();

            const isRight = rot.x >= 0;
            const lineEndX = mx + (isRight ? 24 : -24);
            const lineEndY = my - 14;

            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.lineTo(lineEndX + (isRight ? 12 : -12), lineEndY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.font = '600 9.5px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = isRight ? 'left' : 'right';
            const labelX = lineEndX + (isRight ? 16 : -16);
            ctx.fillText(m.name, labelX, lineEndY + 3);

            ctx.font = '400 8px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(m.sub, labelX, lineEndY + 14);
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
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="uc-globe-wrapper">
      <canvas ref={canvasRef} className="uc-globe-canvas" />
      <div className="uc-globe-ambient-radial" />
    </div>
  );
};
