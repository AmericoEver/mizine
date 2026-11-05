import React, { useState, useEffect } from 'react';
import { SiteContent, ContactMessage, ReelItem, ProjectItem, ClientItem, TestimonialItem, TimelineItem, TeamMember, GroupCompany } from '../types';
import { apiService } from '../services/api';

interface AdminDashboardProps {
  initialContent: SiteContent;
  onClose: () => void;
  onContentUpdated: (updated: SiteContent) => void;
}

type TabType = 'hero' | 'about' | 'reels' | 'projects' | 'clients' | 'timeline' | 'team' | 'group' | 'messages';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialContent,
  onClose,
  onContentUpdated
}) => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const list = await apiService.getMessages();
    setMessages(list);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('A guardar alterações no backend...');
    const success = await apiService.saveFullContent(content);
    setIsSaving(false);
    if (success) {
      setSaveStatus('Guardado com sucesso!');
      onContentUpdated(content);
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('Erro ao guardar no backend. Alterações guardadas localmente.');
    }
  };

  const handleDeleteMessage = async (id: number | string) => {
    if (!confirm('Tem a certeza que deseja eliminar esta mensagem?')) return;
    await apiService.deleteMessage(id);
    setMessages(messages.filter((m) => m.id !== id));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'reel' | 'project', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSaveStatus('A carregar imagem do seu computador...');

    const res = await apiService.uploadFile(file);
    setIsUploading(false);

    if (res.success && res.url) {
      if (target === 'cover') {
        setContent((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            coverImageUrl: res.url
          }
        }));
        setSaveStatus('Capa carregada com sucesso! Clique em "Guardar Alterações" para aplicar.');
      } else if (target === 'reel' && typeof index === 'number') {
        const updated = [...content.reels];
        updated[index].imageUrl = res.url;
        setContent((prev) => ({ ...prev, reels: updated }));
        setSaveStatus('Capa do Reel carregada!');
      } else if (target === 'project' && typeof index === 'number') {
        const updated = [...content.projects];
        updated[index].imageUrl = res.url;
        setContent((prev) => ({ ...prev, projects: updated }));
        setSaveStatus('Capa do Projeto carregada!');
      }
      setTimeout(() => setSaveStatus(''), 4000);
    } else {
      setSaveStatus('Erro ao carregar o ficheiro: ' + (res.error || 'Falha no processamento'));
    }
  };

  // Funções de manipulação de listas
  const addReel = () => {
    const newReel: ReelItem = {
      id: Date.now(),
      title: `Reel ${content.reels.length + 1}`,
      subtitle: '[Cliente / ano]',
      artClass: 'a1',
      videoUrl: ''
    };
    setContent({ ...content, reels: [...content.reels, newReel] });
  };

  const removeReel = (id: number | string) => {
    setContent({ ...content, reels: content.reels.filter((r) => r.id !== id) });
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: Date.now(),
      title: 'Novo Projeto',
      description: 'Descrição do projeto.',
      isWide: false,
      artClass: 'a3',
      linkUrl: '#contacto'
    };
    setContent({ ...content, projects: [...content.projects, newProj] });
  };

  const removeProject = (id: number | string) => {
    setContent({ ...content, projects: content.projects.filter((p) => p.id !== id) });
  };

  const addClient = () => {
    const newClient: ClientItem = {
      id: Date.now(),
      name: `Cliente ${content.clients.length + 1}`
    };
    setContent({ ...content, clients: [...content.clients, newClient] });
  };

  const removeClient = (id: number | string) => {
    setContent({ ...content, clients: content.clients.filter((c) => c.id !== id) });
  };

  const addTestimonial = () => {
    const newT: TestimonialItem = {
      id: Date.now(),
      quote: '“Excelente trabalho e compromisso com o resultado.”',
      author: 'Novo Cliente',
      company: 'Empresa'
    };
    setContent({ ...content, testimonials: [...content.testimonials, newT] });
  };

  const removeTestimonial = (id: number | string) => {
    setContent({ ...content, testimonials: content.testimonials.filter((t) => t.id !== id) });
  };

  const addTimeline = () => {
    const newT: TimelineItem = {
      id: Date.now(),
      yearLabel: '2026',
      title: 'Nova Conquista',
      description: 'Descrição do marco alcançado.'
    };
    setContent({ ...content, timeline: [...content.timeline, newT] });
  };

  const removeTimeline = (id: number | string) => {
    setContent({ ...content, timeline: content.timeline.filter((t) => t.id !== id) });
  };

  const addTeamMember = () => {
    const newM: TeamMember = {
      id: Date.now(),
      name: 'Novo Membro',
      role: 'Função',
      initial: 'M'
    };
    setContent({ ...content, team: [...content.team, newM] });
  };

  const removeTeamMember = (id: number | string) => {
    setContent({ ...content, team: content.team.filter((m) => m.id !== id) });
  };

  const addGroupCompany = () => {
    const newG: GroupCompany = {
      id: Date.now(),
      name: 'Nova Empresa',
      description: 'Descrição de uma linha da empresa parceira.',
      buttonText: 'Visitar',
      linkUrl: '#'
    };
    setContent({ ...content, group: [...content.group, newG] });
  };

  const removeGroupCompany = (id: number | string) => {
    setContent({ ...content, group: content.group.filter((g) => g.id !== id) });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="wrap">
        {/* Barra superior do Admin */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '20px',
          marginBottom: '28px'
        }}>
          <div>
            <h1 style={{ fontSize: '38px', lineHeight: 1 }}>
              PAINEL DE <span className="r">ADMINISTRAÇÃO</span>
            </h1>
            <p style={{ color: 'var(--mute)', margin: '4px 0 0', fontSize: '14px' }}>
              Popule e edite todos os campos e conteúdos do site em tempo real
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saveStatus && (
              <span style={{ fontSize: '13px', color: saveStatus.includes('Erro') ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
                {saveStatus}
              </span>
            )}
            <button
              onClick={handleSave}
              className="btn red"
              disabled={isSaving}
            >
              {isSaving ? 'A guardar...' : 'Guardar Alterações'}
            </button>
            <button onClick={onClose} className="btn outline">
              Ver Site
            </button>
            <button
              onClick={() => {
                apiService.logout();
                onClose();
              }}
              className="btn outline"
              style={{ color: '#ff6666', borderColor: '#441111' }}
            >
              Sair
            </button>
          </div>
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '32px',
          borderBottom: '1px solid #1f1f1f'
        }}>
          {[
            { id: 'hero', label: 'Geral & Hero' },
            { id: 'about', label: 'Sobre / Abordagem' },
            { id: 'reels', label: `Reels (${content.reels.length})` },
            { id: 'projects', label: `Projetos (${content.projects.length})` },
            { id: 'clients', label: `Clientes & Testemunhos` },
            { id: 'timeline', label: `Percurso (${content.timeline.length})` },
            { id: 'team', label: `Equipa (${content.team.length})` },
            { id: 'group', label: `Grupo Mizine (${content.group.length})` },
            { id: 'messages', label: `Mensagens (${messages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                background: activeTab === tab.id ? 'var(--red)' : '#141414',
                color: activeTab === tab.id ? '#fff' : '#aaa',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--red)' : '#262626',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div style={{ background: '#0e0e0e', border: '1px solid var(--line)', padding: '32px' }}>
          
          {/* TAB: HERO & GERAL */}
          {activeTab === 'hero' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '26px', margin: 0 }}>Capa Principal & Informações Gerais</h2>
                <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                  A secção do topo foi atualizada para exibir uma capa limpa sem títulos sobrepostos.
                </p>
              </div>

              {/* CARD DE UPLOAD DA CAPA PRINCIPAL */}
              <div style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                padding: '24px',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'var(--red)', margin: 0, fontWeight: 700 }}>
                      Capa do Topo (Hero Cover)
                    </h3>
                    <span style={{ fontSize: '13px', color: '#aaa' }}>
                      Adicione ou altere a imagem de capa diretamente a partir do seu computador.
                    </span>
                  </div>
                  {content.hero.coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, hero: { ...content.hero, coverImageUrl: '' } })}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4d4f',
                        color: '#ff4d4f',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      Remover Capa
                    </button>
                  )}
                </div>

                {/* Pré-visualização da Capa */}
                {content.hero.coverImageUrl ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '260px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '1px solid #333'
                  }}>
                    <img
                      src={content.hero.coverImageUrl}
                      alt="Pré-visualização da Capa"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(0,0,0,0.85)',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: '#00ff66',
                      borderRadius: '3px',
                      border: '1px solid #00aa44'
                    }}>
                      ✓ Capa Ativa no Site
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '140px',
                    border: '2px dashed #333',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#777'
                  }}>
                    <span style={{ fontSize: '26px', marginBottom: '6px' }}>🖼️</span>
                    <span>Nenhuma imagem de capa selecionada (exibirá fundo escuro cinematográfico).</span>
                  </div>
                )}

                {/* Botões de Ação para Carregar do Computador */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{
                    background: 'var(--red)',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '2px',
                    transition: 'opacity 0.2s',
                    opacity: isUploading ? 0.6 : 1
                  }}>
                    <span>{isUploading ? '⏳ A carregar...' : '📁 Escolher Capa do Computador (PC)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      disabled={isUploading}
                      onChange={(e) => handleFileUpload(e, 'cover')}
                    />
                  </label>

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <input
                      type="text"
                      placeholder="Caminho ou URL da imagem (ex: /media/projects/proj-1.jpg)"
                      value={content.hero.coverImageUrl || ''}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, coverImageUrl: e.target.value }
                      })}
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Informações Opcionais / Metadados */}
              <details style={{ background: '#121212', border: '1px solid #222', padding: '16px', borderRadius: '4px' }}>
                <summary style={{ cursor: 'pointer', color: '#999', fontSize: '13px', fontWeight: 600 }}>
                  Metadados e Textos Opcionais (Ocultos na Capa)
                </summary>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Título Interno</label>
                    <textarea
                      rows={2}
                      value={content.hero.title}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Frase / Tagline Interna</label>
                    <textarea
                      rows={2}
                      value={content.hero.tagline}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })}
                    />
                  </div>
                </div>
              </details>

              <h3 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--red)' }}>Banner Informativo (Strip)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Data / Tag ([00/00])</label>
                  <input
                    value={content.hero.bannerDate}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, bannerDate: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Título do Evento</label>
                  <input
                    value={content.hero.bannerTitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, bannerTitle: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Descrição Curta</label>
                  <input
                    value={content.hero.bannerDescription}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, bannerDescription: e.target.value } })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Título de Intenção (Bloco Vermelho)</label>
                  <textarea
                    rows={2}
                    value={content.hero.intentTitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, intentTitle: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Subtítulo de Intenção</label>
                  <textarea
                    rows={2}
                    value={content.hero.intentSubtitle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, intentSubtitle: e.target.value } })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>URL do Vídeo do Showreel (MP4)</label>
                <input
                  placeholder="https://exemplo.com/showreel.mp4"
                  value={content.hero.showreelVideoUrl}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, showreelVideoUrl: e.target.value } })}
                />
              </div>

              <h3 style={{ fontSize: '20px', marginTop: '16px', color: 'var(--red)' }}>Canais de Contacto Direto</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Número WhatsApp</label>
                  <input
                    value={content.hero.whatsappNumber}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, whatsappNumber: e.target.value } })}
                  />
                  <input
                    style={{ marginTop: '8px' }}
                    placeholder="Link (https://wa.me/...)"
                    value={content.hero.whatsappUrl}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, whatsappUrl: e.target.value } })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Instagram</label>
                  <input
                    value={content.hero.instagramHandle}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, instagramHandle: e.target.value } })}
                  />
                  <input
                    style={{ marginTop: '8px' }}
                    placeholder="Link (https://instagram.com/...)"
                    value={content.hero.instagramUrl}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, instagramUrl: e.target.value } })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Email de Contacto</label>
                  <input
                    value={content.hero.contactEmail}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, contactEmail: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <h2 style={{ fontSize: '26px' }}>Sobre & Abordagem</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Etiqueta da Seção</label>
                  <input
                    value={content.about.tagTitle}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, tagTitle: e.target.value } })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Subtítulo da Etiqueta</label>
                  <input
                    value={content.about.tagSubtitle}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, tagSubtitle: e.target.value } })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>Frase Principal de Alto Impacto</label>
                <textarea
                  rows={3}
                  value={content.about.mainHeading}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, mainHeading: e.target.value } })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>História / Sobre a Mizine (2 linhas)</label>
                <textarea
                  rows={3}
                  value={content.about.subtext}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, subtext: e.target.value } })}
                />
              </div>
            </div>
          )}

          {/* TAB: REELS */}
          {activeTab === 'reels' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Gestão de Reels e Vídeos</h2>
                <button onClick={addReel} className="btn red">+ Adicionar Reel</button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {content.reels.map((reel, idx) => (
                  <div key={reel.id} style={{
                    background: '#141414',
                    border: '1px solid var(--line)',
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: '50px 1.2fr 1fr 1.5fr 1.5fr 40px',
                    gap: '12px',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 700, color: 'var(--red)' }}>#{idx + 1}</span>
                    <input
                      placeholder="Título do Reel"
                      value={reel.title}
                      onChange={(e) => {
                        const updated = [...content.reels];
                        updated[idx].title = e.target.value;
                        setContent({ ...content, reels: updated });
                      }}
                    />
                    <input
                      placeholder="[Cliente / ano]"
                      value={reel.subtitle}
                      onChange={(e) => {
                        const updated = [...content.reels];
                        updated[idx].subtitle = e.target.value;
                        setContent({ ...content, reels: updated });
                      }}
                    />
                    <input
                      placeholder="Caminho/URL da Imagem da Capa"
                      value={reel.imageUrl || ''}
                      onChange={(e) => {
                        const updated = [...content.reels];
                        updated[idx].imageUrl = e.target.value;
                        setContent({ ...content, reels: updated });
                      }}
                    />
                    <input
                      placeholder="URL do ficheiro de vídeo (.mp4)"
                      value={reel.videoUrl || ''}
                      onChange={(e) => {
                        const updated = [...content.reels];
                        updated[idx].videoUrl = e.target.value;
                        setContent({ ...content, reels: updated });
                      }}
                    />
                    <button
                      onClick={() => removeReel(reel.id)}
                      style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer', fontSize: '18px' }}
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Projetos em Destaque</h2>
                <button onClick={addProject} className="btn red">+ Adicionar Projeto</button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {content.projects.map((proj, idx) => (
                  <div key={proj.id} style={{
                    background: '#141414',
                    border: '1px solid var(--line)',
                    padding: '20px',
                    display: 'grid',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--red)' }}>Projeto #{idx + 1}</span>
                      <button
                        onClick={() => removeProject(proj.id)}
                        style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer' }}
                      >
                        Eliminar Projeto
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr', gap: '12px' }}>
                      <input
                        placeholder="Título do Projeto"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[idx].title = e.target.value;
                          setContent({ ...content, projects: updated });
                        }}
                      />
                      <select
                        value={proj.isWide ? 'wide' : 'standard'}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[idx].isWide = e.target.value === 'wide';
                          setContent({ ...content, projects: updated });
                        }}
                      >
                        <option value="standard">Tamanho Normal (1 Coluna)</option>
                        <option value="wide">Destaque Panorâmico (Wide)</option>
                      </select>
                      <input
                        placeholder="URL/Caminho da Imagem da Capa"
                        value={proj.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[idx].imageUrl = e.target.value;
                          setContent({ ...content, projects: updated });
                        }}
                      />
                      <input
                        placeholder="Link do Projeto (Instagram/Web)"
                        value={proj.linkUrl || ''}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[idx].linkUrl = e.target.value;
                          setContent({ ...content, projects: updated });
                        }}
                      />
                    </div>

                    <textarea
                      placeholder="Descrição curta do projeto"
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, projects: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLIENTS & TESTIMONIALS */}
          {activeTab === 'clients' && (
            <div>
              <h2 style={{ fontSize: '26px', marginBottom: '20px' }}>Clientes no Letreiro & Testemunhos</h2>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--red)' }}>Marcas no Letreiro Rotativo (Marquee)</h3>
                  <button onClick={addClient} className="btn outline" style={{ fontSize: '12px' }}>+ Adicionar Marca</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {content.clients.map((c, idx) => (
                    <div key={c.id} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={c.name}
                        onChange={(e) => {
                          const updated = [...content.clients];
                          updated[idx].name = e.target.value;
                          setContent({ ...content, clients: updated });
                        }}
                      />
                      <button
                        onClick={() => removeClient(c.id)}
                        style={{ background: '#1c1c1c', border: '1px solid #333', color: '#ff4d4f', padding: '0 10px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--red)' }}>Depoimentos e Avaliações</h3>
                  <button onClick={addTestimonial} className="btn outline" style={{ fontSize: '12px' }}>+ Adicionar Testemunho</button>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {content.testimonials.map((t, idx) => (
                    <div key={t.id} style={{ background: '#141414', border: '1px solid var(--line)', padding: '16px', display: 'grid', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>Depoimento #{idx + 1}</span>
                        <button onClick={() => removeTestimonial(t.id)} style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer' }}>
                          Eliminar
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Texto do depoimento"
                        value={t.quote}
                        onChange={(e) => {
                          const updated = [...content.testimonials];
                          updated[idx].quote = e.target.value;
                          setContent({ ...content, testimonials: updated });
                        }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input
                          placeholder="Nome da pessoa"
                          value={t.author}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[idx].author = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                        />
                        <input
                          placeholder="Empresa / Cargo"
                          value={t.company}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[idx].company = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Percurso e Linha do Tempo</h2>
                <button onClick={addTimeline} className="btn red">+ Adicionar Etapa</button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {content.timeline.map((item, idx) => (
                  <div key={item.id} style={{
                    background: '#141414',
                    border: '1px solid var(--line)',
                    padding: '20px',
                    display: 'grid',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--red)' }}>Marco #{idx + 1}</span>
                      <button onClick={() => removeTimeline(item.id)} style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                      <input
                        placeholder="Ano / Rótulo"
                        value={item.yearLabel}
                        onChange={(e) => {
                          const updated = [...content.timeline];
                          updated[idx].yearLabel = e.target.value;
                          setContent({ ...content, timeline: updated });
                        }}
                      />
                      <input
                        placeholder="Título da Etapa"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.timeline];
                          updated[idx].title = e.target.value;
                          setContent({ ...content, timeline: updated });
                        }}
                      />
                    </div>

                    <textarea
                      placeholder="Descrição detalhada do momento"
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...content.timeline];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, timeline: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TEAM */}
          {activeTab === 'team' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Equipa Mizine</h2>
                <button onClick={addTeamMember} className="btn red">+ Adicionar Membro</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {content.team.map((m, idx) => (
                  <div key={m.id} style={{ background: '#141414', border: '1px solid var(--line)', padding: '20px', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'var(--red)' }}>Membro #{idx + 1}</span>
                      <button onClick={() => removeTeamMember(m.id)} style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '10px' }}>
                      <input
                        placeholder="Letra"
                        maxLength={2}
                        value={m.initial}
                        onChange={(e) => {
                          const updated = [...content.team];
                          updated[idx].initial = e.target.value;
                          setContent({ ...content, team: updated });
                        }}
                      />
                      <input
                        placeholder="Nome do Profissional"
                        value={m.name}
                        onChange={(e) => {
                          const updated = [...content.team];
                          updated[idx].name = e.target.value;
                          setContent({ ...content, team: updated });
                        }}
                      />
                    </div>

                    <input
                      placeholder="Função / Cargo"
                      value={m.role}
                      onChange={(e) => {
                        const updated = [...content.team];
                        updated[idx].role = e.target.value;
                        setContent({ ...content, team: updated });
                      }}
                    />

                    <input
                      placeholder="URL da Foto (opcional)"
                      value={m.avatarUrl || ''}
                      onChange={(e) => {
                        const updated = [...content.team];
                        updated[idx].avatarUrl = e.target.value;
                        setContent({ ...content, team: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GROUP */}
          {activeTab === 'group' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Empresas do Grupo Mizine</h2>
                <button onClick={addGroupCompany} className="btn red">+ Adicionar Empresa</button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {content.group.map((comp, idx) => (
                  <div key={comp.id} style={{ background: '#141414', border: '1px solid var(--line)', padding: '20px', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'var(--red)' }}>Empresa #{idx + 1}</span>
                      <button onClick={() => removeGroupCompany(comp.id)} style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px' }}>
                      <input
                        placeholder="Nome da Empresa"
                        value={comp.name}
                        onChange={(e) => {
                          const updated = [...content.group];
                          updated[idx].name = e.target.value;
                          setContent({ ...content, group: updated });
                        }}
                      />
                      <input
                        placeholder="Texto do Botão (Ex: Visitar)"
                        value={comp.buttonText}
                        onChange={(e) => {
                          const updated = [...content.group];
                          updated[idx].buttonText = e.target.value;
                          setContent({ ...content, group: updated });
                        }}
                      />
                      <input
                        placeholder="Link / URL"
                        value={comp.linkUrl}
                        onChange={(e) => {
                          const updated = [...content.group];
                          updated[idx].linkUrl = e.target.value;
                          setContent({ ...content, group: updated });
                        }}
                      />
                    </div>

                    <textarea
                      placeholder="Descrição curta de uma linha"
                      rows={2}
                      value={comp.description}
                      onChange={(e) => {
                        const updated = [...content.group];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, group: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px' }}>Mensagens Recebidas</h2>
                <button onClick={loadMessages} className="btn outline">Atualizar Lista</button>
              </div>

              {messages.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mute)' }}>
                  Ainda não existem mensagens registadas pelo formulário.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ background: '#141414', border: '1px solid var(--line)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <strong style={{ fontSize: '18px' }}>{msg.name}</strong>
                          <span style={{ color: 'var(--mute)', marginLeft: '12px', fontSize: '13px' }}>
                            &lt;{msg.email}&gt;
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ background: 'rgba(225,6,0,0.15)', color: 'var(--red)', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
                            {msg.projectType}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{ background: 'none', border: 0, color: '#ff4d4f', cursor: 'pointer', fontSize: '13px' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div style={{ background: '#0a0a0a', padding: '14px', borderLeft: '2px solid var(--red)', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                        {msg.message}
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                        <span>Data: {msg.createdAt ? new Date(msg.createdAt).toLocaleString('pt-PT') : 'Recente'}</span>
                        <a href={`mailto:${msg.email}?subject=Resposta Mizine: ${msg.projectType}`} style={{ color: 'var(--red)', fontWeight: 600 }}>
                          Responder por Email →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

