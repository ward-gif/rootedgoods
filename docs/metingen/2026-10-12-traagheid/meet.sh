#!/bin/bash
# Meet elke 10 minuten de tijd tot de eerste byte van vijf paginatypes en logt naar meetlog.csv
cd "$(dirname "$0")"
[ -f meetlog.csv ] || echo "tijdstip,pagina,http,ttfb_s,age,bytes" > meetlog.csv
URLS=("https://rootedgoods.eu/" "https://rootedgoods.eu/huis-keuken/" "https://rootedgoods.eu/Pulltap-s-kelnersmes/A267-8050.100-1KL" "https://rootedgoods.eu/checkout/cart" "https://rootedgoods.eu/robots.txt")
while true; do
  for u in "${URLS[@]}"; do
    out=$(curl -s -D - -o /dev/null -m 40 -H 'Accept-Encoding: gzip' -w 'CODE=%{http_code} TTFB=%{time_starttransfer} BYTES=%{size_download}' "$u" 2>/dev/null)
    age=$(echo "$out" | tr -d '\r' | grep -i '^age:' | awk '{print $2}')
    code=$(echo "$out" | sed -n 's/.*CODE=\([0-9]*\).*/\1/p'); ttfb=$(echo "$out" | sed -n 's/.*TTFB=\([0-9.]*\).*/\1/p'); by=$(echo "$out" | sed -n 's/.*BYTES=\([0-9]*\).*/\1/p')
    echo "$(date '+%Y-%m-%d %H:%M:%S'),${u#https://rootedgoods.eu},${code:-ERR},${ttfb:-},${age:-},${by:-}" >> meetlog.csv
  done
  sleep 600
done
