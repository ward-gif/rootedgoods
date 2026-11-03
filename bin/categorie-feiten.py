#!/usr/bin/env python3
"""Bouwt docs/seo/categorie-feiten.md uit de live site.

Alles wordt geteld, niets geschat. Draai dit opnieuw als het assortiment is
veranderd; het bestand is gegenereerd en mag niet met de hand bijgewerkt worden.

    bin/categorie-feiten.py              # crawlen en schrijven
    bin/categorie-feiten.py --uit-cache  # alleen opnieuw schrijven uit de JSON
"""
import collections, gzip, html, io, json, pathlib, re, sys, time, urllib.request

HIER = pathlib.Path(__file__).resolve().parent.parent
RUW = HIER / 'docs' / 'metingen' / '2026-11-03-categorie-metas' / 'categorie-feiten.json'
DOEL = HIER / 'docs' / 'seo' / 'categorie-feiten.md'
UA = {'User-Agent': 'Mozilla/5.0 (rootedgoods-seo-inventarisatie)'}
MAX_PAGINAS = 24          # 24*24 = 576 producten; daarboven melden we "minstens"


def pak(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30) as f:
        rauw = f.read()
    if rauw[:2] == b'\x1f\x8b':
        rauw = gzip.decompress(rauw)
    return rauw.decode('utf-8', 'replace')


def schoon(x):
    return re.sub(r'\s+', ' ', html.unescape(x)).strip()


def categorie_urls():
    index = pak('https://rootedgoods.eu/sitemap.xml')
    urls = []
    for sm in re.findall(r'<loc>([^<]+)</loc>', index):
        urls += re.findall(r'<loc>([^<]+)</loc>', pak(sm))
    uniek = sorted(set(urls))
    # producten hebben een artikelcode (/A508-269133), categorieen niet
    return [u for u in uniek
            if not re.search(r'/A\d', u)
            and u.rstrip('/') != 'https://rootedgoods.eu'
            and not any(k in u for k in ('/algemeen/', '/informatie/', '/blog'))]


def lees_categorie(u):
    namen, prijzen, opaanvraag, p, afgekapt = [], [], 0, 1, False
    while True:
        if p > MAX_PAGINAS:
            afgekapt = True
            break
        h = pak(u if p == 1 else f'{u}?p={p}')
        if p == 1:
            ctl = re.search(r'class="(is-ctl-[a-z]+)', h)
            if not ctl or ctl.group(1) != 'is-ctl-navigation':
                return None
            titel = re.search(r'<title[^>]*>(.*?)</title>', h, re.S)
            desc = re.search(r'<meta name="description" content="([^"]*)"', h)
            h1 = re.search(r'<h1[^>]*>(.*?)</h1>', h, re.S)
        n = [schoon(x) for x in re.findall(r'<a[^>]*class="product-name"[^>]*title="([^"]+)"', h)]
        if not n:
            break
        namen += n
        for x in [schoon(y) for y in re.findall(r'<span class="product-price">\s*([^<]+?)\s*</span>', h)]:
            m = re.search(r'€\s*([\d.]+),(\d{2})', x)
            if m:
                prijzen.append(float(m.group(1).replace('.', '')) + int(m.group(2)) / 100)
            else:
                opaanvraag += 1
        if len(n) < 24:
            break
        p += 1
        time.sleep(0.2)
    pad = u.replace('https://rootedgoods.eu', '')
    return {
        'url': u, 'pad': pad,
        'bovenliggend': '/' + pad.strip('/').rsplit('/', 1)[0] + '/' if pad.strip('/').count('/') else '',
        'titel_nu': schoon(titel.group(1)) if titel else '',
        'desc_nu': html.unescape(desc.group(1)).strip() if desc else '',
        'heeft_h1': bool(h1),
        'producten': len(namen), 'afgekapt': afgekapt,
        'prijs_min': round(min(prijzen), 2) if prijzen else None,
        'prijs_max': round(max(prijzen), 2) if prijzen else None,
        'prijs_op_aanvraag': opaanvraag,
        'namen': namen,
    }


def merknamen(namen):
    """Eerste woorden die in meerdere producttitels terugkomen. Afgeleid uit de
    titel, niet uit een merkveld; daarom staat die waarschuwing in de kop."""
    k = collections.Counter()
    for n in namen:
        w = n.split()
        for lengte in (3, 2, 1):
            if len(w) < lengte:
                continue
            kand = ' '.join(w[:lengte])
            if len(kand) > 2 and kand[0].isupper():
                k[kand] += 1
                break
    return [(m, c) for m, c in k.most_common(8) if c >= 2]


