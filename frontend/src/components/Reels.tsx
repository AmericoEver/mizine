import React, { useCallback, useRef, useState } from 'react';
import { ReelItem } from '../types';
import { BlackHoleVortex } from './BlackHoleVortex';
import { GargantuaGL } from './GargantuaGL';
import { useScrollScene, smoothstep, lerp, clamp01 } from '../hooks/useScrollScene';

interface ReelsProps {
  reels: ReelItem[];
  onOpenReel: (title: string, videoUrl?: string) => void;
}

/**
 * CAPÍTULO 06 — OS NOSSOS REELS (referência Interstellar / Gargantua)
 * Uma fita de reels em película 24mm atravessa o ecrã. Com o scroll, a gravidade puxa cada reel
 * em espiral para o buraco negro (esticando-se — "esparguetificação"). No centro não há nada a
 * perder: o centro é a Mizine — tudo começa e termina connosco.
 */
export const Reels: React.FC<ReelsProps> = ({ reels, onOpenReel }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pullRef = useRef(0);
  const orbitRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [noGL, setNoGL] = useState(false);
  const onUnsupported = useCallback(() => setNoGL(true), []);
  const n = Math.max(1, reels.length);

  useScrollScene(trackRef, (q, t) => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const cx = W * 0.5;
    // centro do buraco negro: shader WebGL = centro do ecrã; canvas antigo = 52% da altura
    const cy = H * (noGL ? 0.52 : 0.5);

    // a fita desliza para a esquerda com o scroll, como película a correr no projector
    if (stripRef.current) {
      const drift = -q * W * 0.12 + Math.sin(t * 0.6) * 4;
      stripRef.current.style.transform = `translate3d(${drift.toFixed(1)}px, 0, 0)`;
    }

    let swallowed = 0;
    const sr = stage.getBoundingClientRect();
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      // posição de repouso do card (layout, sem a transformação aplicada)
      const start = 0.12 + (i / n) * 0.44;
      const k = clamp01((q - start) / 0.34);
      if (k <= 0) {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.filter = '';
        el.style.pointerEvents = '';
        return;
      }
      const prev = el.style.transform;
      el.style.transform = '';
      const r = el.getBoundingClientRect();
      el.style.transform = prev;
      const x0 = r.left - sr.left + r.width / 2;
      const y0 = r.top - sr.top + r.height / 2;
      const dx = x0 - cx;
      const dy = y0 - cy;
      const r0 = Math.hypot(dx, dy);
      const th0 = Math.atan2(dy, dx);

      // espiral: o raio cai a acelerar, o ângulo dá ~1.3 voltas, achata-se no plano do disco
      const e = k * k;
      const th = th0 + k * Math.PI * 2.6;
      const rad = r0 * (1 - e);
      const flat = lerp(1, 0.36, smoothstep(0, 0.6, k));
      const x = cx + Math.cos(th) * rad;
      const y = cy + Math.sin(th) * rad * flat;
      const sc = lerp(1, 0.05, Math.pow(k, 1.4));
      const stretch = 1 + Math.sin(Math.PI * k) * 1.4 * k; // esparguetificação
      const rot = ((th - th0) * 180) / Math.PI * 0.6;
      el.style.transform =
        `translate3d(${(x - x0).toFixed(1)}px, ${(y - y0).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) ` +
        `scale(${(sc / Math.sqrt(stretch)).toFixed(4)}, ${(sc * stretch).toFixed(4)})`;
      el.style.opacity = (1 - smoothstep(0.78, 1, k)).toFixed(3);
      el.style.filter = `brightness(${lerp(1, 2.2, k).toFixed(2)}) sepia(${(k * 0.8).toFixed(2)}) saturate(${lerp(1, 2.4, k).toFixed(2)})`;
      el.style.pointerEvents = k > 0.25 ? 'none' : '';
      if (k >= 1) swallowed++;
    });

    // alimenta o canvas: disco acelera, núcleo acende, reels entram em órbita
    pullRef.current = Math.max(swallowed / n, smoothstep(0.3, 0.88, q));

    if (headRef.current) {
      headRef.current.style.opacity = (1 - smoothstep(0.78, 0.9, q) * 0.65).toFixed(3);
    }
    // depois de engolidos, os reels ficam em órbita à volta do núcleo (clicáveis)
    const orbitIn = smoothstep(0.84, 0.96, q);
    const Rx = Math.min(W * 0.4, 560);
    const Ry = Rx * 0.16;
    orbitRefs.current.forEach((el, i) => {
      if (!el) return;
      const a = (i / n) * Math.PI * 2 + t * 0.22;
      const z = Math.sin(a);
      const x = cx + Math.cos(a) * Rx * lerp(0.4, 1, orbitIn);
      const y = cy + z * Ry * lerp(0.4, 1, orbitIn);
      const s = lerp(0.62, 1, (z + 1) / 2);
      el.style.transform = `translate3d(${(x - el.offsetWidth / 2).toFixed(1)}px, ${(y - el.offsetHeight / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      // atrás do buraco negro fica escondido pela sombra
      const behind = z < 0 && Math.abs(x - cx) < Rx * 0.32;
      el.style.opacity = (orbitIn * (behind ? 0.08 : z < 0 ? 0.55 : 1)).toFixed(3);
      el.style.zIndex = z > 0 ? '6' : '2';
      el.style.pointerEvents = orbitIn > 0.6 && !behind ? 'auto' : 'none';
    });

    if (coreRef.current) {
      const c = smoothstep(0.74, 0.92, q);
      coreRef.current.style.top = `${cy.toFixed(1)}px`;
      coreRef.current.style.opacity = c.toFixed(3);
      coreRef.current.style.setProperty('--core', c.toFixed(3));
      coreRef.current.style.pointerEvents = c > 0.6 ? 'auto' : 'none';
    }
  });

  return (
    <section className="uc-reels-section cosmic-black-hole-section bh-scene" id="reels">
      <div className="bh-track" ref={trackRef}>
        <div className="bh-stage" ref={stageRef}>
          <div className="bh-universe">
            {noGL ? (
              <BlackHoleVortex reels={reels} onOpenReel={onOpenReel} pullRef={pullRef} showManifesto={false} />
            ) : (
              <GargantuaGL pullRef={pullRef} onUnsupported={onUnsupported} />
            )}
          </div>

          {/* reels em órbita depois de atravessarem o horizonte */}
          <div className="bh-orbit">
            {reels.map((reel, idx) => (
              <button
                key={reel.id}
                ref={el => { orbitRefs.current[idx] = el; }}
                className="bh-orbit-reel"
                onClick={() => onOpenReel(reel.title, reel.videoUrl)}
                aria-label={`Ver ${reel.title}`}
              >
                {reel.imageUrl ? <img src={reel.imageUrl} alt="" loading="lazy" /> : null}
                <span>▶</span>
              </button>
            ))}
          </div>

          <div className="wrap bh-head" ref={headRef}>
            <div className="uc-meta-tag cosmic-meta">
              <span className="meta-bracket">[</span>
              <span className="meta-index">06/06</span>
              <span className="meta-bracket">]</span>
              <span className="meta-sep">•</span>
              <span className="meta-title">REELS // BURACO NEGRO GARGANTUA // FITA 24MM</span>
            </div>
            <h2 className="uc-section-title" style={{ margin: 0 }}>
              Os Nossos <span className="text-red">Reels</span>
            </h2>
            <p className="uc-section-desc cosmic-desc">
              Cada reel é puxado pela gravidade até ao centro do universo das tuas redes sociais.
            </p>
          </div>

          {/* Fita 24mm de reels — é esta que o buraco negro engole */}
          <div className="bh-strip-wrap">
            <div className="bh-strip" ref={stripRef}>
              {reels.map((reel, idx) => (
                <button
                  key={reel.id}
                  ref={el => { cardRefs.current[idx] = el; }}
                  className="bh-reel"
                  onClick={() => onOpenReel(reel.title, reel.videoUrl)}
                  aria-label={`Ver ${reel.title}`}
                >
                  <span className="bh-reel-perfs left" aria-hidden="true" />
                  <span className="bh-reel-perfs right" aria-hidden="true" />
                  <span className="bh-reel-window">
                    {reel.imageUrl ? (
                      <img src={reel.imageUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="bh-reel-fallback" />
                    )}
                    <span className="bh-reel-play" aria-hidden="true">▶</span>
                    <span className="bh-reel-meta">
                      <small>REEL #{idx + 1} • FR {String(idx + 1).padStart(2, '0')}/24</small>
                      <strong>{reel.title}</strong>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* O centro do buraco negro é a Mizine */}
          <div className="bh-core" ref={coreRef}>
            <div className="bh-core-emblem">
              <span className="bh-core-ring" />
              <span className="bh-core-logo">MIZINE</span>
              <span className="bh-core-sub">SINGULARIDADE</span>
            </div>
            <p className="bh-core-quote">
              “Tudo começa connosco e termina connosco — para manter a estabilidade do universo das tuas redes sociais.”
            </p>
            <span className="bh-core-hint">✦ Os reels estão agora em órbita — clica num para ver em 4K</span>
          </div>
        </div>
      </div>
    </section>
  );
};
