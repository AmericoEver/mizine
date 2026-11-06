import React from 'react';
import { HeroContent } from '../types';
import { HeroGlobe } from './HeroGlobe';

interface HeroProps {
  content: HeroContent;
  onPlayShowreel: (title: string, videoUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onPlayShowreel }) => {
  return (
    <section className="uc-hero-section" id="topo">
      {/* Deep Space Void Canvas & Subdued Matrix */}
      <div className="uc-hero-void-bg">
        <div className="uc-hero-stars" />
        <div className="uc-hero-wiregrid" />
      </div>

      {/* Main 2-Column United Carriers Composition */}
      <div className="wrap uc-hero-viewport">
        {/* Left Column: Typography & CTAs */}
        <div className="uc-hero-left">
          {/* Eyebrow Pill / Monospace Tag */}
          <div className="uc-hero-eyebrow reveal-up">
            <span className="eyebrow-accent">●</span>
            <span className="eyebrow-code">[ 01/06 ]</span>
            <span className="eyebrow-sep">•</span>
            <span className="eyebrow-text">UM SÓ OPERADOR MULTIMÉDIA</span>
          </div>

          {/* Massive Display Headline */}
          <h1 className="uc-hero-headline reveal-up">
            CRIAMOS<br />
            CINEMA.<br />
            ASSUMIMOS O<br />
            <span className="text-crimson-gradient">RESULTADO.</span>
          </h1>

          {/* Elevated Narrative Lead Paragraph */}
          <p className="uc-hero-narrative reveal-up">
            Do audiovisual cinematográfico em <strong>4K DCI</strong> e <strong>reels de alto engajamento</strong> à gestão estratégica de marcas e <strong>convites digitais interativos</strong>. Uma equipa coesa, visão unificada e foco absoluto no resultado final.
          </p>

          {/* Pill Action Buttons (Exact United Carriers Shape: rounded 9999px) */}
          <div className="uc-hero-pills reveal-up">
            <a href="#contacto" className="uc-pill uc-pill-solid">
              <span>FALAR CONNOSCO</span>
              <span className="uc-pill-arrow">↗</span>
            </a>

            <a href="#pilares" className="uc-pill uc-pill-ghost">
              <span>NOSSOS SERVIÇOS</span>
            </a>

            <button
              onClick={() => onPlayShowreel('Showreel Mizine Multimédia', content.showreelVideoUrl || '/media/videos/showreel.mp4')}
              className="uc-pill uc-pill-play"
              title="Assistir Showreel"
            >
              <span className="play-icon">▶</span>
              <span>SHOWREEL</span>
            </button>
          </div>

          {/* Bottom Telemetry HUD Bar */}
          <div className="uc-hero-telemetry reveal-up">
            <div className="telemetry-item">
              <span className="telemetry-val">4K DCI / 24FPS</span>
              <span className="telemetry-lbl">Padrão Cinematográfico</span>
            </div>
            <div className="telemetry-div" />
            <div className="telemetry-item">
              <span className="telemetry-val">+100% RETENÇÃO</span>
              <span className="telemetry-lbl">Social Media Viral</span>
            </div>
            <div className="telemetry-div" />
            <div className="telemetry-item">
              <span className="telemetry-val">MAPUTO [HQ]</span>
              <span className="telemetry-lbl">Sede & Operação Global</span>
            </div>
          </div>
        </div>

        {/* Right Column: GIANT 3D GLOWING PARTICLE SPHERE */}
        <div className="uc-hero-right reveal-fade">
          <HeroGlobe />
        </div>
      </div>

      {/* Floating Vertical Site-of-the-Day Style Badge */}
      <div className="uc-floating-badge" aria-hidden="true">
        <span className="badge-logo">MZ.</span>
        <span className="badge-vertical-text">ESTÚDIO 2026</span>
      </div>
    </section>
  );
};
