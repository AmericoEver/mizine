import React, { useState } from 'react';
import { ServicePillar } from '../types';

interface ServicesPillarsProps {
  pillars?: ServicePillar[];
}

export const ServicesPillars: React.FC<ServicesPillarsProps> = ({ pillars = [] }) => {
  const [activeCode, setActiveCode] = useState<string>('01');

  return (
    <section className="uc-services-section theme-daylight-section" id="pilares">
      <div className="wrap">
        {/* Daylight Section Header */}
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag daylight-meta">
            <span className="meta-bracket">[</span>
            <span className="meta-index">03/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">SERVIÇOS & SUBDIVISÕES INTEGRADAS</span>
          </div>
          <h2 className="uc-section-title daylight-title">
            Tudo o que a tua marca precisa.<br />
            <span className="text-red">Sob um único ecossistema multimédia.</span>
          </h2>
          <p className="uc-section-desc daylight-desc">
            Não precisas de gerir múltiplos fornecedores e freelancers sem alinhamento. A Mizine centraliza direção criativa, produção técnica 4K DCI, distribuição viral e tecnologia interativa.
          </p>
        </div>

        {/* 4 Creative White Cards Grid */}
        <div className="uc-pillars-grid daylight-pillars reveal-up">
          {pillars.map((pillar) => {
            const isActive = activeCode === pillar.code;
            return (
              <div
                key={pillar.id}
                className={`uc-pillar-card daylight-white-card ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveCode(pillar.code)}
                onClick={() => setActiveCode(pillar.code)}
              >
                <div className="pillar-top daylight-pillar-top">
                  <span className="pillar-code daylight-code">{pillar.code}</span>
                  <span className="pillar-badge daylight-badge">{pillar.badge}</span>
                </div>

                <div className="pillar-category daylight-cat">{pillar.category}</div>
                <h3 className="pillar-title daylight-p-title">{pillar.title}</h3>
                <p className="pillar-description daylight-p-desc">{pillar.description}</p>

                <div className="pillar-deliverables daylight-deliv">
                  <div className="deliverables-title daylight-deliv-title">ENTREGAS PRINCIPAIS:</div>
                  <ul>
                    {pillar.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <span className="check-bullet text-red">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pillar-footer daylight-p-footer">
                  <a href="#simulador" className="pillar-link daylight-link">
                    <span>Simular este serviço</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
