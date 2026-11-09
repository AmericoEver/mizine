import React, { useRef } from 'react';
import { useScrollScene, smoothstep, lerp, clamp01 } from '../hooks/useScrollScene';

/**
 * CAPÍTULO 03 — "A gravação continua"
 * O ecrã torna-se o monitor da Câmara 01. Com o scroll, a câmara grava B-roll real das produções
 * Mizine (cortes de montagem + claquete por cena). Depois um whip-pan revela quem está do outro lado:
 * Moisés Mabunda, o fundador — a focagem bloqueia no rosto e o HUD conta os anos de experiência.
 */
const SHOTS = [
  { src: '/media/set/shot-02-palco.jpg', scene: 'CONFNES 2025 • PALCO PRINCIPAL', pos: '50% 60%' },
  { src: '/media/set/shot-03-painel.jpg', scene: 'PAINEL DE ESPECIALISTAS • MULTICÂMARA', pos: '50% 55%' },
  { src: '/media/set/shot-01-aerea.jpg', scene: 'PLANO AÉREO • DRONE', pos: '50% 50%' },
  { src: '/media/set/shot-07-sala.jpg', scene: 'WORKSHOP • CAPTAÇÃO CONTÍNUA', pos: '50% 50%' },
  { src: '/media/set/shot-06-reuniao.jpg', scene: 'ENTREVISTA INSTITUCIONAL', pos: '50% 45%' },
  { src: '/media/set/shot-04-orador.jpg', scene: 'KEYNOTE • RETRATO EM PALCO', pos: '50% 22%' },
  { src: '/media/set/shot-08-painel2.jpg', scene: 'CONFERÊNCIA NACIONAL • MULTICÂMARA', pos: '50% 60%' },
  { src: '/media/set/shot-05-plateia.jpg', scene: 'REACÇÕES DO PÚBLICO • B-ROLL', pos: '50% 30%' }
];

const METRICS = [
  { key: 'obras', label: 'PRODUÇÕES', unit: 'OBRAS', to: 150, prefix: '+', text: 'Comerciais, aftermovies VIP, institucionais e videoclipes.' },
  { key: 'views', label: 'AUDIÊNCIA', unit: 'VIEWS', to: 5, prefix: '+', suffix: 'M', text: 'Visualizações orgânicas geradas nas redes.' },
  { key: 'ontime', label: 'COMPROMISSO', unit: 'ON-TIME', to: 100, suffix: '%', text: 'Pontualidade sagrada em cada entrega.' }
];

/** Depois do fundador, a câmara continua a gravar a família Mizine (mesma animação). */
const CREW = [
  { name: 'Américo Mabunda', tag: 'SUJEITO 02 // POR TRÁS DO CÓDIGO', role: 'Co-fundador • Desenvolvimento & Tecnologia', line: 'Constrói as plataformas e a experiência digital do grupo.', src: '/media/team/americo.jpg', pos: '50% 12%', face: { l: 10, t: 14, w: 36, h: 66 }, faceM: { l: 4, t: 13, w: 41, h: 30 } },
  { name: 'Jorge Mabunda', tag: 'SUJEITO 03 // QUEM FEZ A IDEIA EXISTIR', role: 'Co-fundador • Director Executivo', line: 'Incentivou tudo desde o primeiro dia — a visão que tornou a Mizine possível.', src: '/media/team/jorge.jpg', pos: '50% 5%', face: { l: 35, t: 5, w: 34, h: 70 }, faceM: { l: 33, t: 5, w: 39, h: 32 } }
];
/** fracção do scroll dedicada ao B-roll + fundador; o resto é para a equipa */
const M_END = 0.56;
const CREW_LEN = (1 - M_END - 0.02) / CREW.length;

const B_START = 0.03;
const B_END = 0.5;
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

