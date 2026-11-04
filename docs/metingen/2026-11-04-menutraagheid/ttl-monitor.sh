#!/bin/bash
# Volgt de age-header van drie paginasoorten, om te zien hoe lang een cache-regel
# blijft staan en of er ander verkeer is dat hem opwarmt.
cd "$(dirname "$0")"
UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
echo "tijdstip,pagina,ttfb_s,age" > ttl.csv
for n in $(seq 1 14); do
  for u in "https://rootedgoods.eu/" "https://rootedgoods.eu/huis-keuken/" "https://rootedgoods.eu/eten-drinken/"; do
    hdr=$(mktemp)
    t=$(curl -s -D "$hdr" -o /dev/null -m 60 --compressed -A "$UA" -w '%{time_starttransfer}' "$u")
    age=$(tr -d '\r' < "$hdr" | awk 'tolower($1)=="age:"{print $2}' | head -1); rm -f "$hdr"
    echo "$(date '+%H:%M:%S'),${u#https://rootedgoods.eu},$t,${age:-}" >> ttl.csv
  done
  sleep 60
done
