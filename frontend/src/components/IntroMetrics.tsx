import React, { useState } from 'react';
import { AboutContent } from '../types';

interface IntroMetricsProps {
  content: AboutContent;
}

const REAL_PORTFOLIO_BRANDS = [
  { name: 'CONFNES', tag: 'CONFERÊNCIA NACIONAL', logo: '/media/clients/confnes.png', frame: '01' },
  { name: 'UNE', tag: 'UNIÃO DE ESTUDANTES', logo: '/media/clients/une.png', frame: '02' },
  { name: 'INAS', tag: 'GOVERNO DE MOÇAMBIQUE', logo: '/media/clients/inas.png', frame: '03' },
  { name: 'GOV. GAZA', tag: 'SETOR PÚBLICO', logo: '/media/clients/governo-gaza.png', frame: '04' },
  { name: 'LIMPOPO TV', tag: 'TELEVISÃO & BROADCAST', logo: '/media/clients/limpopo-tv.png', frame: '05' },
  { name: 'CREDMOZ', tag: 'FINTECH & CRÉDITO', logo: '/media/clients/credmoz.png', frame: '06' },
  { name: 'CATALYST ACADEMY', tag: 'EDUCAÇÃO & NEGÓCIOS', logo: '/media/clients/catalyst-academy.png', frame: '07' },
  { name: 'MOZCLEAN', tag: 'SOLUÇÕES CORPORATIVAS', logo: '/media/clients/mozclean.png', frame: '08' },
  { name: 'CPC - GAZA', tag: 'CONSELHO PROVINCIAL', logo: '/media/clients/cpc-gaza.png', frame: '09' },
  { name: 'GEEK EVER', tag: 'TECNOLOGIA & GAMING', logo: '/media/clients/geek.png', frame: '10' },
  { name: 'QUAQUA', tag: 'COMUNICAÇÃO & BRANDING', logo: '/media/clients/quaqua.png', frame: '11' },
  { name: 'FCDF', tag: 'FORMAÇÃO FOTOGRÁFICA', logo: '/media/clients/fcdf.png', frame: '12' },
  { name: 'HOME SERVICE', tag: 'SERVIÇOS GERAIS', logo: '/media/clients/home-service.png', frame: '13' },
  { name: 'CLM MAPUTO', tag: 'LOGÍSTICA & TRANSPORTE', logo: '/media/clients/confnes.png', frame: '14' }
];

