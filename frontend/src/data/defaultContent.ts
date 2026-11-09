import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  hero: {
    title: 'MIZINE MULTIMÉDIA',
    tagline: 'Video Making de Alto Impacto, Gestão Estratégica de Redes Sociais, Convites Digitais Interativos & Ecossistema Multimédia.',
    coverImageUrl: '/media/projects/proj-1.jpg',
    bannerDate: 'AUDIOVISUAL & SOCIAL MEDIA',
    bannerTitle: 'Ecossistema Multimédia',
    bannerDescription: 'Produções cinematográficas, reels de retenção máxima e convites digitais memoráveis.',
    intentTitle: 'Cada frame conta.\nCada segundo converte.',
    intentSubtitle: 'Do conceito criativo e captação à viralidade e entrega impecável.',
    showreelVideoUrl: '/media/videos/showreel.mp4',
    whatsappNumber: '+258 84 000 0000',
    whatsappUrl: 'https://wa.me/258840000000',
    instagramHandle: '@mizine_8',
    instagramUrl: 'https://www.instagram.com/mizine_8',
    contactEmail: 'support@mizine.co.mz'
  },
  about: {
    tagTitle: 'Abordagem & Posicionamento',
    tagSubtitle: 'Porquê a Mizine Multimédia?',
    mainHeading: 'Trabalhamos com marcas corajosas e momentos inesquecíveis para criar experiências audiovisuais que as pessoas sentem e recordam. Trabalho ousado pede uma abordagem sem medo.',
    subtext: 'Nascida da paixão pela narrativa visual e engenharia de atenção, a Mizine Multimédia une estética de cinema, gestão viral de redes sociais e soluções digitais exclusivas para elevar marcas a outro patamar.'
  },
  pillars: [
    {
      id: 1,
      code: '01',
      title: 'Video Making & Cinema Comercial',
      category: 'PRODUÇÃO AUDIOVISUAL',
      badge: 'CINEMA',
      description: 'Captação com iluminação de cinema, áudio cristalino e pós-produção profissional para anúncios de TV, comerciais digitais, aftermovies de eventos VIP e documentários corporativos.',
      deliverables: ['Spots Comerciais & TV', 'Aftermovies de Eventos VIP', 'Captação Aérea com Drone', 'Color Grading & Pós-Produção']
    },
    {
      id: 2,
      code: '02',
      title: 'Gestão de Redes Sociais & Reels',
      category: 'SOCIAL & RETENÇÃO VIRAL',
      badge: 'ALTA RETENÇÃO',
      description: 'Vídeos verticais concebidos para prender a atenção nos primeiros 3 segundos. Gestão de perfil, planeamento de conteúdo, captação contínua e edição dinâmica para gerar autoridade e vendas.',
      deliverables: ['Pacotes Mensais de Reels', 'Estratégia de Storytelling', 'Captação Contínua em Maputo', 'Métricas & Otimização de Alcance']
    },
    {
      id: 3,
      code: '03',
      title: 'Mizine Celebrate (Convites Digitais)',
      category: 'EVENTOS, CASAMENTOS & LUXO',
      badge: 'MIZINE CELEBRATE',
      description: 'A subdivisão de luxo do grupo: convites digitais interativos com confirmação de presença (RSVP), contagem decrescente, mapa GPS e cobertura cinematográfica completa no dia do evento.',
      deliverables: ['Convites Digitais Interativos', 'Confirmação de Presença (RSVP)', 'Cobertura de Casamentos & Galas', 'Entrega de Teasers no Mesmo Dia']
    },
    {
      id: 4,
      code: '04',
      title: 'Ecossistema & Subdivisões do Grupo',
      category: 'TECNOLOGIA, SOM & FORMAÇÃO',
      badge: 'GRUPO MIZINE',
      description: 'A Mizine opera além do vídeo: inovação tecnológica com a Geek Ever (web e aplicações), produção e mistura de áudio com a Studio 8 e formação criativa na Mizine Academy.',
      deliverables: ['Geek Ever (Desenvolvimento Tech & Web)', 'Studio 8 (Sound Design & Mistura)', 'Mizine Academy (Workshops & Mentoria)', 'Consultoria Criativa Integrada']
    }
  ],
  reels: [
    {
      id: 1,
      title: 'Branding & Posicionamento',
      subtitle: 'Comercial & Awareness / 2026',
      artClass: 'a1',
      imageUrl: '/media/reels/reel-1.jpg',
      videoUrl: '/media/videos/reel-1.mp4'
    },
    {
      id: 2,
      title: 'Cobertura de Evento VIP',
      subtitle: 'Aftermovie & Dinamismo / 2026',
      artClass: 'a2',
      imageUrl: '/media/reels/reel-2.jpg',
      videoUrl: '/media/videos/reel-2.mp4'
    },
    {
      id: 3,
      title: 'Storytelling de Marca',
      subtitle: 'Narrativa Cinematográfica / 2025',
      artClass: 'a3',
      imageUrl: '/media/reels/reel-3.jpg',
      videoUrl: '/media/videos/reel-3.mp4'
    },
    {
      id: 4,
      title: 'Reels de Alta Retenção',
      subtitle: 'Social Media & Viral / 2026',
      artClass: 'a4',
      imageUrl: '/media/reels/reel-4.jpg',
      videoUrl: '/media/videos/reel-4.mp4'
    },
    {
      id: 5,
      title: 'Fashion & Lifestyle',
      subtitle: 'Editorial Audiovisual / 2025',
      artClass: 'a5',
      imageUrl: '/media/reels/reel-5.jpg',
      videoUrl: '/media/videos/reel-5.mp4'
    },
    {
      id: 6,
      title: 'Showcase Corporativo',
      subtitle: 'Apresentação Empresarial / 2026',
      artClass: 'a6',
      imageUrl: '/media/reels/reel-6.jpg',
      videoUrl: '/media/videos/reel-6.mp4'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Campanha de Posicionamento de Marca',
      description: 'Direção criativa, captação e edição dinâmica para lançamento nacional com foco em autoridade e conexão com o público.',
      isWide: true,
      artClass: 'a3',
      imageUrl: '/media/projects/proj-1.jpg',
      linkUrl: 'https://www.instagram.com/mizine_8'
    },
    {
      id: 2,
      title: 'Série de Reels de Alto Engajamento',
      description: 'Pacote estratégico de vídeos verticais otimizados para Instagram e TikTok com retenção e estética cinematográfica.',
      isWide: false,
      artClass: 'a1',
      imageUrl: '/media/projects/proj-2.jpg',
      linkUrl: 'https://www.instagram.com/mizine_8'
    },
    {
      id: 3,
      title: 'Cobertura Cinematográfica de Eventos',
      description: 'Captação dinâmica dos melhores momentos, entregando vídeos teaser no próprio dia e aftermovie final memorável.',
      isWide: false,
      artClass: 'a5',
      imageUrl: '/media/projects/proj-3.jpg',
      linkUrl: 'https://www.instagram.com/mizine_8'
    }
  ],
  clients: [
    { id: 1, name: 'GEEK EVER', logoUrl: '/media/clients/geek-ever.svg' },
    { id: 2, name: 'MIZINE CELEBRATE', logoUrl: '/media/clients/mizine-celebrate.svg' },
    { id: 3, name: 'MAPUTO CREATIVE', logoUrl: '/media/clients/maputo-creative.svg' },
    { id: 4, name: 'STUDIO 8', logoUrl: '/media/clients/studio-8.svg' },
    { id: 5, name: 'VALOR DIGITAL', logoUrl: '/media/clients/valor-digital.svg' },
    { id: 6, name: 'BRAND MZ', logoUrl: '/media/clients/brand-mz.svg' },
    { id: 7, name: 'XAI ART', logoUrl: '/media/clients/xai-art.svg' }
  ],
  testimonials: [
    {
      id: 1,
      quote: '“A Mizine elevou a perceção da nossa marca a outro patamar. O vídeo de lançamento teve um acabamento estético e impacto incomparáveis.”',
      author: 'Moises Mabunda',
      company: 'Direção Criativa'
    },
    {
      id: 2,
      quote: '“Agilidade na entrega, olhar refinado de câmara e uma compreensão profunda de marketing de atenção. Superou todas as expectativas.”',
      author: 'Sara Tembe',
      company: 'Brand & Marketing'
    },
    {
      id: 3,
      quote: '“Os reels produzidos pela equipa multiplicaram as visualizações e o engajamento orgânico do nosso perfil nas primeiras semanas.”',
      author: 'Carlos Mondlane',
      company: 'Empreendedor'
    }
  ],
  timeline: [
    {
      id: 1,
      yearLabel: '2023',
      title: 'Início da Mizine',
      description: 'Primeiras produções audiovisuais e criação do olhar de cinema aplicado a marcas e projetos locais.'
    },
    {
      id: 2,
      yearLabel: '2024',
      title: 'Consolidação Criativa & Reels',
      description: 'Expansão para campanhas publicitárias completas, reels virais e atendimento a marcas corporativas.'
    },
    {
      id: 3,
      yearLabel: '2025',
      title: 'Diversificação & Mizine Celebrate',
      description: 'Crescimento da equipa e nascimento de iniciativas de luxo como Mizine Celebrate e Geek Ever.'
    },
    {
      id: 4,
      yearLabel: '2026',
      title: 'Ecossistema Multimédia Completo',
      description: 'Liderança em vídeo making, gestão de redes sociais de alta retenção e soluções digitais integradas.'
    }
  ],
  team: [
    {
      id: 1,
      name: 'Moisés Mabunda',
      role: 'Fundador & Diretor Criativo',
      initial: 'M',
      avatarUrl: '/logo-m.jpg'
    },
    {
      id: 2,
      name: 'Direção de Fotografia',
      role: 'Cinematografia & Luz',
      initial: 'D'
    },
    {
      id: 3,
      name: 'Edição & Color Grading',
      role: 'Montagem & Pós-Produção',
      initial: 'E'
    },
    {
      id: 4,
      name: 'Estratégia de Redes Sociais',
      role: 'Storytelling & Viralidade',
      initial: 'S'
    }
  ],
  group: [
    {
      id: 1,
      name: 'Mizine Celebrate',
      description: 'Convites digitais interativos de luxo, confirmação de presença (RSVP) e cobertura cinematográfica para eventos exclusivos.',
      buttonText: 'Explorar Celebrate',
      linkUrl: 'https://instagram.com/mizine_celebrate'
    },
    {
      id: 2,
      name: 'Geek Ever',
      description: 'Braço tecnológico do grupo: desenvolvimento de plataformas digitais, aplicações web e soluções de engenharia digital.',
      buttonText: 'Visitar Geek Ever',
      linkUrl: 'https://geek.mizine.co.mz'
    },
    {
      id: 3,
      name: 'Mizine Academy',
      description: 'Workshops, masterclasses e programas práticos sobre video making, edição cinematográfica e retenção nas redes sociais.',
      buttonText: 'Saber Mais',
      linkUrl: 'https://www.instagram.com/mizine_8'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Qual é a diferença entre um vídeo tradicional e a abordagem de Video Making da Mizine?',
      answer: 'Tratamos cada produção com técnicas e óticas de cinema — iluminação dramática, captação de alta resolução, edição rítmica e color grading profissional. Os nossos vídeos são desenhados com psicologia de atenção para prender o espectador nos primeiros 3 segundos.'
    },
    {
      id: 2,
      question: 'Como funciona a gestão de Redes Sociais e produção de Reels?',
      answer: 'Desenvolvemos a estratégia mensal, realizamos sessões de captação contínua e entregamos pacotes de reels verticais dinâmicos de alta retenção prontos a publicar, otimizados para o algoritmo do Instagram e TikTok.'
    },
    {
      id: 3,
      question: 'O que é a Mizine Celebrate e como funcionam os Convites Digitais?',
      answer: 'É a nossa subdivisão focada em eventos e casamentos inesquecíveis. Criamos convites digitais interativos de alta elegância (com mapa interativo, confirmação de presença RSVP online, contagem decrescente e música) e realizamos a cobertura audiovisual cinematográfica do dia.'
    },
    {
      id: 4,
      question: 'Vocês atendem em todo o Moçambique e no estrangeiro?',
      answer: 'Sim! Com base em Maputo, a nossa equipa desloca-se a qualquer província de Moçambique e a outros países com equipamento de produção móvel completo para projetos comerciais e eventos.'
    },
    {
      id: 5,
      question: 'Qual é o prazo médio de entrega de um projeto?',
      answer: 'Para reels de redes sociais e convites digitais, os prazos variam entre 48h a 5 dias úteis. Para comerciais completos e aftermovies cinematográficos, a entrega varia entre 5 a 12 dias úteis, com entregas teaser no próprio dia para eventos.'
    }
  ]
};
