import React, { useEffect, useState, useRef } from 'react';
import worldMapData from '../data/worldMap2D.json';

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

interface PartnerNode {
  name: string;
  lon: number;
  lat: number;
}

const PARTNER_NODES: PartnerNode[] = [
  { name: 'Lisboa & Europa', lon: -9.14, lat: 38.72 },
  { name: 'Londres', lon: -0.12, lat: 51.5 },
  { name: 'Dubai', lon: 55.27, lat: 25.20 },
  { name: 'São Paulo', lon: -46.63, lat: -23.55 },
  { name: 'Joanesburgo', lon: 28.04, lat: -26.20 },
  { name: 'Sydney', lon: 151.2, lat: -33.86 }
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Counter logic: ~4.5 to 5.0 seconds duration with cinematic pacing
  useEffect(() => {
    let current = 0;
    let pauseCount = 0;

    const interval = setInterval(() => {
      // Intentional micro-pause around 79% (matching United Carriers screenshot)
      if (current === 79 && pauseCount < 10) {
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
        }, 500);
      }
      setProgress(Math.min(100, current));
    }, 42);

    return () => clearInterval(interval);
  }, [onComplete]);

  // World map dotted canvas with REAL continental coordinates
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

    const mapDots = worldMapData as [number, number, number][];

    let t = 0;
    const render = () => {
      t += 0.035;
      ctx.clearRect(0, 0, width, height);

      // Fit 2D world map neatly inside canvas area with equirectangular projection
      const mapW = width * 0.96;
      const mapH = height * 0.90;
      const offsetX = (width - mapW) / 2;
      const offsetY = (height - mapH) / 2;

      const project = (lon: number, lat: number) => ({
        x: ((lon + 180) / 360) * mapW + offsetX,
        y: ((80 - lat) / 140) * mapH + offsetY
      });

      // 1. Draw Real World Continent Dots (Exact Earth Geography)
      for (let i = 0; i < mapDots.length; i++) {
        const [lon, lat, isMoz] = mapDots[i];
        const p = project(lon, lat);

        ctx.beginPath();
        if (isMoz === 1) {
          // Highlighted Mozambique dots
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ff3b30';
        } else {
          // Standard continental dots
          ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        }
        ctx.fill();
      }

      // Maputo HQ coordinates (-25.96 lat, 32.58 lon)
      const hq = project(32.58, -25.96);

      // 2. Global Connection Arcs reaching out from Maputo HQ to Partner Cities
      for (let i = 0; i < PARTNER_NODES.length; i++) {
        const node = PARTNER_NODES[i];
        const dest = project(node.lon, node.lat);

        const midX = (hq.x + dest.x) * 0.5;
        const midY = (hq.y + dest.y) * 0.5 - 24;

        ctx.beginPath();
        ctx.moveTo(hq.x, hq.y);
        ctx.quadraticCurveTo(midX, midY, dest.x, dest.y);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Traveling photon packet from Maputo
        const packetT = (t * 0.75 + i * 0.28) % 1;
        const inv = 1 - packetT;
        const px = inv * inv * hq.x + 2 * inv * packetT * midX + packetT * packetT * dest.x;
        const py = inv * inv * hq.y + 2 * inv * packetT * midY + packetT * packetT * dest.y;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Partner City Blue Dot with subtle pulse (United Carriers style)
        const nodePulse = 1 + Math.sin(t * 3 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(dest.x, dest.y, 3.2 * nodePulse, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. MOÇAMBIQUE HQ BEACON (BERÇO & SEDE)
      const pulse = 1 + Math.sin(t * 3.5) * 0.25;

      // Concentric expanding radar rings from Maputo
      for (let w = 0; w < 2; w++) {
        const wavePhase = (t * 0.65 + w * 0.5) % 1;
        const waveRadius = 4 + wavePhase * 26;
        const waveAlpha = Math.max(0, 1 - wavePhase) * 0.85;

        ctx.beginPath();
        ctx.arc(hq.x, hq.y, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 48, ${waveAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Hot red Mozambique core dot
      ctx.beginPath();
      ctx.arc(hq.x, hq.y, 5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3b30';
      ctx.shadowColor = '#ff3b30';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center white bead
      ctx.beginPath();
      ctx.arc(hq.x, hq.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Technical HUD Leader Line
      const lineEndX = hq.x + 28;
      const lineEndY = hq.y + 18;

      ctx.beginPath();
      ctx.moveTo(hq.x, hq.y);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.lineTo(lineEndX + 45, lineEndY);
      ctx.strokeStyle = '#ff3b30';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '700 9.5px "Space Grotesk", sans-serif';
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

        {/* Center: Dotted World Map Canvas with Exact Continents */}
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
