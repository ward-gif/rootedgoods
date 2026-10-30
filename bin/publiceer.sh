#!/usr/bin/env bash
# Publiceert rootedgoods.css en rootedgoods.js naar de live site.
#
#   bin/publiceer.sh "commitbericht"      commit, push, purge, controleer
#   bin/publiceer.sh --alleen-purge       alleen purgen en controleren
#
# De live site laadt de .min-varianten. jsDelivr maakt die zelf aan en cachet ze
# APART van de onverkorte bestanden. Purge je alleen rootedgoods.css, dan blijft
# rootedgoods.min.css staan en verandert er niets op de site. Daarom alle vier.
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HIER"

REPO="gh/ward-gif/rootedgoods@main"
BESTANDEN=(rootedgoods.css rootedgoods.min.css rootedgoods.js rootedgoods.min.js)

# --- Brace-check: een ongebalanceerde CSS sloopt alles eronder stil ---
for f in rootedgoods.css; do
  diepte=$(python3 -I -c "s=open('$f').read(); print(s.count('{')-s.count('}'))")
  if [ "$diepte" -ne 0 ]; then
    echo "AFGEBROKEN: $f heeft brace-diepte $diepte, hoort 0 te zijn." >&2
    exit 1
  fi
  echo "brace-check $f: 0, in balans"
done

# --- plakklaar/ moet bij zijn bij blokken-def/ ---
# Anders staat er een blok klaar om te plakken dat niet meer klopt met de bron.
if ! "$HIER/bin/plakklaar.sh" --toets >/dev/null 2>&1; then
  "$HIER/bin/plakklaar.sh" --toets || true
  echo "AFGEBROKEN: werk eerst plakklaar/ bij met bin/plakklaar.sh." >&2
  exit 1
fi
echo "plakklaar-check: bij"

# --- Committen en pushen ---
if [ "${1:-}" != "--alleen-purge" ]; then
  if [ -z "${1:-}" ]; then
    echo "AFGEBROKEN: geef een commitbericht, of --alleen-purge." >&2
    exit 1
  fi
  git add -A
  git diff --cached --quiet && echo "niets te committen" || git commit -m "$1"
  git push
fi

SHA=$(git rev-parse HEAD)
echo "HEAD: $SHA"

# --- Purgen ---
for f in "${BESTANDEN[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://purge.jsdelivr.net/$REPO/$f")
  echo "purge $f: $code"
done

echo "wachten op de edge (15s), de purge is asynchroon"
sleep 15

# --- Controleren: het onverkorte bestand moet byte voor byte kloppen ---
mislukt=0
for f in rootedgoods.css rootedgoods.js; do
  if curl -s --max-time 30 "https://cdn.jsdelivr.net/$REPO/$f" | diff -q - "$f" >/dev/null; then
    echo "OK      $f op de CDN is gelijk aan lokaal"
  else
    echo "STALE   $f op de CDN wijkt af van lokaal" >&2
    mislukt=1
  fi
done

# --- En de .min-varianten die de site echt laadt, moeten vers opgehaald zijn ---
for f in rootedgoods.min.css rootedgoods.min.js; do
  leeftijd=$(curl -sI --max-time 30 "https://cdn.jsdelivr.net/$REPO/$f" | awk 'tolower($1)=="age:"{print $2+0}')
  leeftijd=${leeftijd:-onbekend}
  if [ "$leeftijd" != "onbekend" ] && [ "$leeftijd" -lt 120 ]; then
    echo "OK      $f vers op de edge (age ${leeftijd}s)"
  else
    echo "STALE   $f heeft age ${leeftijd}s, de purge is niet doorgekomen" >&2
    mislukt=1
  fi
done

if [ "$mislukt" -ne 0 ]; then
  echo
  echo "Niet alles is vers. Draai 'bin/publiceer.sh --alleen-purge' nog eens." >&2
  exit 1
fi

# --- De merkgids herinneren ---
# Deze CSS is leidend voor de huisstijl. Verandert hier een token, dan loopt de
# skill achter tot iemand hem bijtrekt, en de showroom-build gaat daar later op
# klagen. Beter nu weten dan straks. Blokkeert niet: de site mag altijd voor.
MERK="$HIER/../merk/merk-gelijk.py"
if [ -f "$MERK" ]; then
  echo
  if python3 -I "$MERK" >/dev/null 2>&1; then
    echo "merkgids: in lijn met deze CSS"
  else
    echo "LET OP: de merkgids loopt achter op deze CSS."
    python3 -I "$MERK" 2>&1 | sed -n '/vs skill/,$p' | sed 's/^/  /'
    echo "  Trek ~/.claude/skills/rootedgoods/design/tokens.css bij, daarna de showroom."
  fi
fi

cat <<SLOT

Klaar. De edge is vers.

LET OP: de bezoeker is dat niet. De bestanden komen binnen met
max-age=604800, oftewel zeven dagen in de browser. Wie de site deze week al
bezocht, ziet je wijziging pas als die week om is, of na een harde ververs.
Een purge raakt alleen de CDN-edge, niet de browsercache. Dit is punt A3 in
docs/promidata-vragen.md: een versie-query in de thema-URL zou dit oplossen.

Zelf controleren: incognitovenster, of cmd-shift-R.
SLOT
