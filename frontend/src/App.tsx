import { useState, useEffect } from 'react';
import { SiteContent } from './types';
import { defaultContent } from './data/defaultContent';
import { apiService } from './services/api';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Strip } from './components/Strip';
import { About } from './components/About';
import { Reels } from './components/Reels';
import { Projects } from './components/Projects';
import { Clients } from './components/Clients';
import { Timeline } from './components/Timeline';
import { Team } from './components/Team';
import { Group } from './components/Group';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Lightbox } from './components/Lightbox';

import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';

export function App() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  // Determina se a URL atual é /admin ou #admin
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path === '/admin/' || hash === '#admin';
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(apiService.isAuthenticated);

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

  // Observador de interseção para ativar menu apenas na página pública
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

  // Observador de Scroll Reveal ("Txamm") para animações cinematográficas ao fazer scroll
  useEffect(() => {
    if (isAdminRoute) return;

    const timeout = setTimeout(() => {
      const targets = document.querySelectorAll(
        '.reveal-up, .reveal-fade, .reveal-scale, section > .wrap, .strip, .marq-logos, .grid .card, .reel, .tl li, .team article, .gcards .gcard, .cwrap'
      );

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach((el) => {
        if (!el.classList.contains('reveal-fade') && !el.classList.contains('reveal-scale')) {
          el.classList.add('reveal-up');
        }
        revealObserver.observe(el);
      });

      return () => revealObserver.disconnect();
    }, 80);

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

  // Página pública original 100% limpa (sem botão de admin)
  return (
    <div className="mizine-app">
      <Navbar />
      <Hero content={content.hero} />
      <Strip content={content.hero} onPlayShowreel={handleOpenVideo} />
      <About content={content.about} />
      <Reels reels={content.reels} onOpenReel={handleOpenVideo} />
      <Projects projects={content.projects} />
      <Clients clients={content.clients} testimonials={content.testimonials} />
      <Timeline timeline={content.timeline} />
      <Team team={content.team} />
      <Group companies={content.group} />
      <Contact hero={content.hero} />
      <Footer />

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
