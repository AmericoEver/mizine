import React from 'react';
import { ClientItem, TestimonialItem } from '../types';

interface ClientsProps {
  clients: ClientItem[];
  testimonials: TestimonialItem[];
}

const DEFAULT_LOGOS: Record<string, string> = {
  'GEEK EVER': '/media/clients/geek-ever.svg',
  'MIZINE CELEBRATE': '/media/clients/mizine-celebrate.svg',
  'MAPUTO CREATIVE': '/media/clients/maputo-creative.svg',
  'STUDIO 8': '/media/clients/studio-8.svg',
  'VALOR DIGITAL': '/media/clients/valor-digital.svg',
  'BRAND MZ': '/media/clients/brand-mz.svg',
  'XAI ART': '/media/clients/xai-art.svg',
};

const getClientLogo = (c: ClientItem): string => {
  if (c.logoUrl && c.logoUrl.trim() !== '') return c.logoUrl;
  const key = (c.name || '').trim().toUpperCase();
  return DEFAULT_LOGOS[key] || '';
};

export const Clients: React.FC<ClientsProps> = ({ clients, testimonials }) => {
  return (
    <section className="uc-clients-section" id="clientes" style={{ paddingTop: 0 }}>
      <div className="wrap uc-section-header reveal-up">
        <div className="uc-meta-tag">
          <span className="meta-bracket">[</span>
          <span className="meta-index">PARCEIROS</span>
          <span className="meta-bracket">]</span>
          <span className="meta-sep">•</span>
          <span className="meta-title">RELAÇÕES DE CONFIANÇA & MARCAS</span>
        </div>
        <h2 className="uc-section-title">
          Com quem já <span className="text-red">trabalhámos.</span>
        </h2>
        <p className="uc-section-desc">
          Empresas, marcas líderes e eventos exclusivos que confiaram a sua imagem e momentos à Mizine Multimédia.
        </p>
      </div>

      {/* Infinite Logo Marquee */}
      <div className="uc-marquee-wrap reveal-fade" aria-label="Logotipos de Clientes">
        <div className="uc-marquee-track">
          {clients.concat(clients).map((c, i) => {
            const logo = getClientLogo(c);
            return (
              <div key={`${c.id}-${i}`} className="uc-marquee-badge" title={c.name}>
                {logo ? (
                  <img
                    src={logo}
                    alt={c.name}
                    className="uc-marquee-logo"
                    loading="lazy"
                  />
                ) : (
                  <div className="uc-marquee-fallback">
                    <span className="fallback-dot">●</span>
                    <span className="fallback-text">{c.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Contrast Partner Grid */}
      <div className="wrap" style={{ marginTop: '36px' }}>
        <div className="uc-partners-grid reveal-up">
          {clients.map((c) => {
            const logo = getClientLogo(c);
            return (
              <div key={c.id} className="uc-partner-tile" title={c.name}>
                {logo ? (
                  <img
                    src={logo}
                    alt={c.name}
                    className="uc-partner-tile-logo"
                    loading="lazy"
                  />
                ) : (
                  <span className="uc-partner-tile-text">{c.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Block */}
      <div className="wrap" style={{ marginTop: '64px' }}>
        <div className="uc-testimonials-grid reveal-up">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="uc-testimonial-card">
              <div className="testimonial-quotes-sign">“</div>
              <p className="testimonial-quote-text">{item.quote.replace(/^[“"']|[”"']$/g, '')}</p>
              <cite className="testimonial-author-block">
                <span className="author-name">{item.author}</span>
                <span className="author-company">{item.company}</span>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};
