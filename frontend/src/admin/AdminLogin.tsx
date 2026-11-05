import React, { useState } from 'react';
import { apiService } from '../services/api';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await apiService.login(password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError('Senha incorreta. Tente "mizine2026" ou a senha definida no backend.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at center, #1a0202 0%, #000 70%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0d0d0d',
        border: '1px solid var(--line)',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
            MIZINE<span style={{ color: 'var(--red)' }}>.</span> ADMIN
          </h2>
          <p style={{ color: 'var(--mute)', fontSize: '13px', margin: 0 }}>
            Aceda para gerir os conteúdos da plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a sua senha de administrador"
              required
              autoFocus
            />
          </div>

          {error && (
            <div style={{ color: 'var(--red)', fontSize: '12px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn red"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'A verificar...' : 'Entrar'}
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>

          <div style={{ marginTop: '14px', fontSize: '11px', color: '#666', textAlign: 'center' }}>
            Dica: senha padrão temporária é <code>mizine2026</code>
          </div>
        </form>
      </div>
    </div>
  );
};

