import React, { useState } from 'react';
import { HeroContent } from '../types';
import { Icon } from './Icon';
import { apiService } from '../services/api';

interface ContactProps {
  hero: HeroContent;
}

export const Contact: React.FC<ContactProps> = ({ hero }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Video Making & Cinema',
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
        projectType: 'Video Making & Cinema',
        message: ''
      });
    } catch {
      setStatus('Erro ao enviar. Por favor contacte-nos directamente pelo WhatsApp ou Email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = ['Video Making & Cinema', 'Redes Sociais & Reels', 'Cobertura de Evento', 'Convites (Celebrate)', 'Design & Branding', 'Outro'];
  const wa = hero.whatsappUrl || 'https://wa.me/258840000000';
  const email = hero.contactEmail || 'support@mizine.co.mz';
  const channels = [
    { icon: 'chat' as const, label: 'WhatsApp', value: hero.whatsappNumber || '+258 84 000 0000', href: wa, ext: true },
    { icon: 'mail' as const, label: 'Email', value: email, href: `mailto:${email}`, ext: false },
    { icon: 'instagram' as const, label: 'Instagram', value: hero.instagramHandle || '@mizine_8', href: hero.instagramUrl || 'https://www.instagram.com/mizine_8', ext: true },
    { icon: 'pin' as const, label: 'Estúdio', value: 'Maputo, Moçambique', href: '#topo', ext: false }
  ];

  return (
    <section className="ct-section" id="contacto">
      <div className="wrap ct-grid">
        <div className="ct-left reveal-up">
          <span className="why2-kicker">CONTACTO</span>
          <h2>
            Vamos filmar<br />
            <span>a tua história.</span>
          </h2>
          <p className="ct-lead">Conta-nos o projecto. Respondemos em menos de 2 horas, de segunda a sábado.</p>
          <div className="ct-channels">
            {channels.map(c => (
              <a key={c.label} href={c.href} target={c.ext ? '_blank' : undefined} rel="noreferrer" className="ct-channel">
                <Icon name={c.icon} size={18} />
                <span className="ct-channel-label">{c.label}</span>
                <span className="ct-channel-value">{c.value}</span>
                <Icon name="arrow-up-right" size={16} className="ct-channel-go" />
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ct-form reveal-up">
          <span className="ct-form-tag">● REC • BRIEF DO PROJECTO</span>
          <label className="ct-field">
            <span>Nome ou empresa</span>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Carlos Mondlane / Empresa X" required />
          </label>
          <label className="ct-field">
            <span>Email</span>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="contacto@empresa.co.mz" required />
          </label>
          <div className="ct-field">
            <span>O que precisas?</span>
            <div className="ct-pills" role="radiogroup">
              {services.map(sv => (
                <button
                  type="button"
                  key={sv}
                  role="radio"
                  aria-checked={formData.projectType === sv}
                  className={`ct-pill ${formData.projectType === sv ? 'is-on' : ''}`}
                  onClick={() => setFormData({ ...formData, projectType: sv })}
                >
                  {sv}
                </button>
              ))}
            </div>
          </div>
          <label className="ct-field">
            <span>Sobre o projecto</span>
            <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Objectivo, datas, local e o que imaginas…" required />
          </label>
          <button type="submit" disabled={isSubmitting} className="ct-submit">
            <span>{isSubmitting ? 'A enviar…' : 'Enviar brief'}</span>
            <Icon name="arrow" size={18} />
          </button>
          {status && <div className={`ct-status ${status.includes('Erro') ? 'is-error' : ''}`}>{status}</div>}
        </form>
      </div>
    </section>
  );
};
