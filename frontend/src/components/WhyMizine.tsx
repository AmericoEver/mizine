import React from 'react';

const POINTS = [
  { code: '01', title: 'Um único interlocutor', desc: 'Do roteiro à captação, cor, áudio e entrega. Sem coordenar cinco freelancers, sem passagens de testemunho.' },
  { code: '02', title: 'Olhar e equipamento de cinema', desc: 'Câmaras 4K/6K, lentes cine, luz e pós-produção broadcast — para a tua marca parecer internacional.' },
  { code: '03', title: 'Retenção nos primeiros 3 segundos', desc: 'Desenhamos ganchos visuais que param o scroll e transformam espectadores em clientes.' },
  { code: '04', title: 'Prazos sagrados', desc: 'Um dia de atraso estraga um lançamento. O calendário acordado é uma garantia, não uma estimativa.' }
];

const STATS = [
  { value: '+150', label: 'Produções entregues' },
  { value: '100%', label: 'Entregas no prazo' },
  { value: '+5M', label: 'Visualizações orgânicas' },
  { value: '13+', label: 'Marcas que confiam em nós' }
];

export const WhyMizine: React.FC = () => {
  return (
    <section className="why2-section" id="porque">
      {/* saída do buraco negro: o universo escuro abre-se para a luz do dia */}
      <div className="why2-exit" aria-hidden="true">
        <span className="why2-exit-label">SAÍDA DO HORIZONTE • REGRESSO A MAPUTO ☀️</span>
      </div>

      <div className="wrap">
        <div className="why2-grid">
          <div className="why2-statement reveal-up">
            <span className="why2-kicker">PORQUÊ A MIZINE</span>
            <h2>
              Criamos media.<br />
              <span className="text-red">Assumimos o resultado.</span>
            </h2>
            <p>Uma equipa, um ponto de contacto, nenhuma passagem de testemunho. Construído para marcas e eventos que não podem arriscar amadorismo ou atrasos.</p>
            <a href="#contacto" className="why2-cta">
              Fala connosco <span>→</span>
            </a>
          </div>

          <ol className="why2-list reveal-up">
            {POINTS.map(p => (
              <li key={p.code}>
                <span className="why2-code">{p.code}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="why2-stats reveal-up">
          {STATS.map(s => (
            <div key={s.label} className="why2-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
