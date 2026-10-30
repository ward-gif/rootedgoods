#!/bin/bash
# Rooted Goods — lokale CSS-server met no-cache headers.
# Dubbelklik dit bestand (of run het in Terminal) om te starten.
# Serveert de map waarin dit script staat op http://localhost:8000,
# zodat de Resource Override altijd je verse rootedgoods.css laadt.
#
# Waarom dit script meer doet dan serveren: op 30 oktober 2026 stond er een
# losse `python3 -m http.server 8000` te draaien, gestart uit een map die daarna
# verplaatst was. Hij bleef luisteren en gaf 404 op alles. Resource Override
# haalde die foutpagina op als stylesheet, dus de site verloor al zijn eigen CSS
# en er zei niets waarom. Een server die draait is niet hetzelfde als een server
# die werkt, dus dit script controleert dat, bij de start en daarna elke minuut.

MAP="$(cd "$(dirname "$0")" && pwd)"
cd "$MAP" || exit 1
PORT=8000
TOETS=rootedgoods.css   # dit bestand moet hij kunnen leveren, anders heeft het geen zin

if [ ! -f "$TOETS" ]; then
  echo "AFGEBROKEN: $TOETS staat niet in $MAP."
  echo "Dit script hoort in de wortel van de webshop-repo te staan."
  read -r -p "Enter om te sluiten." _
  exit 1
fi

# Stop wat er op deze poort draait, van onszelf of niet. Precies het geval van
# 30 oktober: er stond iets kapots, en zonder dit blijft dat staan.
BEZET=$(lsof -ti tcp:$PORT 2>/dev/null)
if [ -n "$BEZET" ]; then
  echo "Poort $PORT was bezet (pid $(echo "$BEZET" | tr '\n' ' ')), dat wordt gestopt."
  echo "$BEZET" | xargs kill 2>/dev/null
  sleep 1
fi

echo "Rooted Goods CSS-server (no-cache) -> http://localhost:$PORT"
echo "Map: $MAP"
echo ""

# De servermap staat vast op een absoluut pad. Hangt hij aan de werkmap, dan
# serveert hij niets meer zodra die map verdwijnt of hernoemd wordt.
python3 - "$PORT" "$MAP" <<'PY' &
import functools, http.server, socketserver, sys
PORT, MAP = int(sys.argv[1]), sys.argv[2]
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    def log_message(self, *a):
        pass
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), functools.partial(Handler, directory=MAP)) as httpd:
    httpd.serve_forever()
PY
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT INT TERM

# --- Toets bij de start -------------------------------------------------------
LOKAAL=$(wc -c < "$TOETS" | tr -d ' ')
for _ in 1 2 3 4 5 6 7 8 9 10; do
  sleep 0.4
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/$TOETS" 2>/dev/null)
  [ "$CODE" = "200" ] && break
done
BYTES=$(curl -s -o /dev/null -w '%{size_download}' "http://localhost:$PORT/$TOETS" 2>/dev/null)

if [ "$CODE" != "200" ] || [ "$BYTES" != "$LOKAAL" ]; then
  echo "AFGEBROKEN: de server draait wel, maar levert $TOETS niet goed."
  echo "  verwacht: 200 en $LOKAAL bytes"
  echo "  gekregen: ${CODE:-geen antwoord} en ${BYTES:-0} bytes"
  echo ""
  echo "Zet Resource Override uit tot dit klopt, anders laadt je browser deze"
  echo "foutpagina als stylesheet en lijkt de site stuk zonder dat iets dat zegt."
  kill $SERVER 2>/dev/null
  read -r -p "Enter om te sluiten." _
  exit 1
fi

echo "Controle: $TOETS komt binnen als 200, $BYTES bytes. Goed."
echo "Laat dit venster open staan. Sluiten = server stopt."
echo ""

# --- En daarna blijven kijken -------------------------------------------------
# De storing van 30 oktober ontstond pas ná de start, toen een map verplaatst
# werd. Een eenmalige controle had hem dus gemist.
while kill -0 $SERVER 2>/dev/null; do
  sleep 60
  C=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/$TOETS" 2>/dev/null)
  if [ "$C" != "200" ]; then
    echo ""
    echo "LET OP $(date '+%H:%M'): $TOETS geeft nu ${C:-geen antwoord} in plaats van 200."
    echo "Je browser krijgt dan een foutpagina als stylesheet en de site lijkt stuk."
    echo "Sluit dit venster en start serve.command opnieuw."
  fi
done
