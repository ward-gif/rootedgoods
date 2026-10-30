Onderwerp: Aanvulling trage paginaovergang rootedgoods.eu: cache staat aan, productupdates verklaren het niet

Hoi,

Een aanvulling op mijn vorige bericht, met wat ik vandaag in de admin heb gezien.

Wat de admin laat zien (2026-10-13, 11:18)
Shopware 6.5.8.16, omgeving Productie, HTTP cache Aan, cache-adapter CacheDecorator. Mijn vraag of er een cache is, is daarmee beantwoord. De vraag is nu waarom de categoriepagina's en de homepage toch traag zijn.

Productupdates lijken het niet te verklaren
Ik dacht eerst dat de productimport de cache van de categoriepagina's steeds ongeldig maakt. In Catalogus, Producten (529 producten), gesorteerd op laatst gewijzigd, zie ik wijzigingen op 13 oktober om 03:01 en 03:24 (23 producten), daarvoor op 11 oktober om 22:38 en 10 oktober om 22:35. Op 12 oktober is er niets gewijzigd. Mijn metingen van 12 oktober (10:06 tot 14:50, n=29 per pagina) vallen dus niet in de buurt van een productupdate, en toch was /huis-keuken/ toen traag (mediaan 3,95 s, max 18,27 s). Vanochtend ook nog: 13 oktober 10:31 tot 10:33, drie metingen, /huis-keuken/ 8,38 s, 1,30 s en 1,43 s. Let op: ik kijk alleen naar de wijzigingsdatum van producten. Andere wijzigingen (categorieën, prijsregels, handmatig cache legen) zie ik zo niet.

Vragen
1. Wat is de hitratio van de HTTP cache voor / en /huis-keuken/ in de afgelopen week, en hoe lang is de TTL?
2. In de responses staat een Age-header, maar alleen op / , categoriepagina's en productpagina's, niet op /checkout/cart of robots.txt. Welke laag zet die: de ingebouwde Symfony HttpCache of een reverse proxy zoals Varnish? Kan die laag verzoeken laten wachten (lock) als dezelfde pagina tegelijk wordt opgebouwd?
3. Wat is de belasting op de server (bambook.08.promidata.shop) in de pieken, en deelt die server veel shops? Zijn PHP-workers of databaseverbindingen vol op die momenten?
4. Kunnen jullie voor 12 oktober 10:00 tot 15:00 de PHP- en MySQL-slowlog bekijken voor deze twee pagina's?

Beperkingen: ik kan de admin alleen lezen, zonder toegang tot logboeken, geplande taken of plugins. De wijzigingsdatum van producten zegt niets over andere oorzaken van een koude cache.

Groet,
Ward