export const IntroMetrics: React.FC<IntroMetricsProps> = ({ content }) => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  // Duplicate for seamless infinite loop marquee
  const marqueeBrands = [...REAL_PORTFOLIO_BRANDS, ...REAL_PORTFOLIO_BRANDS];

  return (
    <section className="uc-intro-section theme-daylight-section" id="sobre">
      <div className="wrap">
        {/* Daylight Arrival Telemetry Header */}
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag daylight-meta">
            <span className="meta-bracket">[</span>
            <span className="meta-index">02/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">TERRA // MOÇAMBIQUE • DIA ENSOLARADO [ 12:00 ] ☀️</span>
          </div>
          <span className="uc-header-sub daylight-sub">Sede Operacional & Ecossistema de Produção</span>
        </div>

        {/* Big Bold Manifesto Headline */}
        <div className="uc-manifesto-grid daylight-manifesto reveal-up">
          <h2 className="uc-manifesto-text daylight-text">
            {content.mainHeading || 'Trabalhamos com marcas corajosas e momentos únicos para criar experiências que as pessoas sentem e partilham.'}
          </h2>
          <div className="uc-manifesto-aside daylight-aside">
            <p className="uc-manifesto-sub daylight-subtext">
              {content.subtext || 'Nascida em Moçambique e com visão global, a Mizine une estética cinematográfica em 4K DCI, engenharia de atenção para redes sociais e comunicação estratégica com acabamento impecável.'}
            </p>
            <div className="daylight-origin-badge">
              <span className="origin-flag">🇲🇿</span>
              <span className="origin-text">MAPUTO, MOÇAMBIQUE • ESTÚDIO CENTRAL</span>
            </div>
          </div>
        </div>

        {/* 24MM PHOTOGRAPHIC FILM REEL // MARCAS QUE JÁ TRABALHARAM COM MOISÉS MABUNDA */}
        <div className="film-reel-24mm-daylight reveal-up">
          <div className="film-reel-meta-bar">
            <div className="film-reel-title">
              <span className="rec-tally-dot" />
              <span>FITA DE GRAVAÇÃO 24MM // MARCAS QUE CONFIAM NA MIZINE</span>
            </div>
            <div className="film-reel-spec">
              <span>PADRÃO 24MM CELLULOID • 24 FPS • EXPOSIÇÃO LUZ DO DIA 5600K</span>
            </div>
          </div>

          <div className="film-strip-viewport">
            <div className="film-strip-track">
              {marqueeBrands.map((brand, idx) => {
                const isHovered = hoveredBrand === `${brand.name}-${idx}`;
                return (
                  <div
                    key={`${brand.name}-${idx}`}
                    className={`film-frame-24mm ${isHovered ? 'is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredBrand(`${brand.name}-${idx}`)}
                    onMouseLeave={() => setHoveredBrand(null)}
                  >
                    {/* Top Sprocket Perforations */}
                    <div className="film-sprockets top">
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                    </div>

                    {/* Frame Content Window */}
                    <div className="film-frame-window">
                      <div className="frame-header-indicator">
                        <span className="frame-counter">[ FR {brand.frame}/24 ]</span>
                        <span className="frame-rec-status">
                          <span className="mini-rec-dot" />
                          <span>REC</span>
                        </span>
                      </div>

                      <div className="film-logo-container">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="film-brand-logo"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="film-brand-name">{brand.name}</span>
                      </div>

                      <div className="film-brand-category">
                        <span>{brand.tag}</span>
                      </div>
                    </div>

                    {/* Bottom Sprocket Perforations */}
                    <div className="film-sprockets bottom">
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                      <span className="sprocket-hole" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CINEMA CAMERA ON TRIPOD & MOISÉS MABUNDA FOUNDER VIGNETTE */}
        <div className="camera-tripod-founder-set reveal-up">
          {/* Left Column: Realistic Cinema Camera on Studio Heavy-Duty Tripod */}
          <div className="cinema-camera-col">
            <div className="cinema-camera-rig">
              {/* Studio Tally Light */}
              <div className="camera-tally-bar">
                <span className="tally-rec-dot" />
                <span className="tally-text">🔴 CAMERA 01 • REC 24.000 FPS • 4K DCI</span>
              </div>

              {/* Viewfinder Monitor Screen with Real On-Set Photo of Moisés Mabunda */}
              <div className="camera-viewfinder-screen">
                {/* Rule of thirds crosshairs */}
                <div className="vf-grid-overlay">
                  <div className="grid-line h1" />
                  <div className="grid-line h2" />
                  <div className="grid-line v1" />
                  <div className="grid-line v2" />
                  <div className="center-crosshair" />
                </div>

                {/* Real photo of Moisés Mabunda on set with cinema gimbal */}
                <div className="vf-subject-shot">
                  <img
                    src="/media/founder/moises-cinema-set.jpg"
                    alt="Moisés Jorge Mabunda na Direção de Audiovisual"
                    className="vf-subject-img"
                  />
                </div>

                {/* Viewfinder HUD Overlays */}
                <div className="vf-hud-top">
                  <span className="vf-rec-badge">● REC [RAW]</span>
                  <span className="vf-tc">TC 01:24:58:12</span>
                  <span className="vf-battery">🔋 98%</span>
                </div>

                <div className="vf-hud-bottom">
                  <span className="vf-shutter">1/48s • 180°</span>
                  <span className="vf-iso">ISO 800</span>
                  <span className="vf-wb">5600K DAYLIGHT</span>
                  <span className="vf-audio">
                    <span className="audio-meter">
                      <span className="meter-level" />
                    </span>
                    <span>CH1/2</span>
                  </span>
                </div>
              </div>

              {/* Cinema Camera Body & Tripod Stand SVG Graphics */}
              <div className="camera-tripod-graphic" aria-hidden="true">
                <svg viewBox="0 0 320 180" className="tripod-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Fluid Head Mount */}
                  <rect x="135" y="10" width="50" height="14" rx="3" fill="#1b1c24" stroke="#ff3b30" strokeWidth="1.5" />
                  <circle cx="160" cy="17" r="4" fill="#ff3b30" />
                  {/* Pan Handle */}
                  <path d="M185 17 L235 32" stroke="#4a4c58" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="235" cy="32" r="5" fill="#1b1c24" stroke="#ff3b30" strokeWidth="1.5" />
                  {/* Tripod Collar & Level Bubble */}
                  <rect x="142" y="24" width="36" height="16" rx="2" fill="#2d303e" />
                  <circle cx="160" cy="32" r="3" fill="#00d4ff" />
                  {/* Tripod Legs (Heavy-Duty Carbon Fiber Studio Spread) */}
                  <line x1="160" y1="40" x2="160" y2="175" stroke="#1f222e" strokeWidth="6" strokeLinecap="round" />
                  <line x1="160" y1="40" x2="160" y2="175" stroke="#35394b" strokeWidth="2" strokeDasharray="8 4" />
                  <line x1="152" y1="40" x2="45" y2="175" stroke="#1f222e" strokeWidth="6" strokeLinecap="round" />
                  <line x1="152" y1="40" x2="45" y2="175" stroke="#35394b" strokeWidth="2" strokeDasharray="8 4" />
                  <line x1="168" y1="40" x2="275" y2="175" stroke="#1f222e" strokeWidth="6" strokeLinecap="round" />
                  <line x1="168" y1="40" x2="275" y2="175" stroke="#35394b" strokeWidth="2" strokeDasharray="8 4" />
                  {/* Mid-Level Spreader Brackets */}
                  <path d="M85 125 L160 115 L235 125" stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Rubber Feet */}
                  <rect x="36" y="172" width="18" height="6" rx="2" fill="#0a0b10" />
                  <rect x="151" y="172" width="18" height="6" rx="2" fill="#0a0b10" />
                  <rect x="266" y="172" width="18" height="6" rx="2" fill="#0a0b10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Narrative & Daylight Architectural Metrics */}
          <div className="founder-narrative-col">
            <div className="founder-profile-card">
              <div className="founder-card-header">
                <span className="founder-badge">LIDERANÇA & CRIAÇÃO</span>
                <span className="founder-status-live">● ON SET // GRAVANDO</span>
              </div>
              <h3 className="founder-name">Moisés Jorge Mabunda</h3>
              <span className="founder-role">
                Fundador & Diretor Criativo • Licenciado em Cinema e Audiovisual
              </span>
              <p className="founder-quote">
                “Ao longo da minha trajetória, desenvolvo soluções visuais que combinam criatividade, estratégia e rigor técnico. A minha experiência em audiovisual, fotografia e edição de vídeo une cinema e design, permitindo ter uma visão ampla da comunicação e da construção de autoridade de cada marca.”
              </p>
              <div className="founder-tags-row">
                <span className="f-tag">CINEMA 4K</span>
                <span className="f-tag">DESIGN GRÁFICO</span>
                <span className="f-tag">DIREÇÃO DE FOTOGRAFIA</span>
                <span className="f-tag">RETENÇÃO VIRAL</span>
              </div>
            </div>

            {/* 4 Architectural Daylight Metrics */}
            <div className="daylight-metrics-grid">
              <div className="daylight-metric-card">
                <div className="d-metric-top">
                  <span className="d-metric-badge">EXPERIÊNCIA</span>
                  <span className="d-metric-dot red">●</span>
                </div>
                <div className="d-metric-number">+3<span className="d-metric-unit">ANOS</span></div>
                <p className="d-metric-label">Criando narrativas de autoridade e acabamento de cinema.</p>
              </div>

              <div className="daylight-metric-card">
                <div className="d-metric-top">
                  <span className="d-metric-badge">PRODUÇÕES</span>
                  <span className="d-metric-dot">●</span>
                </div>
                <div className="d-metric-number">+150<span className="d-metric-unit">OBRAS</span></div>
                <p className="d-metric-label">Comerciais, aftermovies VIP, vídeos institucionais e videoclipes.</p>
              </div>

              <div className="daylight-metric-card">
                <div className="d-metric-top">
                  <span className="d-metric-badge">AUDIÊNCIA</span>
                  <span className="d-metric-dot">●</span>
                </div>
                <div className="d-metric-number">+5M<span className="d-metric-unit">VIEWS</span></div>
                <p className="d-metric-label">Visualizações e retenção geradas organicamente nas redes.</p>
              </div>

              <div className="daylight-metric-card highlight-card">
                <div className="d-metric-top">
                  <span className="d-metric-badge">COMPROMISSO</span>
                  <span className="d-metric-dot green">●</span>
                </div>
                <div className="d-metric-number">100%<span className="d-metric-unit">ON-TIME</span></div>
                <p className="d-metric-label">Pontualidade sagrada na entrega de cada projeto e evento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
