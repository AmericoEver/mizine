import React, { useEffect, useState, useRef } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

const LOCATIONS = [
  'MAPUTO, MZ [HQ - BERÇO]',
  'MOÇAMBIQUE',
  'ÁFRICA AUSTRAL',
  'JOHANNESBURG',
  'LISBOA & EUROPA',
  'DUBAI & EMIRADOS',
  'SÃO PAULO & AMÉRICAS',
  'ALCANCE GLOBAL 100%'
];

const CAPABILITIES = [
  'VIDEO MAKING 4K DCI',
  'REELS DE ALTA RETENÇÃO',
  'GESTÃO DE REDES SOCIAIS',
  'CONVITES DIGITAIS (CELEBRATE)',
  'COLOR GRADING CINEMA',
  'COBERTURA DE EVENTOS VIP',
  'DRONE & CAPTAÇÃO AÉREA',
  'REDES & DISTRIBUIÇÃO GLOBAL'
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Counter logic: ~4.5 seconds duration with cinematic pacing
  useEffect(() => {
    let current = 0;
    let pauseCount = 0;

    const interval = setInterval(() => {
      // Intentional micro-pause around 79% (matching United Carriers screenshot)
      if (current === 79 && pauseCount < 9) {
        pauseCount++;
        return;
      }

      if (current < 25) {
        current += Math.floor(Math.random() * 2) + 1;
      } else if (current < 55) {
        current += Math.floor(Math.random() * 2) + 1;
      } else if (current < 79) {
        current += 1;
      } else if (current < 95) {
        current += Math.floor(Math.random() * 2) + 1;
      } else if (current < 100) {
        current += 1;
      } else {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDestroyed(true);
            if (onComplete) onComplete();
          }, 750);
        }, 450);
      }
      setProgress(Math.min(100, current));
    }, 42); // 42ms * ~100 steps + pauses = ~4.5 seconds

    return () => clearInterval(interval);
  }, [onComplete]);

  // World map dotted canvas with prominent Mozambique focus
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const cols = 60;
    const rows = 30;

    const landZones = [
      // Americas (North, Central, South)
      { x1: 0.12, x2: 0.30, y1: 0.18, y2: 0.44 },
      { x1: 0.20, x2: 0.27, y1: 0.44, y2: 0.54 },
      { x1: 0.24, x2: 0.35, y1: 0.54, y2: 0.86 },
      // Europe
      { x1: 0.46, x2: 0.56, y1: 0.20, y2: 0.40 },
      // Africa
      { x1: 0.46, x2: 0.60, y1: 0.40, y2: 0.82 },
      // Asia
      { x1: 0.57, x2: 0.86, y1: 0.18, y2: 0.58 },
      // Australia
      { x1: 0.76, x2: 0.88, y1: 0.64, y2: 0.86 }
    ];

    // Global partner hubs
    const partnerNodes = [
      { x: 0.48, y: 0.34, name: 'Lisboa' },
      { x: 0.28, y: 0.70, name: 'Brasil' },
      { x: 0.63, y: 0.42, name: 'Dubai' },
      { x: 0.52, y: 0.81, name: 'JHB' },
      { x: 0.82, y: 0.74, name: 'Sydney' }
    ];

    // Mozambique HQ
    const mozHQ = { x: 0.56, y: 0.73, name: 'MAPUTO • SEDE MIZINE' };

    let t = 0;
    const render = () => {
      t += 0.035;
      ctx.clearRect(0, 0, width, height);

      const cellW = width / cols;
      const cellH = height / rows;

      // 1. Draw World Continent Dots
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;

          const isLand = landZones.some(z => nx >= z.x1 && nx <= z.x2 && ny >= z.y1 && ny <= z.y2);
          if (isLand) {
            const jitter = Math.sin(c * 12.3 + r * 45.6);
            if (jitter > -0.65) {
              const px = c * cellW + cellW * 0.5;
              const py = r * cellH + cellH * 0.5;

              // If point is inside Mozambique territory (around x: 0.54-0.57, y: 0.68-0.75)
              const isMozTerritory = nx >= 0.54 && nx <= 0.57 && ny >= 0.68 && ny <= 0.76;

              ctx.beginPath();
              ctx.arc(px, py, isMozTerritory ? 1.8 : 1.1, 0, Math.PI * 2);
              ctx.fillStyle = isMozTerritory ? 'rgba(255, 59, 48, 0.85)' : 'rgba(255, 255, 255, 0.15)';
              ctx.fill();
            }
          }
        }
      }

      const hqX = mozHQ.x * width;
      const hqY = mozHQ.y * height;

      // 2. Global Arcs reaching out from Maputo HQ to the rest of the world
      for (let i = 0; i < partnerNodes.length; i++) {
        const node = partnerNodes[i];
        const nx = node.x * width;
        const ny = node.y * height;

        const midX = (hqX + nx) * 0.5;
        const midY = (hqY + ny) * 0.5 - 28;

        ctx.beginPath();
        ctx.moveTo(hqX, hqY);
        ctx.quadraticCurveTo(midX, midY, nx, ny);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving photon packet from Maputo
        const packetT = (t * 0.8 + i * 0.3) % 1;
        const inv = 1 - packetT;
        const px = inv * inv * hqX + 2 * inv * packetT * midX + packetT * packetT * nx;
        const py = inv * inv * hqY + 2 * inv * packetT * midY + packetT * packetT * ny;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Partner node dot
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
      }

      // 3. PROMINENT MOÇAMBIQUE HQ BEACON PIN
      const pulse = 1 + Math.sin(t * 3.5) * 0.3;

      // Concentric expanding radar waves from Mozambique
      for (let w = 0; w < 2; w++) {
        const wavePhase = (t * 0.7 + w * 0.5) % 1;
        const waveRadius = 4 + wavePhase * 24;
        const waveAlpha = Math.max(0, 1 - wavePhase) * 0.85;

        ctx.beginPath();
        ctx.arc(hqX, hqY, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 48, ${waveAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Hot red Mozambique core dot
      ctx.beginPath();
      ctx.arc(hqX, hqY, 4.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3b30';
      ctx.shadowColor = '#ff3b30';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center white bead
      ctx.beginPath();
      ctx.arc(hqX, hqY, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Technical label leader line
      const lineEndX = hqX + 26;
      const lineEndY = hqY + 18;

      ctx.beginPath();
      ctx.moveTo(hqX, hqY);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.lineTo(lineEndX + 45, lineEndY);
      ctx.strokeStyle = '#ff3b30';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '700 9px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('🇲🇿 MOÇAMBIQUE [SEDE]', lineEndX + 4, lineEndY - 3);

      ctx.font = '500 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ff3b30';
      ctx.fillText('BERÇO MIZINE MULTIMÉDIA', lineEndX + 4, lineEndY + 9);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  if (isDestroyed) return null;

  return (
    <div className={`uc-preloader-overlay ${isFading ? 'is-fading' : ''}`}>
      {/* Top Center Radar Reticle */}
      <div className="uc-preloader-reticle" aria-hidden="true">
        <div className="reticle-circle">
          <div className="reticle-dot" />
        </div>
      </div>

      <div className="wrap uc-preloader-content">
        {/* Left Column: Brand & Locations */}
        <div className="uc-preloader-col uc-preloader-left">
          <div className="uc-preloader-brand">
            <span className="brand-name">MIZINE</span>
            <span className="brand-dot">●</span>
            <span className="brand-sub">MULTIMÉDIA</span>
          </div>

          <div className="uc-preloader-list">
            {LOCATIONS.map((loc, idx) => (
              <div
                key={loc}
                className={`uc-preloader-item ${idx === 0 ? 'is-highlight' : ''}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <span className="item-bullet">{idx === 0 ? '▶' : '—'}</span>
                <span className="item-text">{loc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Dotted World Map Canvas with Mozambique Focus */}
        <div className="uc-preloader-col uc-preloader-center">
          <canvas ref={canvasRef} className="uc-preloader-map-canvas" />
        </div>

        {/* Right Column: Progress Counter & Capabilities */}
        <div className="uc-preloader-col uc-preloader-right">
          <div className="uc-preloader-counter-wrap">
            <span className="uc-preloader-number">{progress < 10 ? `0${progress}` : progress}</span>
            <span className="uc-preloader-spinner" aria-hidden="true">✢</span>
          </div>

          <div className="uc-preloader-list uc-preloader-list-right">
            {CAPABILITIES.map((cap, idx) => (
              <div
                key={cap}
                className={`uc-preloader-item ${progress > (idx + 1) * 11 ? 'is-active' : ''}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <span className="item-text">{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Vertical Badge on right edge during preload */}
      <div className="uc-floating-badge" aria-hidden="true">
        <span className="badge-logo">MZ.</span>
        <span className="badge-vertical-text">ESTÚDIO 2026</span>
      </div>
    </div>
  );
};
