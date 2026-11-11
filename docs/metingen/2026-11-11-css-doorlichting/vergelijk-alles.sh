#!/bin/zsh
# Vergelijkt rootedgoods.css (A, lokaal) met een kandidaat (B) op 31 paginatypes x 3 breedtes, parallel per breedte.
# Gebruik: ./vergelijk-alles.sh kandidaat.css <naam>
cd "$(dirname "$0")"
P=(/ /alle-producten/ /huis-keuken/ /Borrelplank/A1352-Kerst1 /eindejaarsgeschenken /thema-s/ /offerte /over-ons /merken/ /contact "/search?search=kerstbal" /dag-van-de-leraar /events-conferenties /faq /full-service-ontzorging /medewerker-merchandise /onboarding-welkomstpakket /services/ /verzending-naar-meerdere-locaties /warehousing-fulfillment /alle-thema-s /wishlist /algemeen/algemene-voorwaarden/ /thema-s/winter/ /thema-s/made-in-nl/ /thema-s/kerstpakketten-eindejaar/ /tassen-reizen/ /eten-drinken/ /informatie/nieuwsbrief/ /blog/ /elektronica/)
rm -f verg-$2-*.txt
for vp in mobiel tablet desktop; do
  (MODE=vergelijk CSSB=$1 UIT=vergelijk-$2-$vp.json VP=$vp node meet.mjs "${P[@]}" > verg-$2-$vp.txt 2>&1; echo klaar > verg-$2-$vp.klaar) &
done
wait
echo "31 paginatypes x 3 breedtes: $(cat verg-$2-*.txt | grep -c VERSCHIL) metingen, $(cat verg-$2-*.txt | grep -c 'VERSCHIL op 0 ') zonder verschil"
cat verg-$2-*.txt | grep VERSCHIL | grep -v 'VERSCHIL op 0 ' | cut -c1-400
