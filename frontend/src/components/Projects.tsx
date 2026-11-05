import React from 'react';
import { ProjectItem } from '../types';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2>
            Projetos em <span className="r">destaque</span>
          </h2>
        </div>
        <div className="grid">
          {projects.map((proj) => {
            const isWide = proj.isWide;
            const artClass = proj.artClass || 'a3';
            const link = proj.linkUrl || '#contacto';

            return (
              <a
                key={proj.id}
                className={`card ${isWide ? 'wide' : ''}`}
                href={link}
                target={link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
              >
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="art"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className={`art ${artClass}`} />
                )}

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />

                <div className="t" style={{ zIndex: 2 }}>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
