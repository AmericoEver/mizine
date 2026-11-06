import React, { useEffect, useState, useRef } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

const LOCATIONS = [
  'MAPUTO, MZ [HQ]',
  'MOÇAMBIQUE',
  'ÁFRICA AUSTRAL',
  'JOHANNESBURG',
  'LUANDA',
  'LISBOA',
  'DUBAI',
  'GLOBAL REACH'
];

const CAPABILITIES = [
  'VIDEO MAKING 4K DCI',
  'REELS DE ALTA RETENÇÃO',
  'GESTÃO DE REDES SOCIAIS',
  'CONVITES DIGITAIS (CELEBRATE)',
  'COLOR GRADING CINEMA',
  'COBERTURA DE EVENTOS VIP',
  'DRONE & CAPTAÇÃO AÉREA',
  'DESIGN & IDENTIDADE'
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Counter logic (0 -> 100%)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear realistic progress
      if (current < 35) {
        current += Math.floor(Math.random() * 4) + 2;
      } else if (current < 75) {
        current += Math.floor(Math.random() * 3) + 1;
      } else if (current < 92) {
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
          }, 700);
        }, 300);
      }
      setProgress(Math.min(100, current));
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  // World map dotted canvas
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

    // Dotted world map rough grid
    const cols = 58;
    const rows = 28;
    
    // Normalized landmass approximations [xMin, xMax, yMin, yMax]
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

    // Pulsing bright cyan/blue coordinates (matching United Carriers screenshot)
    const hotspots = [
      { x: 0.55, y: 0.73, name: 'Maputo' },   // Maputo
      { x: 0.52, y: 0.62, name: 'Luanda' },   // Angola
      { x: 0.50, y: 0.80, name: 'Cape Town' },// SA
      { x: 0.48, y: 0.34, name: 'Lisbon' },   // Europe
      { x: 0.62, y: 0.42, name: 'Dubai' },    // Middle East
      { x: 0.82, y: 0.74, name: 'Sydney' }    // Australia
    ];

    let t = 0;
    const render = () => {
      t += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Draw faint dot matrix for world map
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;

          const isLand = landZones.some(z => nx >= z.x1 && nx <= z.x2 && ny >= z.y1 && ny <= z.y2);
          if (isLand) {
            // Subtle noise variation
            const jitter = Math.sin(c * 12.3 + r * 45.6);
            if (jitter > -0.65) {
              ctx.beginPath();
              ctx.arc(c * cellW + cellW * 0.5, r * cellH + cellH * 0.5, 1.1, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
              ctx.fill();
            }
          }
        }
      }

      // Draw pulsing electric blue hotspots and radar ripples
      for (let i = 0; i < hotspots.length; i++) {
        const h = hotspots[i];
        const hx = h.x * width;
        const hy = h.y * height;

        // Expanding radar rings
        const ringPhase = (t + i * 1.2) % 2;
        const ringRad = 4 + ringPhase * 16;
        const ringAlpha = Math.max(0, 1 - ringPhase / 2) * 0.7;

        ctx.beginPath();
        ctx.arc(hx, hy, ringRad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 180, 255, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing center core dot
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

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

        {/* Center: Dotted World Map Canvas */}
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
                className={`uc-preloader-item ${progress > (idx + 1) * 12 ? 'is-active' : ''}`}
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