export const FounderCamera: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const shotRefs = useRef<(HTMLImageElement | null)[]>([]);
  const feedRef = useRef<HTMLImageElement | null>(null);
  const cutRef = useRef<HTMLDivElement | null>(null);
  const slateRef = useRef<HTMLDivElement | null>(null);
  const slateSceneRef = useRef<HTMLSpanElement | null>(null);
  const slateNumRef = useRef<HTMLSpanElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const takesRef = useRef<HTMLSpanElement | null>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLDivElement | null>(null);
  const yearsRef = useRef<HTMLSpanElement | null>(null);
  const yearsBarRef = useRef<HTMLSpanElement | null>(null);
  const dossierRef = useRef<HTMLDivElement | null>(null);
  const tcRef = useRef<HTMLElement | null>(null);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastShot = useRef(-1);
  const crewImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const crewCapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollScene(trackRef, (pRaw, t) => {
    // a parte do fundador corre em [0, M_END]; depois entra a equipa
    const p = clamp01(pRaw / M_END);
    const stage = stageRef.current;
    const screen = screenRef.current;
    if (!stage || !screen) return;
    const vw = stage.clientWidth;
    const vh = stage.clientHeight;
    const mobile = vw < 760;

    // Monitor da câmara: grande, 16:9, entra com um ligeiro "push-in"
    // telemóvel: monitor vertical (4:5) a ocupar o ecrã; desktop: 16:9
    const fW = mobile ? vw - 24 : Math.min(vw * 0.94, vh * 0.82 * (16 / 9));
    const fH = mobile ? Math.min(fW * 1.45, vh - 290) : fW * (9 / 16);
    const fCx = vw / 2;
    const fCy = mobile ? 70 + fH / 2 + 8 : vh * 0.54;
    const enter = smoothstep(0, 0.06, p);
    screen.style.left = `${(fCx - fW / 2).toFixed(1)}px`;
    screen.style.top = `${(fCy - fH / 2).toFixed(1)}px`;
    screen.style.width = `${fW.toFixed(1)}px`;
    screen.style.height = `${fH.toFixed(1)}px`;
    screen.style.transform = `scale(${lerp(0.9, 1, enter).toFixed(4)})`;

    // B-roll: um plano por "passo" de scroll, com corte, claquete e zoom lento
    const bp = clamp01((p - B_START) / (B_END - B_START));
    const n = SHOTS.length;
    const idx = Math.min(n - 1, Math.floor(bp * n));
    const local = bp * n - idx;
    const whip = smoothstep(0.5, 0.6, p); // whip-pan para o fundador
    shotRefs.current.forEach((img, i) => {
      if (!img) return;
      const on = i === idx;
      img.style.opacity = on ? '1' : '0';
      if (on) {
        const kb = lerp(1.04, 1.13, local);
        const pan = (i % 2 === 0 ? -1 : 1) * local * 1.6;
        img.style.transform = `translate3d(${(pan - whip * 38).toFixed(2)}%, 0, 0) scale(${kb.toFixed(4)})`;
        img.style.filter = whip > 0.01 ? `blur(${(whip * 14).toFixed(1)}px)` : '';
      }
    });
    if (idx !== lastShot.current) {
      lastShot.current = idx;
      if (slateSceneRef.current) slateSceneRef.current.textContent = SHOTS[idx].scene;
      if (slateNumRef.current) slateNumRef.current.textContent = `CENA ${pad(idx + 1)} • TAKE 1`;
    }
    if (takesRef.current) takesRef.current.textContent = pad(bp >= 1 ? n : idx + 1);
    // flash de corte no início de cada plano
    if (cutRef.current) {
      const flash = bp > 0 && bp < 1 ? Math.max(0, 1 - local / 0.12) * 0.55 : 0;
      cutRef.current.style.opacity = flash.toFixed(3);
    }
    if (slateRef.current) slateRef.current.style.opacity = (1 - smoothstep(0.46, 0.52, p)).toFixed(3);
    if (introRef.current) {
      const io = smoothstep(0.02, 0.07, p) * (1 - smoothstep(0.44, 0.5, p));
      introRef.current.style.opacity = io.toFixed(3);
      introRef.current.style.transform = `translateY(${((1 - io) * 14).toFixed(1)}px)`;
    }

    // a câmara sai do Moisés quando entra o primeiro membro da equipa
    const crewIn = smoothstep(M_END + 0.01, M_END + 0.05, pRaw);

    // O fundador entra no whip-pan: desfocado → nítido
    if (feedRef.current) {
      const f = feedRef.current;
      f.style.opacity = smoothstep(0.52, 0.58, p).toFixed(3);
      const slide = (1 - whip) * 38;
      const blur = 12 * (1 - smoothstep(0.55, 0.68, p)) + (p > 0.58 && p < 0.66 ? Math.abs(Math.sin(t * 6)) * 1.2 : 0);
      const outSlide = crewIn * -38;
      f.style.transform = `translate3d(${(slide + outSlide).toFixed(2)}%, 0, 0) scale(${lerp(1.08, 1, smoothstep(0.55, 0.75, p)).toFixed(4)})`;
      f.style.filter = `blur(${(blur + crewIn * 14 * (1 - crewIn) * 4).toFixed(2)}px)`;
      f.style.opacity = (smoothstep(0.52, 0.58, p) * (1 - smoothstep(0.6, 1, crewIn))).toFixed(3);
    }

    // Caixa de focagem: a passear no B-roll → procura → bloqueia no rosto
    const lock = smoothstep(0.62, 0.74, p);
    if (focusRef.current && crewIn <= 0) {
      const fr = focusRef.current;
      const roam = 1 - smoothstep(0.5, 0.6, p);
      const rx = 38 + Math.sin(t * 0.7) * 10 * roam;
      const ry = 26 + Math.cos(t * 0.9) * 8 * roam;
      // alvo do rosto: depende do formato do monitor (16:9 no desktop, 4:5 no telemóvel)
      const face = mobile ? { l: 24, t: 9, w: 53, h: 36 } : { l: 31.5, t: 17, w: 26, h: 58 };
      fr.style.left = `${lerp(rx, face.l, lock) + (1 - lock) * Math.sin(t * 3.1) * (1 - roam) * 3}%`;
      fr.style.top = `${lerp(ry, face.t, lock)}%`;
      fr.style.width = `${lerp(24, face.w, lock)}%`;
      fr.style.height = `${lerp(mobile ? 30 : 44, face.h, lock)}%`;
      fr.classList.toggle('is-locked', lock > 0.98);
    }
    if (subjectRef.current) {
      const so = smoothstep(0.7, 0.78, p);
      subjectRef.current.style.opacity = (so * (1 - crewIn)).toFixed(3);
      subjectRef.current.style.transform = `translateX(${((1 - so) * -16).toFixed(1)}px)`;
    }
    const yp = smoothstep(0.74, 0.88, p);
    if (yearsRef.current) yearsRef.current.textContent = `+${(3 * yp).toFixed(yp >= 1 ? 0 : 1)}`;
    if (yearsBarRef.current) yearsBarRef.current.style.transform = `scaleX(${yp.toFixed(3)})`;
    if (dossierRef.current) {
      const d = smoothstep(0.8, 0.92, p);
      const dOut = 1 - smoothstep(M_END - 0.02, M_END + 0.02, pRaw);
      dossierRef.current.style.opacity = (d * dOut).toFixed(3);
      dossierRef.current.style.transform = `translateY(${((1 - d) * 24 + (1 - dOut) * -24).toFixed(1)}px)`;
      dossierRef.current.style.pointerEvents = d * dOut > 0.6 ? 'auto' : 'none';
      const mp = smoothstep(0.82, 0.97, p);
      METRICS.forEach((m, i) => {
        const el = metricRefs.current[i];
        if (el) el.textContent = `${m.prefix ?? ''}${Math.round(m.to * mp)}${m.suffix ?? ''}`;
      });
    }
    // EQUIPA: cada membro entra com whip-pan, focagem procura → bloqueia no rosto, legenda
    CREW.forEach((c, k) => {
      const s0 = M_END + 0.01 + k * CREW_LEN;
      const u = (pRaw - s0) / CREW_LEN;
      const img = crewImgRefs.current[k];
      const cap = crewCapRefs.current[k];
      const last = k === CREW.length - 1;
      const win = smoothstep(0, 0.14, u);
      const wout = last ? 0 : smoothstep(0.86, 1, u);
      const vis = u > -0.05 && (last || u < 1.05);
      if (img) {
        const blur = 14 * (1 - smoothstep(0.08, 0.3, u)) + wout * 14 + (u > 0.2 && u < 0.32 ? Math.abs(Math.sin(t * 6)) * 1.2 : 0);
        img.style.opacity = vis ? (win * (1 - wout)).toFixed(3) : '0';
        img.style.transform = `translate3d(${((1 - win) * 38 - wout * 38).toFixed(2)}%, 0, 0) scale(${lerp(1.1, 1, smoothstep(0.05, 0.6, u)).toFixed(4)})`;
        img.style.filter = `blur(${blur.toFixed(2)}px)`;
      }
      if (cap) {
        const co = smoothstep(0.32, 0.46, u) * (1 - (last ? 0 : smoothstep(0.82, 0.9, u)));
        cap.style.opacity = vis ? co.toFixed(3) : '0';
        cap.style.transform = `translateX(${((1 - co) * -16).toFixed(1)}px)`;
      }
      if (focusRef.current && vis && u >= 0 && (last || u < 1)) {
        const fr = focusRef.current;
        const lk = smoothstep(0.16, 0.38, u);
        const f = mobile ? c.faceM : c.face;
        const hunt = (1 - lk) * Math.sin(t * 3.1) * 3;
        fr.style.left = `${lerp(40, f.l, lk) + hunt}%`;
        fr.style.top = `${lerp(24, f.t, lk)}%`;
        fr.style.width = `${lerp(24, f.w, lk)}%`;
        fr.style.height = `${lerp(mobile ? 30 : 44, f.h, lk)}%`;
        fr.classList.toggle('is-locked', lk > 0.98 && wout < 0.05);
      }
    });

    const frames = Math.floor(t * 24);
    if (tcRef.current) {
      tcRef.current.textContent = `01:${pad((frames / 24 / 60) % 60)}:${pad((frames / 24) % 60)}:${pad(frames % 24)}`;
    }
  });

  return (
    <div className="cam-track" ref={trackRef}>
      <div className="cam-stage" ref={stageRef}>
        <div className="cam-screen" ref={screenRef}>
          {/* B-roll real das produções Mizine */}
          {SHOTS.map((s, i) => (
            <img
              key={s.src}
              ref={el => { shotRefs.current[i] = el; }}
              src={s.src}
              alt=""
              className="cam-shot"
              style={{ objectPosition: s.pos, opacity: i === 0 ? 1 : 0 }}
              loading="lazy"
            />
          ))}
          {/* o fundador (whip-pan) */}
          <img ref={feedRef} src="/media/founder/moises-cinema-set.jpg" alt="Moisés Jorge Mabunda" className="cam-feed" />
          {CREW.map((c, k) => (
            <img
              key={c.src}
              ref={el => { crewImgRefs.current[k] = el; }}
              src={c.src}
              alt={c.name}
              className="cam-feed cam-crew"
              style={{ objectPosition: c.pos }}
              loading="lazy"
            />
          ))}
          <div className="cam-cut" ref={cutRef} />
          <div className="cam-grain" aria-hidden="true" />

          {/* HUD do monitor */}
          <div className="cam-hud-grid" />
          <span className="cam-hud-corner tl" />
          <span className="cam-hud-corner tr" />
          <span className="cam-hud-corner bl" />
          <span className="cam-hud-corner br" />
          <div className="cam-hud-top">
            <span className="cam-hud-rec">
              <i /> REC [RAW]
            </span>
            <span>
              TC <b ref={el => { tcRef.current = el; }}>01:00:00:00</b>
            </span>
            <span>CÂMARA 01</span>
            <span className="cam-hud-batt">▮▮▮▮▯ 98%</span>
          </div>

          <div className="cam-focus" ref={focusRef}>
            <span className="cam-focus-label">AF • ROSTO</span>
          </div>

          {/* abertura do capítulo, sobre o B-roll */}
          <div className="cam-intro" ref={introRef}>
            <span className="cam-intro-tag">CÂMARA 01 // A GRAVAÇÃO CONTINUA</span>
            <strong>Cada palco. Cada evento. Cada rosto.</strong>
            <span className="cam-intro-takes">
              TAKES GRAVADOS <b ref={takesRef}>01</b> / {pad(SHOTS.length)}
            </span>
          </div>

          {/* claquete digital por cena */}
          <div className="cam-slate" ref={slateRef}>
            <span className="cam-slate-num" ref={slateNumRef}>CENA 01 • TAKE 1</span>
            <span className="cam-slate-scene" ref={slateSceneRef}>{SHOTS[0].scene}</span>
          </div>

          <div className="cam-subject" ref={subjectRef}>
            <span className="cam-subject-tag">SUJEITO 01 // POR TRÁS DA CÂMARA</span>
            <strong>Moisés Jorge Mabunda</strong>
            <span className="cam-subject-role">Co-fundador • Diretor Criativo • Licenciado em Cinema e Audiovisual</span>
            <div className="cam-years">
              <span className="cam-years-num" ref={yearsRef}>+0</span>
              <span className="cam-years-lbl">
                ANOS DE EXPERIÊNCIA
                <span className="cam-years-bar">
                  <span ref={yearsBarRef} />
                </span>
              </span>
            </div>
          </div>

          {CREW.map((c, k) => (
            <div key={c.name} className="cam-subject cam-crew-cap" ref={el => { crewCapRefs.current[k] = el; }}>
              <span className="cam-subject-tag">{c.tag}</span>
              <strong>{c.name}</strong>
              <span className="cam-subject-role">{c.role}</span>
              <span className="cam-crew-line">{c.line}</span>
            </div>
          ))}

          <div className="cam-hud-bottom">
            <span>1/48s • 180°</span>
            <span>ISO 800</span>
            <span>5600K DAYLIGHT</span>
            <span>T1.5</span>
            <span className="cam-hud-audio">
              CH1/2 <i />
            </span>
          </div>
        </div>

        {/* Dossier do fundador — entra no fim do plano */}
        <div className="cam-dossier" ref={dossierRef}>
          <div className="cam-dossier-head">
            <span className="founder-badge">LIDERANÇA & CRIAÇÃO</span>
            <span className="founder-status-live">● ON SET // GRAVANDO</span>
          </div>
          <p className="cam-dossier-quote">
            “Desenvolvo soluções visuais que combinam criatividade, estratégia e rigor técnico — cinema e design ao serviço da autoridade de cada marca.”
          </p>
          <div className="cam-dossier-metrics">
            {METRICS.map((m, i) => (
              <div key={m.key} className="cam-metric">
                <span className="cam-metric-lbl">{m.label}</span>
                <span className="cam-metric-num">
                  <span ref={el => { metricRefs.current[i] = el; }}>0</span>
                  <small>{m.unit}</small>
                </span>
                <span className="cam-metric-txt">{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
