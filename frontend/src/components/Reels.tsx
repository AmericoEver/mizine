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
              <div className={`art ${artClass}`} />
              <span className="play" />
              <div className="meta">
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

