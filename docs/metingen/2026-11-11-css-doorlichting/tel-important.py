#!/usr/bin/env python3
"""Telt !important in rootedgoods.css per sectie. Sectiekop = '/* ====' gevolgd door een titelregel.
Gebruik: python3 -I tel-important.py [pad/naar/rootedgoods.css]"""
import re, sys, json
pad = sys.argv[1] if len(sys.argv) > 1 else 'rootedgoods.css'
regels = open(pad, encoding='utf-8').read().split('\n')
secties = []  # (regelnr, titel)
for i, l in enumerate(regels):
    if l.startswith('/* ====') and i + 1 < len(regels):
        titel = regels[i + 1].strip().strip('*/').strip()
        secties.append([i + 1, titel])
secties.insert(0, [1, '(kop en webfonts)'])
res = []
for k, (start, titel) in enumerate(secties):
    eind = secties[k + 1][0] - 1 if k + 1 < len(secties) else len(regels)
    blok = '\n'.join(regels[start - 1:eind])
    nonc = re.sub(r'/\*.*?\*/', '', blok, flags=re.S)  # zonder commentaar
    res.append(dict(start=start, eind=eind, titel=titel, regels=eind - start + 1,
                    important=nonc.count('!important'),
                    declaraties=nonc.count(';')))
tot_imp = sum(r['important'] for r in res)
tot_decl = sum(r['declaraties'] for r in res)
print(f"{pad}: {len(regels)} regels, {len(res)} secties, {tot_imp} !important in {tot_decl} declaraties ({100*tot_imp/tot_decl:.1f}%), commentaar niet meegeteld")
print(f"{'imp':>5} {'decl':>5} {'%':>5}  {'regels':>11}  titel")
for r in sorted(res, key=lambda r: -r['important'])[:25]:
    p = 100 * r['important'] / max(r['declaraties'], 1)
    print(f"{r['important']:5d} {r['declaraties']:5d} {p:5.0f}  r{r['start']:>5}-{r['eind']:<5}  {r['titel'][:70]}")
json.dump(res, open(sys.argv[2] if len(sys.argv) > 2 else '/dev/null', 'w'), ensure_ascii=False, indent=1)
