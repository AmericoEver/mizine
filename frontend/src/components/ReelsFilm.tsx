import React, { useRef } from 'react';
import { ReelItem } from '../types';
import { Icon } from './Icon';
import { useScrollScene, smoothstep, lerp } from '../hooks/useScrollScene';

interface ReelsFilmProps {
  reels: ReelItem[];
  onOpenReel: (title: string, videoUrl?: string) => void;
}

/**
 * CAPÍTULO 06 — OS NOSSOS REELS (sala de projecção)
 * A mesma película das marcas, agora com os reels: a fita corre com o scroll e o fotograma
 * que passa na "janela" do projector acende, cresce e mostra o título — como cinema a rodar.
 * (O buraco negro — Reels.tsx / GargantuaGL.tsx — fica no código para outra parte do projecto.)
 */
export const ReelsFilm: React.FC<ReelsFilmProps> = ({ reels, onOpenReel }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const subRef = useRef<HTMLSpanElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const progRef = useRef<HTMLSpanElement | null>(null);
  const last = useRef(-1);
  const n = reels.length;

  useScrollScene(trackRef, (p, t) => {
    const stage = stageRef.current;
    const strip = stripRef.current;
    if (!stage || !strip || n === 0) return;
    const W = stage.clientWidth;
    const first = frameRefs.current[0];
    const fw = first ? first.offsetWidth : 220;
    // entra pela direita, percorre todos os reels, sai pela esquerda
    const enter = smoothstep(0, 0.1, p);
    const run = smoothstep(0.08, 0.92, p);
    const offset = lerp(-0.4, n - 1, run) + (1 - enter) * -0.8;
    const x = W / 2 - fw / 2 - offset * fw;
    strip.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;

    frameRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = Math.abs(i - offset);
      const focus = Math.max(0, 1 - d);
      const f = focus * focus * (3 - 2 * focus);
      el.style.setProperty('--focus', f.toFixed(3));
      el.style.zIndex = String(10 + Math.round(f * 10));
    });

    const idx = Math.max(0, Math.min(n - 1, Math.round(offset)));
    if (idx !== last.current) {
      last.current = idx;
      if (titleRef.current) titleRef.current.textContent = reels[idx].title;
      if (subRef.current) subRef.current.textContent = reels[idx].subtitle || '';
      if (countRef.current) countRef.current.textContent = String(idx + 1).padStart(2, '0');
    }
    if (progRef.current) progRef.current.style.transform = `scaleX(${run.toFixed(3)})`;
    if (beamRef.current) beamRef.current.style.opacity = (0.75 + Math.sin(t * 23) * 0.04 + Math.sin(t * 7.3) * 0.05).toFixed(3);
  });

  return (
    <section className="rf-section" id="reels">
      <div className="rf-track" ref={trackRef} style={{ height: `${Math.max(3, n) * 55 + 100}vh` }}>
        <div className="rf-stage" ref={stageRef}>
          <div className="rf-beam" ref={beamRef} aria-hidden="true" />
          <div className="rf-dust" aria-hidden="true" />

          <div className="wrap rf-head">
            <div className="uc-meta-tag cosmic-meta">
              <span className="meta-bracket">[</span>
              <span className="meta-index">06/06</span>
              <span className="meta-bracket">]</span>
              <span className="meta-sep">•</span>
              <span className="meta-title">SALA DE PROJECÇÃO // FITA 24MM</span>
            </div>
            <h2>
              Os nossos <span className="text-red">reels.</span>
            </h2>
          </div>

          <div className="rf-gate" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          <div className="rf-strip" ref={stripRef}>
            {reels.map((r, i) => (
              <button
                key={r.id}
                ref={el => { frameRefs.current[i] = el; }}
                className="rf-frame"
                onClick={() => onOpenReel(r.title, r.videoUrl)}
                aria-label={`Ver ${r.title}`}
              >
                <span className="rf-perfs top" aria-hidden="true" />
                <span className="rf-window">
                  {r.imageUrl ? <img src={r.imageUrl} alt="" loading="lazy" /> : <span className="rf-fallback" />}
                  <span className="rf-play" aria-hidden="true"><Icon name="play" size={18} /></span>
                </span>
                <span className="rf-perfs bottom" aria-hidden="true" />
                <span className="rf-edge" aria-hidden="true">MIZINE ▸ {String(i + 1).padStart(2, '0')}A</span>
              </button>
            ))}
          </div>

          <div className="wrap rf-caption">
            <div className="rf-now">
              <span className="rf-count"><span ref={countRef}>01</span> / {String(n).padStart(2, '0')}</span>
              <span className="rf-title" ref={titleRef}>{reels[0]?.title}</span>
              <span className="rf-sub" ref={subRef}>{reels[0]?.subtitle}</span>
            </div>
            <div className="rf-progress"><span ref={progRef} /></div>
          </div>
        </div>
      </div>
    </section>
  );
};
