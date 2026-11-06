export interface HeroContent {
  title: string;
  tagline: string;
  coverImageUrl?: string;
  bannerDate: string;
  bannerTitle: string;
  bannerDescription: string;
  intentTitle: string;
  intentSubtitle: string;
  showreelVideoUrl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  contactEmail: string;
}

export interface AboutContent {
  tagTitle: string;
  tagSubtitle: string;
  mainHeading: string;
  subtext: string;
}

export interface ReelItem {
  id: number | string;
  title: string;
  subtitle: string;
  videoUrl?: string;
  imageUrl?: string;
  artClass?: string;
  order?: number;
}

export interface ProjectItem {
  id: number | string;
  title: string;
  description: string;
  isWide?: boolean;
  artClass?: string;
  imageUrl?: string;
  linkUrl?: string;
  order?: number;
}

export interface ClientItem {
  id: number | string;
  name: string;
  logoUrl?: string;
  order?: number;
}

export interface TestimonialItem {
  id: number | string;
  quote: string;
  author: string;
  company: string;
  order?: number;
}

export interface TimelineItem {
  id: number | string;
  yearLabel: string;
  title: string;
  description: string;
  order?: number;
}

export interface TeamMember {
  id: number | string;
  name: string;
  role: string;
  initial: string;
  avatarUrl?: string;
  order?: number;
}

export interface GroupCompany {
  id: number | string;
  name: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  order?: number;
}

export interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface ServicePillar {
  id: string | number;
  code: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  badge?: string;
  accent?: string;
}

export interface FaqItem {
  id: string | number;
  question: string;
  answer: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  reels: ReelItem[];
  projects: ProjectItem[];
  clients: ClientItem[];
  testimonials: TestimonialItem[];
  timeline: TimelineItem[];
  team: TeamMember[];
  group: GroupCompany[];
  pillars?: ServicePillar[];
  faq?: FaqItem[];
}

