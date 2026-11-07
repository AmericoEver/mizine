import React, { useRef } from 'react';
import { useScrollScene, smoothstep, lerp } from '../hooks/useScrollScene';

/**
 * CAPÍTULO 03 — "A gravação continua"
 * Uma câmara de cinema num tripé está a gravar. Com o scroll, a câmara aproxima-se até o monitor
 * encher o ecrã; a focagem acerta e vemos, de relance, quem está a ser filmado: Moisés Mabunda,
 * o fundador. O HUD bloqueia o rosto e conta os anos de experiência.
 *
 * Geometria do rig (viewBox 640×560): monitor em x 186–474, y 40–202 (16:9).
 */
const MON = { x: 186 / 640, y: 40 / 560, w: 288 / 640, h: 162 / 560 };

const METRICS = [
  { key: 'obras', label: 'PRODUÇÕES', unit: 'OBRAS', to: 150, prefix: '+', text: 'Comerciais, aftermovies VIP, institucionais e videoclipes.' },
  { key: 'views', label: 'AUDIÊNCIA', unit: 'VIEWS', to: 5, prefix: '+', suffix: 'M', text: 'Visualizações orgânicas geradas nas redes.' },
  { key: 'ontime', label: 'COMPROMISSO', unit: 'ON-TIME', to: 100, suffix: '%', text: 'Pontualidade sagrada em cada entrega.' }
];

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

