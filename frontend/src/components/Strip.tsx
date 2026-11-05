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

      <div className="v">
        <button
          className="play"
          aria-label="Ver showreel"
          onClick={() => onPlayShowreel('Showreel Mizine', content.showreelVideoUrl)}
        />
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

