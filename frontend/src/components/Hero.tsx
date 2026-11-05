import React from 'react';
import { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const hasCover = Boolean(content.coverImageUrl);

  return (
    <header
      className={`hero ${hasCover ? 'has-custom-cover' : ''}`}
      id="topo"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505'
      }}
    >
      {hasCover && (
        <img
          src={content.coverImageUrl}
          alt="Capa Mizine Produção"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1
          }}
        />
      )}

      {/* Degradê cinematográfico para fundir com a navegação no topo e com a secção seguinte na base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hasCover
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.95) 95%, #000000 100%)'
            : undefined,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />
    </header>
  );
};
