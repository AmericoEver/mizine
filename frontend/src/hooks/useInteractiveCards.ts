import { useEffect } from 'react';

/**
 * Cards que "respondem ao sistema e ao utilizador":
 *  - inclinação 3D e luz que segue o cursor (CSS vars --rx --ry --mx --my)
 *  - quando o card entra no ecrã, é "fotografado": flash de obturador + focagem ([data-shot])
 * Aplica-se a todos os `.ix-card` dentro de `containerRef`.
 */
export function useInteractiveCards(containerRef: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.ix-card'));
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const onMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    };
    const onLeave = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    if (fine) {
      cards.forEach(c => {
        c.addEventListener('pointermove', onMove);
        c.addEventListener('pointerleave', onLeave);
      });
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const i = cards.indexOf(el);
            el.style.setProperty('--shot-delay', `${(i % 4) * 110}ms`);
            // atributo (não classe): o React reescreve className quando o card activo muda
            el.dataset.shot = '1';
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );
    cards.forEach(c => io.observe(c));

    return () => {
      io.disconnect();
      cards.forEach(c => {
        c.removeEventListener('pointermove', onMove);
        c.removeEventListener('pointerleave', onLeave);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps]);
}
