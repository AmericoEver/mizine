import React, { useRef } from 'react';
import { GroupCompany } from '../types';
import { Icon, IconName } from './Icon';
import { useScrollScene, smoothstep, lerp, clamp01 } from '../hooks/useScrollScene';

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
 * O GRUPO — "a Mizine é o sol; as franquias são os seus planetas".
 * Cena guiada pelo scroll: o sol acende, as órbitas desenham-se, cada planeta entra na sua órbita
 * e depois a câmara foca um planeta de cada vez, com a respectiva ficha.
 */
export const Group: React.FC<GroupProps> = ({ companies }) => {
  const planets = buildPlanets(companies);
  const n = planets.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const planetRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useScrollScene(trackRef, (p, t) => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const mobile = W < 760;
    const cx = mobile ? W / 2 : W * 0.36;
    const cy = mobile ? H * 0.4 : H * 0.54;
    const maxR = Math.min(mobile ? W * 0.46 : W * 0.27, H * 0.95);

    // 1) o sol acende
    const sunIn = smoothstep(0, 0.14, p);
    if (sunRef.current) {
      sunRef.current.style.left = `${cx}px`;
      sunRef.current.style.top = `${cy}px`;
      sunRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.3, 1, sunIn).toFixed(3)})`;
      sunRef.current.style.opacity = sunIn.toFixed(3);
    }
    if (introRef.current) {
      const io = smoothstep(0.04, 0.14, p) * (1 - smoothstep(0.4, 0.48, p));
      introRef.current.style.opacity = io.toFixed(3);
      introRef.current.style.transform = `translateY(${((1 - io) * 16).toFixed(1)}px)`;
    }

    // 3) foco: um planeta de cada vez
    const fp = clamp01((p - 0.46) / 0.5);
    const active = p < 0.46 ? -1 : Math.min(n - 1, Math.floor(fp * n));

    planets.forEach((_, i) => {
      const k = (i + 1) / n;
      const rx = maxR * lerp(0.42, 1, k);
      const ry = rx * 0.3;
      // 2) órbitas desenham-se e planetas entram, um a um
      const appear = smoothstep(0.12 + i * 0.07, 0.24 + i * 0.07, p);
      const orbit = orbitRefs.current[i];
      if (orbit) {
        orbit.style.left = `${cx - rx}px`;
        orbit.style.top = `${cy - ry}px`;
        orbit.style.width = `${rx * 2}px`;
        orbit.style.height = `${ry * 2}px`;
        orbit.style.opacity = (appear * (active === -1 || active === i ? 1 : 0.35)).toFixed(3);
        orbit.style.setProperty('--draw', appear.toFixed(3));
        orbit.classList.toggle('is-active', active === i);
      }
      const speed = 0.16 / Math.sqrt(k);
      const a = i * 2.1 + t * speed + (1 - appear) * 1.6;
      const z = Math.sin(a);
      const x = cx + Math.cos(a) * rx;
      const y = cy + z * ry;
      const el = planetRefs.current[i];
      if (el) {
        const isA = active === i;
        const s = lerp(0.72, 1.08, (z + 1) / 2) * (isA ? 1.35 : 1) * lerp(0.4, 1, appear);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        el.style.opacity = (appear * (active === -1 || isA ? 1 : 0.55)).toFixed(3);
        // atrás do sol fica por baixo
        el.style.zIndex = z > 0 ? '6' : '2';
        el.classList.toggle('is-active', isA);
      }
      const card = cardRefs.current[i];
      if (card) {
        const on = active === i;
        card.classList.toggle('is-on', on);
      }
      const dot = dotRefs.current[i];
      if (dot) dot.classList.toggle('is-on', active === i);
    });
  });

  return (
    <section className="sys-section" id="grupo">
      <div className="sys-track" ref={trackRef} style={{ height: `${220 + n * 70}vh` }}>
        <div className="sys-stage" ref={stageRef}>
          <div className="sys-stars" aria-hidden="true" />

          <div className="wrap sys-head">
            <span className="why2-kicker">O GRUPO MIZINE</span>
          </div>

          <div className="sys-intro" ref={introRef}>
            <h2>
              A Mizine é o sol.<br />
              <span>Tudo o resto gira à sua volta.</span>
            </h2>
            <p>Este site é a estrela-mãe. Cada franquia é um planeta com a sua própria órbita — e a mesma energia criativa no centro.</p>
          </div>

          {planets.map((_, i) => (
            <div key={`o${i}`} className="sys-orbit" ref={el => { orbitRefs.current[i] = el; }} aria-hidden="true" />
          ))}

          <div className="sys-sun" ref={sunRef}>
            <span className="sys-sun-corona" aria-hidden="true" />
            <span className="sys-sun-core">
              <strong>MIZINE</strong>
              <small>MULTIMÉDIA</small>
            </span>
          </div>

          {planets.map((pl, i) => (
            <a
              key={pl.name}
              ref={el => { planetRefs.current[i] = el; }}
              className="sys-planet"
              href={pl.link}
              target={pl.link.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              style={{ ['--pc' as string]: pl.color } as React.CSSProperties}
              aria-label={pl.name}
            >
              <span className="sys-planet-body"><Icon name={pl.icon} size={20} /></span>
              <span className="sys-planet-name">{pl.name}</span>
            </a>
          ))}

          <div className="sys-cards">
            {planets.map((pl, i) => (
              <div
                key={pl.name}
                ref={el => { cardRefs.current[i] = el; }}
                className="sys-card"
                style={{ ['--pc' as string]: pl.color } as React.CSSProperties}
              >
                <span className="sys-card-role">
                  <Icon name={pl.icon} size={14} /> PLANETA {String(i + 1).padStart(2, '0')} • {pl.role}
                </span>
                <h3>{pl.name}</h3>
                <p>{pl.description}</p>
                <a href={pl.link} target={pl.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                  {pl.cta} <Icon name="arrow-up-right" size={14} />
                </a>
              </div>
            ))}
            <div className="sys-dots" aria-hidden="true">
              {planets.map((pl, i) => (
                <span key={pl.name} ref={el => { dotRefs.current[i] = el; }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
