import React from 'react';
import { AboutContent } from '../types';

interface AboutProps {
  content: AboutContent;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section className="approach" id="sobre">
      <div className="wrap">
        <div className="tag">
          {content.tagTitle}
          <p>{content.tagSubtitle}</p>
        </div>
        <div>
          <h2>
            Trabalhamos com clientes corajosos para criar <span className="r">experiências</span> que as pessoas sentem. Trabalho ousado pede uma <span className="r">abordagem</span> sem medo.
          </h2>
          <p className="sub">{content.subtext}</p>
        </div>
      </div>
    </section>
  );
};

