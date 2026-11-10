#!/bin/bash
# Derde meting na de performance-update van Promidata. Zelfde user-agent als 4 en 6 november.
# Stap 1: eerste bezoek per menucategorie zonder cache-omzeiling (age toont of de pagina vers is).
# Stap 2: tweede bezoek direct erna (warm).
# Stap 3: koud via ?rgkoud=, twee rondes.
cd "$(dirname "$0")"
UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
meet() { # url -> http,ttfb,totaal,bytes,age
  local hdr; hdr=$(mktemp)
  local m; m=$(curl -s -D "$hdr" -o /dev/null -m 60 --compressed -A "$UA" -w '%{http_code},%{time_starttransfer},%{time_total},%{size_download}' "$1")
  local age; age=$(tr -d '\r' < "$hdr" | awk 'tolower($1)=="age:"{print $2}' | head -1)
  rm -f "$hdr"; echo "$m,${age:-}"
}
echo "moment,label,url,http,ttfb_s,totaal_s,bytes,age" > ruw.csv
while IFS=$'\t' read -r label widget cat; do
  [ -z "$label" ] && continue
  echo "eerste,\"$label\",$cat,$(meet "$cat")" >> ruw.csv; sleep 0.5
done < navids.txt
while IFS=$'\t' read -r label widget cat; do
  [ -z "$label" ] && continue
  echo "tweede,\"$label\",$cat,$(meet "$cat")" >> ruw.csv; sleep 0.5
done < navids.txt
echo "ronde,label,url,http,ttfb_s,totaal_s,bytes,age" > koud.csv
PAGINAS="/ /drinkwaren/ /huis-keuken/ /kleding-textiel/ /alle-producten/ /thema-s/kerstpakketten-eindejaar/ /merken/ /over-ons /eindejaarsgeschenken /offerte"
for r in 1 2; do
  for p in $PAGINAS; do
    echo "$r,$p,https://rootedgoods.eu${p},$(meet "https://rootedgoods.eu${p}?rgkoud=$(date +%s)$RANDOM")" >> koud.csv; sleep 0.5
  done
done
