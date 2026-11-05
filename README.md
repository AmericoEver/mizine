# MIZINE Produção - Plataforma Web

Aplicação completa desenvolvida com **React + TypeScript** no Frontend e **Laravel (PHP 8.2+)** no Backend, com Painel Administrativo em tempo real e pronta para deploy na **Hostinger**.

---

## 📁 Estrutura do Projeto

```text
mizine/
├── frontend/                  # Aplicação React + TypeScript (Vite)
│   ├── src/
│   │   ├── admin/            # Painel de Administração e Login
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── AdminLogin.tsx
│   │   ├── components/       # Componentes modulares da landing page
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Strip.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Reels.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── Team.tsx
│   │   │   ├── Group.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   └── Footer.tsx
│   │   ├── data/             # Conteúdo inicial sincronizado com o draft
│   │   ├── services/         # Conexão à API Laravel com fallback inteligente
│   │   ├── types/            # Tipagens estritas TypeScript
│   │   ├── App.tsx
│   │   └── index.css         # Identidade visual (Anton, Inter, #E10600)
│   └── dist/                 # Build de produção otimizado
│
├── backend/                   # API e Gestão em Laravel
│   ├── app/Http/Controllers/Api/
│   │   └── ContentController.php   # Endpoints de API e Admin CRUD
│   ├── database/
│   │   ├── migrations/       # Tabelas relacionais para todas as seções
│   │   └── seeders/          # Dados do draft original já pré-populados
│   └── routes/
│       └── api.php           # Rotas REST (/api/content, /api/contact, /api/admin/...)
│
└── deploy/public_html/        # Pacote pronto para lançamento na Hostinger
    ├── index.html            # SPA React de alto desempenho
    ├── assets/               # JS e CSS compilados e cacheados
    ├── .htaccess             # Roteamento de API e proteção de subpastas
    └── api/                  # Laravel API com SQLite pronto
```

---

## 🔐 Acesso ao Painel de Administração

- No topo do site, clique no botão **ADMIN**.
- **Senha padrão inicial:** `mizine2026` (ou configurável via `.env` no backend através de `ADMIN_PASSWORD`).
- O painel permite editar em abas dedicadas:
  1. **Geral & Hero**: Título, frase de efeito, banner informativo, intenção, vídeo do showreel e contatos diretos (WhatsApp, Instagram, Email).
  2. **Sobre / Abordagem**: Etiquetas, headline principal e histórico.
  3. **Reels**: Adicionar, editar URLs de vídeo MP4, títulos, cliente/ano e estilos visuais.
  4. **Projetos em Destaque**: Títulos, descrições, layout amplo (wide) ou standard.
  5. **Clientes & Testemunhos**: Marcas rotativas no letreiro (marquee) e depoimentos com autor e empresa.
  6. **Percurso (Timeline)**: Linha do tempo com ano e descrição das conquistas.
  7. **Equipa**: Integrantes, fotos/iniciais e funções.
  8. **Grupo Mizine**: Empresas parceiras (ex: Mizine Celebrate) com links externos.
  9. **Mensagens**: Caixa de entrada das solicitações enviadas através do formulário de contato do site com opção de resposta direta por email.

---

## 🚀 Como Executar Localmente

### 1. Iniciar o Backend (Laravel)
```bash
cd backend
php artisan serve
```
A API estará acessível em `http://127.0.0.1:8000/api/content`.

### 2. Iniciar o Frontend (React + TypeScript)
```bash
cd frontend
npm run dev
```
O site estará acessível em `http://localhost:5173`.

