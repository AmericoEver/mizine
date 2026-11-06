import React from 'react';
import { GroupCompany } from '../types';

interface GroupProps {
  companies: GroupCompany[];
}

export const Group: React.FC<GroupProps> = ({ companies }) => {
  return (
    <section className="uc-group-section" id="grupo">
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">ECOSSISTEMA</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">DIVISÕES DO GRUPO MIZINE</span>
          </div>
          <h2 className="uc-section-title">
            Além do vídeo.<br />
            <span className="text-red">Um grupo multimédia completo.</span>
          </h2>
          <p className="uc-section-desc">
            A Mizine Multimédia conecta-se com tecnologia, áudio profissional e eventos em divisões especializadas.
          </p>
        </div>

        <div className="uc-group-grid reveal-up">
          {companies.map((company, idx) => (
            <div key={company.id} className="uc-group-card">
              <div className="card-top-row">
                <span className="card-num">0{idx + 1}</span>
                <span className="card-tag">SUBDIVISÃO</span>
              </div>
              <h3 className="card-title">{company.name}</h3>
              <p className="card-desc">{company.description}</p>
              <div className="card-action">
                <a
                  className="btn uc-btn-primary"
                  href={company.linkUrl}
                  target={company.linkUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                >
                  <span>{company.buttonText || 'Conhecer Divisão'}</span>
                  <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
