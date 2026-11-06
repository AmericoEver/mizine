import React, { useRef } from 'react';
import { ReelItem } from '../types';

interface ReelsProps {
  reels: ReelItem[];
  onOpenReel: (title: string, videoUrl?: string) => void;
}

export const Reels: React.FC<ReelsProps> = ({ reels, onOpenReel }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const distance = 320;
      trackRef.current.scrollBy({
        left: direction === 'right' ? distance : -distance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="uc-reels-section" id="reels" style={{ paddingTop: 0 }}>
      <div className="wrap uc-reels-head reveal-up">
        <div>
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">REELS & SHORT-FORM</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">FORMATO VERTICAL DE ALTA RETENÇÃO</span>
          </div>
          <h2 className="uc-section-title" style={{ margin: 0 }}>
            Os Nossos <span className="text-red">Reels</span>
          </h2>
        </div>

        <div className="uc-carousel-arrows">
          <button onClick={() => scroll('left')} aria-label="Anterior" className="uc-arrow-btn">
            ←
          </button>
          <button onClick={() => scroll('right')} aria-label="Seguinte" className="uc-arrow-btn">
            →
          </button>
        </div>
      </div>

      <div className="uc-reels-track-container" ref={trackRef}>
        <div className="uc-reels-track">
          {reels.map((reel, idx) => (
            <button
              key={reel.id}
              className="uc-reel-card reveal-up"
              onClick={() => onOpenReel(reel.title, reel.videoUrl)}
              aria-label={`Ver ${reel.title}`}
            >
              {/* HUD Badge de Gravação Audiovisual */}
              <div className="hud-rec-badge">
                <span className="hud-rec-dot" />
                <span>REC 4K</span>
              </div>

              {/* Viewfinder Reticles */}
              <div className="hud-corner top-right" />
              <div className="hud-corner bottom-left" />

              {reel.imageUrl ? (
                <img
                  src={reel.imageUrl}
                  alt={reel.title}
                  className="uc-reel-img"
                  loading="lazy"
                />
              ) : (
                <div className="uc-reel-fallback-gradient" />
              )}

              {/* Overlay Cinematográfico */}
              <div className="uc-reel-overlay" />

              {/* Play Trigger */}
              <div className="uc-reel-play-btn">
                <span className="play-icon">▶</span>
              </div>

              <div className="uc-reel-meta">
                <span className="reel-index">REEL #{idx + 1}</span>
                <h3 className="reel-title">{reel.title}</h3>
                <span className="reel-subtitle">{reel.subtitle}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
