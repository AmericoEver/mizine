import React from 'react';
import { GroupCompany } from '../types';

interface GroupProps {
  companies: GroupCompany[];
}

export const Group: React.FC<GroupProps> = ({ companies }) => {
  return (
    <section className="group" id="grupo">
      <div className="wrap">
        <div className="head">
          <h2>Parte do grupo Mizine</h2>
        </div>
        <p className="intro">
          A Mizine é uma das empresas do Grupo Mizine. Conheça as outras.
        </p>

        <div className="gcards">
          {companies.map((company) => (
            <div key={company.id} className="gc">
              <div>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
              </div>
              <a
                className="btn red"
                href={company.linkUrl}
                target={company.linkUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
              >
                {company.buttonText || 'Visitar'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

