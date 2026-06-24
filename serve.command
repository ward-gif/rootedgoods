#!/bin/bash
# Rooted Goods — lokale CSS-server met no-cache headers.
# Dubbelklik dit bestand (of run het in Terminal) om te starten.
# Serveert de map waarin dit script staat op http://localhost:8000
# zodat de Resource Override altijd je verse rootedgoods.css laadt.

cd "$(dirname "$0")" || exit 1
PORT=8000

# Stop een eventueel draaiende server op deze poort (alleen 8000).
lsof -ti tcp:$PORT 2>/dev/null | xargs kill 2>/dev/null
sleep 0.5

echo "Rooted Goods CSS-server (no-cache) -> http://localhost:$PORT"
echo "Map: $(pwd)"
echo "Laat dit venster open staan. Sluiten = server stopt."
echo ""

python3 - "$PORT" <<'PY'
import http.server, socketserver, sys
PORT = int(sys.argv[1])
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    httpd.serve_forever()
PY