export const FounderCamera: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const feedRef = useRef<HTMLImageElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLDivElement | null>(null);
  const yearsRef = useRef<HTMLSpanElement | null>(null);
  const yearsBarRef = useRef<HTMLSpanElement | null>(null);
  const dossierRef = useRef<HTMLDivElement | null>(null);
  const tcRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useScrollScene(trackRef, (p, t) => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    if (!stage || !rig) return;
    const vw = stage.clientWidth;
    const vh = stage.clientHeight;
    const mobile = vw < 760;

    // Rectângulo final do monitor (ecrã cheio, 16:9)
    const fW = Math.min(vw * (mobile ? 1 : 0.94), vh * 0.84 * (16 / 9));
    const fH = fW * (9 / 16);
    const fCx = vw / 2;
    const fCy = mobile ? vh * 0.42 : vh * 0.53;

    // Rectângulo do monitor no rig (sem transformações)
    const rL = rig.offsetLeft;
    const rT = rig.offsetTop;
    const rW = rig.offsetWidth;
    const rH = rig.offsetHeight;
    const mW = rW * MON.w;
    const mCx = rL + rW * (MON.x + MON.w / 2);
    const mCy = rT + rH * (MON.y + MON.h / 2);

    // 1) dolly suave + 2) push-in até o monitor encher o ecrã
    const dolly = smoothstep(0, 0.25, p);
    const zRaw = smoothstep(0.22, 0.6, p);
    const z = zRaw * zRaw * (3 - 2 * zRaw);
    const s = lerp(lerp(0.9, 1, dolly), fW / mW, z);
    const tx = (fCx - mCx) * z;
    const ty = (fCy - mCy) * z + (1 - z) * Math.sin(t * 0.8) * 2;
    rig.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;

    // focagem: desfocado → nítido (o "relance")
    if (feedRef.current) {
      const blur = 5 * (1 - smoothstep(0.5, 0.68, p)) + (z > 0.05 && z < 0.95 ? Math.abs(Math.sin(t * 6)) * 1.2 : 0);
      feedRef.current.style.filter = `blur(${blur.toFixed(2)}px) saturate(${lerp(0.6, 1.05, smoothstep(0.5, 0.7, p)).toFixed(2)})`;
    }
    if (frameRef.current) frameRef.current.style.opacity = (1 - smoothstep(0.42, 0.58, p)).toFixed(3);
    // quando o monitor enche o ecrã, o resto da câmara desaparece (fica só o plano)
    if (svgRef.current) svgRef.current.style.opacity = (1 - smoothstep(0.5, 0.62, p)).toFixed(3);
    if (captionRef.current) {
      const c = 1 - smoothstep(0.16, 0.28, p);
      captionRef.current.style.opacity = c.toFixed(3);
      captionRef.current.style.transform = `translateY(${((1 - c) * -20).toFixed(1)}px)`;
    }

    // HUD de câmara em ecrã cheio
    const hud = hudRef.current;
    if (hud) {
      hud.style.left = `${(fCx - fW / 2).toFixed(1)}px`;
      hud.style.top = `${(fCy - fH / 2).toFixed(1)}px`;
      hud.style.width = `${fW.toFixed(1)}px`;
      hud.style.height = `${fH.toFixed(1)}px`;
      hud.style.opacity = smoothstep(0.56, 0.66, p).toFixed(3);
    }
    // Caixa de focagem: procura → bloqueia no rosto
    const lock = smoothstep(0.62, 0.74, p);
    if (focusRef.current) {
      const f = focusRef.current;
      const hunt = (1 - lock) * Math.sin(t * 3.1) * 3;
      f.style.left = `${lerp(30, 31.5, lock) + hunt}%`;
      f.style.top = `${lerp(12, 17, lock)}%`;
      f.style.width = `${lerp(40, 26, lock)}%`;
      f.style.height = `${lerp(70, 58, lock)}%`;
      f.classList.toggle('is-locked', lock > 0.98);
    }
    if (subjectRef.current) {
      const so = smoothstep(0.7, 0.78, p);
      subjectRef.current.style.opacity = so.toFixed(3);
      subjectRef.current.style.transform = `translateX(${((1 - so) * -16).toFixed(1)}px)`;
    }
    // Anos de experiência (conta enquanto se faz scroll)
    const yp = smoothstep(0.74, 0.88, p);
    if (yearsRef.current) yearsRef.current.textContent = `+${(3 * yp).toFixed(yp >= 1 ? 0 : 1)}`;
    if (yearsBarRef.current) yearsBarRef.current.style.transform = `scaleX(${yp.toFixed(3)})`;
    if (dossierRef.current) {
      const d = smoothstep(0.8, 0.92, p);
      dossierRef.current.style.opacity = d.toFixed(3);
      dossierRef.current.style.transform = `translateY(${((1 - d) * 24).toFixed(1)}px)`;
      dossierRef.current.style.pointerEvents = d > 0.6 ? 'auto' : 'none';
      const mp = smoothstep(0.82, 0.97, p);
      METRICS.forEach((m, i) => {
        const el = metricRefs.current[i];
        if (el) el.textContent = `${m.prefix ?? ''}${Math.round(m.to * mp)}${m.suffix ?? ''}`;
      });
    }
    // Timecode a 24 fps (corre em tempo real enquanto a cena está visível)
    const frames = Math.floor(t * 24);
    const tc = `01:${pad((frames / 24 / 60) % 60)}:${pad((frames / 24) % 60)}:${pad(frames % 24)}`;
    tcRefs.current.forEach(el => {
      if (el) el.textContent = tc;
    });
  });

  return (
    <div className="cam-track" ref={trackRef}>
      <div className="cam-stage" ref={stageRef}>
        <div className="cam-caption" ref={captionRef}>
          <span className="cam-cap-rec">
            <i /> CÂMARA 01 • REC
          </span>
          <span className="cam-cap-tc" ref={el => { tcRefs.current[0] = el; }}>01:00:00:00</span>
          <p>As marcas ficaram gravadas. A câmara continua a rodar — e do outro lado da lente…</p>
        </div>

        <div className="cam-rig" ref={rigRef} aria-hidden="true">
          <svg ref={svgRef} viewBox="0 0 640 560" className="cam-rig-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="camBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#30333f" />
                <stop offset="0.55" stopColor="#1a1c24" />
                <stop offset="1" stopColor="#0d0e13" />
              </linearGradient>
              <linearGradient id="camMetal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4a4e5e" />
                <stop offset="1" stopColor="#16181f" />
              </linearGradient>
              <linearGradient id="camLens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2b2e39" />
                <stop offset="0.5" stopColor="#111217" />
                <stop offset="1" stopColor="#07080b" />
              </linearGradient>
              <linearGradient id="camLeg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#101117" />
                <stop offset="0.5" stopColor="#3b3e4b" />
                <stop offset="1" stopColor="#101117" />
              </linearGradient>
            </defs>

            {/* sombra no chão */}
            <ellipse cx="330" cy="548" rx="230" ry="9" fill="rgba(12,14,30,0.14)" />

            {/* TRIPÉ — pernas de carbono com tubos telescópicos */}
            <g strokeLinecap="round">
              <path d="M318 372 L148 538" stroke="#12131a" strokeWidth="11" />
              <path d="M318 372 L148 538" stroke="#3c3f4c" strokeWidth="3" strokeDasharray="34 6" />
              <path d="M342 372 L512 538" stroke="#12131a" strokeWidth="11" />
              <path d="M342 372 L512 538" stroke="#3c3f4c" strokeWidth="3" strokeDasharray="34 6" />
              <path d="M330 376 L330 546" stroke="#0d0e13" strokeWidth="12" />
              <path d="M330 376 L330 546" stroke="#454857" strokeWidth="3" strokeDasharray="34 6" />
              <path d="M214 474 L330 460 L446 474" stroke="#ff3b30" strokeWidth="3" />
              <circle cx="330" cy="460" r="5" fill="#ff3b30" />
            </g>
            <rect x="138" y="536" width="22" height="7" rx="2" fill="#07080b" />
            <rect x="319" y="544" width="22" height="7" rx="2" fill="#07080b" />
            <rect x="500" y="536" width="22" height="7" rx="2" fill="#07080b" />

            {/* bacia + cabeça fluida + braço de pan */}
            <rect x="298" y="352" width="64" height="24" rx="7" fill="url(#camMetal)" />
            <rect x="294" y="330" width="72" height="26" rx="6" fill="#1b1d26" stroke="#2f3240" />
            <circle cx="330" cy="343" r="6" fill="#ff3b30" />
            <circle cx="330" cy="343" r="2.4" fill="#ffd2cf" />
            <path d="M366 344 L476 376" stroke="#1b1d26" strokeWidth="9" strokeLinecap="round" />
            <path d="M452 369 L486 379" stroke="#ff3b30" strokeWidth="11" strokeLinecap="round" />

            {/* placa base + varões */}
            <rect x="226" y="318" width="218" height="12" rx="3" fill="#252833" />
            <path d="M130 334 L310 334" stroke="#2a2d38" strokeWidth="6" strokeLinecap="round" />

            {/* follow focus */}
            <rect x="172" y="300" width="10" height="34" rx="2" fill="#1b1d26" />
            <circle cx="177" cy="300" r="15" fill="#15161d" stroke="#3a3d4a" strokeWidth="2" strokeDasharray="3 2.2" />
            <circle cx="177" cy="300" r="5" fill="#ff3b30" />

            {/* matte box */}
            <path d="M84 226 L142 246 L142 310 L84 330 Z" fill="#14151c" stroke="#2c2f3b" strokeWidth="2" />
            <path d="M84 226 L60 214 M84 330 L60 342" stroke="#2c2f3b" strokeWidth="4" strokeLinecap="round" />
            <path d="M90 232 L90 324" stroke="rgba(120,180,255,0.35)" strokeWidth="2" />

            {/* objectiva cine com anel de foco graduado */}
            <rect x="140" y="252" width="90" height="52" rx="6" fill="url(#camLens)" stroke="#2a2d38" />
            <g stroke="#9aa0b4" strokeWidth="1.2">
              {Array.from({ length: 11 }, (_, i) => (
                <path key={i} d={`M${156 + i * 6} 256 V${i % 5 === 0 ? 268 : 263}`} />
              ))}
            </g>
            <path d="M188 252 V304" stroke="#ff3b30" strokeWidth="1.6" />
            <text x="152" y="296" fill="#c9cdda" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
              35mm T1.5
            </text>
            <rect x="228" y="246" width="26" height="64" rx="5" fill="url(#camMetal)" />

            {/* corpo da câmara */}
            <rect x="252" y="234" width="180" height="86" rx="9" fill="url(#camBody)" stroke="#3b3f4e" />
            <rect x="266" y="250" width="70" height="34" rx="3" fill="#07080b" stroke="#2a2d38" />
            <text x="272" y="263" fill="#ffae19" fontSize="7.5" fontFamily="JetBrains Mono, monospace">24.00 FPS</text>
            <text x="272" y="276" fill="#00d4ff" fontSize="7.5" fontFamily="JetBrains Mono, monospace">4K DCI RAW</text>
            <g stroke="#2c2f3b" strokeWidth="2">
              {Array.from({ length: 6 }, (_, i) => (
                <path key={i} d={`M${356 + i * 9} 252 V300`} />
              ))}
            </g>
            <text x="268" y="308" fill="#6c7084" fontSize="8" fontWeight="800" fontFamily="Space Grotesk, sans-serif" letterSpacing="2">
              MIZINE CINE
            </text>
            <circle cx="414" cy="306" r="6" fill="#e10600" stroke="#ff8a84" strokeWidth="1.5" />

            {/* pega superior + braço do monitor */}
            <path d="M272 234 V214 Q272 208 278 208 H404 Q410 208 410 214 V234" stroke="#1b1d26" strokeWidth="9" strokeLinejoin="round" />
            <rect x="322" y="198" width="16" height="14" rx="3" fill="#2a2d38" />
            <circle className="cam-tally" cx="262" cy="228" r="5" fill="#ff3b30" />

            {/* visor electrónico (EVF) */}
            <rect x="432" y="248" width="46" height="28" rx="6" fill="#16171e" stroke="#2c2f3b" />
            <ellipse cx="482" cy="262" rx="6" ry="15" fill="#0b0c10" />

            {/* cabo do monitor */}
            <path d="M470 196 C 520 210, 500 250, 440 258" stroke="#14151c" strokeWidth="3" />
          </svg>

          {/* Monitor (HTML): o feed ao vivo da câmara */}
          <div className="cam-monitor">
            <img
              ref={feedRef}
              src="/media/founder/moises-cinema-set.jpg"
              alt=""
              className="cam-feed"
            />
            <div className="cam-monitor-frame" ref={frameRef}>
              <span className="cam-mon-rec">● REC</span>
              <span className="cam-mon-tc">CAM 01</span>
            </div>
          </div>
        </div>

        {/* HUD em ecrã cheio (não é escalado: texto sempre nítido) */}
        <div className="cam-hud" ref={hudRef}>
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
              TC <b ref={el => { tcRefs.current[1] = el; }}>01:00:00:00</b>
            </span>
            <span>4K DCI • 24 FPS</span>
            <span className="cam-hud-batt">▮▮▮▮▯ 98%</span>
          </div>

          <div className="cam-focus" ref={focusRef}>
            <span className="cam-focus-label">AF • ROSTO</span>
          </div>

          <div className="cam-subject" ref={subjectRef}>
            <span className="cam-subject-tag">SUJEITO 01 // EM FOCO</span>
            <strong>Moisés Jorge Mabunda</strong>
            <span className="cam-subject-role">Fundador & Diretor Criativo • Licenciado em Cinema e Audiovisual</span>
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
