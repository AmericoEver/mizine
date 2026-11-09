import React from 'react';
import { AboutContent } from '../types';
import { Icon } from './Icon';
import { FounderCamera } from './FounderCamera';

interface IntroMetricsProps {
  content: AboutContent;
}

export const IntroMetrics: React.FC<IntroMetricsProps> = ({ content }) => {
  return (
    <section className="uc-intro-section theme-daylight-section" id="sobre">
      <div className="wrap">
        {/* Continuação do roteiro: depois das marcas, a câmara continua a gravar → o criador */}
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag daylight-meta">
            <span className="meta-bracket">[</span>
            <span className="meta-index">03/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">CÂMARA 01 // A GRAVAÇÃO CONTINUA</span>
          </div>
          <span className="uc-header-sub daylight-sub">Sede Operacional em Maputo & Ecossistema de Produção</span>
        </div>

        <div className="uc-manifesto-grid daylight-manifesto reveal-up">
          <h2 className="uc-manifesto-text daylight-text">
            Por trás de cada fotograma, há quem esteja atrás da câmara.
          </h2>
          <div className="uc-manifesto-aside daylight-aside">
            <p className="uc-manifesto-sub daylight-subtext">
              {content.subtext || 'Nascida em Moçambique e com visão global, a Mizine une estética cinematográfica, engenharia de atenção para redes sociais e comunicação estratégica com acabamento impecável.'}
            </p>
            <div className="daylight-origin-badge">
              <span className="origin-flag"><Icon name="pin" size={15} /></span>
              <span className="origin-text">MAPUTO, MOÇAMBIQUE • ESTÚDIO CENTRAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* CÂMARA NO TRIPÉ → PUSH-IN NO MONITOR → RELANCE DO FUNDADOR (cena guiada pelo scroll) */}
      <FounderCamera />
    </section>
  );
};
