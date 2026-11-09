import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SiteContent, ContactMessage } from '../types';
import { apiService } from '../services/api';
import { Icon, IconName } from '../components/Icon';

interface AdminDashboardProps {
  initialContent: SiteContent;
  onClose: () => void;
  onContentUpdated: (updated: SiteContent) => void;
}

type SectionId = 'geral' | 'fundador' | 'reels' | 'grupo' | 'mensagens' | 'arquivo';

/* --------------------------------------------------------------------------
   Campos reutilizáveis
   -------------------------------------------------------------------------- */
type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'video';
interface FieldDef<T> { key: keyof T & string; label: string; type?: FieldType; hint?: string; placeholder?: string }

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: FieldType;
  hint?: string;
  placeholder?: string;
  onUpload?: (file: File) => Promise<string | null>;
}> = ({ label, value, onChange, type = 'text', hint, placeholder, onUpload }) => {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isMedia = type === 'image' || type === 'video';
  return (
    <label className={`adm-field ${isMedia ? 'is-media' : ''}`}>
      <span className="adm-label">{label}</span>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} placeholder={placeholder} />
      ) : (
        <input type={type === 'url' ? 'url' : 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? (isMedia ? 'https://… ou carrega do computador' : '')} />
      )}
      {isMedia && (
        <div className="adm-media">
          <div className="adm-media-preview">
            {value ? (
              type === 'image' ? <img src={value} alt="" /> : <video src={value} muted playsInline preload="metadata" />
            ) : (
              <span><Icon name={type === 'image' ? 'camera' : 'play'} size={18} /> Sem ficheiro</span>
            )}
          </div>
          {onUpload && (
            <>
              <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => fileRef.current?.click()}>
                {busy ? 'A carregar…' : 'Carregar do computador'}
              </button>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept={type === 'image' ? 'image/jpeg,image/png,image/webp,image/gif' : 'video/mp4,video/quicktime'}
                onChange={async e => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (!f) return;
                  setBusy(true);
                  const url = await onUpload(f);
                  setBusy(false);
                  if (url) onChange(url);
                }}
              />
            </>
          )}
        </div>
      )}
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
};

