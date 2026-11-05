import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  hero: {
    title: 'MIZINE PRODUÇÃO',
    tagline: 'Soluções Audiovisuais, Marketing e Publicidade. +3 anos criando conteúdos e histórias que posicionam marcas com olhar de cinema.',
    bannerDate: 'DESTAQUE',
    bannerTitle: 'Audiovisual & Marketing',
    bannerDescription: 'Vídeos curtos, reels dinâmicos e campanhas de impacto para marcas corajosas.',
    intentTitle: 'Cada plano\ntem uma intenção',
    intentSubtitle: 'Do conceito criativo e captação à pós-produção e entrega final.',
    showreelVideoUrl: 'https://www.instagram.com/mizine_8/reels/',
    whatsappNumber: '+258 84 000 0000',
    whatsappUrl: 'https://wa.me/258840000000',
    instagramHandle: '@mizine_8',
    instagramUrl: 'https://www.instagram.com/mizine_8',
    contactEmail: 'ola@mizine.co.mz'
  },
  about: {
    tagTitle: 'Abordagem',
    tagSubtitle: 'Quem somos e como criamos valor.',
    mainHeading: 'Trabalhamos com marcas corajosas para criar experiências audiovisuais que as pessoas sentem e recordam. Trabalho ousado pede uma abordagem sem medo.',
    subtext: 'Nascida da paixão pela narrativa visual e marketing de atenção, a Mizine Produção une técnicas cinematográficas a estratégias modernas de conteúdo para destacar a sua marca no mercado.'
  },
  reels: [
    {
      id: 1,
      title: 'Branding & Posicionamento',
      subtitle: 'Comercial & Awareness / 2026',
      artClass: 'a1',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    },
    {
      id: 2,
      title: 'Cobertura de Evento VIP',
      subtitle: 'Aftermovie & Dinamismo / 2026',
      artClass: 'a2',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    },
    {
      id: 3,
      title: 'Storytelling de Marca',
      subtitle: 'Narrativa Cinematográfica / 2025',
      artClass: 'a3',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    },
    {
      id: 4,
      title: 'Reels de Alta Retenção',
      subtitle: 'Social Media & Viral / 2026',
      artClass: 'a4',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    },
    {
      id: 5,
      title: 'Fashion & Lifestyle',
      subtitle: 'Editorial Audiovisual / 2025',
      artClass: 'a5',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    },
    {
      id: 6,
      title: 'Showcase Corporativo',
      subtitle: 'Apresentação Empresarial / 2026',
      artClass: 'a6',
      videoUrl: 'https://www.instagram.com/mizine_8/reels/'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Campanha de Posicionamento de Marca',
      description: 'Direção criativa, captação 4K e edição dinâmica para lançamento nacional com foco em autoridade e conexão com o público.',
      isWide: true,
      artClass: 'a3',
      linkUrl: 'https://www.instagram.com/mizine_8'
    },
    {
      id: 2,
      title: 'Série de Reels de Alto Engajamento',
      description: 'Pacote estratégico de vídeos verticais otimizados para Instagram e TikTok com retenção e estética cinematográfica.',
      isWide: false,
      artClass: 'a1',
      linkUrl: 'https://www.instagram.com/mizine_8'
    },
    {
      id: 3,
      title: 'Cobertura Cinematográfica de Eventos',
      description: 'Captação dinâmica dos melhores momentos, entregando vídeos teaser no próprio dia e aftermovie final memorável.',
      isWide: false,
      artClass: 'a5',
      linkUrl: 'https://www.instagram.com/mizine_8'
    }
  ],
  clients: [
    { id: 1, name: 'GEEK MOÇAMBIQUE' },
    { id: 2, name: 'MIZINE CELEBRATE' },
    { id: 3, name: 'MAPUTO CREATIVE' },
    { id: 4, name: 'STUDIO 8' },
    { id: 5, name: 'VALOR DIGITAL' },
    { id: 6, name: 'BRAND MZ' }
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
      title: 'Consolidação Criativa',
      description: 'Expansão para campanhas publicitárias completas, reels virais e atendimento a marcas corporativas.'
    },
    {
      id: 3,
      yearLabel: '2025',
      title: 'Diversificação do Grupo',
      description: 'Crescimento da equipa e nascimento de iniciativas paralelas como Mizine Celebrate e Geek.'
    },
    {
      id: 4,
      yearLabel: '2026',
      title: 'Ecossistema Audiovisual',
      description: 'Plataforma digital própria, liderança em vídeos curtos e expansão para produções de grande escala.'
    }
  ],
  team: [
    { id: 1, name: 'Moisés Mabunda', role: 'Fundador & Diretor Criativo', initial: 'M' },
    { id: 2, name: 'Direção de Fotografia', role: 'Cinematografia & Luz', initial: 'D' },
    { id: 3, name: 'Edição & Color Grading', role: 'Montagem & Pós-Produção', initial: 'E' },
    { id: 4, name: 'Estratégia de Marketing', role: 'Storytelling & Social', initial: 'S' }
  ],
  group: [
    {
      id: 1,
      name: 'Mizine Celebrate',
      description: 'Convites digitais interativos e cobertura para eventos e casamentos inesquecíveis.',
      buttonText: 'Visitar',
      linkUrl: 'https://instagram.com/mizine_celebrate'
    },
    {
      id: 2,
      name: 'Geek Moçambique',
      description: 'Plataforma digital, inovação tecnológica e aplicativos.',
      buttonText: 'Visitar',
      linkUrl: 'https://geek.mizine.co.mz'
    },
    {
      id: 3,
      name: 'Mizine Academy',
      description: 'Workshops e conteúdos sobre audiovisual, edição e marketing de conteúdo.',
      buttonText: 'Visitar',
      linkUrl: 'https://www.instagram.com/mizine_8'
    }
  ]
};
