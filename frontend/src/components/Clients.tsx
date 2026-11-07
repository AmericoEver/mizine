import React from 'react';
import { ClientItem, TestimonialItem } from '../types';
import { CLIENT_BRANDS } from '../data/clientBrands';

interface ClientsProps {
  clients: ClientItem[];
  testimonials: TestimonialItem[];
}

export const Clients: React.FC<ClientsProps> = ({ testimonials }) => {
  return (
    <section className="clients2-section" id="clientes">
      <div className="wrap">
        <div className="clients2-head reveal-up">
          <span className="why2-kicker">CONFIANÇA</span>
          <h2>
            Marcas que já <span className="text-red">confiaram a sua história</span> à nossa câmara.
          </h2>
        </div>

        {/* parede de logos real (cinzento → cor ao passar o rato) */}
        <div className="clients2-wall reveal-up">
          {CLIENT_BRANDS.map(b => (
            <div key={b.name} className="clients2-logo" title={b.name}>
              {b.logo ? <img src={b.logo} alt={b.name} loading="lazy" /> : <span>{b.name}</span>}
              <small>{b.tag}</small>
            </div>
          ))}
          <a href="#contacto" className="clients2-logo clients2-next">
            <span>A tua marca aqui</span>
            <i>→</i>
          </a>
        </div>

        {testimonials.length > 0 && (
          <div className="clients2-quotes reveal-up">
            {testimonials.map(t => (
              <figure key={t.id} className="clients2-quote">
                <blockquote>“{t.quote.replace(/^[“"']|[”"']$/g, '')}”</blockquote>
                <figcaption>
                  <span className="clients2-avatar">{t.author.split(' ').map(s => s[0]).slice(0, 2).join('')}</span>
                  <span>
                    <strong>{t.author}</strong>
                    <small>{t.company}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