def schrijf(f):
    telling = collections.Counter(n for c in f for n in set(c['namen']))
    zonder_h1 = sum(1 for c in f if not c['heeft_h1'])
    leeg = sum(1 for c in f if not c['desc_nu'])
    r = [
        '# Feiten per categorie', '',
        'Gegenereerd met `bin/categorie-feiten.py`. **Niet met de hand bijwerken**;',
        'draai het script opnieuw, anders loopt dit uit de pas met de site.', '',
        f"{len(f)} categoriepagina's, {sum(x['producten'] for x in f)} producttreffers.",
        'Een product telt mee in elke categorie waar het in staat, dus dit is meer dan',
        'het aantal producten in de catalogus.', '',
        f'Stand bij het genereren: **{leeg} van de {len(f)} hebben een lege meta description**,',
        f'**{zonder_h1} hebben geen h1**.', '',
        '**"Alleen hier"** zijn producten die op geen enkele andere categoriepagina staan.',
        'Dat is het eerlijkste aanknopingspunt om een categorie van zijn buren te',
        'onderscheiden. Staat er niets, dan deelt deze categorie zijn hele assortiment met',
        'anderen en moet het verschil uit de toepassing komen, niet uit het aanbod.', '',
        '**Merknamen** zijn afgeleid uit de producttitels, niet uit een merkveld in',
        'Shopware. Controleer ze voordat je ze in een titel zet.', '', '---', '']
    for c in sorted(f, key=lambda x: (-x['producten'], x['pad'])):
        uniek = [n for n in dict.fromkeys(c['namen']) if telling[n] == 1]
        aantal = f"minstens {c['producten']}" if c['afgekapt'] else str(c['producten'])
        if c['prijs_op_aanvraag']:
            aantal += f", waarvan {c['prijs_op_aanvraag']} op aanvraag"
        prijs = (f"€ {c['prijs_min']:.2f} tot € {c['prijs_max']:.2f}".replace('.', ',')
                 if c['prijs_min'] is not None else 'geen prijzen gevonden')
        r += [f"## {c['pad']}", '', '| | |', '|---|---|',
              f"| Titel nu | `{c['titel_nu'].replace('|', '¦')}` |",
              f"| Onder | `{c['bovenliggend'] or 'hoofdniveau'}` |",
              f"| Producten | {aantal} |",
              f"| Prijs | {prijs} |",
              f"| Alleen hier | {len(uniek)} |", '']
        m = merknamen(c['namen'])
        if m:
            r += ['**Namen die vaker terugkomen:** ' + ', '.join(f'{x} ({n}x)' for x, n in m), '']
        if uniek:
            r += ['**Alleen in deze categorie:** ' + '; '.join(uniek[:8])
                  + ('; ...' if len(uniek) > 8 else ''), '']
        r += ['**Een greep uit het aanbod:** '
              + '; '.join(list(dict.fromkeys(c['namen']))[:8]), '', '---', '']
    DOEL.parent.mkdir(parents=True, exist_ok=True)
    DOEL.write_text('\n'.join(r), encoding='utf-8')
    print(f'geschreven: {DOEL.relative_to(HIER)}  ({len(r)} regels, {len(f)} categorieen)')


def main():
    if '--uit-cache' in sys.argv:
        if not RUW.exists():
            sys.exit(f'AFGEBROKEN: {RUW} bestaat niet. Draai eerst zonder --uit-cache.')
        schrijf(json.load(RUW.open(encoding='utf-8')))
        return
    urls = categorie_urls()
    print(f'{len(urls)} kandidaat-URLs uit de sitemap')
    f = []
    for i, u in enumerate(urls, 1):
        try:
            c = lees_categorie(u)
        except Exception as e:
            print(f'  FOUT {u}: {e}')
            continue
        if c is None:
            continue
        f.append(c)
        print(f"  {i}/{len(urls)}  {c['pad']}  {c['producten']}", flush=True)
    if not f:
        sys.exit('AFGEBROKEN: geen enkele categorie gelezen.')
    RUW.parent.mkdir(parents=True, exist_ok=True)
    json.dump(f, RUW.open('w', encoding='utf-8'), ensure_ascii=False, indent=1)
    schrijf(f)


if __name__ == '__main__':
    main()
