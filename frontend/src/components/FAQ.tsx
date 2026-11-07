import React, { useState } from 'react';
import { FaqItem } from '../types';

interface FAQProps {
  items?: FaqItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items = [] }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq2-section" id="faq">
      <div className="wrap faq2-grid">
        <div className="faq2-head reveal-up">
          <span className="why2-kicker">FAQ</span>
          <h2>Perguntas frequentes.</h2>
          <p>
            Não encontras a resposta? <a href="#contacto">Escreve-nos</a> — respondemos em menos de 2 horas.
          </p>
        </div>
        <div className="faq2-list reveal-up">
          {items.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.id} className={`faq2-item ${isOpen ? 'is-open' : ''}`}>
                <button type="button" onClick={() => setOpen(isOpen ? null : idx)} aria-expanded={isOpen}>
                  <span>{item.question}</span>
                  <i aria-hidden="true" />
                </button>
                <div className="faq2-body">
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
