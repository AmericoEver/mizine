import React from 'react';
import { DotMap } from './DotMap';
import { FooterWordmark } from './FooterWordmark';
import { HeroContent } from '../types';

interface FooterProps {
  hero: HeroContent;
}

export const Footer: React.FC<FooterProps> = ({ hero }) => {
  const email = hero.contactEmail || 'support@mizine.co.mz';
  return (
    <footer className="footer2">
      <div className="footer2-mapwrap">
        <DotMap />
        <div className="wrap footer2-loop">
          <span className="footer2-kicker">● MAPUTO [HQ] • 25°58′S 32°35′E</span>
          <p>Tudo começa connosco.<br /><span>E termina connosco.</span></p>
          <a href="#topo" className="footer2-top">Voltar ao espaço ↑</a>
        </div>
      </div>

      <div className="wrap footer2-cols">
        <div className="footer2-brand">
          <span className="footer2-logo">MIZINE<i>.</i></span>
          <p>Estúdio criativo de video making, gestão de redes sociais, convites digitais e ecossistema multimédia. Maputo, Moçambique.</p>
        </div>
        <div>
          <h4>Navegar</h4>
          <a href="#topo">Início</a>
          <a href="#sobre">Fundadores</a>
          <a href="#pilares">Serviços</a>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#reels">Reels</a>
        </div>
        <div>
          <h4>Grupo</h4>
          <a href="https://instagram.com/mizine_celebrate" target="_blank" rel="noreferrer">Mizine Celebrate</a>
          <a href="https://geek.mizine.co.mz" target="_blank" rel="noreferrer">Geek Ever</a>
          <a href="#grupo">Studio 8</a>
          <a href="https://www.instagram.com/mizine_8" target="_blank" rel="noreferrer">Mizine Academy</a>
        </div>
        <div>
          <h4>Contacto</h4>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={hero.whatsappUrl || 'https://wa.me/258840000000'} target="_blank" rel="noreferrer">{hero.whatsappNumber || '+258 84 000 0000'}</a>
          <a href={hero.instagramUrl || 'https://www.instagram.com/mizine_8'} target="_blank" rel="noreferrer">{hero.instagramHandle || '@mizine_8'}</a>
          <span>Seg–Sex • 08:00–18:00</span>
        </div>
      </div>

      <FooterWordmark />

      <div className="wrap footer2-bottom">
        <span>© {new Date().getFullYear()} Mizine Multimédia. Todos os direitos reservados.</span>
        <span className="footer2-status">MAPUTO • MOÇAMBIQUE</span>
        <a href="/admin" className="footer2-admin">Admin</a>
      </div>
    </footer>
  );
};
