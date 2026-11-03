#!/usr/bin/env python3
"""Controleert meta-titels en -descriptions voordat ze in Shopware gaan.

    bin/meta-check.py docs/seo/meta-teksten.tsv

Invoer: een TSV met kopregel  pad<TAB>titel<TAB>description

Breekt af met code 1 zodra er iets fout is, en noemt elke regel bij naam.
Tekens tellen met het oog gaat mis; dat is de hele reden dat dit bestaat.

De set-brede controles zijn belangrijker dan ze lijken. Bij zestig teksten is de
verklikker zelden een losse zin, maar het feit dat ze allemaal dezelfde vorm
hebben. Het bestaande concept in docs/meta-teksten-concept.md liet dat zien:
negen van de eenendertig begonnen letterlijk met "Van een".
"""
import collections, csv, re, sys, unicodedata

TITEL_MIN, TITEL_MAX = 35, 60
DESC_MIN, DESC_MAX = 120, 155
SUFFIX = ' | Rooted Goods'

# Vulwoorden uit de natural-writing-skill plus de clichés van het genre.
VERBODEN = [
    'cruciaal', 'naadloos', 'optimaliseren', 'faciliteren', 'benadrukken', 'robuust',
    'in het hart van', 'een schat aan', 'het is niet alleen', 'niet alleen maar ook',
    'ontdek onze', 'ontdek ons', 'op zoek naar', 'juiste adres', 'ruim assortiment',
    'ruime assortiment', 'uitgebreide collectie', 'uitgebreid assortiment',
    'voor ieder wat wils', 'hoogwaardige', 'hoogwaardig', 'premium kwaliteit',
    'unieke selectie', 'de beste', 'scherpe prijzen', 'snelle levering',
    'bij ons vindt u', 'bij ons vind je', 'een breed scala',
]
# Claims die niet hard te maken zijn. Zie brand/claims.md in de rootedgoods-skill.
CLAIM_FOUT = [
    ('gemaakt in europa', 'in lopende tekst is het "geassembleerd in Europa"'),
    ('100% duurzaam', 'geen greenwashing'),
    ('co2-neutraal', 'niet onderbouwd'),
    ('minimale afname', 'er is geen vaste minimale afname'),
    ('vanaf 25 stuks', 'er is geen vaste minimale afname'),
    ('werkdagen levertijd', 'nooit een vaste levertijd noemen'),
    ('binnen 24 uur', 'de claim is "binnen één werkdag"'),
]

fouten, waarschuwingen = [], []


def meld(lijst, pad, tekst):
    lijst.append(f'  {pad:42s} {tekst}')


def woorden(s):
    return re.findall(r"[a-zà-ÿ0-9'’-]+", s.lower())


def controleer_rij(r):
    pad, t, d = r['pad'].strip(), r['titel'].strip(), r['description'].strip()
    tl, dl = len(t), len(d)

    if not t or not d:
        meld(fouten, pad, 'titel of description is leeg'); return
    if tl > TITEL_MAX:
        meld(fouten, pad, f'titel {tl} tekens, maximaal {TITEL_MAX}')
    if tl < TITEL_MIN:
        meld(waarschuwingen, pad, f'titel {tl} tekens, korter dan {TITEL_MIN}; ruimte onbenut')
    if not t.endswith(SUFFIX):
        meld(fouten, pad, f'titel eindigt niet op "{SUFFIX.strip()}"')
    if t.rstrip().endswith('.'):
        meld(fouten, pad, 'titel eindigt op een punt; een kop krijgt die niet')
    if not (DESC_MIN <= dl <= DESC_MAX):
        meld(fouten, pad, f'description {dl} tekens, moet tussen {DESC_MIN} en {DESC_MAX}')
    if not d.rstrip().endswith(('.', '?')):
        meld(fouten, pad, 'description eindigt niet op een punt; dit is lopende tekst')

    for teken, naam in (('—', 'em-dash'), ('–', 'en-dash')):
        if teken in t or teken in d:
            meld(fouten, pad, f'bevat een {naam}; gebruik komma, punt of haakjes')
    if '!' in t or '!' in d:
        meld(fouten, pad, 'bevat een uitroepteken')

    samen = f'{t} {d}'.lower()
    for w in VERBODEN:
        if w in samen:
            meld(fouten, pad, f'verboden wending: "{w}"')
    for w, waarom in CLAIM_FOUT:
        if w in samen:
            meld(fouten, pad, f'claim "{w}": {waarom}')
    if re.search(r'\b(u|uw)\b', d.lower()) or re.search(r'\b(u|uw)\b', t.lower()):
        meld(fouten, pad, 'spreekt met "u"; de site gebruikt je en jij')

    kern = [w for w in woorden(pad.strip('/').split('/')[-1].replace('-', ' '))]
    if kern and not any(k in samen for k in kern if len(k) > 3):
        meld(waarschuwingen, pad, f'noemt de categorie niet ({" ".join(kern)})')


def controleer_set(rijen):
    n = len(rijen)
    for veld in ('titel', 'description'):
        dubbel = [(v, c) for v, c in collections.Counter(r[veld].strip() for r in rijen).items() if c > 1]
        for v, c in dubbel:
            meld(fouten, '(set)', f'{c} pagina\'s delen dezelfde {veld}: "{v[:60]}"')

    grens = max(4, round(n * 0.20))
    for veld in ('titel', 'description'):
        op = collections.Counter(' '.join(r[veld].split()[:2]).lower() for r in rijen)
        for w, c in op.most_common():
            if c > grens:
                meld(fouten, '(set)', f'{c} van de {n} {veld}s beginnen met "{w}" (grens {grens})')

    # Gedeelde woordgroepen: hét teken dat er één sjabloon is ingevuld.
    vier = collections.Counter()
    for r in rijen:
        w = woorden(r['description'])
        for i in range(len(w) - 3):
            vier[' '.join(w[i:i + 4])] += 1
    for g, c in vier.most_common():
        if c > grens:
            meld(fouten, '(set)', f'woordgroep "{g}" staat in {c} van de {n} descriptions (grens {grens})')

    zinnen = collections.Counter(len(re.findall(r'[.?]', r['description'])) for r in rijen)
    vaakst, c = zinnen.most_common(1)[0]
    if n >= 10 and c / n > 0.75:
        meld(waarschuwingen, '(set)',
             f'{c} van de {n} descriptions hebben {vaakst} zinnen; het ritme is overal gelijk')


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    with open(sys.argv[1], encoding='utf-8', newline='') as f:
        rijen = [r for r in csv.DictReader(f, delimiter='\t') if r.get('pad', '').strip()]
    if not rijen:
        sys.exit('AFGEBROKEN: geen rijen gevonden. Verwacht een TSV met pad, titel, description.')
    for r in rijen:
        if not {'pad', 'titel', 'description'} <= set(r):
            sys.exit('AFGEBROKEN: kopregel moet pad, titel en description bevatten (tabs, geen komma\'s).')
    for r in rijen:
        controleer_rij(r)
    controleer_set(rijen)

    print(f'{len(rijen)} rijen gecontroleerd.\n')
    if waarschuwingen:
        print(f'{len(waarschuwingen)} waarschuwing(en), mag je negeren als je weet waarom:')
        print('\n'.join(waarschuwingen), '\n')
    if fouten:
        print(f'{len(fouten)} FOUT(EN), deze moeten eerst weg:')
        print('\n'.join(fouten))
        sys.exit(1)
    print('Geen fouten. Klaar om in Shopware te zetten.')


if __name__ == '__main__':
    main()
