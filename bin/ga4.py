#!/usr/bin/env python3
"""GA4-rapporten voor rootedgoods.eu, met de basis onder elk getal.

Draaien:   ./.venv/bin/python bin/ga4.py --property <id> [--van 2026-10-06] [--tot 2026-10-26]
Of zet GA4_PROPERTY_ID in de omgeving, dan mag --property weg.

Authenticatie gaat via Application Default Credentials van je eigen account.
Eenmalig, met de analytics-scope erbij:

    gcloud auth application-default login \
      --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly

Er is geen service-accountsleutel nodig; de organisatie blokkeert die ook
(iam.managed.disableServiceAccountKeyCreation, gezien 27 oktober 2026).

Wil je Rooted Goods op een eigen identiteit lezen in plaats van ward@bambook.org,
gebruik dan een losse gcloud-configmap en wijs het script daarnaar:

    export CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods
    gcloud auth application-default login --scopes=...
    export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud-rootedgoods/application_default_credentials.json

Het script drukt bij elke draai af met welke identiteit en welk quota-project het leest.
"""
import argparse, os, sys, datetime as dt

SCOPE = "https://www.googleapis.com/auth/analytics.readonly"


def sterf(melding, hint=""):
    print(f"\nAFGEBROKEN: {melding}", file=sys.stderr)
    if hint:
        print(f"\n{hint}", file=sys.stderr)
    sys.exit(1)


try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Metric, RunReportRequest, OrderBy, FilterExpression, Filter,
    )
    from google.api_core.exceptions import GoogleAPIError, PermissionDenied, InvalidArgument
except ImportError as e:
    sterf(f"de GA4-bibliotheek ontbreekt ({e}).",
          "Installeren:  ./.venv/bin/pip install google-analytics-data")


def herkomst():
    """Druk af met welke identiteit en welk quota-project we lezen.

    Zonder dit kun je zonder het te merken met het verkeerde account draaien,
    en dan klopt elk getal eronder wel maar slaat het op iets anders.
    """
    import google.auth
    pad = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") or os.path.expanduser(
        os.path.join(os.environ.get("CLOUDSDK_CONFIG", "~/.config/gcloud"),
                     "application_default_credentials.json"))
    wie, project = "onbekend", None
    try:
        creds, project = google.auth.default(scopes=[SCOPE])
        wie = (getattr(creds, "service_account_email", None)
               or getattr(creds, "_client_id", None) and "gebruikersaccount (ADC)"
               or "gebruikersaccount (ADC)")
        project = getattr(creds, "quota_project_id", None) or project
    except Exception:
        pass
    print(f"gelezen als: {wie} | quota-project: {project or '(geen)'}")
    print(f"credentials: {pad}")


def client():
    try:
        return BetaAnalyticsDataClient()
    except Exception as e:
        sterf(f"kon niet authenticeren: {e}",
              "Draai eenmalig:\n  gcloud auth application-default login \\\n"
              f"    --scopes=https://www.googleapis.com/auth/cloud-platform,{SCOPE}")


def rapport(cl, prop, dims, mets, van, tot, order=None, limit=50, filt=None):
    req = RunReportRequest(
        property=f"properties/{prop}",
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=m) for m in mets],
        date_ranges=[DateRange(start_date=van, end_date=tot)],
        limit=limit,
        dimension_filter=filt,
    )
    if order:
        req.order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order), desc=True)]
    try:
        return cl.run_report(req)
    except PermissionDenied as e:
        sterf(f"geen toegang tot property {prop}: {e.message}",
              "Twee mogelijke oorzaken:\n"
              "  1. je ADC heeft de analytics-scope niet. Draai de gcloud-regel uit de kop van dit bestand opnieuw.\n"
              "  2. het account heeft geen leesrechten op deze property (GA4 > Beheer > Toegangsbeheer).")
    except InvalidArgument as e:
        sterf(f"GA4 wees de aanvraag af: {e.message}",
              "Meestal een verkeerd property-ID (het getal van 9 cijfers, niet de G-code) of een onbekende dimensie.")
    except GoogleAPIError as e:
        sterf(f"GA4-fout: {e}")


def tabel(resp, kop, basis, breedtes=None):
    print(f"\n### {kop}")
    print(f"    basis: {basis}")
    if not resp.rows:
        print("    GEEN RIJEN. Dat is zelf een bevinding, geen leeg resultaat.")
        return
    dnames = [d.name for d in resp.dimension_headers]
    mnames = [m.name for m in resp.metric_headers]
    w = breedtes or [38] * len(dnames)
    print("    " + "".join(f"{n[:x]:<{x+1}}" for n, x in zip(dnames, w)) + "".join(f"{m:>16}" for m in mnames))
    for r in resp.rows:
        cells = "".join(f"{v.value[:x]:<{x+1}}" for v, x in zip(r.dimension_values, w))
        vals = ""
        for mn, v in zip(mnames, r.metric_values):
            try:
                f = float(v.value)
                vals += f"{f*100:>15.1f}%" if "rate" in mn.lower() else f"{f:>16.1f}" if "." in v.value else f"{int(f):>16}"
            except ValueError:
                vals += f"{v.value:>16}"
        print("    " + cells + vals)
    if resp.row_count > len(resp.rows):
        print(f"    ... {resp.row_count} rijen totaal, {len(resp.rows)} getoond")


