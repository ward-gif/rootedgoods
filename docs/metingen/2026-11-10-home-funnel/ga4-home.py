#!/usr/bin/env python3
"""GA4-doorlichting voor de home-funnel (10 november 2026).

Draaien (uit de repo-wortel):
  CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods \
  GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud-rootedgoods/application_default_credentials.json \
  ./.venv/bin/python docs/metingen/2026-11-10-home-funnel/ga4-home.py

Elke vraag staat apart. Een vraag die de API weigert wordt hardop gemeld en
telt als niet gemeten; er wordt niets stilletjes overgeslagen of ingevuld.
Alle uitvoer gaat ook als JSON naar ga4-home.json naast dit bestand.
"""
import json, os, sys
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (DateRange, Dimension, Metric, RunReportRequest,
    FilterExpression, FilterExpressionList, Filter, OrderBy)

PROP = os.environ.get("GA4_PROPERTY_ID", "551909322")
VAN, TOT = "2026-10-06", "2026-11-10"
HIER = os.path.dirname(os.path.abspath(__file__))
cl = BetaAnalyticsDataClient()
uit, mislukt = {}, []


def f_eq(dim, waarde):
    return FilterExpression(filter=Filter(field_name=dim, string_filter=Filter.StringFilter(value=waarde, match_type=Filter.StringFilter.MatchType.EXACT)))
def f_has(dim, waarde):
    return FilterExpression(filter=Filter(field_name=dim, string_filter=Filter.StringFilter(value=waarde, match_type=Filter.StringFilter.MatchType.CONTAINS)))
def f_in(dim, waarden):
    return FilterExpression(filter=Filter(field_name=dim, in_list_filter=Filter.InListFilter(values=waarden)))
def f_and(*fs):
    return FilterExpression(and_group=FilterExpressionList(expressions=list(fs)))


def vraag(naam, titel, basis, dims, mets, filt=None, van=VAN, tot=TOT, order=None, limit=40):
    print(f"\n### {naam}. {titel}\n    basis: {basis} | {van} t/m {tot}")
    try:
        req = RunReportRequest(property=f"properties/{PROP}", dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in mets], date_ranges=[DateRange(start_date=van, end_date=tot)],
            dimension_filter=filt, limit=limit,
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order or mets[0]), desc=True)] if order != "dim" else [OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name=dims[0]))])
        r = cl.run_report(req)
    except Exception as e:
        print(f"    NIET GEMETEN: {str(e)[:300]}")
        mislukt.append((naam, str(e)[:200]))
        return
    kop = dims + mets
    rijen = [[*(d.value for d in x.dimension_values), *(m.value for m in x.metric_values)] for x in r.rows]
    tot_rijen = r.row_count
    print("    " + " | ".join(kop))
    for x in rijen:
        print("    " + " | ".join(x))
    print(f"    ({len(rijen)} van {tot_rijen} rijen)")
    uit[naam] = {"titel": titel, "basis": basis, "van": van, "tot": tot, "kolommen": kop, "rijen": rijen, "totaal_rijen": tot_rijen}


# ---- A. Is de meetketen heel? ----
vraag("A1", "Sessies en events per dag", "alle sessies met toestemming", ["date"], ["sessions", "eventCount", "keyEvents"], order="dim", limit=60)
vraag("A2", "Welke events zijn als key event gemarkeerd", "eventName x keyEvents, alleen events met keyEvents > 0 staan er echt in", ["eventName"], ["eventCount", "keyEvents"], limit=40)
vraag("A3", "Hostnames", "staat er verkeer van een andere host in (staging, test)?", ["hostName"], ["sessions", "eventCount"])
vraag("A4", "Bron/medium van de sessies", "controle op auto-tagging van Ads (google / cpc) en rommel", ["sessionSourceMedium"], ["sessions", "engagedSessions", "keyEvents"], limit=25)
vraag("A5", "Landing (not set) en onbekende kanalen", "sessies zonder landingspagina zijn meestal een meetbreuk", ["sessionDefaultChannelGroup", "deviceCategory"], ["sessions", "engagementRate"], limit=30)

# ---- B. Wat doet de home? ----
vraag("B1", "Landing op de home per kanaal en apparaat", "sessies met landingPage exact '/'", ["sessionDefaultChannelGroup", "deviceCategory"],
      ["sessions", "engagedSessions", "engagementRate", "averageSessionDuration", "keyEvents"], f_eq("landingPage", "/"))
vraag("B2", "Home, alle weergaven per apparaat", "page_view op pagePath '/' (ook niet-landing)", ["deviceCategory"],
      ["screenPageViews", "totalUsers", "userEngagementDuration"], f_eq("pagePath", "/"))
