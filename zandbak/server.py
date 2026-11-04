#!/usr/bin/env python3
"""Zandbakserver op 8010, met no-cache zodat elke ververs verse CSS geeft.

Alles wat hier lokaal staat (index.html, rootedgoods.css, rootedgoods.js) wordt
van schijf geserveerd. Al het andere wordt doorverwezen naar de live site.

WAAROM DAT DOORVERWIJZEN ERIN ZIT. Zonder dat kreeg je twee stille vervalsingen:

1. Het thema haalt bij het laden `/widgets/checkout/info` op voor het winkelmandje
   en plakt het antwoord in de knop. Lokaal gaf dat de 404-pagina van
   SimpleHTTPRequestHandler, en die hele foutpagina (met <h1>Error response</h1>)
   belandde in de header. In de thema-CSS werd die h1 een Playfair-kop van 41 px
   boven de hero. Dat ziet eruit als een ontwerpfout en is het niet.
2. Alle `/media/...`-afbeeldingen ontbraken, dus de klantlogo's in de hero waren
   kapotte alt-teksten van 22 px in plaats van echte logo's. Elke hoogtemeting
   van de hero kwam daardoor te laag uit.

Een 302 is genoeg: de browser haalt het bij rootedgoods.eu op, en wij houden
alleen de bestanden onder handen die we zelf aan het bewerken zijn.
"""
import functools, http.server, pathlib, socketserver

HIER = pathlib.Path(__file__).parent
LIVE = 'https://rootedgoods.eu'


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def send_head(self):
        """Staat het hier niet, dan haal je het maar bij de echte site."""
        pad = self.path.split('?', 1)[0].split('#', 1)[0]
        if pad not in ('/', ''):
            lokaal = HIER / pad.lstrip('/')
            if not lokaal.is_file():
                self.send_response(302)
                self.send_header('Location', LIVE + self.path)
                self.end_headers()
                return None
        return super().send_head()

    def log_message(self, *a):
        pass


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', 8010),
                            functools.partial(Handler, directory=str(HIER))) as s:
    print('zandbak op http://localhost:8010/  (onbekende paden gaan naar ' + LIVE + ')')
    s.serve_forever()
