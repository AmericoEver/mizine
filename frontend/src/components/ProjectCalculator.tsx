import React, { useState } from 'react';
import { HeroContent } from '../types';

interface ProjectCalculatorProps {
  heroContent: HeroContent;
}

export const ProjectCalculator: React.FC<ProjectCalculatorProps> = ({ heroContent }) => {
  const [selectedService, setSelectedService] = useState<'video' | 'reels' | 'celebrate' | 'group'>('video');
  const [tier, setTier] = useState<'standard' | 'pro' | 'master'>('pro');
  const [extras, setExtras] = useState<string[]>(['drone']);

  const toggleExtra = (key: string) => {
    if (extras.includes(key)) {
      setExtras(extras.filter((k) => k !== key));
    } else {
      setExtras([...extras, key]);
    }
  };

  const serviceLabels = {
    video: 'Video Making & Cinema Comercial (4K)',
    reels: 'Pacote de Reels & Gestão de Redes Sociais',
    celebrate: 'Mizine Celebrate (Convites Digitais & Eventos)',
    group: 'Ecossistema Multimédia Completo (Geek Ever + Produção)'
  };

  const tierDetails = {
    video: {
      standard: { name: 'Comercial Direto (30s)', desc: '1 dia de captação, edição dinâmica e entrega em 4K', est: 'Sob Consulta' },
      pro: { name: 'Campanha de Marca (60s)', desc: 'Roteiro, captação 4K com luz de cinema e pós-produção broadcast', est: 'Mais Popular' },
      master: { name: 'Produção Completa / Aftermovie VIP', desc: 'Múltiplas câmaras, drone 4K, edição sonora e teasers imediatos', est: 'Produção de Luxo' }
    },
    reels: {
      standard: { name: 'Starter Pack (4 Reels / Mês)', desc: 'Captação mensal concentrada e edição vertical para parar o scroll', est: 'Mensal' },
      pro: { name: 'Growth Pack (8 Reels / Mês)', desc: 'Estratégia de ganchos de 3s, edição diária e análise de retenção', est: 'Mais Recomendado' },
      master: { name: 'Scale Viral (16 Reels / Mês)', desc: 'Produção semanal contínua, cobertura de bastidores e viralidade', est: 'Escala Total' }
    },
    celebrate: {
      standard: { name: 'Convite Digital Interativo', desc: 'Design exclusivo, contagem decrescente, mapa GPS e música', est: 'Digital' },
      pro: { name: 'Convite + Confirmação RSVP Online', desc: 'Gestão de convidados, painel de presenças e convite animado', est: 'Mais Escolhido' },
      master: { name: 'Celebrate VIP (Convite + Cobertura Vídeo)', desc: 'Convite interativo completo + captação de cinema no dia do evento', est: 'Experiência VIP' }
    },
    group: {
      standard: { name: 'Web Landing Page Geek Ever + Vídeo', desc: 'Website moderno e responsivo integrado com vídeo institucional', est: 'Tech & Media' },
      pro: { name: 'Plataforma Completa + Pacote Social', desc: 'Website avançado, catálogo online e produção de reels', est: 'E-commerce / App' },
      master: { name: 'Transformação Digital & Multimédia Total', desc: 'Ecossistema corporativo completo com suporte contínuo', est: 'Enterprise' }
    }
  };

  const currentTier = tierDetails[selectedService][tier];

  // Gera link dinâmico de WhatsApp pré-formatado
  const generateWhatsAppUrl = () => {
    const rawNumber = (heroContent.whatsappNumber || '+258840000000').replace(/[^0-9]/g, '');
    const serviceName = serviceLabels[selectedService];
    const tierName = currentTier.name;
    const extrasNames = extras.length > 0 ? extras.join(', ') : 'Nenhum extra selecionado';

    const message = `Olá Mizine Multimédia! 👋\n\nFiz uma simulação no vosso site:\n• Serviço: ${serviceName}\n• Pacote: ${tierName}\n• Extras Selecionados: ${extrasNames}\n\nGostaria de receber uma proposta e verificar disponibilidade de datas!`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="uc-calculator-section" id="simulador">
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">SIMULADOR</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">SIMULADOR INTERATIVO DE PROJETOS</span>
          </div>
          <h2 className="uc-section-title">
            Configura o teu projeto em tempo real.<br />
            <span className="text-red">Sem surpresas, com total transparência.</span>
          </h2>
          <p className="uc-section-desc">
            Escolhe o setor que pretendes impulsionar e obtém um brief estruturado para falar diretamente com a nossa equipa de direção criativa.
          </p>
        </div>

        <div className="uc-calc-box reveal-up">
          {/* Step 1: Escolha do Serviço */}
          <div className="calc-step">
            <div className="step-label">
              <span className="step-num">PASSO 01</span>
              <span>SELECIONA O SETOR PRINCIPAL</span>
            </div>
            <div className="service-tabs-grid">
              {[
                { id: 'video', label: 'Video Making (Cinema 4K)', icon: '🎬' },
                { id: 'reels', label: 'Gestão de Redes Sociais & Reels', icon: '📱' },
                { id: 'celebrate', label: 'Mizine Celebrate (Convites)', icon: '✨' },
                { id: 'group', label: 'Ecossistema Multimédia (Tech + Vídeo)', icon: '⚡' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`service-tab-btn ${selectedService === s.id ? 'active' : ''}`}
                  onClick={() => setSelectedService(s.id as any)}
                >
                  <span className="tab-icon">{s.icon}</span>
                  <span className="tab-text">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Nível do Pacote */}
          <div className="calc-step" style={{ marginTop: '28px' }}>
            <div className="step-label">
              <span className="step-num">PASSO 02</span>
              <span>DIMENSÃO & FORMATO DE ENTREGA</span>
            </div>
            <div className="tier-cards-grid">
              {(['standard', 'pro', 'master'] as const).map((t) => {
                const info = tierDetails[selectedService][t];
                const isSelected = tier === t;
                return (
                  <div
                    key={t}
                    className={`tier-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setTier(t)}
                  >
                    <div className="tier-badge-row">
                      <span className="tier-code">{t.toUpperCase()}</span>
                      <span className="tier-est">{info.est}</span>
                    </div>
                    <h4 className="tier-name">{info.name}</h4>
                    <p className="tier-desc">{info.desc}</p>
                    <div className="tier-check">
                      <span>{isSelected ? '✓ Selecionado' : 'Selecionar'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Extras Opcionais */}
          <div className="calc-step" style={{ marginTop: '28px' }}>
            <div className="step-label">
              <span className="step-num">PASSO 03</span>
              <span>ADICIONAIS ESPECIAIS (OPCIONAL)</span>
            </div>
            <div className="extras-grid">
              {[
                { id: 'drone', label: 'Captação Aérea com Drone 4K', desc: 'Planos panorâmicos de alta resolução' },
                { id: 'express', label: 'Entrega Express (48 Horas)', desc: 'Prioridade máxima em ilha de edição' },
                { id: 'audio', label: 'Locução & Voz-off Profissional', desc: 'Voz institucional gravada em estúdio' },
                { id: 'multi', label: 'Exportação Multiformato (16:9 + 9:16)', desc: 'Adaptado para TV, YouTube e Reels' }
              ].map((extra) => {
                const isChecked = extras.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    className={`extra-pill ${isChecked ? 'active' : ''}`}
                    onClick={() => toggleExtra(extra.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="extra-title">{extra.label}</div>
                      <div className="extra-sub">{extra.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary & WhatsApp Action */}
          <div className="calc-summary-bar">
            <div className="summary-left">
              <div className="summary-tag">RESUMO DA SIMULAÇÃO:</div>
              <h3 className="summary-service-name">
                {serviceLabels[selectedService]} — <span className="text-red">{currentTier.name}</span>
              </h3>
              <p className="summary-extras-list">
                {extras.length > 0 ? `Adicionais: ${extras.length} extra(s) selecionado(s)` : 'Sem adicionais selecionados'}
              </p>
            </div>

            <div className="summary-right">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn uc-btn-whatsapp"
              >
                <span>Solicitar Proposta no WhatsApp</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

