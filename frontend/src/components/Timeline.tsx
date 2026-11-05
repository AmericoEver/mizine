import React from 'react';
import { TimelineItem } from '../types';

interface TimelineProps {
  timeline: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  return (
    <section id="percurso" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2>
            O nosso <span className="r">percurso</span>
          </h2>
        </div>
        <ul className="tl">
          {timeline.map((item) => (
            <li key={item.id}>
              <b>{item.yearLabel}</b>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

