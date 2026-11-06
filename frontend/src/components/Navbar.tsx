import React, { useState } from 'react';

interface NavbarProps {
  onBackToSite?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onBackToSite, isAdminView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="uc-nav">
      <div className="wrap uc-nav-inner">
        <a className="logo uc-logo" href={isAdminView ? '/#topo' : '#topo'}>
          <img
            src="/logo-m.jpg"
            alt="Mizine Multimédia"
            className="uc-logo-img"
          />
          <div className="uc-logo-text">
            <span className="brand-title">MIZINE</span>
            <span className="brand-sub">MULTIMÉDIA</span>
          </div>
        </a>

        {!isAdminView ? (
          <>
            <div className="uc-status-pill">
              <span className="status-dot"></span>
              <span className="status-label">STUDIO REC • 4K 24FPS</span>
            </div>

            <ul id="menu" className={`uc-menu ${isOpen ? 'open' : ''}`}>
              <li><a href="#sobre" onClick={() => setIsOpen(false)}>Sobre</a></li>
              <li><a href="#pilares" onClick={() => setIsOpen(false)}>Pilares</a></li>
              <li><a href="#reels" onClick={() => setIsOpen(false)}>Trabalhos</a></li>
              <li><a href="#porque" onClick={() => setIsOpen(false)}>Porquê</a></li>
              <li><a href="#simulador" onClick={() => setIsOpen(false)}>Simulador</a></li>
              <li><a href="#clientes" onClick={() => setIsOpen(false)}>Clientes</a></li>
              <li><a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a></li>
              <li><a href="#contacto" onClick={() => setIsOpen(false)}>Contacto</a></li>
            </ul>

            <div className="uc-nav-actions">
              <a className="btn uc-btn-primary" href="#simulador">
                <span>Iniciar Projeto</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>

            <button
              className="burger uc-burger"
              id="burger"
              aria-label="Abrir menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{isOpen ? 'Fechar' : 'Menu'}</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
            <span className="admin-badge">Painel de Gestão</span>
            {onBackToSite && (
              <button onClick={onBackToSite} className="btn uc-btn-primary">
                Voltar ao Site
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
