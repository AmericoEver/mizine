import React, { useState } from 'react';

interface NavbarProps {
  onBackToSite?: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onBackToSite, isAdminView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="wrap">
        <a className="logo" href={isAdminView ? '/#topo' : '#topo'}>
          MIZINE<i>.</i>
        </a>
        
        {!isAdminView ? (
          <>
            <ul id="menu" className={isOpen ? 'open' : ''}>
              <li><a href="#sobre" onClick={() => setIsOpen(false)}>Sobre</a></li>
              <li><a href="#reels" onClick={() => setIsOpen(false)}>Trabalhos</a></li>
              <li><a href="#clientes" onClick={() => setIsOpen(false)}>Clientes</a></li>
              <li><a href="#percurso" onClick={() => setIsOpen(false)}>Percurso</a></li>
              <li><a href="#equipa" onClick={() => setIsOpen(false)}>Equipa</a></li>
              <li><a href="#grupo" onClick={() => setIsOpen(false)}>Grupo</a></li>
              <li><a href="#contacto" onClick={() => setIsOpen(false)}>Contacto</a></li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a className="btn" href="#contacto">Falar connosco</a>
            </div>

            <button
              className="burger"
              id="burger"
              aria-label="Abrir menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              Menu
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
            <span className="admin-badge">Painel de Gestão</span>
            {onBackToSite && (
              <button onClick={onBackToSite} className="btn">
                Voltar ao Site
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
