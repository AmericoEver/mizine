import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { HeroContent } from '../types';
import { HeroGlobe } from './HeroGlobe';
import { Icon } from './Icon';
import { CLIENT_BRANDS, stripBrandAt } from '../data/clientBrands';

interface HeroProps {
  content: HeroContent;
  onPlayShowreel: (title: string, videoUrl: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onPlayShowreel }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  // 3 ciclos completos de marcas: cobre qualquer largura de ecrã enquanto a fita corre em loop
  const stripFrames = Array.from({ length: CLIENT_BRANDS.length * 3 }, (_, k) => stripBrandAt(k));

  return (
    <div className="uc-hero-scroll-track" id="topo">
      {/* Altímetro de descida — renderizado no <body> para ficar realmente fixo no ecrã */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="flight-altimeter" id="flightTelemetryHud" aria-hidden="true">
            <div className="alt-head">
              <span className="hud-rec-dot" />
              <span>DESCIDA • MAPUTO</span>
            </div>
            <div className="alt-body">
              <div className="alt-tape" id="hudAltTape">
                <span className="alt-tape-needle" />
              </div>
              <div className="alt-readout">
                <span className="alt-lbl">ALTITUDE</span>
                <span className="alt-val">
                  <span id="hudAltitudeVal">24.8</span>
                  <span className="alt-unit" id="hudAltUnit">KM</span>
                </span>
                <span className="alt-lbl">VELOCIDADE</span>
                <span className="alt-sub" id="hudMachVal">MACH 12.4</span>
              </div>
            </div>
            <div className="alt-target">
              <span className="alt-lbl">ALVO</span>
              <span className="alt-target-val">MAPUTO [HQ] · 25°58′S 32°35′E</span>
            </div>
            <div className="alt-progress">
              <span id="hudAltBar" />
            </div>
          </div>,
          document.body
        )}

      <section className="uc-hero-section">
        {/* Full-bleed Deep Space Canvas Universe with Scroll-Driven Zoom into Mozambique & Volumetric Clouds */}
        <div className="uc-hero-canvas-universe">
          <HeroGlobe
            onPlayVideo={(title, url) => onPlayShowreel(title, url)}
            viewportRef={viewportRef}
          />
        </div>

        {/* Typography & CTAs positioned strictly inside the dark cosmic space on the left */}
        <div className="uc-hero-viewport" ref={viewportRef}>
          <div className="uc-hero-left">
            <div className="uc-hero-eyebrow reveal-up">
              <span className="eyebrow-accent">●</span>
              <span className="eyebrow-code">[ 01/06 ]</span>
              <span className="eyebrow-sep">•</span>
              <span className="eyebrow-text">MULTIMÉDIA & CINEMA</span>
            </div>

            <h1 className="uc-hero-headline reveal-up">
              CRIAMOS<br />
              CINEMA.<br />
              <span className="text-crimson-gradient">ASSUMIMOS O RESULTADO.</span>
            </h1>

            <p className="uc-hero-narrative reveal-up">
              Produção audiovisual, reels estratégicos de alta retenção e soluções visuais que aceleram marcas.
            </p>

            <div className="uc-hero-pills reveal-up">
              <a href="#contacto" className="uc-pill uc-pill-solid">
                <span>INICIAR PROJETO</span>
                <span className="uc-pill-arrow">↗</span>
              </a>

              <button
                onClick={() => onPlayShowreel('Mizine Multimédia — Apresentação', content.showreelVideoUrl || '/media/videos/showreel.mp4')}
                className="uc-pill uc-pill-play"
                title="Assistir Apresentação Mizine"
              >
                <span className="play-icon">▶</span>
                <span>VER VÍDEO</span>
              </button>
            </div>

            <div className="uc-hero-telemetry reveal-up">
              <div className="telemetry-item">
                <span className="telemetry-val">CINEMA</span>
                <span className="telemetry-lbl">Produção audiovisual</span>
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

        <div className="uc-floating-badge" aria-hidden="true">
          <span className="badge-logo">MZ.</span>
          <span className="badge-vertical-text">ESTÚDIO 2026</span>
        </div>

        <div className="uc-hero-scroll-indicator" aria-hidden="true">
          <div className="scroll-indicator-mouse">
            <div className="scroll-indicator-wheel" />
          </div>
          <span className="scroll-indicator-text">SCROLL PARA EXPLORAR</span>
        </div>

        {/* POUSO EM MAPUTO (luz do dia): o texto aponta para a fita, a fita do espaço aterra aqui.
            Fica DENTRO da cena fixa, por isso o alvo da aterragem não se mexe durante a transição. */}
        <div className="uc-hero-landing" id="heroLanding">
          <div className="wrap landing-head" id="heroLandingHead">
            <div className="uc-meta-tag daylight-meta">
              <span className="meta-bracket">[</span>
              <span className="meta-index">02/06</span>
              <span className="meta-bracket">]</span>
              <span className="meta-sep">•</span>
              <span className="meta-title">TERRA // MAPUTO • DIA ENSOLARADO [ 12:00 ] <Icon name="sun" size={13} className="meta-icon" /></span>
            </div>
            <h2 className="landing-title">
              TRABALHAMOS COM <span className="text-crimson-gradient">MARCAS CORAJOSAS.</span>
            </h2>
            <p className="landing-sub">
              <span>Estas marcas já confiaram a sua história à nossa câmara</span>
              <span className="landing-arrow" aria-hidden="true">↓</span>
            </p>
          </div>

          <div className="landing-reel">
            <div className="wrap film-reel-meta-bar">
              <div className="film-reel-title">
                <span className="rec-tally-dot" />
                <span>FITA DE GRAVAÇÃO 24MM // PARCEIROS & CLIENTES</span>
              </div>
              <div className="film-reel-spec">
                <span>PARCEIROS & CLIENTES</span>
              </div>
            </div>

            <div className="cine-strip" id="heroLandingStrip">
              {/* Posição controlada pelo canvas (mesmo relógio da fita que orbita o planeta) */}
              <div className="cine-strip-track" id="heroLandingTrack">
                {stripFrames.map((brand, idx) => (
                  <div key={idx} className="cine-frame" title={brand.name}>
                    <span className="cine-edge-code">MIZINE ▸ {brand.frame}A</span>
                    <div className="cine-frame-window">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="cine-frame-logo" />
                      ) : (
                        <span
                          className="cine-frame-wordmark"
                          style={{ ['--len' as string]: brand.name.length } as React.CSSProperties}
                        >
                          {brand.name}
                        </span>
                      )}
                      {brand.logo && <span className="cine-frame-name">{brand.name}</span>}
                      <span className="cine-frame-tag">{brand.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
