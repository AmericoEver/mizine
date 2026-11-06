import React from 'react';

export const WhyMizine: React.FC = () => {
  const points = [
    {
      code: '01',
      title: 'Um Único Interlocutor Criativo',
      desc: 'Sem necessidade de coordenar 5 freelancers diferentes. Assumimos toda a cadeia: do roteiro e captação à colorização, áudio e entrega final sem fricção.'
    },
    {
      code: '02',
      title: 'Equipamento & Olhar de Cinema',
      desc: 'Câmaras 4K/6K profissionais, lentes de cinema, iluminação avançada e pós-produção broadcast para que o seu produto pareça internacional.'
    },
    {
      code: '03',
      title: 'Psicologia de Retenção nos 3s',
      desc: 'Não fazemos apenas vídeos bonitos — desenhamos ganchos visuais para parar o scroll, reter a atenção nas redes sociais e converter espectadores em clientes.'
    },
    {
      code: '04',
      title: 'Cumprimento Sagrado de Prazos',
      desc: 'No audiovisual, um dia de atraso estraga um lançamento. Na Mizine, o calendário acordado é uma garantia irrevogável.'
    }
  ];

  return (
    <section className="uc-why-section" id="porque">
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">04/06</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">PORQUÊ A MIZINE MULTIMÉDIA</span>
          </div>
          <h2 className="uc-section-title">
            Criamos media.<br />
            <span className="text-red">Assumimos o resultado.</span>
          </h2>
          <p className="uc-section-desc">
            Construído para marcas e eventos que não podem arriscar amadorismo ou atrasos.
          </p>
        </div>

        <div className="uc-why-grid reveal-up">
          {points.map((p, idx) => (
            <div key={idx} className="uc-why-card">
              <div className="why-code">{p.code}</div>
              <h3 className="why-title">{p.title}</h3>
              <p className="why-desc">{p.desc}</p>
              <div className="why-corner-accent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
