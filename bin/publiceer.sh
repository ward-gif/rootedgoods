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

# --- Edge-toestand vóór het purgen, om straks te weten of er iets veranderde ---
voor_css=$(curl -s --max-time 30 "https://cdn.jsdelivr.net/$REPO/rootedgoods.css" | shasum | cut -d' ' -f1)
voor_js=$(curl -s --max-time 30 "https://cdn.jsdelivr.net/$REPO/rootedgoods.js" | shasum | cut -d' ' -f1)

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

# --- De .min-varianten, die de site echt laadt ---
# Toets op inhoud, niet op de age-header. Die loog op 30 oktober 2026: na een purge
# stond age op 0 terwijl er nog de oude CSS uit kwam.
#
# Alleen toetsen als de bron op de edge ook werkelijk veranderde. jsDelivr minificeert
# zelf, en een @main die met een oudere minifier-versie gebouwd is wijkt af van een
# verse SHA-build zonder dat er inhoudelijk iets mis is: op 30 oktober scheelde
# rootedgoods.min.js 36 bytes terwijl de onverkorte js op @main, op de SHA en lokaal
# byte voor byte gelijk was. Daar hard op falen is vals alarm.
for paar in "rootedgoods.css:rootedgoods.min.css:$voor_css" "rootedgoods.js:rootedgoods.min.js:$voor_js"; do
  bron=${paar%%:*}; rest=${paar#*:}; min=${rest%%:*}; voor=${rest#*:}
  na=$(curl -s --max-time 30 "https://cdn.jsdelivr.net/$REPO/$bron" | shasum | cut -d' ' -f1)
  lokaal=$(shasum "$HIER/$bron" | cut -d' ' -f1)
  if [ "$na" != "$lokaal" ]; then
    # De bron zelf is nog niet vers; dat is hierboven al gemeld. De geminificeerde
    # variant hierop toetsen zegt dan niets.
    echo "OVERGESLAGEN $min, $bron staat zelf nog niet vers op de edge"
    continue
  fi
  if [ "$voor" = "$na" ]; then
    echo "OVERGESLAGEN $min, $bron was al vers en onveranderd"
    continue
  fi
  vers=$(curl -s --max-time 40 "https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@$SHA/$min" | shasum | cut -d' ' -f1)
  nu=$(curl -s --max-time 40 "https://cdn.jsdelivr.net/$REPO/$min" | shasum | cut -d' ' -f1)
  if [ "$vers" = "$nu" ]; then
    echo "OK      $min op @main is gelijk aan @$(echo "$SHA" | cut -c1-7)"
  else
    echo "STALE   $min op @main wijkt af van @$(echo "$SHA" | cut -c1-7)" >&2
    echo "        De site laadt dit bestand, dus de bezoeker ziet nog het oude." >&2
    mislukt=1
  fi
done

if [ "$mislukt" -ne 0 ]; then
  cat >&2 <<'UITLEG'

Niet alles is vers. Draai 'bin/publiceer.sh --alleen-purge' nog eens.

Blijft een .min-bestand afwijken, dan is het geen tijdelijke vertraging maar het
probleem van @main: jsDelivr geeft 200 op de purge en zet de age op 0, maar
serveert de oude geminificeerde inhoud door. Herhaald purgen helpt dan niet.
Gezien op 30 oktober 2026, en docs/kaart-assets.md waarschuwde er al voor bij de
kaart-SVG's: "een purge komt niet altijd door".

De echte oplossing zit in de thema-head, en die is van Promidata: een SHA of een
versie-query achter de twee URL's in plaats van @main. Zie punt A3 in
docs/promidata-vragen.md. Tot die tijd zakt de edge vanzelf binnen twaalf uur
(s-maxage=43200).
UITLEG
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
