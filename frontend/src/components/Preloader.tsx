import React, { useEffect, useRef, useState } from 'react';
import { DotMap } from './DotMap';

interface PreloaderProps {
  onComplete?: () => void;
}

const DURATION = 1500; // ms — rápido: o mapa varre o mundo, Maputo acende e a página abre

/** Preloader: o mesmo mapa pontilhado do rodapé (Maputo a emitir) + contador. ~1.5s no total. */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / DURATION);
      // ease-out: arranca rápido e assenta no fim
      setProgress(Math.round((1 - Math.pow(1 - k, 2.2)) * 100));
      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setIsFading(true);
        setTimeout(() => {
          setIsDestroyed(true);
          onComplete?.();
        }, 550);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  if (isDestroyed) return null;

  return (
    <div className={`pl2 ${isFading ? 'is-fading' : ''}`} role="status" aria-label="A carregar Mizine">
      <div className="pl2-map">
        <DotMap className="pl2-canvas" reveal />
      </div>
      <div className="pl2-top">
        <span className="pl2-brand">
          MIZINE<i>.</i>
        </span>
        <span className="pl2-loc">MAPUTO [HQ] • 25°58′S 32°35′E</span>
      </div>
      <div className="pl2-bottom">
        <span className="pl2-tag">A PREPARAR A CENA</span>
        <span className="pl2-count">{String(progress).padStart(3, '0')}</span>
      </div>
      <div className="pl2-bar">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
};
