import React, { useEffect, useRef } from 'react';
import worldData from '../data/worldPoints.json';

interface WorldPoint { lat: number; lon: number; moz?: boolean }

/** Mapa-mundo pontilhado (os mesmos pontos do globo do hero) com Maputo a emitir para o mundo:
 *  a página fecha onde começou — "tudo começa e termina connosco". */
export const DotMap: React.FC<{ className?: string; reveal?: boolean }> = ({ className = 'footer2-map', reveal = false }) => {
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
    // vista: escala igual em lon/lat (sem esticar). Ecrãs largos: mundo inteiro; estreitos: África/Moçambique em foco
    let sc = 1, lonC = 0, latC = 10, dot = 1.3;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w / h >= 1.7) {
        sc = Math.min(w / 360, h / 140);
        lonC = 0;
        latC = 10;
      } else {
        // largura visível ~ 120°..60° de longitude conforme o ecrã, centrada entre África e o Índico
        const lonSpan = Math.max(62, Math.min(130, 130 * (w / h) / 1.7));
        sc = Math.min(w / lonSpan, h / 95);
        lonC = 24;
        latC = -2;
      }
      dot = Math.max(1.3, Math.min(3.2, sc * 0.55));
    };
    const proj = (lat: number, lon: number) => ({ x: w / 2 + (lon - lonC) * sc, y: h / 2 - (lat - latC) * sc });
    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const sweep = reveal ? Math.min(1, t / 0.9) : 1;
      for (const p of pts) {
        if (p.lat < -60 || p.lat > 80) continue;
        const { x, y } = proj(p.lat, p.lon);
        if (x > sweep * w || x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        ctx.fillStyle = p.moz ? 'rgba(255,59,48,0.95)' : 'rgba(255,255,255,0.18)';
        const ds = p.moz ? dot * 1.35 : dot;
        ctx.fillRect(x - ds / 2, y - ds / 2, ds, ds);
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
  return <canvas ref={ref} className={className} aria-hidden="true" />;
};

