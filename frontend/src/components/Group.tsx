import React from 'react';
import { GroupCompany } from '../types';

interface GroupProps {
  companies: GroupCompany[];
}

export const Group: React.FC<GroupProps> = ({ companies }) => {
  return (
    <section className="group2-section" id="grupo">
      <div className="wrap">
        <div className="group2-head reveal-up">
          <span className="why2-kicker">GRUPO MIZINE</span>
          <h2>
            Além do vídeo.<br />
            <span className="text-red">Um ecossistema completo.</span>
          </h2>
        </div>
        <div className="group2-list reveal-up">
          {companies.map((c, i) => (
            <a
              key={c.id}
              className="group2-row"
              href={c.linkUrl}
              target={c.linkUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
            >
              <span className="group2-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="group2-name">{c.name}</span>
              <span className="group2-desc">{c.description}</span>
              <span className="group2-go">{c.buttonText || 'Conhecer'} ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
