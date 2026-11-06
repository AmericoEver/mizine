import React, { useState } from 'react';

interface NavbarProps {
  onBackToSite?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onBackToSite, isAdminView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="uc-main-header">
      {/* Top Technical Wire Ticker (At the very top of the screen) */}
      {!isAdminView && (
        <div className="uc-top-ticker">
          <div className="wrap uc-ticker-inner">
            <div className="uc-ticker-left">
              <span className="ticker-badge">NEWS:</span>
              <span className="ticker-text">
                PRODUÇÃO CINEMATOGRÁFICA 4K DCI & REELS DE ALTA RETENÇÃO EM MOÇAMBIQUE E ÁFRICA AUSTRAL...
              </span>
            </div>
            <div className="uc-ticker-right">
              <a href="#simulador" className="ticker-link">SIMULADOR DE ORÇAMENTO</a>
              <span className="ticker-sep">|</span>
              <span className="ticker-code">ESTÚDIO CENTRAL [MZ]</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Row */}
      <nav className="uc-nav-header">
        <div className="wrap uc-nav-row">
          {/* Brand Wordmark (United Carriers style) */}
          <a className="uc-brand" href={isAdminView ? '/#topo' : '#topo'}>
            <img src="/logo-m.jpg" alt="M" className="uc-brand-avatar" />
            <div className="uc-brand-group">
              <span className="uc-brand-title">MIZINE</span>
              <span className="uc-brand-sub">MULTIMÉDIA</span>
            </div>
          </a>

          {!isAdminView ? (
            <>
              {/* Clean Nav Links */}
              <ul className={`uc-nav-links ${isOpen ? 'is-active' : ''}`}>
                <li><a href="#pilares" onClick={() => setIsOpen(false)}>SERVIÇOS</a></li>
                <li><a href="#reels" onClick={() => setIsOpen(false)}>TRABALHOS</a></li>
                <li><a href="#porque" onClick={() => setIsOpen(false)}>DIFERENCIAIS</a></li>
                <li><a href="#simulador" onClick={() => setIsOpen(false)}>SIMULADOR</a></li>
                <li><a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a></li>
                <li><a href="#contacto" onClick={() => setIsOpen(false)}>CONTACTO</a></li>
              </ul>

              {/* Right Action: White Pill Button */}
              <div className="uc-nav-action-wrap">
                <a className="uc-pill uc-pill-solid uc-nav-cta" href="#simulador">
                  <span>INICIAR PROJETO</span>
                  <span className="uc-pill-arrow">↗</span>
                </a>

                <button
                  className={`uc-burger-btn ${isOpen ? 'open' : ''}`}
                  aria-label="Toggle navigation"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="burger-line"></span>
                  <span className="burger-line"></span>
                </button>
              </div>
            </>
          ) : (
            <div className="uc-nav-admin-tools">
              <span className="admin-status-pill">MODO ADMIN</span>
              {onBackToSite && (
                <button onClick={onBackToSite} className="uc-pill uc-pill-solid">
                  VOLTAR AO SITE
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
