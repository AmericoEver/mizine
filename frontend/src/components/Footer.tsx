import React from 'react';
import { HeroContent } from '../types';

interface FooterProps {
  hero: HeroContent;
}

export const Footer: React.FC<FooterProps> = ({ hero }) => {
  return (
    <footer className="uc-footer">
      <div className="wrap uc-footer-inner">
        {/* Top Brand Banner */}
        <div className="uc-footer-top">
          <div className="uc-footer-brand">
            <div className="footer-logo-row">
              <img
                src="/logo-m.jpg"
                alt="Mizine"
                className="footer-logo-img"
              />
              <span className="footer-brand-name">MIZINE<i>.</i></span>
            </div>
            <p className="footer-tagline">
              Estúdio Criativo de Video Making, Gestão Estratégica de Redes Sociais, Convites Digitais Interativos & Ecossistema Multimédia.
            </p>
          </div>

          <div className="uc-footer-cta-col">
            <span className="footer-cta-label">PRONTO PARA IMPULSIONAR A TUA MARCA?</span>
            <a href="#simulador" className="btn uc-btn-primary">
              <span>Simular Orçamento Online</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* 4 Column Links Grid */}
        <div className="uc-footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">NAVEGAÇÃO</h4>
            <ul>
              <li><a href="#topo">Início / Topo</a></li>
              <li><a href="#sobre">Manifesto & Métricas</a></li>
              <li><a href="#pilares">Pilares de Serviço</a></li>
              <li><a href="#trabalhos">Projetos em Destaque</a></li>
              <li><a href="#reels">Reels Verticais 4K</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">SUBDIVISÕES DO GRUPO</h4>
            <ul>
              <li><a href="https://instagram.com/mizine_celebrate" target="_blank" rel="noreferrer">Mizine Celebrate (Convites)</a></li>
              <li><a href="https://geek.mizine.co.mz" target="_blank" rel="noreferrer">Geek Ever (Tech & Apps)</a></li>
              <li><a href="#grupo">Studio 8 (Som & Áudio)</a></li>
              <li><a href="https://www.instagram.com/mizine_8" target="_blank" rel="noreferrer">Mizine Academy (Workshops)</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">DIRETO & SUPORTE</h4>
            <ul>
              <li><a href={`mailto:${hero.contactEmail || 'support@mizine.co.mz'}`}>{hero.contactEmail || 'support@mizine.co.mz'}</a></li>
              <li><a href={hero.whatsappUrl || 'https://wa.me/258840000000'} target="_blank" rel="noreferrer">{hero.whatsappNumber || '+258 84 000 0000'}</a></li>
              <li><a href={hero.instagramUrl || 'https://www.instagram.com/mizine_8'} target="_blank" rel="noreferrer">{hero.instagramHandle || '@mizine_8'}</a></li>
              <li><span>Maputo, Moçambique</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">PADRÕES & TÉCNICA</h4>
            <ul>
              <li><span className="tech-badge">4K / 6K DCI CINEMA</span></li>
              <li><span className="tech-badge">ALTA RETENÇÃO 3S</span></li>
              <li><span className="tech-badge">RSVP CONVITES LUXO</span></li>
              <li><span className="tech-badge">ENTREGA PONTUAL 100%</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="uc-footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} Mizine Multimédia. Todos os direitos reservados.
          </div>

          <div className="footer-bottom-actions">
            <span className="system-status">SYS // OPERATIONAL</span>
            <a href="/admin" className="admin-access-link" title="Área Restrita">
              [ ADMIN ]
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
