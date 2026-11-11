#!/usr/bin/env python3
"""Lead-meting nagelopen in GA4 (11 november 2026). Elke vraag apart; wat de API weigert wordt hardop gemeld.
Draaien (uit de repo-wortel): bin/ga4.sh is voor het standaardrapport; dit script gebruikt dezelfde identiteit:
  CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud-rootedgoods/application_default_credentials.json \
  ./.venv/bin/python docs/metingen/2026-11-11-lead-check/ga4-leads.py"""
import json, os, datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (DateRange, Dimension, Metric, RunReportRequest,
    FilterExpression, FilterExpressionList, Filter, OrderBy)
PROP = os.environ.get("GA4_PROPERTY_ID", "551909322"); HIER = os.path.dirname(os.path.abspath(__file__))
cl = BetaAnalyticsDataClient(); uit = {}; mislukt = []
def f_in(dim, w): return FilterExpression(filter=Filter(field_name=dim, in_list_filter=Filter.InListFilter(values=w)))
def f_has(dim, w): return FilterExpression(filter=Filter(field_name=dim, string_filter=Filter.StringFilter(value=w, match_type=Filter.StringFilter.MatchType.CONTAINS)))
def f_and(*fs): return FilterExpression(and_group=FilterExpressionList(expressions=list(fs)))
def vraag(naam, titel, basis, dims, mets, filt=None, van="2026-10-06", tot="2026-11-11", limit=60, order=None):
    print(f"\n### {naam}. {titel}\n    basis: {basis} | {van} t/m {tot}")
    try:
        req = RunReportRequest(property=f"properties/{PROP}", dimensions=[Dimension(name=d) for d in dims], metrics=[Metric(name=m) for m in mets],
            date_ranges=[DateRange(start_date=van, end_date=tot)], dimension_filter=filt, limit=limit, order_bys=order or [])
        r = cl.run_report(req)
    except Exception as e:
        print("    NIET GEMETEN:", str(e)[:200].replace("\n", " ")); mislukt.append(naam); uit[naam] = {"fout": str(e)[:300]}; return
    rijen = [[v.value for v in x.dimension_values] + [v.value for v in x.metric_values] for x in r.rows]
    uit[naam] = {"titel": titel, "basis": basis, "kolommen": dims + mets, "rijen": rijen}
    print("    " + " | ".join(dims + mets))
    for x in rijen: print("    " + " | ".join(x))
    if not rijen: print("    (geen rijen)")
DOEL = ["generate_lead", "contact", "belafspraak_gepland", "form_start", "form_submit", "purchase", "add_to_cart", "begin_checkout", "view_item", "view_cart"]
vraag("A", "Doel-events, hele periode", "eventCount, totalUsers per eventName", ["eventName"], ["eventCount", "totalUsers"], f_in("eventName", DOEL))
vraag("B", "Doel-events, laatste 14 dagen", "zelfde, 29 okt t/m 11 nov", ["eventName"], ["eventCount", "totalUsers"], f_in("eventName", DOEL), van="2026-10-29")
vraag("C", "generate_lead per dag", "eventCount per datum", ["date", "eventName"], ["eventCount"], f_in("eventName", ["generate_lead", "contact", "belafspraak_gepland"]), order=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="date"))])
vraag("D", "generate_lead/contact per pagina", "eventCount per pagePath", ["eventName", "pagePath"], ["eventCount", "totalUsers"], f_in("eventName", ["generate_lead", "contact", "belafspraak_gepland"]))
vraag("E", "Events op /contact, /offerte en de configurator-aanvraag", "eventCount per pagePath en eventName", ["pagePath", "eventName"], ["eventCount", "totalUsers"],
      f_and(f_in("eventName", ["page_view", "form_start", "form_submit", "generate_lead", "contact", "file_download", "click"]), f_has("pagePath", "contact") if False else f_in("pagePath", ["/contact", "/offerte", "/poconfigurator/request", "/poconfigurator/request/cart"])))
vraag("F", "form_id bij generate_lead", "eventCount per customEvent:form_id (alleen als als dimensie geregistreerd)", ["customEvent:form_id"], ["eventCount"], f_in("eventName", ["generate_lead", "form_submit"]))
vraag("G", "Sessies en key events per kanaal, laatste 14 dagen", "sessies en keyEvents per sessionDefaultChannelGroup", ["sessionDefaultChannelGroup"], ["sessions", "keyEvents"], van="2026-10-29", order=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)])
json.dump(uit, open(os.path.join(HIER, "ga4-leads.json"), "w"), ensure_ascii=False, indent=1)
print("\nNiet gemeten:", mislukt or "geen")
