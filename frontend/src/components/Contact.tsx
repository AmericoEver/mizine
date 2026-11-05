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
    projectType: 'Reels e vídeos curtos',
    message: ''
  });
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('A enviar mensagem...');

    try {
      const result = await apiService.sendContact(formData);
      setStatus(result.message || 'Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      setFormData({
        name: '',
        email: '',
        projectType: 'Reels e vídeos curtos',
        message: ''
      });
    } catch {
      setStatus('Erro ao enviar. Por favor contacte-nos directamente pelo WhatsApp ou Email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contacto">
      <div className="wrap">
        <h2>
          Vamos criar<br />algo <span className="r">juntos</span>
        </h2>

        <div className="cwrap">
          <form id="f" onSubmit={handleSubmit}>
            <input
              name="n"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="O seu nome"
              required
              aria-label="Nome"
            />
            <input
              name="e"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              required
              aria-label="Email"
            />
            <select
              name="t"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              aria-label="Tipo de projeto"
            >
              <option value="Reels e vídeos curtos">Reels e vídeos curtos</option>
              <option value="Vídeo comercial">Vídeo comercial</option>
              <option value="Cobertura de evento">Cobertura de evento</option>
              <option value="Outro">Outro</option>
            </select>
            <textarea
              name="m"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Conte-nos sobre o projeto"
              required
              aria-label="Mensagem"
            />
            <button className="btn red" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'A enviar...' : 'Enviar mensagem'}
            </button>
            <div className="ok" id="ok" role="status">
              {status}
            </div>
          </form>

          <div className="dir">
            <a href={hero.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
              <small>[{hero.whatsappNumber}]</small>
            </a>
            <a href={hero.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
              <small>[{hero.instagramHandle}]</small>
            </a>
            <a href={`mailto:${hero.contactEmail}`}>
              Email
              <small>[{hero.contactEmail}]</small>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

