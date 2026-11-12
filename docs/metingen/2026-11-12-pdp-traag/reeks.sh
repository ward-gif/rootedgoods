#!/usr/bin/env bash
# Wisselt huidige situatie (A) en grid-kandidaat (C) af, N keer, en schrijft per run cls en de grootste sprong.
S="$1"; N="$2"; U='https://rootedgoods.eu/Citizen-Green-Vanguard-gerecyclede-rugzak/A33-12080355'
for i in $(seq 1 $N); do
  URL="$U" PROFIEL=desktop NAAM=reeks-A-$i JSFILE=$S/js-controle.js node laden.mjs >/dev/null 2>&1 && python3 -c "
import json; o=json.load(open('reeks-A-$i-desktop.json')); print('A huidig  run $i | cls',o['cls'],'| grootste sprong',max([v['v'] for v in o['verschuivingen']]+[0]),'| load',o['load_ms'])" || echo "A huidig  run $i | AFGEBROKEN (geen load binnen 90 s)"
  URL="$U" PROFIEL=desktop NAAM=reeks-C-$i JSFILE=$S/js-zonder-titelverplaatsing.js CSSFILE=$S/css-grid.css node laden.mjs >/dev/null 2>&1 && python3 -c "
import json; o=json.load(open('reeks-C-$i-desktop.json')); print('C grid    run $i | cls',o['cls'],'| grootste sprong',max([v['v'] for v in o['verschuivingen']]+[0]),'| load',o['load_ms'])" || echo "C grid    run $i | AFGEBROKEN (geen load binnen 90 s)"
done
