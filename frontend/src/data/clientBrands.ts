// Marcas reais do portfólio — partilhadas pela fita do globo (canvas) e pela fita de aterragem (DOM),
// na MESMA ordem, para que a fita que desce do espaço seja visualmente a mesma que aterra na página.
// `logo` vazio = a marca é mostrada como logotipo tipográfico (ainda sem ficheiro de logo limpo).
export interface ClientBrand {
  name: string;
  tag: string;
  logo: string;
  frame: string;
}

export const CLIENT_BRANDS: ClientBrand[] = [
  { name: 'CPC - GAZA', tag: 'CONSELHO PROVINCIAL', logo: '/media/clients/v2/cpc-gaza.png', frame: '01' },
  { name: 'CONFNES', tag: 'CONFERÊNCIA NACIONAL', logo: '/media/clients/v2/confnes.png', frame: '02' },
  { name: 'CREDMOZ', tag: 'FINTECH & CRÉDITO', logo: '/media/clients/v2/credmoz.png', frame: '03' },
  { name: 'UNE', tag: 'UNIÃO DE ESTUDANTES', logo: '/media/clients/v2/une.png', frame: '04' },
  { name: 'FCDF', tag: 'FORMAÇÃO FOTOGRÁFICA', logo: '/media/clients/v2/fcdf.png', frame: '05' },
  { name: 'GEEK EVER', tag: 'TECNOLOGIA & GAMING', logo: '/media/clients/v2/geek.png', frame: '06' },
  { name: 'INAS', tag: 'GOVERNO DE MOÇAMBIQUE', logo: '/media/clients/v2/inas.png', frame: '07' },
  { name: 'CATALYST ACADEMY', tag: 'EDUCAÇÃO & NEGÓCIOS', logo: '/media/clients/v2/catalyst-academy.png', frame: '08' },
  { name: 'LIMPOPO TV', tag: 'TELEVISÃO & BROADCAST', logo: '/media/clients/v2/limpopo-tv.png', frame: '09' },
  { name: 'QUAQUA', tag: 'COMUNICAÇÃO & BRANDING', logo: '/media/clients/v2/quaqua.png', frame: '10' },
  { name: 'GOV. GAZA', tag: 'SETOR PÚBLICO', logo: '/media/clients/v2/governo-gaza.png', frame: '11' },
  { name: 'HOME SERVICE', tag: 'SERVIÇOS GERAIS', logo: '/media/clients/v2/home-service.png', frame: '12' },
  { name: 'MOZCLEAN', tag: 'SOLUÇÕES CORPORATIVAS', logo: '/media/clients/v2/mozclean.png', frame: '13' }
];

/** Ordem dos fotogramas na fita DOM: a fita do canvas, ao aterrar, corre com o índice a DESCER da esquerda
 *  para a direita — a fita DOM usa a mesma sequência para que a troca canvas→DOM seja invisível. */
export const stripBrandAt = (k: number): ClientBrand => {
  const b = CLIENT_BRANDS.length;
  return CLIENT_BRANDS[(b - (k % b)) % b];
};
