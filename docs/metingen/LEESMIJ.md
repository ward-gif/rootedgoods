# Metingen

Ruwe meetgegevens, geen conclusies. Wat we eruit concludeerden staat in
`docs/diagnose-2026-10.md` en in het verbeterplan. Hier staat het bewijs,
zodat een conclusie later nog na te rekenen is.

**Bewaar het ruwe bestand, ook als het lelijk is.** Clarity gooit opnames na
ongeveer dertig dagen weg, PageSpeed-runs zijn niet reproduceerbaar en een
Tag Assistant-sessie bestaat maar één keer. Een export die je niet bewaart,
is een meting die nooit heeft plaatsgevonden.

## Indeling

| Map of bestand | Wat erin staat |
|---|---|
| `clarity-2026-10/` | Clarity-exports, per ronde. Zie de LEESMIJ daar. |
| `tagassistant/` | Sessies uit GTM-voorbeeldmodus, per onderwerp, met datum voorop. |
| `psi-*.json` | PageSpeed Insights, ruwe uitvoer van `bin/psi.sh`. |
| `nulmeting-*.md` | Een vastgelegd vertrekpunt met de filters erbij, zodat de nameting dezelfde vraag stelt. |

## Naamgeving

`<jjjj-mm-dd>-<onderwerp>`, datum voorop zodat de map vanzelf op volgorde staat.
Dus `2026-10-29-bestelroute`, niet `bestelroute-okt`.

Zet er een `notities.md` bij met wat je gelopen hebt en wat er opviel. Een
export zonder die regels is over twee maanden onleesbaar: je ziet dan wel
welke gebeurtenissen er waren, maar niet wat je aan het doen was.

## Een Tag Assistant-sessie exporteren

In Tag Assistant rechtsboven de drie puntjes, dan exporteren. Je krijgt een
JSON met alle gebeurtenissen, de dataLayer per stap en welke tags vuurden.

**Let op:** die export bevat alles wat je tijdens de sessie hebt ingetypt,
dus ook wat je in een formulier zette. Gebruik testgegevens, geen echte
klantnamen of adressen van iemand anders.
