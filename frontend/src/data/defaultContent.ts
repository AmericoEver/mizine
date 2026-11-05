import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  hero: {
    title: 'MIZINE PRODUÇÃO',
    tagline: 'Vídeos curtos, reels e histórias com olhar de cinema. Filmamos, montamos e entregamos conteúdo que fica na memória.',
    bannerDate: '[00/00]',
    bannerTitle: '[Evento recente]',
    bannerDescription: '[Descrição curta do último trabalho.]',
    intentTitle: 'Cada plano\ntem uma intenção',
    intentSubtitle: 'Do guião à última frame, cuidamos de tudo.',
    showreelVideoUrl: '',
    whatsappNumber: '+258 00 000 0000',
    whatsappUrl: 'https://wa.me/258000000000',
    instagramHandle: '@mizine',
    instagramUrl: 'https://instagram.com/mizine',
    contactEmail: 'ola@mizine.com'
  },
  about: {
    tagTitle: 'Abordagem',
    tagSubtitle: 'Quem somos e como trabalhamos.',
    mainHeading: 'Trabalhamos com clientes corajosos para criar experiências que as pessoas sentem. Trabalho ousado pede uma abordagem sem medo.',
    subtext: '[Escreva aqui 2 linhas sobre a Mizine: quando nasceu, o que acredita, o que entrega.]'
  },
  reels: [
    { id: 1, title: 'Reel 1', subtitle: '[Cliente / ano]', artClass: 'a1', videoUrl: '' },
    { id: 2, title: 'Reel 2', subtitle: '[Cliente / ano]', artClass: 'a2', videoUrl: '' },
    { id: 3, title: 'Reel 3', subtitle: '[Cliente / ano]', artClass: 'a3', videoUrl: '' },
    { id: 4, title: 'Reel 4', subtitle: '[Cliente / ano]', artClass: 'a4', videoUrl: '' },
    { id: 5, title: 'Reel 5', subtitle: '[Cliente / ano]', artClass: 'a5', videoUrl: '' },
    { id: 6, title: 'Reel 6', subtitle: '[Cliente / ano]', artClass: 'a6', videoUrl: '' }
  ],
  projects: [
    {
      id: 1,
      title: '[Projeto principal]',
      description: '[Uma linha sobre o que foi feito e para quem.]',
      isWide: true,
      artClass: 'a3',
      linkUrl: '#contacto'
    },
    {
      id: 2,
      title: '[Projeto 2]',
      description: '[Descrição curta.]',
      isWide: false,
      artClass: 'a1',
      linkUrl: '#contacto'
    },
    {
      id: 3,
      title: '[Projeto 3]',
      description: '[Descrição curta.]',
      isWide: false,
      artClass: 'a5',
      linkUrl: '#contacto'
    }
  ],
  clients: [
    { id: 1, name: '[Cliente 1]' },
    { id: 2, name: '[Cliente 2]' },
    { id: 3, name: '[Cliente 3]' },
    { id: 4, name: '[Cliente 4]' },
    { id: 5, name: '[Cliente 5]' },
    { id: 6, name: '[Cliente 6]' }
  ],
  testimonials: [
    {
      id: 1,
      quote: '“[Testemunho do cliente sobre o trabalho da Mizine.]”',
      author: '[Nome]',
      company: '[Empresa]'
    },
    {
      id: 2,
      quote: '“[Testemunho do cliente sobre o trabalho da Mizine.]”',
      author: '[Nome]',
      company: '[Empresa]'
    },
    {
      id: 3,
      quote: '“[Testemunho do cliente sobre o trabalho da Mizine.]”',
      author: '[Nome]',
      company: '[Empresa]'
    }
  ],
  timeline: [
    {
      id: 1,
      yearLabel: '[Ano]',
      title: '[Início da Mizine]',
      description: '[Como tudo começou.]'
    },
    {
      id: 2,
      yearLabel: '[Ano]',
      title: '[Primeiro grande trabalho]',
      description: '[O que mudou a partir daí.]'
    },
    {
      id: 3,
      yearLabel: '[Ano]',
      title: '[Crescimento da equipa]',
      description: '[Novos serviços, novos clientes.]'
    },
    {
      id: 4,
      yearLabel: '[Hoje]',
      title: '[Grupo Mizine]',
      description: '[Onde estamos agora e para onde vamos.]'
    }
  ],
  team: [
    { id: 1, name: '[Nome]', role: '[Função]', initial: 'M' },
    { id: 2, name: '[Nome]', role: '[Função]', initial: 'I' },
    { id: 3, name: '[Nome]', role: '[Função]', initial: 'Z' },
    { id: 4, name: '[Nome]', role: '[Função]', initial: 'E' }
  ],
  group: [
    {
      id: 1,
      name: 'Mizine Celebrate',
      description: 'Convites digitais para eventos.',
      buttonText: 'Visitar',
      linkUrl: 'https://instagram.com/mizine_celebrate'
    },
    {
      id: 2,
      name: '[Empresa 2]',
      description: '[Descrição de uma linha.]',
      buttonText: 'Visitar',
      linkUrl: '#'
    },
    {
      id: 3,
      name: '[Empresa 3]',
      description: '[Descrição de uma linha.]',
      buttonText: 'Visitar',
      linkUrl: '#'
    }
  ]
};

