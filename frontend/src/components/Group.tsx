import React, { useRef } from 'react';
import { GroupCompany } from '../types';
import { Icon, IconName } from './Icon';
import { useScrollScene, smoothstep, clamp01 } from '../hooks/useScrollScene';

interface GroupProps {
  companies: GroupCompany[];
}

interface Planet {
  name: string;
  role: string;
  description: string;
  link: string;
  cta: string;
  icon: IconName;
  color: string;
}

const STYLE: Record<string, { role: string; icon: IconName; color: string }> = {
  'mizine celebrate': { role: 'CONVITES & EVENTOS', icon: 'invite', color: '#f5b84a' },
  'geek ever': { role: 'TECNOLOGIA & APPS', icon: 'code', color: '#3aa0ff' },
  'mizine academy': { role: 'FORMAÇÃO CRIATIVA', icon: 'academy', color: '#7be0a3' },
  'studio 8': { role: 'SOM & ÁUDIO', icon: 'mic', color: '#c58bff' }
};

/** Franquias vindas do painel + Studio 8 (sempre presente no ecossistema) */
const buildPlanets = (companies: GroupCompany[]): Planet[] => {
  const list: Planet[] = companies.map(c => {
    const s = STYLE[c.name.trim().toLowerCase()] ?? { role: 'FRANQUIA MIZINE', icon: 'orbit' as IconName, color: '#ff8a5c' };
    return { name: c.name, description: c.description, link: c.linkUrl, cta: c.buttonText || 'Conhecer', ...s };
  });
  if (!list.some(p => p.name.toLowerCase() === 'studio 8')) {
    list.splice(Math.min(2, list.length), 0, {
      name: 'Studio 8',
      description: 'Captação, design e mistura de som para filmes, campanhas, podcasts e eventos ao vivo.',
      link: '#contacto',
      cta: 'Falar com o Studio 8',
      ...STYLE['studio 8']
    });
  }
  return list;
};

/**
 * O GRUPO — "uma casa, várias marcas".
 * Cena guiada pelo scroll: à esquerda o índice das marcas do grupo (a que está em foco acende na sua cor),
 * à direita a ficha da marca. A Mizine é a casa-mãe; cada marca tem a sua identidade.
 */
export const Group: React.FC<GroupProps> = ({ companies }) => {
  const brands = buildPlanets(companies);
  const n = brands.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);

  useScrollScene(trackRef, p => {
    const fp = clamp01((p - 0.08) / 0.84);
    const active = Math.min(n - 1, Math.floor(fp * n));
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      el.classList.toggle('is-on', i === active);
      el.classList.toggle('is-past', i < active);
    });
    cardRefs.current.forEach((el, i) => el?.classList.toggle('is-on', i === active));
    if (barRef.current) barRef.current.style.transform = `scaleY(${((active + 1) / n).toFixed(3)})`;
    if (countRef.current) countRef.current.textContent = String(active + 1).padStart(2, '0');
    if (headRef.current) {
      const h = 0.35 + 0.65 * smoothstep(0, 0.06, p);
      headRef.current.style.opacity = h.toFixed(3);
      headRef.current.style.transform = `translateY(${((1 - h) * 20).toFixed(1)}px)`;
    }
  });

  return (
    <section className="grp-section" id="grupo">
      <div className="grp-track" ref={trackRef} style={{ height: `${120 + n * 60}vh` }}>
        <div className="grp-stage">
          <div className="wrap grp-grid">
            <div className="grp-left">
              <div ref={headRef}>
                <span className="why2-kicker">O GRUPO MIZINE</span>
                <h2>
                  Uma casa.<br />
                  <span>Várias marcas.</span>
                </h2>
                <p className="grp-lead">A Mizine é a casa-mãe. Cada marca do grupo tem a sua identidade — e a mesma exigência criativa por trás.</p>
              </div>
              <div className="grp-index">
                <span className="grp-rail" aria-hidden="true"><span ref={barRef} /></span>
                {brands.map((b, i) => (
                  <a
                    key={b.name}
                    ref={el => { rowRefs.current[i] = el; }}
                    className="grp-row"
                    href={b.link}
                    target={b.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    style={{ ['--pc' as string]: b.color } as React.CSSProperties}
                  >
                    <span className="grp-row-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="grp-row-name">{b.name}</span>
                    <span className="grp-row-icon"><Icon name={b.icon} size={18} /></span>
                  </a>
                ))}
              </div>
            </div>

            <div className="grp-right">
              <div className="grp-count" aria-hidden="true">
                <span ref={countRef}>01</span> / {String(n).padStart(2, '0')}
              </div>
              <div className="grp-cards">
                {brands.map((b, i) => (
                  <div
                    key={b.name}
                    ref={el => { cardRefs.current[i] = el; }}
                    className="grp-card"
                    style={{ ['--pc' as string]: b.color } as React.CSSProperties}
                  >
                    <span className="grp-card-mark"><Icon name={b.icon} size={34} /></span>
                    <span className="grp-card-role">MARCA DO GRUPO • {b.role}</span>
                    <h3>{b.name}</h3>
                    <p>{b.description}</p>
                    <a href={b.link} target={b.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                      {b.cta} <Icon name="arrow-up-right" size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
