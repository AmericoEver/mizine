import React from 'react';
import { AboutContent } from '../types';

interface IntroMetricsProps {
  content: AboutContent;
}

export const IntroMetrics: React.FC<IntroMetricsProps> = ({ content }) => {
  return (
    <section className="uc-intro-section" id="sobre">
      <div className="wrap">
        {/* Header Tag */}
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">02/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">{content.tagTitle || 'MANIFESTO & IMPACTO'}</span>
          </div>
          <span className="uc-header-sub">{content.tagSubtitle || 'O Nosso Propósito'}</span>
        </div>

        {/* Big Manifesto Headline */}
        <div className="uc-manifesto-grid reveal-up">
          <h2 className="uc-manifesto-text">
            {content.mainHeading || 'Trabalhamos com marcas corajosas e momentos únicos para criar experiências que as pessoas sentem e partilham.'}
          </h2>
          <div className="uc-manifesto-aside">
            <p className="uc-manifesto-sub">
              {content.subtext || 'Nascida da paixão pela narrativa visual e engenharia de atenção, a Mizine Multimédia une estética de cinema, gestão viral de redes sociais e soluções digitais exclusivas para elevar marcas a outro patamar.'}
            </p>
            <div className="uc-manifesto-signature">
              <span className="sig-name">Moisés Jorge Mabunda</span>
              <span className="sig-role">Fundador & Diretor Criativo • Mizine Multimédia</span>
            </div>
          </div>
        </div>

        {/* 4-Column Architectural Metrics Grid */}
        <div className="uc-metrics-grid reveal-up">
          <div className="uc-metric-card">
            <div className="metric-header">
              <span className="metric-badge">EXPERIÊNCIA</span>
              <span className="metric-dot">●</span>
            </div>
            <div className="metric-number">+3<span className="metric-unit">ANOS</span></div>
            <p className="metric-label">Criando narrativas de autoridade e conteúdos com acabamento de cinema.</p>
          </div>

          <div className="uc-metric-card">
            <div className="metric-header">
              <span className="metric-badge">ENTREGAS</span>
              <span className="metric-dot">●</span>
            </div>
            <div className="metric-number">+150<span className="metric-unit">PROD</span></div>
            <p className="metric-label">Comerciais, aftermovies de eventos VIP, vídeos institucionais e videoclipes.</p>
          </div>

          <div className="uc-metric-card">
            <div className="metric-header">
              <span className="metric-badge">ALCANCE</span>
              <span className="metric-dot">●</span>
            </div>
            <div className="metric-number">+5M<span className="metric-unit">VIEWS</span></div>
            <p className="metric-label">Visualizações e retenção geradas organicamente no Instagram e TikTok.</p>
          </div>

          <div className="uc-metric-card highlight">
            <div className="metric-header">
              <span className="metric-badge">CONFIANÇA</span>
              <span className="metric-dot">●</span>
            </div>
            <div className="metric-number">100%<span className="metric-unit">ON-TIME</span></div>
            <p className="metric-label">Pontualidade sagrada na entrega de cada projeto e evento.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

