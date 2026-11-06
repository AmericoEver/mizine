import React, { useState } from 'react';
import { HeroContent } from '../types';
import { apiService } from '../services/api';

interface ContactProps {
  hero: HeroContent;
}

export const Contact: React.FC<ContactProps> = ({ hero }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Video Making & Cinema Comercial',
    message: ''
  });
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('A enviar mensagem para a equipa criativa...');

    try {
      const result = await apiService.sendContact(formData);
      setStatus(result.message || 'Mensagem enviada com sucesso! Entraremos em contacto no próprio dia.');
      setFormData({
        name: '',
        email: '',
        projectType: 'Video Making & Cinema Comercial',
        message: ''
      });
    } catch {
      setStatus('Erro ao enviar. Por favor contacte-nos directamente pelo WhatsApp ou Email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="uc-contact-section" id="contacto">
      <div className="wrap">
        <div className="uc-section-header reveal-up">
          <div className="uc-meta-tag">
            <span className="meta-bracket">[</span>
            <span className="meta-index">CONTACTO</span>
            <span className="meta-bracket">]</span>
            <span className="meta-sep">•</span>
            <span className="meta-title">INICIAR UM NOVO PROJETO</span>
          </div>
          <h2 className="uc-section-title">
            Vamos criar algo memorável.<br />
            <span className="text-red">Fala connosco hoje.</span>
          </h2>
          <p className="uc-section-desc">
            Seja para um comercial de cinema, gestão contínua de redes sociais ou convites digitais exclusivos, estamos prontos para elevar a tua marca.
          </p>
        </div>

        <div className="uc-contact-grid reveal-up">
          {/* Form Column */}
          <div className="uc-contact-form-card">
            <form onSubmit={handleSubmit} className="uc-form">
              <div className="form-group">
                <label className="form-label">O SEU NOME OU EMPRESA</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Carlos Mondlane / Empresa X"
                  required
                  className="uc-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL CORPORATIVO OU PESSOAL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: contacto@suaempresa.co.mz"
                  required
                  className="uc-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">SERVIÇO OU PROJETO PRETENDIDO</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="uc-select"
                >
                  <option value="Video Making & Cinema Comercial">Video Making & Cinema Comercial (4K)</option>
                  <option value="Gestão de Redes Sociais & Reels">Gestão de Redes Sociais & Pacote de Reels</option>
                  <option value="Mizine Celebrate (Convites Digitais)">Mizine Celebrate (Convites Digitais & Eventos)</option>
                  <option value="Cobertura de Evento VIP / Aftermovie">Cobertura de Evento VIP / Aftermovie</option>
                  <option value="Ecossistema Geek Ever (Tech + Vídeo)">Ecossistema Geek Ever (Tech + Vídeo)</option>
                  <option value="Outro Projeto Personalizado">Outro Projeto Personalizado</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DETALHES OU OBJETIVO DO PROJETO</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Conte-nos brevemente sobre a sua visão, datas de lançamento e necessidades específicas..."
                  required
                  className="uc-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn uc-btn-primary full-width"
              >
                <span>{isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}</span>
                <span className="btn-arrow">→</span>
              </button>

              {status && (
                <div className={`uc-form-alert ${status.includes('Erro') ? 'error' : 'success'}`}>
                  {status}
                </div>
              )}
            </form>
          </div>

          {/* Direct Details Column */}
          <div className="uc-contact-info-card">
            <h3 className="info-title">Canais Diretos de Produção</h3>
            <p className="info-desc">
              Prefere falar diretamente no WhatsApp com a nossa equipa criativa? Estamos operacionais de Segunda a Sábado.
            </p>

            <div className="info-items">
              <a
                href={hero.whatsappUrl || 'https://wa.me/258840000000'}
                target="_blank"
                rel="noreferrer"
                className="info-item-link highlight"
              >
                <span className="info-icon">💬</span>
                <div>
                  <div className="info-tag">WHATSAPP DIRETO</div>
                  <div className="info-val">{hero.whatsappNumber || '+258 84 000 0000'}</div>
                </div>
              </a>

              <a
                href={`mailto:${hero.contactEmail || 'support@mizine.co.mz'}`}
                className="info-item-link"
              >
                <span className="info-icon">✉️</span>
                <div>
                  <div className="info-tag">EMAIL CORPORATIVO</div>
                  <div className="info-val">{hero.contactEmail || 'support@mizine.co.mz'}</div>
                </div>
              </a>

              <a
                href={hero.instagramUrl || 'https://www.instagram.com/mizine_8'}
                target="_blank"
                rel="noreferrer"
                className="info-item-link"
              >
                <span className="info-icon">📸</span>
                <div>
                  <div className="info-tag">INSTAGRAM OFICIAL</div>
                  <div className="info-val">{hero.instagramHandle || '@mizine_8'}</div>
                </div>
              </a>

              <div className="info-item-link">
                <span className="info-icon">📍</span>
                <div>
                  <div className="info-tag">LOCALIZAÇÃO</div>
                  <div className="info-val">Maputo, Moçambique • Atendimento Nacional & Internacional</div>
                </div>
              </div>
            </div>

            <div className="info-working-hours">
              <span className="hours-dot">●</span>
              <span>ESTÚDIO EM OPERAÇÃO • RESPOSTA MÉDIA: &lt; 2 HORAS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
