import { SiteContent, ContactMessage } from '../types';
import { defaultContent } from '../data/defaultContent';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiService = {
  // Pega todo o conteúdo da landing page
  async getContent(): Promise<SiteContent> {
    try {
      const res = await fetch(`${API_BASE}/content`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Falha ao obter conteúdo da API');
      const data = await res.json();
      if (data && data.hero) {
        localStorage.setItem('mizine_content_cache', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('API não respondeu, usando cache ou padrão:', err);
    }

    const cached = localStorage.getItem('mizine_content_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    return defaultContent;
  },

  // Envia formulário de contacto
  async sendContact(data: { name: string; email: string; projectType: string; message: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Erro ao enviar mensagem');
      return { success: true, message: json.message || 'Mensagem enviada com sucesso!' };
    } catch {
      // Salva localmente se offline ou em fallback
      const stored = JSON.parse(localStorage.getItem('mizine_offline_msgs') || '[]');
      stored.unshift({
        id: Date.now(),
        ...data,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mizine_offline_msgs', JSON.stringify(stored));
      return {
        success: true,
        message: 'Mensagem registada com sucesso!'
      };
    }
  },

  // Autenticação Admin
  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('mizine_admin_token', data.token);
        return { success: true, token: data.token };
      }
      if (res.status === 429) return { success: false, error: 'Demasiadas tentativas. Aguarda um minuto.' };
      return { success: false, error: 'Senha incorrecta.' };
    } catch {
      return { success: false, error: 'Sem ligação ao servidor. Tenta novamente.' };
    }
  },

  logout(): void {
    localStorage.removeItem('mizine_admin_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('mizine_admin_token');
  },

  // Salvar todo o conteúdo via Admin
  async saveFullContent(content: SiteContent): Promise<boolean> {
    const token = localStorage.getItem('mizine_admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        localStorage.setItem('mizine_content_cache', JSON.stringify(content));
        return true;
      }
      if (res.status === 401) this.logout();
    } catch {
      // sem ligação: NÃO fingir sucesso — o painel avisa que nada foi publicado
    }
    return false;
  },

  // Obter mensagens de contacto para o Admin
  async getMessages(): Promise<ContactMessage[]> {
    const token = localStorage.getItem('mizine_admin_token');
    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // fallback
    }
    const stored = JSON.parse(localStorage.getItem('mizine_offline_msgs') || '[]');
    return stored;
  },

  // Deletar mensagem
  async deleteMessage(id: number | string): Promise<boolean> {
    const token = localStorage.getItem('mizine_admin_token');
    const stored = JSON.parse(localStorage.getItem('mizine_offline_msgs') || '[]');
    localStorage.setItem('mizine_offline_msgs', JSON.stringify(stored.filter((m: ContactMessage) => m.id !== id)));
    try {
      const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) this.logout();
      return res.ok;
    } catch {
      return false;
    }
  },

  // Upload de imagem/capa a partir do computador (PC)
  async uploadFile(file: File): Promise<{ success: boolean; url: string; error?: string }> {
    const token = localStorage.getItem('mizine_admin_token');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        return { success: true, url: data.url };
      }
      if (res.status === 401) {
        this.logout();
        return { success: false, url: '', error: 'Sessão expirada. Entra novamente.' };
      }
      return { success: false, url: '', error: data.message || 'Formato não suportado (JPG, PNG, WEBP, GIF, MP4, MOV).' };
    } catch {
      return { success: false, url: '', error: 'Sem ligação ao servidor.' };
    }
  }
};

