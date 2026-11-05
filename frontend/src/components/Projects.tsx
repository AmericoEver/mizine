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
              >
                <div className={`art ${artClass}`} />
                <div className="t">
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

