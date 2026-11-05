import React from 'react';
import { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  // Converte títulos com quebras de linha se existirem
  const lines = content.title.split('\n');

  return (
    <header className="hero" id="topo">
      <div className="wrap">
        <h1>
          {lines.length > 1 ? (
            lines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < lines.length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            <>
              Mizine<br />Produção
            </>
          )}
        </h1>
        <p>{content.tagline}</p>
      </div>
    </header>
  );
};

