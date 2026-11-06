import React, { useRef } from 'react';
import { ReelItem } from '../types';
import { BlackHoleVortex } from './BlackHoleVortex';

interface ReelsProps {
  reels: ReelItem[];
  onOpenReel: (title: string, videoUrl?: string) => void;
}

export const Reels: React.FC<ReelsProps> = ({ reels, onOpenReel }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const distance = 340;
      trackRef.current.scrollBy({
        left: direction === 'right' ? distance : -distance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="uc-reels-section cosmic-black-hole-section" id="reels">
      <div className="wrap uc-reels-head reveal-up">
        <div>
          <div className="uc-meta-tag cosmic-meta">
            <span className="meta-bracket">[</span>
            <span className="meta-index">REELS & SHORT-FORM</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">BURACO NEGRO GARGANTUA // FITA 24MM</span>
          </div>
          <h2 className="uc-section-title" style={{ margin: 0 }}>
            Os Nossos <span className="text-red">Reels</span>
          </h2>
          <p className="uc-section-desc cosmic-desc">
            Série de reels verticais em fita 24mm sendo atraídos pela gravidade do buraco negro até à singularidade central da Mizine.
          </p>
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

      {/* INTERACTIVE INTERSTELLAR GARGANTUA ACCRETION DISK CANVAS */}
      <div className="reels-black-hole-container reveal-up">
        <BlackHoleVortex reels={reels} onOpenReel={onOpenReel} />
      </div>

      {/* 24MM REEL FILM STRIP CAROUSEL */}
      <div className="uc-reels-track-container" ref={trackRef}>
        <div className="uc-reels-track">
          {reels.map((reel, idx) => (
            <button
              key={reel.id}
              className="uc-reel-card film-card-24mm reveal-up"
              onClick={() => onOpenReel(reel.title, reel.videoUrl)}
              aria-label={`Ver ${reel.title}`}
            >
              {/* Top Film Sprocket Border */}
              <div className="reel-sprocket-row top">
                <span className="r-sprocket" />
                <span className="r-sprocket" />
                <span className="r-sprocket" />
                <span className="r-sprocket" />
              </div>

              {/* HUD Badge de Gravação Audiovisual */}
              <div className="hud-rec-badge">
                <span className="hud-rec-dot" />
                <span>REC 4K // 24MM</span>
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
                <span className="reel-index">REEL #{idx + 1} • FRAME 0{idx + 1}/24</span>
                <h3 className="reel-title">{reel.title}</h3>
                <span className="reel-subtitle">{reel.subtitle}</span>
              </div>

              {/* Bottom Film Sprocket Border */}
              <div className="reel-sprocket-row bottom">
                <span className="r-sprocket" />
                <span className="r-sprocket" />
                <span className="r-sprocket" />
                <span className="r-sprocket" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
