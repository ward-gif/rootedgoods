// In de pagina. window.__rg.tag(css) markeert elementen waarop regels met :hover/:focus/:active in het onderwerp-deel kunnen werken;
// meet(k, marks) test per !important-longhand of het !important verschil maakt met de toestand geforceerd (door Node via CDP);
// ab(k, cssA, cssB) vergelijkt alle berekende stijl van element k onder CSS A en B.
(() => {
  const STATE = /:(hover|focus-visible|focus-within|focus|active)\b/g;
  const PSEUDOEL = /::?(before|after|marker|placeholder|first-line|first-letter|selection|-webkit-[a-z-]+|-moz-[a-z-]+)\s*$/i;
  const delen = s => { const uit = []; let d = 0, b = '', q = ''; for (const c of s) { if (q) { b += c; if (c === q) q = ''; continue; } if (c === '"' || c === "'") { q = c; b += c; continue; } if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { uit.push(b.trim()); b = ''; } else b += c; } if (b.trim()) uit.push(b.trim()); return uit; };
  const lastCompound = s => { let d = 0, last = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '(' || c === '[') d++; else if (c === ')' || c === ']') d--; else if (d === 0 && /[\s>+~]/.test(c)) last = i + 1; } return [s.slice(0, last), s.slice(last)]; };
  const regels = {}; let st;
  const verz = rs => { for (const r of rs) { if (r.type === 1) { const l = r.style.getPropertyValue('--rg-l'); if (l) (regels[l] = regels[l] || []).push(r); } else if (r.cssRules && r.type !== 7) verz(r.cssRules); } };
  const els = () => [...document.querySelectorAll('[data-rg-t]')];
  window.__rg = {
    tag(css) {
      const link = document.querySelector('link[href*="rootedgoods.min.css"]'); if (link) link.remove();
      st = document.getElementById('rg-meet') || document.createElement('style'); st.id = 'rg-meet'; st.textContent = css; document.head.appendChild(st);
      const kill = document.createElement('style'); kill.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}'; document.head.appendChild(kill);
      verz(st.sheet.cssRules); let n = 0;
      const uit = [];
      for (const [l, rs] of Object.entries(regels)) {
        const rule = rs[0]; const heeftImp = [...rule.style].some(p => !p.startsWith('--') && rule.style.getPropertyPriority(p) === 'important'); if (!heeftImp) continue;
        delen(rule.selectorText).forEach((part, pi) => {
          const [voor, laatste] = lastCompound(part); if (!STATE.test(laatste)) { STATE.lastIndex = 0; return; } STATE.lastIndex = 0;
          if (STATE.test(voor)) { STATE.lastIndex = 0; uit.push({ l, pi, st: 'ouder-toestand' }); return; } STATE.lastIndex = 0;
          if (PSEUDOEL.test(laatste.replace(STATE, ''))) { uit.push({ l, pi, st: 'pseudo-element' }); return; }
          const states = [...new Set([...laatste.matchAll(STATE)].map(m => m[1]))];
          const kaal = (voor + laatste.replace(STATE, '')).trim() || '*';
          let gev = []; try { gev = [...document.querySelectorAll(kaal)].slice(0, 3); } catch (e) { uit.push({ l, pi, st: 'selector-fout' }); return; }
          if (!gev.length) { uit.push({ l, pi, st: 'geen-element' }); return; }
          for (const el of gev) { el.setAttribute('data-rg-t', (el.getAttribute('data-rg-t') ? el.getAttribute('data-rg-t') + ' ' : '') + `${l}:${pi}:${states.join('+')}`); n++; }
          uit.push({ l, pi, st: 'gemerkt', n: gev.length });
        });
      }
      return uit;
    },
    marks() { return els().map(e => e.getAttribute('data-rg-t')); },
    meet(k, marksText) {
      const el = els()[k]; const uit = [];
      for (const mk of marksText.split(' ')) {
        const [l] = mk.split(':'); const rule = (regels[l] || [])[0]; if (!rule) continue; const sty = rule.style;
        const props = [...sty].filter(p => !p.startsWith('--') && sty.getPropertyPriority(p) === 'important');
        for (const p of props) {
          if (/^(transition|animation)/.test(p)) { uit.push({ l: Number(l), p, st: 'niet-meetbaar' }); continue; }
          const w = sty.getPropertyValue(p); const v = getComputedStyle(el).getPropertyValue(p);
          sty.setProperty(p, w, ''); const n = getComputedStyle(el).getPropertyValue(p); sty.setProperty(p, w, 'important');
          uit.push(v !== n ? { l: Number(l), p, st: 'nodig', d: v.slice(0, 40) + ' -> ' + n.slice(0, 40) } : { l: Number(l), p, st: 'gelijk' });
        }
      }
      return uit;
    },
    ab(k, cssA, cssB) {
      const el = els()[k]; const tekst = cs => { const r = []; for (let i = 0; i < cs.length; i++) r.push(cs[i] + '\t' + cs.getPropertyValue(cs[i])); return r; };
      st.textContent = cssA; const a = tekst(getComputedStyle(el)); st.textContent = cssB; const b = tekst(getComputedStyle(el)); st.textContent = cssA;
      const mb = new Map(b.map(x => x.split('\t'))); return a.map(x => x.split('\t')).filter(([n, v]) => mb.get(n) !== v).map(([n, v]) => `${n}: ${v.slice(0, 30)} -> ${(mb.get(n) || '').slice(0, 30)}`);
    }
  };
})();
