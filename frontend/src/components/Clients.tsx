import React from 'react';
import { ClientItem, TestimonialItem } from '../types';

interface ClientsProps {
  clients: ClientItem[];
  testimonials: TestimonialItem[];
}

export const Clients: React.FC<ClientsProps> = ({ clients, testimonials }) => {
  return (
    <section id="clientes" style={{ paddingTop: 0 }}>
      <div className="wrap head">
        <h2>
          Com quem já <span className="r">trabalhámos</span>
        </h2>
      </div>

      <div className="marq" aria-label="Clientes">
        <div>
          {clients.map((c, i) => (
            <span key={`a-${c.id}-${i}`}>{c.name}</span>
          ))}
          {clients.map((c, i) => (
            <span key={`b-${c.id}-${i}`}>{c.name}</span>
          ))}
        </div>
      </div>

      <div className="wrap quotes">
        {testimonials.map((item) => (
          <blockquote key={item.id}>
            {item.quote}
            <cite>
              {item.author}, {item.company}
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

