#!/usr/bin/env bash
# Geeft een blok plakklaar: zonder HTML-commentaar, op het klembord.
#
#   bin/plak.sh eind-cta            uit blokken-def/, naar het klembord
#   bin/plak.sh eind-cta --toon     ook naar het scherm
#   bin/plak.sh --lijst             welke blokken er zijn
#
# Waarom dit bestaat: het commentaar boven een blok draagt de redenering, en dat
# wil je lezen terwijl je het bewerkt. Maar het mag niet mee het CMS in. Dat was
# de reden voor twee mappen, en twee mappen lopen uit elkaar: op 30 oktober 2026
# verschilden 30 van de 31 gedeelde bestanden. Eén bron plus deze stap kan niet
# uit elkaar lopen.
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRON="$HIER/blokken-def"

if [ "${1:-}" = "--lijst" ] || [ -z "${1:-}" ]; then
  echo
  echo "  Blokken in blokken-def/:"
  echo
  (cd "$BRON" && ls *.html | sed 's/\.html$//' | sed 's/^/    /')
  echo
  echo "  Gebruik: bin/plak.sh <naam> [--toon]"
  echo
  exit 0
fi

NAAM="${1%.html}"
PAD="$BRON/$NAAM.html"
if [ ! -f "$PAD" ]; then
  echo "AFGEBROKEN: $NAAM.html staat niet in blokken-def/. 'bin/plak.sh --lijst' toont ze." >&2
  exit 1
fi

UIT=$(python3 -I "$HIER/bin/ontdoe-commentaar.py" "$PAD")

if [ -z "$UIT" ]; then
  echo "AFGEBROKEN: $NAAM.html levert niets op na het strippen." >&2
  exit 1
fi

printf '%s' "$UIT" | pbcopy
REGELS=$(printf '%s' "$UIT" | wc -l | tr -d ' ')
BYTES=$(printf '%s' "$UIT" | wc -c | tr -d ' ')
echo "$NAAM: $((REGELS + 1)) regels, $BYTES bytes, op het klembord."

if [ "${2:-}" = "--toon" ]; then
  echo
  printf '%s\n' "$UIT"
fi
