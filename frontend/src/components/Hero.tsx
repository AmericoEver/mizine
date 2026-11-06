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
      {/* Full-bleed Deep Space Canvas Universe with Interactive 35mm Film Frames & Global Arcs */}
      <div className="uc-hero-canvas-universe">
        <HeroGlobe onPlayVideo={(title, url) => onPlayShowreel(title, url)} />
      </div>

      {/* Typography & CTAs positioned strictly inside the dark cosmic space on the left */}
      <div className="uc-hero-viewport">
        <div className="uc-hero-left">
          {/* Eyebrow Pill / Monospace Tag */}
          <div className="uc-hero-eyebrow reveal-up">
            <span className="eyebrow-accent">●</span>
            <span className="eyebrow-code">[ 01/06 ]</span>
            <span className="eyebrow-sep">•</span>
            <span className="eyebrow-text">MULTIMÉDIA & CINEMA</span>
          </div>

          {/* Clean, Punchy Display Headline */}
          <h1 className="uc-hero-headline reveal-up">
            CRIAMOS<br />
            CINEMA.<br />
            <span className="text-crimson-gradient">ASSUMIMOS O RESULTADO.</span>
          </h1>

          {/* Crisp, Non-intrusive Narrative */}
          <p className="uc-hero-narrative reveal-up">
            Produção 4K DCI, reels estratégicos de alta retenção e soluções visuais que aceleram marcas.
          </p>

          {/* Action Pills */}
          <div className="uc-hero-pills reveal-up">
            <a href="#contacto" className="uc-pill uc-pill-solid">
              <span>INICIAR PROJETO</span>
              <span className="uc-pill-arrow">↗</span>
            </a>

            <button
              onClick={() => onPlayShowreel('Mizine Multimédia — Apresentação 4K DCI', content.showreelVideoUrl || '/media/videos/showreel.mp4')}
              className="uc-pill uc-pill-play"
              title="Assistir Apresentação Mizine"
            >
              <span className="play-icon">▶</span>
              <span>VER VÍDEO</span>
            </button>
          </div>

          {/* Compact Telemetry HUD Bar */}
          <div className="uc-hero-telemetry reveal-up">
            <div className="telemetry-item">
              <span className="telemetry-val">4K DCI</span>
              <span className="telemetry-lbl">Cinema 24FPS</span>
            </div>
            <div className="telemetry-div" />
            <div className="telemetry-item">
              <span className="telemetry-val">+100%</span>
              <span className="telemetry-lbl">Retenção Viral</span>
            </div>
            <div className="telemetry-div" />
            <div className="telemetry-item">
              <span className="telemetry-val">MAPUTO [HQ]</span>
              <span className="telemetry-lbl">Base Global</span>
            </div>
          </div>
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
