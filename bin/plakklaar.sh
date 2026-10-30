#!/usr/bin/env bash
# Genereert plakklaar/ uit blokken-def/: dezelfde blokken, zonder commentaar.
#
#   bin/plakklaar.sh            bijwerken
#   bin/plakklaar.sh --toets    alleen kijken of het bij is, niets schrijven
#
# Open een bestand uit plakklaar/, cmd-A, cmd-C, en plak het in de HTML-editor
# van Shopware. Bewerk er nooit iets in: de volgende keer wordt het overschreven.
# Werken doe je in blokken-def/, waar het commentaar staat.
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HIER"

TOETS=${1:-}
mkdir -p plakklaar
nieuw=0; gelijk=0; weg=0

for pad in blokken-def/*.html; do
  naam=$(basename "$pad")
  uit=$(python3 -I bin/ontdoe-commentaar.py "$pad")
  if [ -f "plakklaar/$naam" ] && [ "$uit" = "$(cat "plakklaar/$naam")" ]; then
    gelijk=$((gelijk + 1))
  else
    nieuw=$((nieuw + 1))
    [ "$TOETS" = "--toets" ] || printf '%s\n' "$uit" > "plakklaar/$naam"
  fi
done

# Een blok dat uit blokken-def verdwijnt, mag niet blijven rondslingeren in
# plakklaar: dan plak je ooit iets dat niet meer bestaat.
for pad in plakklaar/*.html; do
  [ -e "$pad" ] || continue
  naam=$(basename "$pad")
  if [ ! -f "blokken-def/$naam" ]; then
    weg=$((weg + 1))
    [ "$TOETS" = "--toets" ] || rm "$pad"
  fi
done

if [ "$TOETS" = "--toets" ]; then
  if [ "$nieuw" -eq 0 ] && [ "$weg" -eq 0 ]; then
    echo "plakklaar/ is bij ($gelijk blokken)."
  else
    echo "plakklaar/ loopt achter: $nieuw bij te werken, $weg te verwijderen." >&2
    echo "Draai bin/plakklaar.sh." >&2
    exit 1
  fi
else
  echo "plakklaar/: $nieuw bijgewerkt, $gelijk ongewijzigd, $weg verwijderd."
fi
