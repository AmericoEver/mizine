import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

/**
 * Easter egg do rodapé (à United Carriers):
 *  - passar o rato numa letra revela um fotograma real de uma produção dentro da letra;
 *  - clicar numa letra "grava" o take (fica acesa a vermelho);
 *  - gravar as 6 letras — ou escrever "mizine" no teclado — fecha a claquete: CORTA! TAKE APROVADO.
 */
const LETTERS = ['M', 'I', 'Z', 'I', 'N', 'E'];
const FRAMES = [
  '/media/set/shot-02-palco.jpg',
  '/media/set/shot-04-orador.jpg',
  '/media/set/shot-01-aerea.jpg',
  '/media/set/shot-05-plateia.jpg',
  '/media/set/shot-03-painel.jpg',
  '/media/founder/moises-cinema-set.jpg'
];

export const FooterWordmark: React.FC = () => {
  const [rec, setRec] = useState<boolean[]>(() => LETTERS.map(() => false));
  const [cut, setCut] = useState(false);
  const typed = useRef('');
  const timer = useRef<number | undefined>(undefined);
  const recorded = rec.filter(Boolean).length;

  const fireCut = () => {
    setCut(true);
    setRec(LETTERS.map(() => true));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCut(false);
      setRec(LETTERS.map(() => false));
    }, 3600);
  };

  const toggle = (i: number) => {
    if (cut) return;
    setRec(prev => {
      const next = prev.map((v, k) => (k === i ? !v : v));
      if (next.every(Boolean)) window.setTimeout(fireCut, 120);
      return next;
    });
  };

  // código secreto: escrever "mizine" em qualquer sítio da página
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key.length !== 1) return;
      typed.current = (typed.current + e.key.toLowerCase()).slice(-6);
      if (typed.current === 'mizine') fireCut();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`fw ${cut ? 'is-cut' : ''}`}>
      <div className="fw-slate" aria-hidden="true">
        <span className="fw-slate-arm" />
        <span className="fw-slate-text">
          <Icon name="camera" size={16} /> CORTA! TAKE APROVADO.
        </span>
      </div>
      <div className="fw-word" role="group" aria-label="MIZINE">
        {LETTERS.map((l, i) => (
          <button
            key={i}
            type="button"
            className={`fw-letter ${rec[i] ? 'is-rec' : ''}`}
            style={{ ['--img' as string]: `url(${FRAMES[i]})`, ['--i' as string]: i } as React.CSSProperties}
            onClick={() => toggle(i)}
            aria-pressed={rec[i]}
            aria-label={`Letra ${l}${rec[i] ? ' gravada' : ''}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="fw-hint" aria-live="polite">
        {cut ? 'Obrigado por veres até ao fim.' : recorded > 0 ? `TAKES GRAVADOS ${recorded}/6` : 'Passa o rato pelas letras. Clica para gravar.'}
      </div>
    </div>
  );
};
