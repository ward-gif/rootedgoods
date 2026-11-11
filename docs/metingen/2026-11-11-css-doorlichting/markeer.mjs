// Zet --rg-l:<regelnr>; als eerste declaratie in elk stijlblok. Exporteert markeer(css) -> { tekst, aantal }.
export function markeer(css) {
  let uit = '', i = 0, regel = 1, prelude = '', paren = 0, aantal = 0; const stack = [];
  while (i < css.length) {
    const c = css[i], n = css[i + 1];
    if (c === '/' && n === '*') { const e = css.indexOf('*/', i + 2); const stuk = css.slice(i, e + 2); regel += (stuk.match(/\n/g) || []).length; uit += stuk; i = e + 2; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (css[j] !== c) { if (css[j] === '\\') j++; j++; } const stuk = css.slice(i, j + 1); uit += stuk; prelude += stuk; i = j + 1; continue; }
    if (c === '\n') regel++;
    if (c === '(') paren++; if (c === ')') paren--;
    if (paren === 0 && c === '{') {
      const p = prelude.trim(); const slaOver = stack.includes('skip');
      const isAt = p.startsWith('@'); const nest = /^@(media|supports|layer|container)/i.test(p);
      stack.push(isAt && !nest ? 'skip' : (nest ? 'nest' : 'regel'));
      uit += '{'; if (!isAt && !slaOver) { uit += ` --rg-l:${regel};`; aantal++; }
      prelude = ''; i++; continue;
    }
    if (paren === 0 && c === '}') { stack.pop(); prelude = ''; uit += c; i++; continue; }
    if (paren === 0 && c === ';') prelude = ''; else prelude += c;
    uit += c; i++;
  }
  return { tekst: uit, aantal };
}
