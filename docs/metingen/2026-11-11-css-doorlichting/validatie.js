// Draait in de pagina. Maakt een momentopname van de berekende stijl van ALLE elementen (en ::before/::after),
// haalt !important weg bij de opgegeven regels (via CSSOM), maakt een tweede momentopname en vergelijkt.
// Alles in een synchrone taak, zodat er geen timers of animaties tussendoor lopen.
(async (CSS_TEXT, REGELS) => {
  const link = document.querySelector('link[href*="rootedgoods.min.css"]');
  if (!link) return { fout: 'rootedgoods.min.css-link niet gevonden' };
  const st = document.createElement('style'); st.id = 'rg-meet'; st.textContent = CSS_TEXT;
  link.parentNode.insertBefore(st, link); link.remove();
  const kill = document.createElement('style'); kill.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}';
  document.head.appendChild(kill);
  await new Promise(r => setTimeout(r, 300));
  const lijst = [];
  const loop = rules => { for (const r of rules) { if (r.type === 1) lijst.push(r); else if (r.cssRules && r.type !== 7) loop(r.cssRules); } };
  loop(st.sheet.cssRules);
  const els = [...document.querySelectorAll('body, body *, html')].filter(e => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(e.tagName));
  const tekst = cs => { const r = []; for (let i = 0; i < cs.length; i++) { const n = cs[i]; r.push(n + '\t' + cs.getPropertyValue(n)); } return r.join('\n'); };
  const snap = () => { const o = []; for (const e of els) { o.push(tekst(getComputedStyle(e))); o.push(tekst(getComputedStyle(e, '::before'))); o.push(tekst(getComputedStyle(e, '::after'))); } return o; };
  const A = snap();
  let gewijzigd = 0, props = 0;
  for (const rule of lijst) {
    const l = rule.style.getPropertyValue('--rg-l'); const p = REGELS[l]; if (!p) continue; gewijzigd++;
    for (const n of p) { const w = rule.style.getPropertyValue(n); if (rule.style.getPropertyPriority(n) === 'important') { rule.style.setProperty(n, w, ''); props++; } }
  }
  const B = snap();
  const verschil = [];
  for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) {
    const e = els[Math.floor(i / 3)]; const ps = ['', '::before', '::after'][i % 3];
    const par = t => Object.fromEntries(t.split('\n').filter(Boolean).map(x => { const k = x.indexOf('\t'); return [x.slice(0, k), x.slice(k + 1)]; }));
    const pa = par(A[i]), pb = par(B[i]);
    const d = Object.keys(pa).filter(k => pa[k] !== pb[k]).map(k => `${k}: ${pa[k].slice(0, 30)} -> ${(pb[k] || '').slice(0, 30)}`);
    verschil.push({ el: e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.') : '') + ps, d: d.slice(0, 6) });
  }
  return { elementen: els.length, regelsAangepast: gewijzigd, longhandsAangepast: props, verschil: verschil.slice(0, 40), nVerschil: verschil.length };
})
