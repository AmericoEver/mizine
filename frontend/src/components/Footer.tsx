import React, { useEffect, useRef } from 'react';
import { HeroContent } from '../types';
import worldData from '../data/worldPoints.json';

interface FooterProps {
  hero: HeroContent;
}

interface WorldPoint { lat: number; lon: number; moz?: boolean }

/** Mapa-mundo pontilhado (os mesmos pontos do globo do hero) com Maputo a emitir para o mundo:
 *  a página fecha onde começou — "tudo começa e termina connosco". */
const DotMap: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const pts = worldData as WorldPoint[];
    const HQ = { lat: -25.97, lon: 32.58 };
    const targets = [
      { lat: 38.7, lon: -9.1 }, { lat: 25.2, lon: 55.3 }, { lat: -23.5, lon: -46.6 },
      { lat: -26.2, lon: 28.0 }, { lat: 51.5, lon: -0.1 }, { lat: 40.7, lon: -74.0 }, { lat: 1.3, lon: 103.8 }
    ];
    let w = 0, h = 0, raf = 0, visible = false;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const proj = (lat: number, lon: number) => ({ x: ((lon + 180) / 360) * w, y: ((80 - lat) / 140) * h });
    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (p.lat < -60 || p.lat > 80) continue;
        const { x, y } = proj(p.lat, p.lon);
        ctx.fillStyle = p.moz ? 'rgba(255,59,48,0.95)' : 'rgba(255,255,255,0.16)';
        ctx.fillRect(x, y, p.moz ? 1.8 : 1.3, p.moz ? 1.8 : 1.3);
      }
      const o = proj(HQ.lat, HQ.lon);
      targets.forEach((tg, i) => {
        const d = proj(tg.lat, tg.lon);
        const mx = (o.x + d.x) / 2;
        const my = Math.min(o.y, d.y) - Math.abs(d.x - o.x) * 0.22;
        ctx.strokeStyle = 'rgba(255,59,48,0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(o.x, o.y);
        ctx.quadraticCurveTo(mx, my, d.x, d.y);
        ctx.stroke();
        // pacote a viajar ao longo do arco
        const k = (t * 0.25 + i / targets.length) % 1;
        const bx = (1 - k) * (1 - k) * o.x + 2 * (1 - k) * k * mx + k * k * d.x;
        const by = (1 - k) * (1 - k) * o.y + 2 * (1 - k) * k * my + k * k * d.y;
        ctx.fillStyle = '#ff3b30';
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(d.x - 1.5, d.y - 1.5, 3, 3);
      });
      for (let r = 0; r < 3; r++) {
        const ph = (t * 0.8 + r / 3) % 1;
        ctx.strokeStyle = `rgba(255,59,48,${(1 - ph) * 0.7})`;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 4 + ph * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#ff3b30';
      ctx.beginPath();
      ctx.arc(o.x, o.y, 4, 0, Math.PI * 2);
      ctx.fill();
      if (visible) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) { visible = true; raf = requestAnimationFrame(draw); }
      else if (!e.isIntersecting) { visible = false; cancelAnimationFrame(raf); }
    });
    io.observe(c);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="footer2-map" aria-hidden="true" />;
};

export const Footer: React.FC<FooterProps> = ({ hero }) => {
  const email = hero.contactEmail || 'support@mizine.co.mz';
  return (
    <footer className="footer2">
      <div className="footer2-mapwrap">
        <DotMap />
        <div className="wrap footer2-loop">
          <span className="footer2-kicker">● MAPUTO [HQ] • 25°58′S 32°35′E</span>
          <p>Tudo começa connosco.<br /><span>E termina connosco.</span></p>
          <a href="#topo" className="footer2-top">Voltar ao espaço ↑</a>
        </div>
      </div>

      <div className="wrap footer2-cols">
        <div className="footer2-brand">
          <span className="footer2-logo">MIZINE<i>.</i></span>
          <p>Estúdio criativo de video making, gestão de redes sociais, convites digitais e ecossistema multimédia. Maputo, Moçambique.</p>
        </div>
        <div>
          <h4>Navegar</h4>
          <a href="#topo">Início</a>
          <a href="#sobre">Fundador</a>
          <a href="#pilares">Serviços</a>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#reels">Reels</a>
        </div>
        <div>
          <h4>Grupo</h4>
          <a href="https://instagram.com/mizine_celebrate" target="_blank" rel="noreferrer">Mizine Celebrate</a>
          <a href="https://geek.mizine.co.mz" target="_blank" rel="noreferrer">Geek Ever</a>
          <a href="#grupo">Studio 8</a>
          <a href="https://www.instagram.com/mizine_8" target="_blank" rel="noreferrer">Mizine Academy</a>
        </div>
        <div>
          <h4>Contacto</h4>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={hero.whatsappUrl || 'https://wa.me/258840000000'} target="_blank" rel="noreferrer">{hero.whatsappNumber || '+258 84 000 0000'}</a>
          <a href={hero.instagramUrl || 'https://www.instagram.com/mizine_8'} target="_blank" rel="noreferrer">{hero.instagramHandle || '@mizine_8'}</a>
          <span>Seg–Sex • 08:00–18:00</span>
        </div>
      </div>

      <div className="footer2-wordmark" aria-hidden="true">MIZINE</div>

      <div className="wrap footer2-bottom">
        <span>© {new Date().getFullYear()} Mizine Multimédia. Todos os direitos reservados.</span>
        <span className="footer2-status">● REC • 4K DCI • 24 FPS</span>
        <a href="/admin" className="footer2-admin">Admin</a>
      </div>
    </footer>
  );
};
