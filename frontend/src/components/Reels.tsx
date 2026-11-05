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
      const distance = 280;
      trackRef.current.scrollBy({
        left: direction === 'right' ? distance : -distance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="reels" style={{ paddingTop: 0 }}>
      <div className="wrap head">
        <h2>
          Os nossos <span className="r">reels</span>
        </h2>
        <div className="arrows">
          <button onClick={() => scroll('left')} aria-label="Anterior">←</button>
          <button onClick={() => scroll('right')} aria-label="Seguinte">→</button>
        </div>
      </div>

      <div className="track" ref={trackRef} id="track">
        {reels.map((reel) => {
          const artClass = reel.artClass || 'a1';
          return (
            <button
              key={reel.id}
              className="reel"
              onClick={() => onOpenReel(reel.title, reel.videoUrl)}
              aria-label={`Ver ${reel.title}`}
            >
              {reel.imageUrl ? (
                <img
                  src={reel.imageUrl}
                  alt={reel.title}
                  className="art"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className={`art ${artClass}`} />
              )}
              
              {/* Overlay cinematográfico */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, rgba(225,6,0,0.1) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              <span className="play" style={{ zIndex: 3 }} />
              <div className="meta" style={{ zIndex: 3 }}>
                <h3>{reel.title}</h3>
                <span>{reel.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
