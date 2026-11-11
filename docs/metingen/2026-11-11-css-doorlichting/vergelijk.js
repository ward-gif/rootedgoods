// In de pagina: zet CSS A neer, maakt een momentopname van alle berekende stijlen (incl. ::before/::after), zet CSS B neer,
// maakt een tweede en vergelijkt. Zelfde DOM, geen ruis. Geeft de verschillen terug.
(async (CSS_A, CSS_B) => {
  const link = document.querySelector('link[href*="rootedgoods.min.css"]'); if (!link) return { fout: 'geen link' };
  const st = document.createElement('style'); st.id = 'rg-meet'; st.textContent = CSS_A; link.parentNode.insertBefore(st, link); link.remove();
  const kill = document.createElement('style'); kill.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}'; document.head.appendChild(kill);
  await new Promise(r => setTimeout(r, 300));
  const els = [...document.querySelectorAll('body, body *, html')].filter(e => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(e.tagName));
  const tekst = cs => { const r = []; for (let i = 0; i < cs.length; i++) { const n = cs[i]; r.push(n + '\t' + cs.getPropertyValue(n)); } return r.join('\n'); };
  const snap = () => { const o = []; for (const e of els) { o.push(tekst(getComputedStyle(e))); o.push(tekst(getComputedStyle(e, '::before'))); o.push(tekst(getComputedStyle(e, '::after'))); } return o; };
  const A = snap(); st.textContent = CSS_B; const B = snap();
  const verschil = [];
  for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) {
    const e = els[Math.floor(i / 3)]; const ps = ['', '::before', '::after'][i % 3];
    const par = t => Object.fromEntries(t.split('\n').filter(Boolean).map(x => { const k = x.indexOf('\t'); return [x.slice(0, k), x.slice(k + 1)]; }));
    const pa = par(A[i]), pb = par(B[i]);
    const d = Object.keys(pa).filter(k => pa[k] !== pb[k]).map(k => `${k}: ${pa[k].slice(0, 30)} -> ${(pb[k] || '').slice(0, 30)}`);
    verschil.push({ el: e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.') : '') + ps, d: d.slice(0, 6) });
  }
  return { elementen: els.length, verschil: verschil.slice(0, 40), nVerschil: verschil.length };
})
