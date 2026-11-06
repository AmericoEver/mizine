import React, { useState } from 'react';

interface NavbarProps {
  onBackToSite?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onBackToSite, isAdminView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="uc-nav-header">
      <div className="wrap uc-nav-row">
        {/* Brand Wordmark (United Carriers wide geometric font) */}
        <a className="uc-brand" href={isAdminView ? '/#topo' : '#topo'}>
          <div className="uc-brand-mark">
            <img src="/logo-m.jpg" alt="M" className="uc-brand-icon" />
          </div>
          <span className="uc-brand-title">MIZINE</span>
          <span className="uc-brand-badge">MULTIMÉDIA</span>
        </a>

        {!isAdminView ? (
          <>
            {/* Nav Links */}
            <ul className={`uc-nav-links ${isOpen ? 'is-active' : ''}`}>
              <li><a href="#pilares" onClick={() => setIsOpen(false)}>SERVIÇOS</a></li>
              <li><a href="#reels" onClick={() => setIsOpen(false)}>REELS</a></li>
              <li><a href="#trabalhos" onClick={() => setIsOpen(false)}>PROJETOS</a></li>
              <li><a href="#porque" onClick={() => setIsOpen(false)}>DIFERENCIAIS</a></li>
              <li><a href="#simulador" onClick={() => setIsOpen(false)}>SIMULADOR</a></li>
              <li><a href="#clientes" onClick={() => setIsOpen(false)}>CLIENTES</a></li>
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
  );
};
