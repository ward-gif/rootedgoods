#!/usr/bin/env python3
"""Bouwt de zandbakpagina uit de vastgelegde live HTML.

Vervangt onze twee jsDelivr-bestanden door de lokale werkkopie, en kan de
hero-sectie vervangen door een blok uit blokken-def. Raakt de repo niet aan.
"""
import pathlib, re, sys

HIER = pathlib.Path(__file__).parent
BRON = HIER / 'bron-kerst.html'
DOEL = HIER / 'index.html'
HERO_BLOK = HIER / 'hero.html'          # optioneel; de nieuwe hero

h = BRON.read_text(encoding='utf-8')

# 1. onze eigen assets uit de CDN halen en lokaal laden
for ext in ('css', 'js'):
    oud = f'https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.min.{ext}'
    if oud not in h:
        sys.exit(f'AFGEBROKEN: {oud} staat niet in de bron. Is de thema-head veranderd?')
    h = h.replace(oud, f'/rootedgoods.{ext}')

# 2. de hero vervangen als er een nieuwe klaarstaat
if HERO_BLOK.exists():
    m = re.search(r'<section class="rg-page-hero">.*?</section>', h, re.S)
    if not m:
        sys.exit('AFGEBROKEN: geen <section class="rg-page-hero"> gevonden om te vervangen.')
    h = h[:m.start()] + HERO_BLOK.read_text(encoding='utf-8') + h[m.end():]
    hero = 'nieuwe hero uit hero.html'
else:
    hero = 'hero ongewijzigd (hero.html bestaat nog niet)'

# 3. een baken zodat je ziet dat je in de zandbak zit en niet op de echte site
baken = ('<div style="position:fixed;z-index:99999;left:0;right:0;bottom:0;'
         'background:#2d4528;color:#fff;font:12px/2.2 system-ui;text-align:center">'
         'ZANDBAK, lokaal, niet de live site</div>')
h = h.replace('</body>', baken + '</body>', 1)

DOEL.write_text(h, encoding='utf-8')
print(f'geschreven: {DOEL}  ({len(h):,} bytes)  |  {hero}')
