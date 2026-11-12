#!/usr/bin/env bash
# Zelfde meting als ttfb-opgesplitst.txt, op een lijst URL's, om mijn eigen verbinding uit te sluiten.
# Gebruik: controle.sh <naam> <url> [aantal]
n=${3:-12}
for i in $(seq 1 $n); do
  curl -s -o /dev/null --max-time 45 -w "$1 $i tls %{time_appconnect} ttfb %{time_starttransfer} totaal %{time_total} http %{http_code} bytes %{size_download}\n" "$2" || echo "$1 $i TIME-OUT na 45 s"
  sleep 4
done