/** Editor genérico de listas: cartões com campos, reordenar, remover e adicionar. */
function ListEditor<T extends { id: number | string }>({
  items,
  onChange,
  fields,
  titleOf,
  newItem,
  addLabel,
  onUpload
}: {
  items: T[];
  onChange: (next: T[]) => void;
  fields: FieldDef<T>[];
  titleOf: (item: T, i: number) => string;
  newItem: () => T;
  addLabel: string;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [open, setOpen] = useState<number | string | null>(items[0]?.id ?? null);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="adm-list">
      {items.map((item, i) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={`adm-item ${isOpen ? 'is-open' : ''}`}>
            <div className="adm-item-head">
              <button type="button" className="adm-item-title" onClick={() => setOpen(isOpen ? null : item.id)}>
                <span className="adm-item-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{titleOf(item, i) || 'Sem título'}</span>
              </button>
              <div className="adm-item-actions">
                <button type="button" title="Subir" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" title="Descer" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
                <button
                  type="button"
                  title="Remover"
                  className="danger"
                  onClick={() => {
                    if (confirm(`Remover "${titleOf(item, i) || 'item'}"?`)) onChange(items.filter(x => x.id !== item.id));
                  }}
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="adm-item-body">
                {fields.map(f => (
                  <Field
                    key={f.key}
                    label={f.label}
                    type={f.type}
                    hint={f.hint}
                    placeholder={f.placeholder}
                    value={String((item[f.key] as unknown as string) ?? '')}
                    onChange={v => onChange(items.map(x => (x.id === item.id ? { ...x, [f.key]: v } : x)))}
                    onUpload={f.type === 'image' || f.type === 'video' ? onUpload : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="adm-add"
        onClick={() => {
          const it = newItem();
          onChange([...items, it]);
          setOpen(it.id);
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Painel
   -------------------------------------------------------------------------- */
const NAV: { id: SectionId; label: string; icon: IconName; group: string }[] = [
  { id: 'geral', label: 'Geral & contactos', icon: 'globe', group: 'No site' },
  { id: 'fundador', label: 'Fundador', icon: 'camera', group: 'No site' },
  { id: 'reels', label: 'Reels', icon: 'reel', group: 'No site' },
  { id: 'grupo', label: 'Marcas do grupo', icon: 'orbit', group: 'No site' },
  { id: 'mensagens', label: 'Mensagens', icon: 'mail', group: 'Caixa' },
  { id: 'arquivo', label: 'Arquivo', icon: 'academy', group: 'Fora do site' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialContent, onClose, onContentUpdated }) => {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saved, setSaved] = useState(() => JSON.stringify(initialContent));
  const [section, setSection] = useState<SectionId>('geral');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);
  const [archiveTab, setArchiveTab] = useState<'projects' | 'clients' | 'testimonials' | 'team' | 'timeline'>('testimonials');

  const dirty = useMemo(() => JSON.stringify(content) !== saved, [content, saved]);

  const notify = (text: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ text, kind });
    window.setTimeout(() => setToast(null), 3800);
  };

  useEffect(() => {
    apiService.getMessages().then(setMessages);
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    const ok = await apiService.saveFullContent(content);
    setIsSaving(false);
    if (ok) {
      setSaved(JSON.stringify(content));
      onContentUpdated(content);
      notify('Publicado no site.');
    } else if (!apiService.isAuthenticated()) {
      notify('Sessão expirada. Entra novamente — as alterações continuam aqui.', 'err');
    } else {
      notify('Não foi possível publicar. Verifica a ligação e tenta outra vez.', 'err');
    }
  }, [content, isSaving, onContentUpdated]);

  // Ctrl/Cmd + S para guardar; aviso ao sair com alterações por guardar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onLeave);
    };
  }, [handleSave, dirty]);

  const upload = useCallback(async (file: File) => {
    const res = await apiService.uploadFile(file);
    if (res.success) {
      notify('Ficheiro carregado. Guarda para publicar.');
      return res.url;
    }
    notify(res.error || 'Falha no carregamento.', 'err');
    return null;
  }, []);

  const leave = (fn: () => void) => {
    if (dirty && !confirm('Tens alterações por publicar. Sair mesmo assim?')) return;
    fn();
  };

  const setHero = (k: keyof SiteContent['hero'], v: string) => setContent(c => ({ ...c, hero: { ...c.hero, [k]: v } }));
  const unread = messages.filter(m => !m.isRead).length;
  const current = NAV.find(n => n.id === section)!;
  const id = () => Date.now() + Math.floor(Math.random() * 1000);

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">
          MIZINE<i>.</i> <small>ADMIN</small>
        </div>
        <nav className="adm-nav">
          {['No site', 'Caixa', 'Fora do site'].map(g => (
            <div key={g} className="adm-nav-group">
              <span className="adm-nav-label">{g}</span>
              {NAV.filter(n => n.group === g).map(n => (
                <button key={n.id} type="button" className={`adm-nav-item ${section === n.id ? 'is-on' : ''}`} onClick={() => setSection(n.id)}>
                  <Icon name={n.icon} size={17} />
                  <span>{n.label}</span>
                  {n.id === 'mensagens' && messages.length > 0 && <em className={unread ? 'is-new' : ''}>{unread || messages.length}</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="adm-side-foot">
          <button type="button" className="adm-link" onClick={() => leave(onClose)}>
            <Icon name="arrow-up-right" size={14} /> Ver site
          </button>
          <button
            type="button"
            className="adm-link danger"
            onClick={() =>
              leave(() => {
                apiService.logout();
                onClose();
              })
            }
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-top">
          <div>
            <span className="adm-crumb">{current.group}</span>
            <h1>{current.label}</h1>
          </div>
          <div className="adm-top-actions">
            <span className={`adm-state ${dirty ? 'is-dirty' : ''}`}>{dirty ? '● Alterações por publicar' : 'Tudo publicado'}</span>
            <button type="button" className="adm-btn primary" onClick={handleSave} disabled={isSaving || !dirty}>
              {isSaving ? 'A publicar…' : 'Publicar'} <kbd>Ctrl S</kbd>
            </button>
          </div>
        </header>

        <div className="adm-body">
          {section === 'geral' && (
            <div className="adm-panel">
              <p className="adm-intro">Contactos e vídeo de apresentação usados no hero, no contacto e no rodapé.</p>
              <div className="adm-grid">
                <Field label="Email de contacto" value={content.hero.contactEmail} onChange={v => setHero('contactEmail', v)} />
                <Field label="WhatsApp (número visível)" value={content.hero.whatsappNumber} onChange={v => setHero('whatsappNumber', v)} placeholder="+258 84 000 0000" />
                <Field label="WhatsApp (link)" type="url" value={content.hero.whatsappUrl} onChange={v => setHero('whatsappUrl', v)} placeholder="https://wa.me/258840000000" />
                <Field label="Instagram (nome)" value={content.hero.instagramHandle} onChange={v => setHero('instagramHandle', v)} placeholder="@mizine_8" />
                <Field label="Instagram (link)" type="url" value={content.hero.instagramUrl} onChange={v => setHero('instagramUrl', v)} />
              </div>
              <Field
                label="Vídeo de apresentação (botão VER VÍDEO)"
                type="video"
                value={content.hero.showreelVideoUrl}
                onChange={v => setHero('showreelVideoUrl', v)}
                onUpload={upload}
                hint="MP4 ou MOV, até 50 MB."
              />
            </div>
          )}

          {section === 'fundador' && (
            <div className="adm-panel">
              <p className="adm-intro">Texto ao lado de “Por trás de cada fotograma, há quem esteja atrás da câmara.”</p>
              <Field
                label="Apresentação da Mizine"
                type="textarea"
                value={content.about.subtext}
                onChange={v => setContent(c => ({ ...c, about: { ...c.about, subtext: v } }))}
              />
            </div>
          )}

          {section === 'reels' && (
            <div className="adm-panel">
              <p className="adm-intro">Os reels da sala de projecção, pela ordem em que passam na fita.</p>
              <ListEditor
                items={content.reels}
                onChange={reels => setContent(c => ({ ...c, reels }))}
                titleOf={r => r.title}
                addLabel="Adicionar reel"
                onUpload={upload}
                newItem={() => ({ id: id(), title: 'Novo reel', subtitle: 'Cliente / 2026', artClass: 'a1', videoUrl: '', imageUrl: '' })}
                fields={[
                  { key: 'title', label: 'Título' },
                  { key: 'subtitle', label: 'Legenda', placeholder: 'Cliente / ano' },
                  { key: 'imageUrl', label: 'Capa (vertical 9:16)', type: 'image' },
                  { key: 'videoUrl', label: 'Vídeo', type: 'video' }
                ]}
              />
            </div>
          )}

          {section === 'grupo' && (
            <div className="adm-panel">
              <p className="adm-intro">As marcas do grupo em “Uma casa. Várias marcas.” — o Studio 8 aparece automaticamente se não estiver na lista.</p>
              <ListEditor
                items={content.group}
                onChange={group => setContent(c => ({ ...c, group }))}
                titleOf={g => g.name}
                addLabel="Adicionar marca"
                onUpload={upload}
                newItem={() => ({ id: id(), name: 'Nova marca', description: '', buttonText: 'Conhecer', linkUrl: '#contacto' })}
                fields={[
                  { key: 'name', label: 'Nome' },
                  { key: 'description', label: 'Descrição', type: 'textarea' },
                  { key: 'buttonText', label: 'Texto do botão' },
                  { key: 'linkUrl', label: 'Link', type: 'url' }
                ]}
              />
            </div>
          )}

          {section === 'mensagens' && (
            <div className="adm-panel">
              {messages.length === 0 ? (
                <div className="adm-empty">
                  <Icon name="mail" size={28} />
                  <p>Ainda não há mensagens do formulário de contacto.</p>
                </div>
              ) : (
                <div className="adm-msgs">
                  {messages.map(m => (
                    <article key={m.id} className={`adm-msg ${m.isRead ? '' : 'is-new'}`}>
                      <header>
                        <div>
                          <strong>{m.name}</strong>
                          <a href={`mailto:${m.email}`}>{m.email}</a>
                        </div>
                        <span className="adm-msg-meta">
                          <em>{m.projectType}</em>
                          {m.createdAt ? new Date(m.createdAt).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                        </span>
                      </header>
                      <p>{m.message}</p>
                      <footer>
                        <a className="adm-btn ghost" href={`mailto:${m.email}?subject=${encodeURIComponent('Mizine — o teu projecto')}`}>
                          Responder por email
                        </a>
                        <button
                          type="button"
                          className="adm-btn danger"
                          onClick={async () => {
                            if (!confirm(`Apagar a mensagem de ${m.name}?`)) return;
                            const ok = await apiService.deleteMessage(m.id);
                            if (ok) setMessages(list => list.filter(x => x.id !== m.id));
                            else notify('Não foi possível apagar.', 'err');
                          }}
                        >
                          Apagar
                        </button>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'arquivo' && (
            <div className="adm-panel">
              <p className="adm-intro">Conteúdos guardados que <b>não aparecem</b> no site actual. Ficam aqui para reutilizar.</p>
              <div className="adm-tabs">
                {([
                  ['testimonials', `Testemunhos (${content.testimonials.length})`],
                  ['clients', `Clientes (${content.clients.length})`],
                  ['projects', `Projectos (${content.projects.length})`],
                  ['team', `Equipa (${content.team.length})`],
                  ['timeline', `Percurso (${content.timeline.length})`]
                ] as const).map(([k, l]) => (
                  <button key={k} type="button" className={archiveTab === k ? 'is-on' : ''} onClick={() => setArchiveTab(k)}>
                    {l}
                  </button>
                ))}
              </div>
              {archiveTab === 'testimonials' && (
                <ListEditor
                  items={content.testimonials}
                  onChange={testimonials => setContent(c => ({ ...c, testimonials }))}
                  titleOf={t => t.author}
                  addLabel="Adicionar testemunho"
                  onUpload={upload}
                  newItem={() => ({ id: id(), quote: '', author: 'Nome', company: 'Empresa' })}
                  fields={[
                    { key: 'quote', label: 'Testemunho', type: 'textarea' },
                    { key: 'author', label: 'Autor' },
                    { key: 'company', label: 'Empresa / cargo' }
                  ]}
                />
              )}
              {archiveTab === 'clients' && (
                <ListEditor
                  items={content.clients}
                  onChange={clients => setContent(c => ({ ...c, clients }))}
                  titleOf={c => c.name}
                  addLabel="Adicionar cliente"
                  onUpload={upload}
                  newItem={() => ({ id: id(), name: 'Nova marca', logoUrl: '' })}
                  fields={[
                    { key: 'name', label: 'Nome' },
                    { key: 'logoUrl', label: 'Logótipo', type: 'image' }
                  ]}
                />
              )}
              {archiveTab === 'projects' && (
                <ListEditor
                  items={content.projects}
                  onChange={projects => setContent(c => ({ ...c, projects }))}
                  titleOf={p => p.title}
                  addLabel="Adicionar projecto"
                  onUpload={upload}
                  newItem={() => ({ id: id(), title: 'Novo projecto', description: '', isWide: false, artClass: 'a3', linkUrl: '#contacto' })}
                  fields={[
                    { key: 'title', label: 'Título' },
                    { key: 'description', label: 'Descrição', type: 'textarea' },
                    { key: 'imageUrl', label: 'Imagem', type: 'image' },
                    { key: 'linkUrl', label: 'Link', type: 'url' }
                  ]}
                />
              )}
              {archiveTab === 'team' && (
                <ListEditor
                  items={content.team}
                  onChange={team => setContent(c => ({ ...c, team }))}
                  titleOf={m => m.name}
                  addLabel="Adicionar membro"
                  onUpload={upload}
                  newItem={() => ({ id: id(), name: 'Novo membro', role: 'Função', initial: 'M' })}
                  fields={[
                    { key: 'name', label: 'Nome' },
                    { key: 'role', label: 'Função' },
                    { key: 'initial', label: 'Inicial' }
                  ]}
                />
              )}
              {archiveTab === 'timeline' && (
                <ListEditor
                  items={content.timeline}
                  onChange={timeline => setContent(c => ({ ...c, timeline }))}
                  titleOf={t => `${t.yearLabel} — ${t.title}`}
                  addLabel="Adicionar marco"
                  onUpload={upload}
                  newItem={() => ({ id: id(), yearLabel: '2026', title: 'Novo marco', description: '' })}
                  fields={[
                    { key: 'yearLabel', label: 'Ano' },
                    { key: 'title', label: 'Título' },
                    { key: 'description', label: 'Descrição', type: 'textarea' }
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {toast && <div className={`adm-toast ${toast.kind === 'err' ? 'is-err' : ''}`}>{toast.text}</div>}
    </div>
  );
};
