import React, { useEffect, useRef, useState } from 'react';
import { ProjectItem } from '../types';

interface ProjectsProps {
  projects: ProjectItem[];
}

interface Work {
  title: string;
  client: string;
  kind: 'video' | 'design' | 'foto' | 'social';
  discipline: string;
  year: string;
  image: string;
}

/** Produções reais do portfólio Mizine (índice minimalista — a imagem aparece ao passar o rato) */
const WORKS: Work[] = [
  { title: 'Conferência Nacional de Estudantes', client: 'CONFNES', kind: 'video', discipline: 'Cobertura multicâmara • Aftermovie', year: '2025', image: '/media/set/shot-02-palco.jpg' },
  { title: 'Painéis & Keynotes em Palco', client: 'CONFNES', kind: 'foto', discipline: 'Fotografia de evento', year: '2025', image: '/media/set/shot-03-painel.jpg' },
  { title: 'Comunicação Institucional', client: 'Governo de Gaza', kind: 'foto', discipline: 'Reportagem • Retrato oficial', year: '2025', image: '/media/work/w-institucional.jpg' },
  { title: 'Plano Aéreo Corredor Logístico', client: 'CLM Maputo', kind: 'video', discipline: 'Drone • Vídeo corporativo', year: '2025', image: '/media/work/w-drone.jpg' },
  { title: 'Campanha "Quem Aprende Sai na Frente"', client: 'Catalyst Academy', kind: 'design', discipline: 'Key visuals • Social ads', year: '2025', image: '/media/work/w-design.jpg' },
  { title: 'Curso Básico de Fotografia', client: 'CDF / FCDF', kind: 'design', discipline: 'Identidade de campanha', year: '2024', image: '/media/work/w-cdf.jpg' },
  { title: 'Identidade & Frota', client: 'MozClean • Arco-Íris', kind: 'design', discipline: 'Branding • Aplicações', year: '2024', image: '/media/work/w-branding.jpg' },
  { title: 'Conteúdo Mensal para Redes', client: 'Marcas parceiras', kind: 'social', discipline: 'Gestão de redes • Reels', year: '2026', image: '/media/work/w-social.jpg' },
  { title: 'Eventos & Bastidores', client: 'Futurist Group', kind: 'social', discipline: 'Social media • Cobertura', year: '2026', image: '/media/work/w-socialmedia.jpg' }
];

const FILTERS = [
  { id: 'all', label: 'Tudo' },
  { id: 'video', label: 'Vídeo' },
  { id: 'foto', label: 'Fotografia' },
  { id: 'design', label: 'Design' },
  { id: 'social', label: 'Social' }
] as const;

export const Projects: React.FC<ProjectsProps> = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [hover, setHover] = useState<number>(-1);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // pré-visualização flutuante que segue o cursor com inércia
  useEffect(() => {
    const list = listRef.current;
    const pv = previewRef.current;
    if (!list || !pv) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      const tilt = Math.max(-8, Math.min(8, (tx - x) * 0.06));
      pv.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    list.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      list.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const shown = WORKS.map((w, i) => ({ w, i })).filter(({ w }) => filter === 'all' || w.kind === filter);

  return (
    <section className="uc-projects-section theme-daylight-section works-section" id="trabalhos">
      <div className="wrap">
        <div className="works-head reveal-up">
          <div className="uc-meta-tag daylight-meta">
            <span className="meta-bracket">[</span>
            <span className="meta-index">05/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">PRODUÇÕES & CAMPANHAS</span>
          </div>
          <h2 className="works-title">
            Trabalho ousado.<br />
            <span className="text-red">Execução sem medo.</span>
          </h2>
          <div className="works-filters" role="tablist">
            {FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`works-filter ${filter === f.id ? 'is-on' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <sup>{f.id === 'all' ? WORKS.length : WORKS.filter(w => w.kind === f.id).length}</sup>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`works-list ${hover >= 0 ? 'has-hover' : ''}`}
          ref={listRef}
          onPointerLeave={() => setHover(-1)}
        >
          <div className="works-row works-row-head" aria-hidden="true">
            <span>Nº</span>
            <span>Projecto</span>
            <span>Cliente</span>
            <span>Disciplina</span>
            <span>Ano</span>
          </div>
          {shown.map(({ w, i }, k) => (
            <a
              key={w.title}
              href="#contacto"
              className={`works-row ${hover === i ? 'is-hover' : ''}`}
              onPointerEnter={() => setHover(i)}
              style={{ animationDelay: `${k * 50}ms` }}
            >
              <span className="works-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="works-name">
                {w.title}
                <img src={w.image} alt="" className="works-thumb" loading="lazy" />
              </span>
              <span className="works-client">{w.client}</span>
              <span className="works-disc">{w.discipline}</span>
              <span className="works-year">
                {w.year}
                <i aria-hidden="true">↗</i>
              </span>
            </a>
          ))}

          <div className={`works-preview ${hover >= 0 ? 'is-on' : ''}`} ref={previewRef} aria-hidden="true">
            {WORKS.map((w, i) => (
              <img key={w.image} src={w.image} alt="" className={hover === i ? 'is-on' : ''} loading="lazy" />
            ))}
          </div>
        </div>

        <div className="works-foot reveal-up">
          <span>Mais bastidores e projectos completos no Instagram</span>
          <a href="https://www.instagram.com/mizine_8" target="_blank" rel="noreferrer">@mizine_8 ↗</a>
        </div>
      </div>
    </section>
  );
};
