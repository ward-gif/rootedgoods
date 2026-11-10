#!/bin/bash
# Meet per menu-item twee dingen: het offcanvas-widgetverzoek dat een tik in het
# mobiele menu afvuurt, en de categoriepagina waar die tik heen gaat.
# De widget is een XHR en wil de XMLHttpRequest-header; een gewone pagina geeft
# daarop 403 (Shopware varieert op Accept). Daarom per soort andere headers.
cd "$(dirname "$0")"
NAV="$1"
UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
echo "ronde,label,soort,url,http,ttfb_s,totaal_s,bytes,age,cache_control" > ruw.csv
for ronde in 1 2 3; do
  while IFS=$'\t' read -r label widget cat; do
    [ -z "$label" ] && continue
    for soort in widget pagina; do
      hdr=$(mktemp)
      if [ "$soort" = widget ]; then
        m=$(curl -s -D "$hdr" -o /dev/null -m 60 --compressed -A "$UA" \
              -H 'X-Requested-With: XMLHttpRequest' \
              -w '%{http_code},%{time_starttransfer},%{time_total},%{size_download}' \
              "https://rootedgoods.eu${widget}")
      else
        m=$(curl -s -D "$hdr" -o /dev/null -m 60 --compressed -A "$UA" \
              -w '%{http_code},%{time_starttransfer},%{time_total},%{size_download}' "$cat")
      fi
      age=$(tr -d '\r' < "$hdr" | awk 'tolower($1)=="age:"{print $2}' | head -1)
      cc=$(tr -d '\r' < "$hdr" | awk 'tolower($1)=="cache-control:"{$1="";print}' | head -1 | tr -d ' ')
      rm -f "$hdr"
      sleep 0.4; echo "$ronde,\"$label\",$soort,$([ "$soort" = widget ] && echo "${widget}" || echo "$cat"),$m,${age:-},${cc:-}" >> ruw.csv
    done
  done < "$NAV"
  echo "ronde $ronde klaar" >&2
done
