import React, { useState } from 'react';
import { ProjectItem } from '../types';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'social' | 'celebrate'>('all');

  const filters = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'video', label: 'Cinema & Comerciais' },
    { id: 'social', label: 'Reels & Redes Sociais' },
    { id: 'celebrate', label: 'Mizine Celebrate' }
  ];

  return (
    <section className="uc-projects-section" id="trabalhos" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">PORTFÓLIO</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">PRODUÇÕES & CAMPANHAS EM DESTAQUE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <h2 className="uc-section-title" style={{ margin: 0 }}>
              Trabalho ousado.<br />
              <span className="text-red">Execução sem medo.</span>
            </h2>

            {/* Filter Pills */}
            <div className="uc-filter-pills">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`uc-filter-btn ${activeFilter === f.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.id as any)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="uc-projects-grid reveal-up">
          {projects.map((proj, idx) => {
            const isWide = proj.isWide || idx === 0;
            const link = proj.linkUrl || '#contacto';

            return (
              <a
                key={proj.id}
                className={`uc-project-card ${isWide ? 'wide' : ''}`}
                href={link}
                target={link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
              >
                {/* Viewfinder HUD Corner Accents */}
                <div className="hud-corner top-left" />
                <div className="hud-corner top-right" />
                <div className="hud-corner bottom-left" />
                <div className="hud-corner bottom-right" />

                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="uc-project-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="uc-project-placeholder" />
                )}

                <div className="uc-project-overlay" />

                <div className="uc-project-content">
                  <div className="uc-project-meta">
                    <span className="project-num">0{idx + 1}</span>
                    <span className="project-badge">4K MASTER</span>
                  </div>
                  <h3 className="uc-project-title">{proj.title}</h3>
                  <p className="uc-project-desc">{proj.description}</p>
                  <div className="uc-project-cta">
                    <span>Ver Produção Completa</span>
                    <span className="cta-arrow">↗</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
