import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  alpha: number;
  colorType: 'blue' | 'orange' | 'white';
}

interface Marker3D {
  name: string;
  sub: string;
  lat: number; // -90 to 90
  lon: number; // -180 to 180
  color: string;
}

const MARKERS: Marker3D[] = [
  { name: 'MAPUTO [HQ]', sub: 'Base de Operações 4K', lat: -25.9, lon: 32.5, color: '#ff3b30' },
  { name: '4K DCI / 24FPS', sub: 'Cinema & Publicidade', lat: 10.0, lon: 15.0, color: '#ff9500' },
  { name: 'VIRAL REELS', sub: 'Gestão & Retenção', lat: -15.0, lon: 45.0, color: '#00d4ff' },
  { name: 'CELEBRATE', sub: 'Convites Digitais VIP', lat: -30.0, lon: 20.0, color: '#ff2d55' },
  { name: 'ÁFRICA & MUNDO', sub: 'Produção Global', lat: 35.0, lon: -20.0, color: '#5856d6' },
  { name: 'STUDIO 8', sub: 'Subdivisão Multimédia', lat: 2.0, lon: -40.0, color: '#ff9500' }
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

    // Rotation angles
    let rotX = 0.22; // subtle tilt
    let rotY = 0;
    let targetRotY = 0;
    let targetRotX = 0.22;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let autoRotateSpeed = 0.0035;

    // Generate ~1400 points evenly on a sphere (Fibonacci lattice)
    const NUM_POINTS = 1350;
    const points: Point3D[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < NUM_POINTS; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / NUM_POINTS);
      
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      // Color variation: upper hemisphere gets more fiery orange, lower gets cyan/blue
      const colorRand = Math.random();
      let colorType: 'blue' | 'orange' | 'white' = 'white';
      if (y > 0.1 && colorRand > 0.4) {
        colorType = 'orange';
      } else if (y < -0.1 && colorRand > 0.3) {
        colorType = 'blue';
      }

      points.push({
        x,
        y,
        z,
        baseRadius: 1 + Math.random() * 1.4,
        alpha: 0.3 + Math.random() * 0.7,
        colorType
      });
    }

    // Convert lat/long to unit 3D sphere coordinate
    const latLonToVec = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -(Math.sin(phi) * Math.sin(theta)),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.cos(theta)
      };
    };

    const markerVectors = MARKERS.map(m => ({
      ...m,
      vec: latLonToVec(m.lat, m.lon)
    }));

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
        // Subtle parallax from pointer
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / width - 0.5;
        const ny = (e.clientY - rect.top) / height - 0.5;
        targetRotX = 0.22 + ny * 0.25;
        targetRotY += nx * 0.0015;
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

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      targetRotY += autoRotateSpeed;

      // Smooth damping
      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;

      // Clamp vertical tilt so it doesn't flip
      rotX = Math.max(-0.6, Math.min(0.6, rotX));

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.55;
      const cy = height * 0.52;
      const radius = Math.min(width, height) * 0.44;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // --- 1. ATMOSPHERIC NEON RIM GLOWS (Matching United Carriers exactly) ---
      // Fiery Orange/Amber Solar Rim (Top Right)
      const orangeGlow = ctx.createRadialGradient(
        cx + radius * 0.35, cy - radius * 0.4, radius * 0.3,
        cx, cy, radius * 1.25
      );
      orangeGlow.addColorStop(0, 'rgba(255, 120, 0, 0.42)');
      orangeGlow.addColorStop(0.5, 'rgba(255, 60, 0, 0.18)');
      orangeGlow.addColorStop(0.85, 'rgba(255, 30, 0, 0.05)');
      orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = orangeGlow;
      ctx.fillRect(0, 0, width, height);

      // Electric Cyan/Blue Deep Rim (Bottom Left Crescent)
      const blueGlow = ctx.createRadialGradient(
        cx - radius * 0.45, cy + radius * 0.4, radius * 0.2,
        cx, cy, radius * 1.3
      );
      blueGlow.addColorStop(0, 'rgba(0, 150, 255, 0.55)');
      blueGlow.addColorStop(0.45, 'rgba(0, 200, 255, 0.25)');
      blueGlow.addColorStop(0.8, 'rgba(0, 80, 200, 0.06)');
      blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      // Globe Void Core (Deep pitch black circle with subtle inner vignette)
      const coreGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      coreGrad.addColorStop(0, 'rgba(3, 4, 8, 0.98)');
      coreGrad.addColorStop(0.8, 'rgba(2, 3, 6, 0.95)');
      coreGrad.addColorStop(1, 'rgba(4, 8, 16, 0.7)');

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

      // --- 2. ORBITAL PARTICLE ARCS (United Carriers trajectory trails) ---
      const numRings = 2;
      for (let r = 0; r < numRings; r++) {
        const ringTilt = (r === 0 ? 0.45 : -0.35) + Math.sin(time * 0.2 + r) * 0.04;
        const ringRad = radius * (1.08 + r * 0.12);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringRad, ringRad * 0.32, ringTilt, 0, Math.PI * 2);
        ctx.strokeStyle = r === 0 ? 'rgba(255, 120, 40, 0.18)' : 'rgba(0, 180, 255, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulsing satellite particle on the ring
        const satAngle = time * (0.8 + r * 0.4) + r * Math.PI;
        const satX = cx + Math.cos(satAngle) * ringRad * Math.cos(ringTilt) - Math.sin(satAngle) * ringRad * 0.32 * Math.sin(ringTilt);
        const satY = cy + Math.cos(satAngle) * ringRad * Math.sin(ringTilt) + Math.sin(satAngle) * ringRad * 0.32 * Math.cos(ringTilt);

        ctx.beginPath();
        ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r === 0 ? '#ff8c00' : '#00e5ff';
        ctx.shadowColor = r === 0 ? '#ff5500' : '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // --- 3. 3D PARTICLE PROJECTION ---
      // Rotate and project points
      const projected = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Depth sorting
        projected.push({
          px: cx + x1 * radius,
          py: cy + y2 * radius,
          z: z2,
          baseRadius: p.baseRadius,
          alpha: p.alpha,
          colorType: p.colorType
        });
      }

      // Draw back particles first, then front
      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        
        // Depth scale & fade
        const depth = (pt.z + 1) / 2; // 0 (back) to 1 (front)
        if (depth < 0.15) continue; // cull far back

        const r = pt.baseRadius * (0.6 + depth * 0.7);
        let alpha = pt.alpha * Math.pow(depth, 1.8);

        // Boost visibility on rims
        const distFromCenter = Math.hypot(pt.px - cx, pt.py - cy) / radius;
        if (distFromCenter > 0.85) {
          alpha = Math.min(1, alpha * 1.4);
        }

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2);

        if (pt.colorType === 'orange') {
          ctx.fillStyle = `rgba(255, 140, 40, ${alpha * 0.9})`;
        } else if (pt.colorType === 'blue') {
          ctx.fillStyle = `rgba(0, 200, 255, ${alpha * 0.95})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
        }
        ctx.fill();
      }

      // --- 4. PRODUCTION COORDINATE MARKERS (Maputo, 4K, Reels, Celebrate) ---
      for (let i = 0; i < markerVectors.length; i++) {
        const m = markerVectors[i];
        const v = m.vec;

        // Rotate Y
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;

        // Rotate X
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        // Only draw when on the front hemisphere
        if (z2 > 0.08) {
          const mx = cx + x1 * radius;
          const my = cy + y2 * radius;
          const markerAlpha = Math.min(1, (z2 - 0.08) * 2.5);

          ctx.save();
          ctx.globalAlpha = markerAlpha;

          // Glowing Hotspot Dot
          const pulse = 1 + Math.sin(time * 3 + i) * 0.25;
          ctx.beginPath();
          ctx.arc(mx, my, 4 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.shadowColor = m.color;
          ctx.shadowBlur = 10;
          ctx.fill();

          // Outer ring ripple
          ctx.beginPath();
          ctx.arc(mx, my, 8 * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = m.color;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Technical Leader Line
          const lineEndX = mx + (x1 >= 0 ? 28 : -28);
          const lineEndY = my - 16;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(lineEndX, lineEndY);
          ctx.lineTo(lineEndX + (x1 >= 0 ? 14 : -14), lineEndY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Text Label
          ctx.font = '600 10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = x1 >= 0 ? 'left' : 'right';
          const labelX = lineEndX + (x1 >= 0 ? 18 : -18);
          ctx.fillText(m.name, labelX, lineEndY + 3);

          ctx.font = '400 9px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.fillText(m.sub, labelX, lineEndY + 15);

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
