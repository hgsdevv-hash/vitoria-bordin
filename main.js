(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '5519995124885';

  /* ---------- texto que ocupa a largura toda ---------- */
  function fitAll() {
    $$('[data-fit]').forEach(el => {
      const box = el.parentElement;
      const target = box.clientWidth;
      if (!target) return;
      el.style.fontSize = '100px';
      const w = el.scrollWidth;
      if (!w) return;
      el.style.fontSize = (100 * target / w * 0.995) + 'px';
      box.style.fontSize = el.style.fontSize;
    });
  }
  fitAll();
  if (document.fonts) {
    document.fonts.ready.then(fitAll);
    document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', fitAll);
    document.fonts.load('800 100px "Cabinet Grotesk"').then(fitAll).catch(() => {});
    document.fonts.load('400 100px "Cabinet Grotesk"').then(fitAll).catch(() => {});
  }
  addEventListener('load', fitAll);
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fitAll, 120); });

  /* ---------- abertura: os cílios desenhados fio a fio ---------- */
  const hero = $('.hero');
  const hl = $('#hero-lashes');
  if (hl) {
    const NSH = 'http://www.w3.org/2000/svg';
    const L = [[70, 400], [330, 170], [870, 170], [1130, 400]];
    const pt = (t) => { const u = 1 - t; return [0, 1].map(k => u*u*u*L[0][k] + 3*u*u*t*L[1][k] + 3*u*t*t*L[2][k] + t*t*t*L[3][k]); };
    const tg = (t) => { const u = 1 - t; return [0, 1].map(k => 3*u*u*(L[1][k]-L[0][k]) + 6*u*t*(L[2][k]-L[1][k]) + 3*t*t*(L[3][k]-L[2][k])); };
    const n = 64;
    for (let i = 0; i < n; i++) {
      const t = 0.03 + (i / (n - 1)) * 0.94;
      const p = pt(t), d = tg(t), m = Math.hypot(d[0], d[1]);
      let v = [d[1] / m, -d[0] / m];
      const out = Math.max(0, (t - 0.4) / 0.6);
      const a = 0.12 + 0.5 * out * out - 0.25 * Math.max(0, 0.25 - t) * 4;
      v = [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
      const len = 80 + 170 * Math.pow(t, 1.6) + (i % 3 === 1 ? 14 : 0);
      const pe = [v[1], -v[0]];
      const c = [p[0] + v[0] * len * 0.55 + pe[0] * len * 0.18, p[1] + v[1] * len * 0.55 + pe[1] * len * 0.18];
      const e = [p[0] + v[0] * len, p[1] + v[1] * len];
      const path = document.createElementNS(NSH, 'path');
      path.setAttribute('class', 'lash-s');
      path.setAttribute('pathLength', '1');
      path.setAttribute('d', `M${p[0].toFixed(1)} ${p[1].toFixed(1)} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
      path.style.setProperty('--d', (0.32 + i * 0.011).toFixed(3) + 's');
      hl.appendChild(path);
    }
  }
  const go = () => hero.classList.add('is-drawn', 'is-ready');
  setTimeout(go, 80);

  /* ---------- menu ---------- */
  const mBtn = $('.nav__menu'), menu = $('#menu');
  function setMenu(open) {
    mBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    mBtn.textContent = open ? 'Fechar' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  mBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  mBtn.style.position = 'relative'; mBtn.style.zIndex = '25';
  $('.nav').style.zIndex = '25';

  /* ---------- entradas ---------- */
  $$('section, footer').forEach(sec => {
    $$('.rv, .rv-img', sec).forEach((el, i) => el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms'));
  });
  // só esconde o que está chegando perto da tela; o resto fica visível sempre
  let pending = $$('.rv, .rv-img');
  function checkReveal() {
    const vh = innerHeight;
    pending = pending.filter(el => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.92) { el.classList.add('in'); return false; }
      if (top < vh * 1.5 && !reduce) el.classList.add('pre');
      return true;
    });
  }
  let sr = 0;
  addEventListener('scroll', () => { if (!sr) sr = requestAnimationFrame(() => { sr = 0; checkReveal(); }); }, { passive: true });
  addEventListener('resize', checkReveal);
  checkReveal();
  setInterval(() => pending.length && checkReveal(), 400);

  /* ---------- vídeo do processo ---------- */
  const vid = $('.como video');
  if (vid) {
    if (reduce) { vid.removeAttribute('loop'); }
    else {
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { vid.preload = 'auto'; vid.play().catch(() => {}); } else vid.pause();
      }, { threshold: 0.25 }).observe(vid);
    }
  }

  /* ---------- botão flutuante ---------- */
  const wa = $('.wa');
  const foot = $('#contato') || $('footer');
  const showWa = () => wa.classList.toggle('is-on', scrollY > innerHeight * 0.8 && (!foot || foot.getBoundingClientRect().top > innerHeight * 0.75));
  addEventListener('scroll', showWa, { passive: true }); showWa();

  /* ---------- mapa de cílios ---------- */
  const svg = $('#eye');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const gL = $('#eye-lashes'), gN = $('#eye-nums'), gZ = $('#eye-zones');
  // pálpebra: cúbica M70 222 C 180 120, 460 120, 570 222 (canto interno à esquerda)
  const P = [[70, 222], [180, 120], [460, 120], [570, 222]];
  // borda de baixo do adesivo: M60 214 C 150 400, 490 400, 580 214
  const Q = [[60, 214], [150, 400], [490, 400], [580, 214]];
  const bez = (C, t) => {
    const u = 1 - t;
    return [
      u*u*u*C[0][0] + 3*u*u*t*C[1][0] + 3*u*t*t*C[2][0] + t*t*t*C[3][0],
      u*u*u*C[0][1] + 3*u*u*t*C[1][1] + 3*u*t*t*C[2][1] + t*t*t*C[3][1]
    ];
  };
  const tan = (C, t) => {
    const u = 1 - t;
    return [
      3*u*u*(C[1][0]-C[0][0]) + 6*u*t*(C[2][0]-C[1][0]) + 3*t*t*(C[3][0]-C[2][0]),
      3*u*u*(C[1][1]-C[0][1]) + 6*u*t*(C[2][1]-C[1][1]) + 3*t*t*(C[3][1]-C[2][1])
    ];
  };

  const MAPS = {
    boneca: { mm: [8, 9, 10, 11, 11, 10, 9], lift: 0, txt: 'mais comprido no meio, para um olhar aberto e redondo' },
    fox:    { mm: [8, 9, 10, 11, 12, 12, 12], lift: 0.55, txt: 'curto no canto de dentro e puxado para cima no de fora, o olhar de raposa' },
    sirena: { mm: [8, 9, 10, 11, 12, 13, 13], lift: 0.2, txt: 'cresce até o canto de fora e alonga o olho' },
    rimel:  { mm: [9, 10, 10, 11, 11, 10, 9], lift: 0, spikes: true, txt: 'pontas marcadas entre fios mais curtos, como quem acabou de passar rímel' }
  };
  const NAMES = { boneca: 'Boneca', fox: 'Fox eyes', sirena: 'Sirena', rimel: 'Efeito rímel', brasileiro: 'volume brasileiro', egipcio: 'volume egípcio', preto: 'fio preto', marrom: 'fio marrom' };
  const state = { efeito: 'boneca', volume: 'brasileiro', cor: 'preto' };
  const ZONES = 7, N = 34, PX = 7.4;

  // números e divisões das regiões
  for (let z = 0; z < ZONES; z++) {
    const tc = 0.06 + (z + 0.5) * (0.88 / ZONES);
    const a = bez(P, tc), b = bez(Q, tc);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('class', 'eye__num');
    t.setAttribute('x', ((a[0] + b[0]) / 2).toFixed(1));
    t.setAttribute('y', ((a[1] + b[1]) / 2 + 30).toFixed(1));
    gN.appendChild(t);
    if (z > 0) {
      const tb = 0.06 + z * (0.88 / ZONES);
      const p1 = bez(P, tb), p2 = bez(Q, tb);
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('class', 'eye__zone');
      l.setAttribute('x1', p1[0].toFixed(1)); l.setAttribute('y1', (p1[1] + 8).toFixed(1));
      l.setAttribute('x2', ((p1[0] + p2[0]) / 2).toFixed(1)); l.setAttribute('y2', ((p1[1] + p2[1]) / 2 + 40).toFixed(1));
      gZ.appendChild(l);
    }
  }
  const lashes = [];
  for (let i = 0; i < N; i++) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('class', 'eye__lash');
    gL.appendChild(p); lashes.push(p);
  }

  function mmAt(map, t) {
    // t de 0 a 1 ao longo da pálpebra -> interpola entre os centros das regiões
    const x = Math.min(Math.max((t - 0.06) / 0.88, 0), 0.9999) * ZONES - 0.5;
    const i = Math.floor(x), f = x - i;
    const a = map.mm[Math.max(0, Math.min(ZONES - 1, i))], b = map.mm[Math.max(0, Math.min(ZONES - 1, i + 1))];
    return a + (b - a) * f;
  }
  const rot = (v, ang) => [v[0] * Math.cos(ang) - v[1] * Math.sin(ang), v[0] * Math.sin(ang) + v[1] * Math.cos(ang)];
  const f1 = n => n.toFixed(1);

  function strand(base, dir, L, curl) {
    const perp = [dir[1], -dir[0]]; // curva para fora
    const end = [base[0] + dir[0] * L, base[1] + dir[1] * L];
    const c = [base[0] + dir[0] * L * 0.55 + perp[0] * L * curl, base[1] + dir[1] * L * 0.55 + perp[1] * L * curl];
    return `M${f1(base[0])} ${f1(base[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(end[0])} ${f1(end[1])}`;
  }

  function draw() {
    const map = MAPS[state.efeito];
    const color = state.cor === 'marrom' ? '#6b3a24' : '#1a0913';
    lashes.forEach((p, i) => {
      const t = 0.04 + (i / (N - 1)) * 0.92;
      const base = bez(P, t);
      const tg = tan(P, t); const len = Math.hypot(tg[0], tg[1]);
      let dir = [tg[1] / len, -tg[0] / len]; // normal para cima
      // inclina um pouco para o canto de fora, e mais ainda no fox
      const outer = Math.max(0, (t - 0.45) / 0.55);
      dir = rot(dir, 0.18 + map.lift * outer * outer);
      let mm = mmAt(map, t);
      let w = 2.2;
      if (map.spikes) { if (i % 4 === 1) { mm += 1.6; w = 3.4; } else mm -= 1.2; }
      const L = mm * PX;
      let d = '';
      if (state.volume === 'egipcio') {
        [-0.2, -0.1, 0, 0.1, 0.2].forEach(s => { d += strand(base, rot(dir, s), L * (1 - Math.abs(s) * 0.5), 0.14); });
      } else {
        d += strand(base, dir, L, 0.14);
        const mid = [base[0] + dir[0] * L * 0.35, base[1] + dir[1] * L * 0.35];
        d += strand(mid, rot(dir, 0.22), L * 0.6, 0.12);
      }
      p.setAttribute('d', d);
      p.style.stroke = color;
      p.style.strokeWidth = state.volume === 'egipcio' ? Math.max(1.3, w - 0.8) : w;
    });
    $$('.eye__num', gN).forEach((t, z) => { t.textContent = map.mm[z]; });

    const res = `${NAMES[state.efeito]}, ${NAMES[state.volume]}, ${NAMES[state.cor]}: ${map.txt}.`;
    $('#mapa-res').textContent = res;
    const msg = `Oi, Vitória! Montei meu mapa no seu site: ${NAMES[state.efeito]}, ${NAMES[state.volume]}, ${NAMES[state.cor]} (${map.mm.join('-')} mm). Pode me passar os horários?`;
    $('#mapa-cta').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }

  $$('.opt').forEach(fs => {
    const group = fs.dataset.group;
    fs.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', fs).forEach(c => { const on = c === b; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
      state[group] = b.dataset.v;
      draw();
    });
  });
  draw();
})();
