import React, { useEffect, useRef } from 'react';
import worldData from '../data/worldPoints.json';

interface WorldPoint {
  lat: number;
  lon: number;
  moz?: boolean;
  reg?: string;
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
    name: 'MOÇAMBIQUE [SEDE]',
    sub: 'Berço & QG Mizine Multimédia',
    lat: -25.96,
    lon: 32.58,
    color: '#ff3b30',
    isHQ: true
  },
  {
    name: 'EUROPA & UK',
    sub: 'Audiovisual & Parcerias',
    lat: 48.85,
    lon: 2.35,
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
    color: '#5856d6'
  },
  {
    name: 'ÁFRICA AUSTRAL',
    sub: 'Cobertura Regional 4K',
    lat: -26.20,
    lon: 28.04,
    color: '#34c759'
  }
];

// Arcs connecting Mozambique HQ to the world
const GLOBAL_ARCS = [
  { targetLat: 48.85, targetLon: 2.35, color: '#00d4ff' },   // Europe
  { targetLat: -23.55, targetLon: -46.63, color: '#ff9500' }, // Americas
  { targetLat: 25.20, targetLon: 55.27, color: '#af52de' },  // Middle East
  { targetLat: -26.20, targetLon: 28.04, color: '#34c759' }  // Regional Africa
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

    // Initial rotation: tilt to showcase Africa / Mozambique front & center
    let rotX = 0.28;
    // Maputo is at lon 32.5. To make it front-facing at start:
    let rotY = -Math.PI * 0.45;
    let targetRotY = rotY;
    let targetRotX = rotX;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const autoRotateSpeed = 0.0028;

    // Convert lat/long to 3D unit sphere coordinate
    const latLonToVec = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -(Math.sin(phi) * Math.sin(theta)),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.cos(theta)
      };
    };

    // Precalculate 3D vectors for real continent points
    const worldPoints = (worldData as WorldPoint[]).map(pt => ({
      ...pt,
      vec: latLonToVec(pt.lat, pt.lon)
    }));

    // Precalculate marker vectors
    const markerVectors = MARKERS.map(m => ({
      ...m,
      vec: latLonToVec(m.lat, m.lon)
    }));

    const hqVec = latLonToVec(-25.96, 32.58);

    // Resize handler
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
        targetRotY += dx * 0.006;
        targetRotX += dy * 0.004;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / width - 0.5;
        const ny = (e.clientY - rect.top) / height - 0.5;
        targetRotX = 0.28 + ny * 0.2;
        targetRotY += nx * 0.001;
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
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.006;
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

    // 3D Rotation helper
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
      targetRotY += autoRotateSpeed;

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      rotX = Math.max(-0.65, Math.min(0.65, rotX));

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.54;
      const cy = height * 0.52;
      const radius = Math.min(width, height) * 0.43;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // --- 1. ATMOSPHERIC NEON RIM GLOWS (United Carriers dual lighting) ---
      // Fiery Orange/Crimson Upper Flare
      const orangeGlow = ctx.createRadialGradient(
        cx + radius * 0.35, cy - radius * 0.45, radius * 0.25,
        cx, cy, radius * 1.3
      );
      orangeGlow.addColorStop(0, 'rgba(255, 110, 0, 0.45)');
      orangeGlow.addColorStop(0.45, 'rgba(255, 50, 0, 0.18)');
      orangeGlow.addColorStop(0.85, 'rgba(255, 20, 0, 0.04)');
      orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      // Electric Cyan/Blue Deep Rim Crescent
      const blueGlow = ctx.createRadialGradient(
        cx - radius * 0.45, cy + radius * 0.4, radius * 0.2,
        cx, cy, radius * 1.35
      );
      blueGlow.addColorStop(0, 'rgba(0, 160, 255, 0.58)');
      blueGlow.addColorStop(0.45, 'rgba(0, 210, 255, 0.25)');
      blueGlow.addColorStop(0.8, 'rgba(0, 90, 220, 0.06)');
      blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      // Globe Void Core
      const coreGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      coreGrad.addColorStop(0, 'rgba(3, 4, 8, 0.98)');
      coreGrad.addColorStop(0.75, 'rgba(2, 3, 6, 0.96)');
      coreGrad.addColorStop(1, 'rgba(4, 8, 16, 0.72)');
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

      // --- 2. 3D 35MM FILM REEL ORBITAL RING ("Fita de gravação de vídeo") ---
      // We render a 3D cinematographic film strip ribbon orbiting the globe!
      const filmFrames = 54;
      const filmOrbitRadius = radius * 1.28;
      const filmWidth = radius * 0.095;
      const filmTilt = 0.42; // Orbit inclination angle (~24 deg)
      const filmSpeed = time * 0.22; // smooth film reel translation

      // Calculate 3D quads for film frames
      interface FilmQuad {
        tl: { x: number; y: number; z: number };
        tr: { x: number; y: number; z: number };
        br: { x: number; y: number; z: number };
        bl: { x: number; y: number; z: number };
        centerZ: number;
        index: number;
      }

      const quads: FilmQuad[] = [];

      for (let i = 0; i < filmFrames; i++) {
        const a1 = (i / filmFrames) * Math.PI * 2 + filmSpeed;
        const a2 = ((i + 0.85) / filmFrames) * Math.PI * 2 + filmSpeed;

        const getFilmEdge = (angle: number, offset: number) => {
          // Point in orbital plane
          const ox = filmOrbitRadius * Math.cos(angle);
          const oz = filmOrbitRadius * Math.sin(angle);
          // Tilt around X
          const x0 = ox;
          const y0 = oz * Math.sin(filmTilt) + offset * Math.cos(filmTilt);
          const z0 = oz * Math.cos(filmTilt) - offset * Math.sin(filmTilt);
          // Rotate by globe rotation
          return rotate3D({ x: x0, y: y0, z: z0 }, cosY, sinY, cosX, sinX);
        };

        const tl = getFilmEdge(a1, filmWidth * 0.5);
        const tr = getFilmEdge(a2, filmWidth * 0.5);
        const br = getFilmEdge(a2, -filmWidth * 0.5);
        const bl = getFilmEdge(a1, -filmWidth * 0.5);

        const centerZ = (tl.z + tr.z + br.z + bl.z) / 4;
        quads.push({ tl, tr, br, bl, centerZ, index: i });
      }

      // Draw film frames sorted by depth (back to front)
      quads.sort((a, b) => a.centerZ - b.centerZ);

      const projectPoint = (p: { x: number; y: number }) => ({
        px: cx + p.x,
        py: cy + p.y
      });

      for (let i = 0; i < quads.length; i++) {
        const q = quads[i];
        const isBack = q.centerZ < 0;

        // Skip or dim back frames when occluded by the solid sphere
        const pTL = projectPoint(q.tl);
        const pTR = projectPoint(q.tr);
        const pBR = projectPoint(q.br);
        const pBL = projectPoint(q.bl);

        const frameAlpha = isBack ? 0.22 : 0.95;

        ctx.save();

        // Celluloid Film Frame Body (Dark Film Base)
        ctx.beginPath();
        ctx.moveTo(pTL.px, pTL.py);
        ctx.lineTo(pTR.px, pTR.py);
        ctx.lineTo(pBR.px, pBR.py);
        ctx.lineTo(pBL.px, pBL.py);
        ctx.closePath();

        ctx.fillStyle = isBack
          ? 'rgba(10, 10, 15, 0.4)'
          : 'rgba(15, 15, 22, 0.88)';
        ctx.fill();

        ctx.strokeStyle = isBack
          ? 'rgba(255, 140, 20, 0.2)'
          : 'rgba(255, 140, 40, 0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner Film Exposure Window (Glowing Screen / Frame)
        const inset = 0.22;
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

        // Cinema Light inside the frame (alternating amber / cyan)
        const isCyanFrame = q.index % 2 === 0;
        ctx.fillStyle = isCyanFrame
          ? `rgba(0, 212, 255, ${0.12 * frameAlpha})`
          : `rgba(255, 120, 0, ${0.14 * frameAlpha})`;
        ctx.fill();

        // 35mm Film Sprocket Holes (Perforações da fita de cinema)
        if (!isBack) {
          ctx.fillStyle = '#020204';
          // Top perforation
          const spTopX = pTL.px + (pTR.px - pTL.px) * 0.5 + (pBL.px - pTL.px) * 0.1;
          const spTopY = pTL.py + (pTR.py - pTL.py) * 0.5 + (pBL.py - pTL.py) * 0.1;
          ctx.beginPath();
          ctx.arc(spTopX, spTopY, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Bottom perforation
          const spBotX = pBL.px + (pBR.px - pBL.px) * 0.5 - (pBL.px - pTL.px) * 0.1;
          const spBotY = pBL.py + (pBR.py - pBL.py) * 0.5 - (pBL.py - pTL.py) * 0.1;
          ctx.beginPath();
          ctx.arc(spBotX, spBotY, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // --- 3. REAL CONTINENT PARTICLES PROJECTION (World Continents + Mozambique) ---
      interface ProjPt {
        px: number;
        py: number;
        z: number;
        moz?: boolean;
        reg?: string;
      }

      const projectedPoints: ProjPt[] = [];

      for (let i = 0; i < worldPoints.length; i++) {
        const pt = worldPoints[i];
        const rot = rotate3D(pt.vec, cosY, sinY, cosX, sinX);

        projectedPoints.push({
          px: cx + rot.x * radius,
          py: cy + rot.y * radius,
          z: rot.z,
          moz: pt.moz,
          reg: pt.reg
        });
      }

      // Sort points back-to-front
      projectedPoints.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];

        // Depth scale (cull far back)
        if (pt.z < -0.15) continue;
        const depth = (pt.z + 1) / 2;

        // Base continent dots
        if (pt.moz) {
          // --- MOÇAMBIQUE HIGHLIGHT (Sede & Berço Mizine) ---
          const pulse = 1 + Math.sin(time * 4) * 0.3;
          const rMoz = 3.2 * pulse * (0.8 + depth * 0.4);

          // Glowing beacon aura around Mozambique
          ctx.save();
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 59, 48, ${0.35 * depth})`;
          ctx.fill();

          // Solid bright red core
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, rMoz, 0, Math.PI * 2);
          ctx.fillStyle = '#ff3b30';
          ctx.shadowColor = '#ff2d55';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        } else {
          // Regular continent dot
          const r = 1.35 * (0.6 + depth * 0.6);
          let alpha = Math.pow(depth, 1.6) * 0.85;

          // Rim lighting boost
          const dist = Math.hypot(pt.px - cx, pt.py - cy) / radius;
          if (dist > 0.85) alpha = Math.min(1, alpha * 1.5);

          ctx.beginPath();
          ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);

          // Give Africa and near-Maputo points a slightly warmer golden tint
          if (pt.reg === 'africa') {
            ctx.fillStyle = `rgba(255, 180, 80, ${alpha * 0.95})`;
          } else if (pt.reg === 'europe') {
            ctx.fillStyle = `rgba(0, 210, 255, ${alpha * 0.9})`;
          } else if (pt.reg === 'north_america' || pt.reg === 'south_america') {
            ctx.fillStyle = `rgba(255, 140, 40, ${alpha * 0.9})`;
          } else {
            ctx.fillStyle = `rgba(235, 240, 255, ${alpha * 0.8})`;
          }
          ctx.fill();
        }
      }

      // --- 4. GLOBAL CONNECTION ARCS (From Maputo HQ to the World) ---
      const rotHQ = rotate3D(hqVec, cosY, sinY, cosX, sinX);
      const hqPX = cx + rotHQ.x * radius;
      const hqPY = cy + rotHQ.y * radius;

      for (let i = 0; i < GLOBAL_ARCS.length; i++) {
        const arc = GLOBAL_ARCS[i];
        const destVec = latLonToVec(arc.targetLat, arc.targetLon);
        const rotDest = rotate3D(destVec, cosY, sinY, cosX, sinX);

        // Only draw if either HQ or Dest is on front hemisphere
        if (rotHQ.z > -0.2 || rotDest.z > -0.2) {
          const destPX = cx + rotDest.x * radius;
          const destPY = cy + rotDest.y * radius;

          // Midpoint elevated off surface to form 3D ballistic arc
          const midVec = {
            x: (rotHQ.x + rotDest.x) * 0.5 * 1.32,
            y: (rotHQ.y + rotDest.y) * 0.5 * 1.32,
            z: (rotHQ.z + rotDest.z) * 0.5 * 1.32
          };
          const midPX = cx + midVec.x * radius;
          const midPY = cy + midVec.y * radius;

          const arcAlpha = Math.max(0.1, (rotHQ.z + rotDest.z + 1.2) / 2.4);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(hqPX, hqPY);
          ctx.quadraticCurveTo(midPX, midPY, destPX, destPY);
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = 0.28 * arcAlpha;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Traveling photon packet from Maputo to World
          const packetPhase = (time * 0.6 + i * 0.25) % 1;
          const inv = 1 - packetPhase;
          const curPX = inv * inv * hqPX + 2 * inv * packetPhase * midPX + packetPhase * packetPhase * destPX;
          const curPY = inv * inv * hqPY + 2 * inv * packetPhase * midPY + packetPhase * packetPhase * destPY;

          ctx.beginPath();
          ctx.arc(curPX, curPY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = arcAlpha;
          ctx.fill();

          ctx.restore();
        }
      }

      // --- 5. TECHNICAL PINS & PRODUCTION LABELS (Highlight on Mozambique) ---
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
            // --- SPECIAL PROMINENT PIN: MOÇAMBIQUE HQ ---
            const pulse = 1 + Math.sin(time * 3.5) * 0.3;

            // Concentric Radar Waves
            const wave1 = (time * 1.8) % 1.5;
            ctx.beginPath();
            ctx.arc(mx, my, 8 + wave1 * 22, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 59, 48, ${Math.max(0, 1 - wave1 / 1.5)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Center Pin Head
            ctx.beginPath();
            ctx.arc(mx, my, 5 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#ff3b30';
            ctx.shadowColor = '#ff3b30';
            ctx.shadowBlur = 16;
            ctx.fill();

            // White Inner Core
            ctx.beginPath();
            ctx.arc(mx, my, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Technical HUD Leader Line
            const lineEndX = mx + 42;
            const lineEndY = my - 24;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.lineTo(lineEndX + 45, lineEndY);
            ctx.strokeStyle = '#ff3b30';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Mozambique Flag Badge + Text
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
