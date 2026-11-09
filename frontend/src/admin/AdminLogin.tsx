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
    if (res.success) onSuccess();
    else setError(res.error || 'Senha incorrecta.');
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={handleSubmit}>
        <div className="adm-brand">
          MIZINE<i>.</i> <small>ADMIN</small>
        </div>
        <p>Área reservada à equipa Mizine.</p>
        <label className="adm-field">
          <span className="adm-label">Senha</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus autoComplete="current-password" />
        </label>
        {error && <div className="adm-error">{error}</div>}
        <button type="submit" className="adm-btn primary" disabled={loading}>
          {loading ? 'A verificar…' : 'Entrar'}
        </button>
        <button type="button" className="adm-link" onClick={onCancel}>
          Voltar ao site
        </button>
      </form>
    </div>
  );
};
