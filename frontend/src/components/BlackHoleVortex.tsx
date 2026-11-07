import React, { useEffect, useRef } from 'react';
import { ReelItem } from '../types';

interface BlackHoleVortexProps {
  reels: ReelItem[];
  onOpenReel: (title: string, videoUrl?: string) => void;
  /** 0→1: quanto da fita de reels já foi engolida (cena guiada pelo scroll em Reels.tsx) */
  pullRef?: React.MutableRefObject<number>;
  showManifesto?: boolean;
}

export const BlackHoleVortex: React.FC<BlackHoleVortexProps> = ({ reels, onOpenReel, pullRef, showManifesto = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tilt interaction
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;
      targetTiltX = ny * 0.25;
      targetTiltY = nx * 0.35;
    };

    canvas.addEventListener('mousemove', onMouseMove);

    // Preload reel images for film frame rendering in 3D orbit
    const loadedThumbnails: { [key: number]: HTMLImageElement } = {};
    reels.forEach((r, idx) => {
      if (r.imageUrl) {
        const img = new Image();
        img.src = r.imageUrl;
        img.onload = () => {
          loadedThumbnails[idx] = img;
        };
      }
    });

    // Swirling gas particles in the accretion disk (Gargantua simulation)
    interface AccretionParticle {
      radius: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
      alpha: number;
      layer: 'inner' | 'mid' | 'outer';
    }

    const particles: AccretionParticle[] = [];
    const numParticles = 420;
    const colors = [
      '#ffffff', // incandescent white
      '#ffe8a3', // warm cream
      '#ffae19', // golden amber
      '#ff6b00', // fiery orange
      '#e62b1e', // deep crimson
      '#7a0c00'  // dark red dust
    ];

    for (let i = 0; i < numParticles; i++) {
      const u = Math.random();
      // Concentrated heavily near the event horizon
      const rRatio = Math.pow(u, 1.8);
      const layer = rRatio < 0.25 ? 'inner' : (rRatio < 0.65 ? 'mid' : 'outer');
      particles.push({
        radius: 0.28 + rRatio * 0.72,
        angle: Math.random() * Math.PI * 2,
        speed: (0.012 + (1 - rRatio) * 0.035) * (0.8 + Math.random() * 0.4),
        size: 0.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.7,
        layer
      });
    }

    let time = 0;

    // Hit-testing boxes for 3D orbiting reels
    let reelHitZones: { x: number; y: number; w: number; h: number; index: number }[] = [];

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (let i = 0; i < reelHitZones.length; i++) {
        const z = reelHitZones[i];
        if (cx >= z.x - z.w / 2 && cx <= z.x + z.w / 2 && cy >= z.y - z.h / 2 && cy <= z.y + z.h / 2) {
          const reel = reels[z.index];
          if (reel) {
            onOpenReel(reel.title, reel.videoUrl);
            return;
          }
        }
      }
    };

    canvas.addEventListener('click', onClick);

    const render = () => {
      time += 0.02;
      const pull = pullRef ? Math.min(1, Math.max(0, pullRef.current)) : 1;
      tiltX += (targetTiltX - tiltX) * 0.06;
      tiltY += (targetTiltY - tiltY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;

      // Base black hole radius
      const isMobile = width < 768;
      const bhRadius = isMobile ? Math.min(width * 0.22, 90) : Math.min(width * 0.16, 140);
      const diskRadiusX = bhRadius * 3.4;
      const diskRadiusY = bhRadius * (0.85 + tiltX); // warped by perspective

      reelHitZones = [];

      // =========================================================================
      // 1. DEEP SPACE BACKDROP & BACKGROUND GRAVITATIONAL REDSHIFT HAZE
      // =========================================================================
      const bgGlow = ctx.createRadialGradient(cx, cy, bhRadius * 0.8, cx, cy, diskRadiusX * 1.5);
      bgGlow.addColorStop(0, 'rgba(255, 120, 20, 0.18)');
      bgGlow.addColorStop(0.35, 'rgba(180, 40, 0, 0.12)');
      bgGlow.addColorStop(0.70, 'rgba(60, 5, 0, 0.06)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 2. GARGANTUA TOP WARPED ACCRETION DISK (GRAVITATIONAL LENSING BEHIND/ABOVE)
      // Light from the rear disk bent over the top of the event horizon
      // =========================================================================
      ctx.save();
      const topDiskH = bhRadius * 1.55;
      const topDiskW = bhRadius * 2.7;

      const topGrad = ctx.createRadialGradient(cx, cy - topDiskH * 0.5, bhRadius * 0.8, cx, cy - topDiskH * 0.3, topDiskW);
      topGrad.addColorStop(0, 'rgba(255, 240, 200, 0.95)'); // Einstein ring rim
      topGrad.addColorStop(0.18, 'rgba(255, 160, 20, 0.85)');
      topGrad.addColorStop(0.45, 'rgba(220, 60, 5, 0.60)');
      topGrad.addColorStop(0.75, 'rgba(120, 15, 0, 0.25)');
      topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = topGrad;
      ctx.beginPath();
      // Ellipse arched above the horizon
      ctx.ellipse(cx, cy - bhRadius * 0.25, topDiskW, topDiskH, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      // Top warped disk filaments
      for (let f = 0; f < 6; f++) {
        const fR = topDiskW * (0.55 + f * 0.08);
        const fH = topDiskH * (0.65 + f * 0.07);
        ctx.strokeStyle = f % 2 === 0 ? 'rgba(255, 220, 140, 0.45)' : 'rgba(255, 120, 10, 0.35)';
        ctx.lineWidth = 1.2 + f * 0.4;
        ctx.beginPath();
        ctx.ellipse(cx, cy - bhRadius * 0.25, fR, fH, 0, Math.PI * 1.05, Math.PI * 1.95);
        ctx.stroke();
      }
      ctx.restore();

      // =========================================================================
      // 3. GARGANTUA LOWER WARPED ACCRETION DISK (GRAVITATIONAL LENSING BENEATH)
      // Light from the rear disk bent underneath the event horizon
      // =========================================================================
      ctx.save();
      const botDiskH = bhRadius * 1.1;
      const botDiskW = bhRadius * 2.3;

      const botGrad = ctx.createRadialGradient(cx, cy + botDiskH * 0.4, bhRadius * 0.7, cx, cy + botDiskH * 0.2, botDiskW);
      botGrad.addColorStop(0, 'rgba(255, 230, 180, 0.80)');
      botGrad.addColorStop(0.20, 'rgba(255, 140, 15, 0.65)');
      botGrad.addColorStop(0.55, 'rgba(180, 45, 5, 0.35)');
      botGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + bhRadius * 0.20, botDiskW, botDiskH, 0, 0, Math.PI);
      ctx.fill();
      ctx.restore();

      // =========================================================================
      // 4. MAIN HORIZONTAL ACCRETION DISK (SWIRLING PLASMA VORTEX)
      // =========================================================================
      ctx.save();
      // Draw swirling dust & plasma particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed * (1 + pull * 1.4);

        // Spiral inward pull towards the event horizon
        p.radius -= 0.0003;
        if (p.radius < 0.28) {
          p.radius = 1.0; // reborn at the outer edge of the disk
        }

        const prX = diskRadiusX * p.radius;
        const prY = diskRadiusY * p.radius;

        // 3D projected coordinate on the tilted disk
        const px = cx + Math.cos(p.angle) * prX;
        const py = cy + Math.sin(p.angle) * prY;

        // Doppler beaming: gas moving towards camera on the left is brighter & bluer/whiter
        const isApproaching = Math.sin(p.angle) < 0;
        const dopplerBoost = isApproaching ? 1.4 : 0.65;

        // If particle is behind the black hole horizon, hide or dim it
        const isBehindBH = Math.sin(p.angle) < -0.2 && Math.hypot(px - cx, (py - cy) * 1.8) < bhRadius;
        if (isBehindBH) continue;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.alpha * dopplerBoost);
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + (1 - p.radius) * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // =========================================================================
      // 5. THE SINGULARITY // PITCH-BLACK SPHERICAL EVENT HORIZON
      // =========================================================================
      ctx.save();
      // Photon Sphere Einstein Ring (intense luminous rim)
      const ringGrad = ctx.createRadialGradient(cx, cy, bhRadius * 0.95, cx, cy, bhRadius * 1.08);
      ringGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      ringGrad.addColorStop(0.3, 'rgba(255, 220, 140, 0.95)');
      ringGrad.addColorStop(0.7, 'rgba(255, 120, 10, 0.70)');
      ringGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // Absolute Black Shadow (Event Horizon)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp shadow stroke
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // =========================================================================
      // 6. 24MM VERTICAL REELS ORBITING & SPIRALING INTO THE BLACK HOLE
      // "reels estão sendo sugados pelo buraco negro levando tudo até ao centro"
      // =========================================================================
      const numReels = Math.min(reels.length, 6);
      const reelFrames: {
        index: number;
        x: number;
        y: number;
        z: number;
        scale: number;
        alpha: number;
        angle: number;
      }[] = [];

      for (let i = 0; i < numReels; i++) {
        // Orbit angle + spiral phase
        const orbitSpeed = 0.008;
        const baseAngle = (i / numReels) * Math.PI * 2 + time * orbitSpeed;
        const spiralProgress = ((time * 0.05 + i * 0.18) % 1.0); // 0 (outer) to 1 (horizon)

        // Elliptical orbit shrinking as it spirals in
        const orbitRadiusX = diskRadiusX * (1.15 - spiralProgress * 0.65);
        const orbitRadiusY = diskRadiusY * (1.15 - spiralProgress * 0.65);

        const rx = cx + Math.cos(baseAngle) * orbitRadiusX;
        const ry = cy + Math.sin(baseAngle) * orbitRadiusY;
        const rz = Math.sin(baseAngle); // positive = in front, negative = behind

        const depthScale = 0.55 + ((rz + 1) / 2) * 0.55;
        const scale = depthScale * (1 - spiralProgress * 0.45);
        // os reels só "entram em órbita" depois de a fita ser engolida
        const orbitIn = pullRef ? Math.min(1, Math.max(0, (pull - 0.55) / 0.35)) : 1;
        const alpha = orbitIn * Math.min(1, Math.max(0.15, (1 - spiralProgress * 0.3) * (rz > 0 ? 1 : 0.45)));
        if (alpha < 0.02) continue;

        reelFrames.push({
          index: i,
          x: rx,
          y: ry,
          z: rz,
          scale,
          alpha,
          angle: baseAngle
        });
      }

      // Sort back-to-front
      reelFrames.sort((a, b) => a.z - b.z);

      for (let i = 0; i < reelFrames.length; i++) {
        const rf = reelFrames[i];
        const reel = reels[rf.index];
        if (!reel) continue;

        // If behind event horizon circle, cull
        const distToCenter = Math.hypot(rf.x - cx, rf.y - cy);
        if (rf.z < -0.1 && distToCenter < bhRadius * 0.95) {
          continue;
        }

        const rw = (isMobile ? 54 : 76) * rf.scale;
        const rh = (isMobile ? 96 : 136) * rf.scale;
        const rx = rf.x - rw / 2;
        const ry = rf.y - rh / 2;

        ctx.save();
        ctx.globalAlpha = rf.alpha;

        // Gravitational tidal stretch & tilt
        const tangentAngle = rf.angle + Math.PI / 2;
        ctx.translate(rf.x, rf.y);
        ctx.rotate(tangentAngle * 0.15); // gentle tidal alignment
        ctx.translate(-rf.x, -rf.y);

        // Record hit zone for clicking
        if (rf.z > -0.2 && rf.alpha > 0.3) {
          reelHitZones.push({
            x: rf.x,
            y: rf.y,
            w: rw,
            h: rh,
            index: rf.index
          });
        }

        // 24MM Film Frame Outer Body (Dark Acetate)
        ctx.fillStyle = '#08080c';
        ctx.strokeStyle = rf.z > 0 ? '#ff851b' : 'rgba(255, 133, 27, 0.4)';
        ctx.lineWidth = 1.4;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Sprockets on Left and Right (Vertical 24mm Film Format)
        const numSprockets = 5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let s = 0; s < numSprockets; s++) {
          const spY = ry + (s + 0.5) * (rh / numSprockets);
          const spW = 3.5 * rf.scale;
          const spH = 5 * rf.scale;
          // Left
          ctx.fillRect(rx + 2, spY - spH / 2, spW, spH);
          // Right
          ctx.fillRect(rx + rw - spW - 2, spY - spH / 2, spW, spH);
        }

        // Inner Image Window
        const imgX = rx + 8 * rf.scale;
        const imgY = ry + 8 * rf.scale;
        const imgW = rw - 16 * rf.scale;
        const imgH = rh - 22 * rf.scale;

        const thumb = loadedThumbnails[rf.index];
        if (thumb && thumb.complete && thumb.naturalWidth > 0) {
          ctx.drawImage(thumb, imgX, imgY, imgW, imgH);
        } else {
          // Fallback glowing gradient
          const g = ctx.createLinearGradient(imgX, imgY, imgX, imgY + imgH);
          g.addColorStop(0, '#1c1c28');
          g.addColorStop(1, '#ff3b30');
          ctx.fillStyle = g;
          ctx.fillRect(imgX, imgY, imgW, imgH);
        }

        // 4K DCI / 24MM Indicator Tag
        ctx.fillStyle = '#ff3b30';
        ctx.font = `700 ${Math.max(6, 7.5 * rf.scale)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(`FR 0${rf.index + 1}`, imgX + 3, imgY + 9 * rf.scale);

        // Singularity suction gravitational streamer connecting reel to core
        ctx.strokeStyle = `rgba(255, 100, 20, ${0.45 * (1 - distToCenter / (diskRadiusX * 1.2))})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rf.x, rf.y);
        ctx.quadraticCurveTo(
          (rf.x + cx) / 2 + Math.cos(time + i) * 20,
          (rf.y + cy) / 2 + Math.sin(time + i) * 15,
          cx,
          cy
        );
        ctx.stroke();

        ctx.restore();
      }

      // =========================================================================
      // 7. THE MIZINE SINGULARITY CORE AT THE EXACT CENTER
      // "o centro do buraco negro é a mizine , pois tudo começa connosco
      // e termina connosco para manter a estabilidade do universo das tuas redes sociais"
      // =========================================================================
      ctx.save();
      const corePulse = 1 + Math.sin(time * 3) * 0.12;
      // quanto mais a fita é engolida, mais a singularidade Mizine acende
      const coreBoost = pullRef ? Math.min(1, Math.max(0, (pull - 0.35) / 0.6)) : 0;

      // Neon Crimson Core Emblem at the Singularity
      const coreR = (isMobile ? 22 : 30) * corePulse * (1 + coreBoost * 1.6);
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, '#ff3b30');
      coreGrad.addColorStop(0.75, 'rgba(255, 59, 48, 0.45)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Mizine Singularity Core Typography (com pullRef, o logotipo grande é DOM — ver Reels.tsx)
      if (pullRef) {
        ctx.restore();
        animId = requestAnimationFrame(render);
        return;
      }
      ctx.font = '900 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ff3b30';
      ctx.shadowBlur = 14;
      ctx.fillText('MIZINE', cx, cy - 2);

      ctx.font = '700 7px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
      ctx.fillText('SINGULARIDADE', cx, cy + 12);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [reels, onOpenReel, pullRef]);

  return (
    <div className="black-hole-vortex-universe">
      <canvas ref={canvasRef} className="black-hole-canvas" />

      {/* Interactive Core Statement Badge */}
      {showManifesto && <div className="black-hole-core-manifesto">
        <div className="singularity-pill">
          <span className="singularity-dot" />
          <span>SINGULARIDADE GRAVITACIONAL // INTERSTELLAR REELS</span>
        </div>
        <p className="singularity-quote">
          “Tudo começa connosco e termina connosco para manter a estabilidade do universo das tuas redes sociais.”
        </p>
        <span className="singularity-hint">
          ✦ Clica em qualquer reel em órbita ou na fita abaixo para reproduzir em 4K
        </span>
      </div>}
    </div>
  );
};
