#!/bin/zsh
# Eén opruimronde: meet alle !important in huidige rootedgoods.css (31 paginatypes x 3 breedtes + menu), bouwt kandidaat uit 'gelijk',
# vergelijkt die met de huidige CSS. Gebruik: ./ronde.sh <rondenaam>   Schrijft ronde-<naam>-*.txt en kandidaat-<naam>.css
cd "$(dirname "$0")"; N=$1
P=(/ /alle-producten/ /huis-keuken/ /Borrelplank/A1352-Kerst1 /eindejaarsgeschenken /thema-s/ /offerte /over-ons /merken/ /contact "/search?search=kerstbal" /dag-van-de-leraar /events-conferenties /faq /full-service-ontzorging /medewerker-merchandise /onboarding-welkomstpakket /services/ /verzending-naar-meerdere-locaties /warehousing-fulfillment /alle-thema-s /wishlist /algemeen/algemene-voorwaarden/ /thema-s/winter/ /thema-s/made-in-nl/ /thema-s/kerstpakketten-eindejaar/ /tassen-reizen/ /eten-drinken/ /informatie/nieuwsbrief/ /blog/ /elektronica/)
rm -f meting-v2-*.json
for vp in mobiel tablet desktop; do (VP=$vp UIT=meting-v2-$vp.json node meet.mjs "${P[@]}" > ronde-$N-m-$vp.txt 2>&1) & done
(MENU=1 VP=mobiel,tablet UIT=meting-v2-menu.json node meet.mjs / /over-ons /offerte /alle-producten/ > ronde-$N-m-menu.txt 2>&1) &
wait
python3 -I tel-important.py ../../../rootedgoods.css important-per-sectie.json > important-per-sectie.txt
python3 -I samenvatting.py > ronde-$N-samenvatting.txt 2>&1
OORDEEL=oordeel-per-longhand.json ALLES=1 python3 -I strip-gelijk.py ../../../rootedgoods.css kandidaat-$N.css | tee ronde-$N-kandidaat.txt
./vergelijk-alles.sh kandidaat-$N.css $N > ronde-$N-vergelijk.txt 2>&1
for v in mobiel tablet desktop; do echo "$v: $(grep -c VERSCHIL verg-$N-$v.txt) metingen, zonder verschil: $(grep -c 'VERSCHIL op 0 ' verg-$N-$v.txt)" >> ronde-$N-vergelijk.txt; done
echo klaar > ronde-$N.klaar
