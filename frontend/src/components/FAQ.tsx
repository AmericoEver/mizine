import React, { useState } from 'react';
import { FaqItem } from '../types';

interface FAQProps {
  items?: FaqItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="uc-faq-section" id="faq">
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">06/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">DÚVIDAS FREQUENTES & PROCESSO</span>
          </div>
          <h2 className="uc-section-title">
            Perguntas Frequentes.<br />
            <span className="text-red">Tudo o que precisas de saber antes de começar.</span>
          </h2>
        </div>

        <div className="uc-faq-list reveal-up">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className={`uc-faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="uc-faq-trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-num">0{idx + 1}</span>
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="uc-faq-body">
                  <div className="faq-answer-inner">
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