def main():
    p = argparse.ArgumentParser(description="GA4-rapporten voor rootedgoods.eu")
    p.add_argument("--property", default=os.environ.get("GA4_PROPERTY_ID"),
                   help="GA4 property-ID, het getal van 9 cijfers (of zet GA4_PROPERTY_ID)")
    p.add_argument("--van", default="2026-10-06")
    p.add_argument("--tot", default=dt.date.today().isoformat())
    a = p.parse_args()

    if not a.property:
        sterf("geen property-ID.",
              "Geef --property <id> mee, of zet GA4_PROPERTY_ID.\n"
              "Het staat in GA4 > Beheer > Property-instellingen, rechtsboven. Een getal van 9 cijfers,\n"
              "niet de meet-ID G-VT3YF07ZGB.")
    if not str(a.property).isdigit():
        sterf(f"'{a.property}' is geen property-ID.",
              "Het property-ID is een getal van 9 cijfers. G-VT3YF07ZGB is de meet-ID en werkt hier niet.")

    herkomst()
    cl = client()
    prop, van, tot = a.property, a.van, a.tot
    dagen = (dt.date.fromisoformat(tot) - dt.date.fromisoformat(van)).days + 1
    print(f"GA4-property {prop} | {van} t/m {tot} ({dagen} dagen)")
    print("Alles hieronder is wat GA4 ziet. Consent Mode staat standaard op denied,")
    print("dus dit is een ondergrens van het werkelijke verkeer, niet een telling.")

    cpc = FilterExpression(filter=Filter(
        field_name="sessionDefaultChannelGroup",
        string_filter=Filter.StringFilter(value="Paid Search")))

    tabel(rapport(cl, prop, ["sessionDefaultChannelGroup"],
                  ["sessions", "totalUsers", "engagedSessions", "engagementRate", "keyEvents"],
                  van, tot, order="sessions"),
          "1. Verkeer per kanaal: zien we de advertentieklikken terug?",
          f"GA4-sessies {van} t/m {tot}. Leg 'Paid Search' naast de 662 Ads-klikken van 6-26 okt. "
          "Het verschil is wat consent en adblockers kosten.")

    tabel(rapport(cl, prop, ["landingPagePlusQueryString", "deviceCategory"],
                  ["sessions", "engagementRate", "userEngagementDuration", "bounceRate"],
                  van, tot, order="sessions", limit=25, filt=cpc),
          "2. Landingspagina x apparaat, alleen betaald zoekverkeer",
          "Wordt de pagina gelezen of alleen geopend? Lage betrokkenheid op mobiel bij hoge op "
          "desktop is het snelheidsprobleem, niet het copyprobleem.",
          breedtes=[44, 10])

    tabel(rapport(cl, prop, ["eventName"], ["eventCount", "totalUsers"], van, tot,
                  order="eventCount", limit=30),
          "3. Welke events vuren er eigenlijk?",
          "Staat generate_lead hier niet tussen, dan is de meetketen stuk en niet de site. "
          "Staat hij er wel met nul, dan is het de site.")

    tabel(rapport(cl, prop, ["searchTerm"], ["eventCount"], van, tot, order="eventCount", limit=30),
          "4. Wat typen mensen in je eigen zoekbalk?",
          "De goedkoopste contentbron die er is: je doelgroep zegt letterlijk wat ze niet vindt. "
          "Leeg betekent meestal dat site search niet gemeten wordt, niet dat niemand zoekt.")

    tabel(rapport(cl, prop, ["pagePath"], ["screenPageViews", "userEngagementDuration"],
                  van, tot, order="screenPageViews", limit=25),
          "5. Meest bekeken pagina's",
          "Kijk waar /offerte staat. Komt die niet voor, dan bereikt niemand het formulier.",
          breedtes=[52])

    tabel(rapport(cl, prop, ["newVsReturning"], ["sessions", "engagementRate", "keyEvents"],
                  van, tot, order="sessions"),
          "6. Nieuw tegenover terugkerend",
          "Zakelijke geschenkinkoop is bijna nooit een sessie. Komt niemand terug, "
          "dan is remarketing het ontbrekende stuk en niet de landingspagina.")

    print("\nKlaar. Elk getal hierboven geldt voor "
          f"{van} t/m {tot} en alleen voor sessies waarin toestemming is gegeven.")


if __name__ == "__main__":
    main()
