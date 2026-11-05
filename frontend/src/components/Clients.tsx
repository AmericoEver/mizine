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
    <section id="clientes" style={{ paddingTop: 0 }}>
      <div className="wrap head reveal-up">
        <h2>
          Com quem já <span className="r">trabalhámos</span>
        </h2>
        <span style={{ color: '#888', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Marcas, Parceiros & Produções
        </span>
      </div>

      {/* Marquee Dinâmico de Logotipos */}
      <div className="marq-logos reveal-fade" aria-label="Logotipos de Clientes">
        <div className="marq-track">
          {clients.concat(clients).map((c, i) => {
            const logo = getClientLogo(c);
            return (
              <div key={`${c.id}-${i}`} className="client-badge" title={c.name}>
                {logo ? (
                  <img
                    src={logo}
                    alt={c.name}
                    className="client-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="client-fallback">
                    <span className="client-dot">●</span>
                    <span className="client-text">{c.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grelha de Logotipos em Destaque */}
      <div className="wrap" style={{ marginTop: '36px' }}>
        <div className="clients-grid reveal-up">
          {clients.map((c) => {
            const logo = getClientLogo(c);
            return (
              <div key={c.id} className="client-grid-card" title={c.name}>
                {logo ? (
                  <img
                    src={logo}
                    alt={c.name}
                    className="client-grid-img"
                    loading="lazy"
                  />
                ) : (
                  <span className="client-grid-name">{c.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Testemunhos com Efeito de Revelação */}
      <div className="wrap quotes reveal-up" style={{ marginTop: '54px' }}>
        {testimonials.map((item, idx) => (
          <blockquote key={item.id} className="testimonial-card" style={{ animationDelay: `${idx * 0.15}s` }}>
            <div className="quote-mark">“</div>
            <p>{item.quote.replace(/^[“"']|[”"']$/g, '')}</p>
            <cite>
              <span className="cite-author">{item.author}</span>
              <span className="cite-company">{item.company}</span>
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
