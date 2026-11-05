import React from 'react';
import { TeamMember } from '../types';

interface TeamProps {
  team: TeamMember[];
}

export const Team: React.FC<TeamProps> = ({ team }) => {
  return (
    <section id="equipa" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head">
          <h2>
            A <span className="r">equipa</span>
          </h2>
        </div>
        <div className="team">
          {team.map((member) => (
            <div key={member.id} className="person">
              <div className="ph">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} />
                ) : (
                  member.initial || member.name.charAt(0) || 'M'
                )}
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

