#!/usr/bin/env python3
"""Voegt meting.json (+ meting-menu.json) samen tot een oordeel per !important-longhand en per regel.
nodig       = op minstens een pagina/viewport veranderde de berekende stijl zonder !important
gelijk      = gemeten op minstens een passend element, nergens verschil
niet-gemeten= alleen geen-match, media-uit of niet-meetbaar (hover, JS-staten, winkelmand, andere viewport)"""
import json, re, sys, os
HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HIER, '../../..'))
bronnen = [f for f in ('meting.json', 'meting-menu.json', 'meting-extra.json') if os.path.exists(os.path.join(HIER, f))]
css = open(os.path.join(REPO, 'rootedgoods.css'), encoding='utf-8').read().split('\n')
runs = 0; per = {}  # (l,p) -> {'st': set, 'n': max, 'd': eerste verschil}
for f in bronnen:
    for r in json.load(open(os.path.join(HIER, f)))['resultaat']:
        runs += 1
        for m in r['metingen']:
            e = per.setdefault((m['l'], m['p']), {'st': set(), 'd': None, 'ok': 0})
            e['st'].add(m['st'])
            if m['st'] == 'nodig' and not e['d']: e['d'] = f"{r['vp']} {r['pad']}: {m['d']}"
            if m['st'] in ('nodig', 'gelijk'): e['ok'] += 1
def oordeel(e):
    if 'nodig' in e['st']: return 'nodig'
    if 'gelijk' in e['st']: return 'gelijk'
    return 'niet-gemeten'
tel = {'nodig': 0, 'gelijk': 0, 'niet-gemeten': 0}
perregel = {}
for (l, p), e in per.items():
    o = oordeel(e); tel[o] += 1; perregel.setdefault(l, {})[p] = o
tot = sum(tel.values())
print(f"bronnen {bronnen}, {runs} metingen (pagina x viewport), {tot} !important-longhands")
for k, v in tel.items(): print(f"  {k:13s} {v:5d}  {100*v/tot:5.1f}%")
reg = {'nodig': 0, 'alles gelijk': 0, 'alles niet-gemeten': 0, 'gelijk + niet-gemeten': 0}
for l, props in perregel.items():
    s = set(props.values())
    if 'nodig' in s: reg['nodig'] += 1
    elif s == {'gelijk'}: reg['alles gelijk'] += 1
    elif s == {'niet-gemeten'}: reg['alles niet-gemeten'] += 1
    else: reg['gelijk + niet-gemeten'] += 1
print(f"per regel ({len(perregel)} regels met !important):")
for k, v in reg.items(): print(f"  {k:22s} {v:5d}")
# per sectie
secties = json.load(open(os.path.join(HIER, 'important-per-sectie.json')))
print(f"\n{'sectie':60s} {'long':>5} {'nodig':>6} {'gelijk':>6} {'n.gem.':>6}")
rij = []
for s in secties:
    c = {'nodig': 0, 'gelijk': 0, 'niet-gemeten': 0}
    for (l, p), e in per.items():
        if s['start'] <= l <= s['eind']: c[oordeel(e)] += 1
    t = sum(c.values())
    if t: rij.append((t, s['titel'][:58], c))
for t, titel, c in sorted(rij, key=lambda x: -x[0])[:20]:
    print(f"{titel:60s} {t:5d} {c['nodig']:6d} {c['gelijk']:6d} {c['niet-gemeten']:6d}")
# selector bij regel l
def selector(l):
    i = l - 1; stuk = [css[i]]
    while i > 0 and not re.search(r'(\}|\*/|;|\{)\s*$', css[i - 1]) and css[i - 1].strip():
        i -= 1; stuk.insert(0, css[i])
    return re.sub(r'\s+', ' ', ' '.join(stuk)).strip().rstrip('{').strip()[:140]
with open(os.path.join(HIER, 'kandidaten-gelijk.tsv'), 'w', encoding='utf-8') as f:
    f.write('regel\tsectie\toordeel\tlonghands\tselector\n')
    for l in sorted(perregel):
        props = perregel[l]; s = set(props.values())
        if 'nodig' in s: continue
        sec = next((x['titel'][:30] for x in secties if x['start'] <= l <= x['eind']), '?')
        f.write(f"{l}\t{sec}\t{'alles gelijk' if s=={'gelijk'} else ('niet gemeten' if s=={'niet-gemeten'} else 'gelijk+niet gemeten')}\t{','.join(props)}\t{selector(l)}\n")
json.dump({f"{l}|{p}": dict(oordeel=oordeel(e), verschil=e['d']) for (l, p), e in per.items()}, open(os.path.join(HIER, 'oordeel-per-longhand.json'), 'w'), ensure_ascii=False)
# regels waarvan alle !important-longhands 'gelijk' zijn: invoer voor de validatie (valideer.mjs)
alles = {str(l): list(p) for l, p in perregel.items() if set(p.values()) == {'gelijk'}}
json.dump(alles, open(os.path.join(HIER, 'gelijk-regels-na-extra.json'), 'w'))
# regressie: regels die al zijn weggehaald (verwijderd-regels-40d582f.json) maar nu ergens 'nodig' blijken
verw = json.load(open(os.path.join(HIER, 'verwijderd-regels-40d582f.json')))
reg = [(int(l), p, per[(int(l), p)]['d']) for l, ps in verw.items() for p in ps if 'nodig' in per.get((int(l), p), {'st': set()})['st']]
print(f"\nREGRESSIE: {len(reg)} weggehaalde longhands die op een extra pagina wel nodig blijken")
for l, p, d in reg[:40]: print(f"  r{l} {p}: {d}")
print(f"\ngelijk-regels-na-extra.json: {len(alles)} regels, {sum(len(v) for v in alles.values())} longhands")