vraag("B3", "Scrollevent op de home per apparaat", "GA4 'scroll' = 90% diepte, eenmaal per pagina; noemer is de weergaven in B2", ["deviceCategory"],
      ["eventCount", "totalUsers"], f_and(f_eq("pagePath", "/"), f_eq("eventName", "scroll")))
vraag("B4", "Tweede pagina: waar gaan ze heen vanaf de home", "page_view waarvan pageReferrer exact de home is", ["pagePath", "deviceCategory"],
      ["screenPageViews", "totalUsers"], f_and(f_eq("eventName", "page_view"), f_in("pageReferrer", ["https://rootedgoods.eu/", "https://www.rootedgoods.eu/"])), limit=40)
vraag("B5", "Tweede pagina: groepering per type bestemming (dezelfde data als B4 per apparaat samen)", "idem, alleen pagePath", ["pagePath"],
      ["screenPageViews", "totalUsers"], f_and(f_eq("eventName", "page_view"), f_in("pageReferrer", ["https://rootedgoods.eu/", "https://www.rootedgoods.eu/"])), limit=60)
vraag("B6", "Zoekacties vanaf de home", "view_search_results met pageReferrer de home", ["pagePath"], ["eventCount"],
      f_and(f_eq("eventName", "view_search_results"), f_in("pageReferrer", ["https://rootedgoods.eu/", "https://www.rootedgoods.eu/"])))

# ---- C. Formulieren en leads ----
vraag("C1", "form_start per pagina", "waar beginnen mensen aan een formulier", ["pagePath"], ["eventCount", "totalUsers"], f_eq("eventName", "form_start"), limit=200)
vraag("C2", "form_submit en generate_lead per pagina", "waar worden formulieren verstuurd en geteld als lead", ["eventName", "pagePath"], ["eventCount", "totalUsers"],
      f_in("eventName", ["form_submit", "generate_lead"]), limit=200)
vraag("C3", "form_start met de home als verwijzer", "pageReferrer is de home; ketenmeting home naar formulier", ["pagePath", "eventName"], ["eventCount", "totalUsers"],
      f_and(f_in("eventName", ["form_start", "form_submit", "generate_lead"]), f_in("pageReferrer", ["https://rootedgoods.eu/", "https://www.rootedgoods.eu/"])))
vraag("C4", "Sessies met een lead per kanaal", "keyEvents per kanaal en apparaat; noemer = sessies in dezelfde rij", ["sessionDefaultChannelGroup", "deviceCategory"], ["sessions", "keyEvents"], limit=20)

vraag("C5", "De offerte- en contactpagina's zelf", "page_view en events op de pagina's waar een lead zou moeten ontstaan", ["pagePath", "eventName"], ["eventCount", "totalUsers"],
      f_and(f_in("eventName", ["page_view", "form_start", "form_submit", "generate_lead"]),
            FilterExpression(or_group=FilterExpressionList(expressions=[f_has("pagePath", "offerte"), f_has("pagePath", "contact"), f_has("pagePath", "poconfigurator"), f_has("pagePath", "kennismaking")]))), limit=60)

# ---- D. Items: meten de lijsten wel wat we denken? ----
vraag("D1", "Itemlijsten: weergaven en klikken", "itemListName: laat zien of hero, slider en themategels apart gemeten worden", ["itemListName"],
      ["itemListViews", "itemListClicks"], limit=30)
vraag("D2", "select_item per pagina", "waar klikken mensen op een product in een lijst", ["pagePath"], ["eventCount", "totalUsers"], f_eq("eventName", "select_item"), limit=25)

# ---- E. Vergelijking met Ads (consent-verlies) ----
vraag("E1", "Betaalde sessies in het Ads-venster 29 okt t/m 9 nov", "GA4 'Paid Search'-sessies; leg naast 519 Ads-klikken (Fable, 29 okt t/m 9 nov)",
      ["sessionDefaultChannelGroup"], ["sessions", "totalUsers"], f_eq("sessionDefaultChannelGroup", "Paid Search"), van="2026-10-29", tot="2026-11-09")

with open(os.path.join(HIER, "ga4-home.json"), "w") as fh:
    json.dump({"property": PROP, "uit": uit, "mislukt": mislukt}, fh, indent=1, ensure_ascii=False)
print(f"\nKlaar. {len(uit)} vragen gemeten, {len(mislukt)} niet gemeten.")
for n, e in mislukt:
    print(f"  NIET GEMETEN {n}: {e}")
