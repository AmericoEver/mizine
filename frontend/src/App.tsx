import { useState, useEffect } from 'react';
import { SiteContent } from './types';
import { defaultContent } from './data/defaultContent';
import { apiService } from './services/api';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroMetrics } from './components/IntroMetrics';
import { ServicesPillars } from './components/ServicesPillars';
import { Projects } from './components/Projects';
import { Reels } from './components/Reels';
import { WhyMizine } from './components/WhyMizine';
import { ProjectCalculator } from './components/ProjectCalculator';
import { Clients } from './components/Clients';
import { Group } from './components/Group';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Lightbox } from './components/Lightbox';
import { Preloader } from './components/Preloader';

import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

export function App() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  // Determina se a rota é /admin ou #admin
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path === '/admin/' || hash === '#admin';
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(apiService.isAuthenticated);
  const [showPreloader, setShowPreloader] = useState<boolean>(() => !checkIsAdminRoute());

  const [lightbox, setLightbox] = useState<{ isOpen: boolean; title: string; videoUrl: string }>({
    isOpen: false,
    title: '',
    videoUrl: ''
  });

  // Ouve alterações de rota (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdm = checkIsAdminRoute();
      setIsAdminRoute(isAdm);
      setIsAuthenticated(apiService.isAuthenticated());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Carregar conteúdo inicial da API Laravel
  useEffect(() => {
    async function load() {
      const data = await apiService.getContent();
      setContent(data);
    }
    load();
  }, []);

  // Observador de interseção para ativar menu
  useEffect(() => {
    if (isAdminRoute) return;

    const links = document.querySelectorAll('#menu a');
    const sections = document.querySelectorAll('section[id], header[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => {
              l.classList.toggle('on', l.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isAdminRoute, content]);

  // Observador de Scroll Reveal estilo United Carriers
  useEffect(() => {
    if (isAdminRoute) return;

    const timeout = setTimeout(() => {
      const targets = document.querySelectorAll(
        '.reveal-up, .reveal-fade, .reveal-scale, section > .wrap, .uc-pillar-card, .uc-project-card, .uc-reel-card, .uc-metric-card, .uc-why-card, .uc-partner-tile, .uc-group-card, .uc-faq-item'
      );

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      targets.forEach((el) => {
        if (!el.classList.contains('reveal-fade') && !el.classList.contains('reveal-scale')) {
          el.classList.add('reveal-up');
        }
        revealObserver.observe(el);
      });

      return () => revealObserver.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAdminRoute, content]);

  const navigateToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  const handleOpenVideo = (title: string, videoUrl?: string) => {
    setLightbox({
      isOpen: true,
      title,
      videoUrl: videoUrl || ''
    });
  };

  const handleCloseVideo = () => {
    setLightbox({
      isOpen: false,
      title: '',
      videoUrl: ''
    });
  };

  // Se a rota for /admin
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => setIsAuthenticated(true)}
          onCancel={navigateToSite}
        />
      );
    }

    return (
      <div className="mizine-app">
        <Navbar onBackToSite={navigateToSite} isAdminView={true} />
        <AdminDashboard
          initialContent={content}
          onClose={navigateToSite}
          onContentUpdated={(updated) => setContent(updated)}
        />
      </div>
    );
  }

  // Página pública 100% inspirada na estética e narrativa de United Carriers
  return (
    <div className="mizine-app">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <Navbar />
      <Hero content={content.hero} onPlayShowreel={handleOpenVideo} />
      <IntroMetrics content={content.about} />
      <ServicesPillars pillars={content.pillars || defaultContent.pillars} />
      <Projects projects={content.projects} />
      <Reels reels={content.reels} onOpenReel={handleOpenVideo} />
      <WhyMizine />
      <ProjectCalculator heroContent={content.hero} />
      <Clients clients={content.clients} testimonials={content.testimonials} />
      <Group companies={content.group} />
      <FAQ items={content.faq || defaultContent.faq} />
      <Contact hero={content.hero} />
      <Footer hero={content.hero} />

      <Lightbox
        isOpen={lightbox.isOpen}
        title={lightbox.title}
        videoUrl={lightbox.videoUrl}
        onClose={handleCloseVideo}
      />
    </div>
  );
}

export default App;
