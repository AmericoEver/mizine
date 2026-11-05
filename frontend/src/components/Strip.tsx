import React from 'react';
import { HeroContent } from '../types';

interface StripProps {
  content: HeroContent;
  onPlayShowreel: (title: string, videoUrl: string) => void;
}

export const Strip: React.FC<StripProps> = ({ content, onPlayShowreel }) => {
  const intentLines = content.intentTitle.split('\n');

  return (
    <div className="strip">
      <div className="w">
        <b>{content.bannerDate}</b>
        <small>{content.bannerTitle}</small>
        <span style={{ fontSize: '13px' }}>{content.bannerDescription}</span>
      </div>

      <div className="v" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button
          className="play"
          aria-label="Ver showreel"
          onClick={() => onPlayShowreel('Showreel Mizine', content.showreelVideoUrl)}
        />
        <div style={{
          marginTop: '10px',
          fontFamily: 'Anton, sans-serif',
          fontSize: '11px',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase',
          pointerEvents: 'none'
        }}>
          VER SHOWREEL
        </div>
      </div>

      <div className="b">
        <h3>
          {intentLines.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < intentLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h3>
        <span style={{ fontSize: '13px' }}>{content.intentSubtitle}</span>
      </div>
    </div>
  );
};

