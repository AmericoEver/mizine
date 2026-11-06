import React, { useState } from 'react';
import { ServicePillar } from '../types';

interface ServicesPillarsProps {
  pillars?: ServicePillar[];
}

export const ServicesPillars: React.FC<ServicesPillarsProps> = ({ pillars = [] }) => {
  const [activeCode, setActiveCode] = useState<string>('01');

  return (
    <section className="uc-services-section" id="pilares">
      <div className="wrap">
        {/* Section Header */}
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">03/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">SERVIÇOS & SUBDIVISÕES INTEGRADAS</span>
          </div>
          <h2 className="uc-section-title">
            Tudo o que a tua marca precisa.<br />
            <span className="text-red">Sob um único ecossistema multimédia.</span>
          </h2>
          <p className="uc-section-desc">
            Não precisas de gerir múltiplos fornecedores e freelancers sem alinhamento. A Mizine centraliza direção criativa, produção técnica, distribuição viral e tecnologia interativa.
          </p>
        </div>

        {/* 4 Pillars Interactive Grid */}
        <div className="uc-pillars-grid reveal-up">
          {pillars.map((pillar) => {
            const isActive = activeCode === pillar.code;
            return (
              <div
                key={pillar.id}
                className={`uc-pillar-card ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveCode(pillar.code)}
                onClick={() => setActiveCode(pillar.code)}
              >
                <div className="pillar-top">
                  <span className="pillar-code">{pillar.code}</span>
                  <span className="pillar-badge">{pillar.badge}</span>
                </div>

                <div className="pillar-category">{pillar.category}</div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>

                <div className="pillar-deliverables">
                  <div className="deliverables-title">ENTREGAS PRINCIPAIS:</div>
                  <ul>
                    {pillar.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <span className="check-bullet">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pillar-footer">
                  <a href="#simulador" className="pillar-link">
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

