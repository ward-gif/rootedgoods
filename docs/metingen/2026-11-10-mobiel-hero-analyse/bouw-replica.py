#!/usr/bin/env python3
"""Bouwt de replica van /eindejaarsgeschenken voor de meetbrowser.

Bron: de ene verse kopie van de live pagina (scratchpad/serve/live-page.html,
10 november 2026). Alles wat van rootedgoods.eu of een CDN zou laden wordt
vervangen door een lokaal bestand; de meetbrowser blokkeert die domeinen
bovendien. Onze eigen CSS/JS komen uit de werkkopie via de symlink `repo`.

Gebruik:  python3 bouw-replica.py <scratchpad/serve>
Schrijft: <serve>/replica-http.html
"""
import re
import sys
import pathlib

serve = pathlib.Path(sys.argv[1])
src = (serve / 'live-page.html').read_text(encoding='utf-8')
html = src

# 1. Thema-CSS lokaal; thema-JS, FontAwesome, Promifonto, GTM en overige
#    externe scripts eruit (niet opgehaald; de meetbrowser blokkeert ze toch).
html = re.sub(r'href="https://rootedgoods\.eu/theme/[^"]*/css/all\.css[^"]*"',
              'href="assets/all.css"', html)
html = re.sub(r'<script[^>]*src="https://rootedgoods\.eu/theme/[^"]*"[^>]*>\s*</script>', '', html)
html = re.sub(r'<link[^>]*cioincludefontawesome[^>]*>', '', html)
html = re.sub(r'<link[^>]*Promifonto[^>]*>', '', html)
html = re.sub(r'<script[^>]*googletagmanager[^>]*>\s*</script>', '', html)

# 2. Onze bundel: de werkkopie, niet de CDN.
html = html.replace('https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.min.css',
                    'repo/rootedgoods.css')
html = html.replace('https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.min.js',
                    'repo/rootedgoods.js')

# 3. Lokale fonts (variabele Playfair en Montserrat uit de showroom) ná alles,
#    zodat zij winnen van de @font-face-regels van thema en bundel.
html = html.replace('</head>', '<link rel="stylesheet" href="assets/fonts.css">\n</head>', 1)

# 4. Beeld.
html = re.sub(r'https://rootedgoods\.eu/media/2a/71/e6/\d+/Logo%20Rooted\.svg', 'assets/logos/header-logo.svg', html)
logos = {
    'Erasmus MC.png': 'erasmus.png', 'Erasmus%20MC.png': 'erasmus.png',
    'Ifes.png': 'ifes.png',
    'Huisartsen G.C. Zuiderzorg.png': 'zuiderzorg.png', 'Huisartsen%20G.C.%20Zuiderzorg.png': 'zuiderzorg.png',
    'Wezijnwille.png': 'wezijnwille.png',
}
for naam, lokaal in logos.items():
    html = re.sub(r'(?:https://rootedgoods\.eu)?/media/[0-9a-f]{2}/[0-9a-f]{2}/[0-9a-f]{2}/\d+/' + re.escape(naam),
                  'assets/logos/' + lokaal, html)
hashes = [
    '0fb70c3d014f6372579d9a66e1fe5f8df14aab2ea920c6ef93597818a084d860',
    'e808835a523ab5bf1c4b0746f1cf6016d41234740e6b78604dc7f141bfc0eb5d',
    '88859cc5f71738072cfaadb121a23be907290405342ab1ed3c122847ad89fced',
    '2758449bb2705a3524248b14f0dbfbb8ad45fa7c9da1e1d311991ebb8cf547f4',
    '4c2cf2a590a03ae6cee451390c1b08eb76e0c9ed42109fa12f3dc4fbf6a6166c',
    '3dcab6b9d8269564c1c3ddf1bf30ef34f5b5f3ad0ce4b3b4b75a7ad3a3cca2d6',
    'df14e9d05012e62763116938456e181ffd52db4b92f5107632ba8595f177745c',
    'b9514bb0c822d42bd0bf4adc5b37202f617d7d90541f1dd7b38e624ecc6837cf',
    'c65447fb6f87f2f5ee96525e682f127d99a49db12807a172bbea458a634a4eef',
]
for i, h in enumerate(hashes, 1):
    # elke maat (400x400, 800x800, 1920x1920, origineel) en elke query naar hetzelfde lokale bestand
    html = re.sub(r'https://rootedgoods\.eu/(?:shared/thumbnail|media)/[^"\s,]*' + h + r'[^"\s,]*',
                  'assets/img/p%d.png' % i, html)

# 5. Alle overige beelden van rootedgoods.eu (feature-rij, services, Richard):
#    een leeg gif, zodat er geen broken-image-icoon in de meting zit.
html = re.sub(r'(?:https://rootedgoods\.eu)?/media/[^"\s)]+\.(?:jpg|jpeg|png|webp)',
              'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', html)

over = sorted(set(re.findall(r'https://rootedgoods\.eu[^"\s)]*', html)))
(serve / 'replica-http.html').write_text(html, encoding='utf-8')
print('geschreven', serve / 'replica-http.html', len(html), 'bytes')
print('nog naar rootedgoods.eu verwijzend (wordt geblokkeerd):', len(over))
for u in over[:20]:
    print('  ', u)
