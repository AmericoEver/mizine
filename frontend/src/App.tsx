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
  const [view, setView] = useState<'site' | 'login' | 'admin'>('site');
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; title: string; videoUrl: string }>({
    isOpen: false,
    title: '',
    videoUrl: ''
  });

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
    if (view !== 'site') return;

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
  }, [view, content]);

  const handleOpenAdmin = () => {
    if (view === 'admin') {
      setView('site');
      return;
    }
    if (apiService.isAuthenticated()) {
      setView('admin');
    } else {
      setView('login');
    }
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

  return (
    <div className="mizine-app">
      {view === 'login' ? (
        <AdminLogin
          onSuccess={() => setView('admin')}
          onCancel={() => setView('site')}
        />
      ) : view === 'admin' ? (
        <>
          <Navbar onOpenAdmin={() => setView('site')} isAdminView={true} />
          <AdminDashboard
            initialContent={content}
            onClose={() => setView('site')}
            onContentUpdated={(updated) => setContent(updated)}
          />
        </>
      ) : (
        <>
          <Navbar onOpenAdmin={handleOpenAdmin} />
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
        </>
      )}
    </div>
  );
}

export default App;
