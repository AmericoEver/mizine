import React from 'react';
import { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
  onPlayShowreel: (title: string, videoUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onPlayShowreel }) => {
  const hasCover = Boolean(content.coverImageUrl);

  return (
    <header className={`uc-hero ${hasCover ? 'has-cover' : ''}`} id="topo">
      {hasCover && (
        <img
          src={content.coverImageUrl}
          alt="Mizine Multimédia Capa"
          className="uc-hero-bg-img"
        />
      )}

      {/* Grid Pattern & Vignette Overlay */}
      <div className="uc-hero-overlay" />
      <div className="uc-hero-grid-lines" />

      <div className="wrap uc-hero-container">
        {/* Monospaced Tag */}
        <div className="uc-meta-tag reveal-up">
          <span className="meta-bracket">[</span>
          <span className="meta-index">01/06</span>
          <span className="meta-bracket">]</span>
          <span className="meta-sep">•</span>
          <span className="meta-title">MIZINE MULTIMÉDIA • ESTÚDIO AUDIOVISUAL & REDES SOCIAIS</span>
        </div>

        {/* Massive Bold Headline */}
        <h1 className="uc-hero-title reveal-up">
          CRIAMOS <span className="text-red">CINEMA.</span><br />
          CAPTURAMOS <span className="text-outline">ATENÇÃO.</span>
        </h1>

        {/* Narrative Description */}
        <div className="uc-hero-bottom-row reveal-up">
          <p className="uc-hero-lead">
            Da produção de <strong>vídeos comerciais 4K</strong> e <strong>reels de alta retenção</strong> aos <strong>convites digitais interativos</strong> da Mizine Celebrate e subdivisões tecnológicas — somos o teu ecossistema multimédia completo.
          </p>

          <div className="uc-hero-cta-group">
            <a href="#reels" className="btn uc-btn-primary">
              <span>Explorar Trabalhos</span>
              <span className="btn-arrow">↓</span>
            </a>

            <button
              onClick={() => onPlayShowreel('Showreel Mizine Multimédia', content.showreelVideoUrl || '/media/videos/showreel.mp4')}
              className="btn uc-btn-glass"
            >
              <span className="play-triangle">▶</span>
              <span>Ver Showreel</span>
            </button>
          </div>
        </div>

        {/* Technical HUD Capabilities Bar */}
        <div className="uc-hud-bar reveal-up">
          <div className="uc-hud-item">
            <span className="hud-code">01</span>
            <span className="hud-label">VIDEO MAKING 4K</span>
          </div>
          <div className="uc-hud-divider" />
          <div className="uc-hud-item">
            <span className="hud-code">02</span>
            <span className="hud-label">GESTÃO DE REDES SOCIAIS</span>
          </div>
          <div className="uc-hud-divider" />
          <div className="uc-hud-item">
            <span className="hud-code">03</span>
            <span className="hud-label">MIZINE CELEBRATE (CONVITES)</span>
          </div>
          <div className="uc-hud-divider" />
          <div className="uc-hud-item">
            <span className="hud-code">04</span>
            <span className="hud-label">ECOSSISTEMA DO GRUPO</span>
          </div>
        </div>
      </div>
    </header>
  );
};
