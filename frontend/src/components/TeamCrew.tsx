import React, { useState } from 'react';

/**
 * A EQUIPA — continuação do capítulo do fundador:
 * por trás da câmara (Moisés) → por trás do código (Américo) → quem fez a ideia existir (Jorge).
 * Fotos em /media/team/*.jpg; sem foto, mostra as iniciais.
 */
const CREW = [
  { id: 'moises', name: 'Moisés Mabunda', role: 'Fundador & Director Criativo', line: 'Por trás da câmara', text: 'Dá forma a cada história: direcção, imagem e montagem.', photo: '/media/team/moises.jpg', pos: '50% 18%' },
  { id: 'americo', name: 'Américo Mabunda', role: 'Desenvolvimento & Tecnologia', line: 'Por trás do código', text: 'Constrói as plataformas e a experiência digital do grupo.', photo: '/media/team/americo.jpg', pos: '50% 22%' },
  { id: 'jorge', name: 'Jorge Mabunda', role: 'Director Executivo', line: 'Quem fez a ideia existir', text: 'Incentivou tudo desde o primeiro dia e garante que a visão se cumpre.', photo: '/media/team/jorge.jpg', pos: '50% 20%' }
];

const Portrait: React.FC<{ src: string; name: string; pos: string }> = ({ src, name, pos }) => {
  const [ok, setOk] = useState(true);
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('');
  return ok ? (
    <img src={src} alt={name} loading="lazy" style={{ objectPosition: pos }} onError={() => setOk(false)} />
  ) : (
    <span className="crew-initials" aria-label={name}>{initials}</span>
  );
};

export const TeamCrew: React.FC = () => (
  <div className="crew wrap">
    <div className="crew-head reveal-up">
      <span className="why2-kicker">A EQUIPA</span>
      <h2>
        Uma família.<br />
        <span className="text-red">Três papéis.</span>
      </h2>
    </div>
    <div className="crew-grid">
      {CREW.map((c, i) => (
        <article key={c.id} className="crew-card reveal-up" style={{ transitionDelay: `${i * 90}ms` }}>
          <div className="crew-photo">
            <Portrait src={c.photo} name={c.name} pos={c.pos} />
            <span className="crew-corners" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="crew-line">{String(i + 1).padStart(2, '0')} • {c.line}</span>
          </div>
          <h3>{c.name}</h3>
          <span className="crew-role">{c.role}</span>
          <p>{c.text}</p>
        </article>
      ))}
    </div>
  </div>
);
