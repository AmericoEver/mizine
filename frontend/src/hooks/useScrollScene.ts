import { useEffect, useLayoutEffect, useRef } from 'react';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Cena guiada pelo scroll: `trackRef` é um contentor alto com um filho `position: sticky`.
 * Chama `onFrame(progresso 0→1 suavizado, tempo em s)` a cada frame, mas só enquanto
 * a cena está perto do ecrã (IntersectionObserver) — fora disso não gasta CPU.
 */
export function useScrollScene(
  trackRef: React.RefObject<HTMLElement | null>,
  onFrame: (p: number, t: number) => void
) {
  const cb = useRef(onFrame);
  useLayoutEffect(() => {
    cb.current = onFrame;
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let running = false;
    let cur = -1;
    const t0 = performance.now();

    const target = () => {
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      return total > 0 ? clamp01(-r.top / total) : 0;
    };
    const loop = () => {
      const tg = target();
      if (cur < 0) cur = tg;
      cur += (tg - cur) * 0.14;
      if (Math.abs(tg - cur) < 0.0005) cur = tg;
      cb.current(cur, (performance.now() - t0) / 1000);
      if (running) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '50% 0px 50% 0px' }
    );
    io.observe(el);
    // primeiro frame imediato (estado correcto mesmo antes de entrar no ecrã)
    cb.current(target(), 0);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [trackRef]);
}
