#!/usr/bin/env python3
"""Search Console-rapporten voor rootedgoods.eu.

Draaien:  bin/gsc.sh                      (laatste 28 dagen)
          bin/gsc.sh --van 2026-09-01 --tot 2026-10-27
          bin/gsc.sh --site https://rootedgoods.eu/

Leest met hetzelfde serviceaccount als GA4 (impersonatie, geen sleutel).
Het serviceaccount moet in Search Console als gebruiker toegevoegd zijn:
zie bin/gsc-setup.md.

Search Console heeft ongeveer twee dagen vertraging, dus de laatste dagen
zijn altijd incompleet. Dat staat bij elke draai vermeld.
"""
import argparse, datetime as dt, os, sys

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"


def sterf(m, hint=""):
    print(f"\nAFGEBROKEN: {m}", file=sys.stderr)
    if hint:
        print(f"\n{hint}", file=sys.stderr)
    sys.exit(1)


HOE_TOEGANG = (
    "Het serviceaccount moet leesrechten krijgen in Search Console:\n\n"
    "  1. search.google.com/search-console, ingelogd als info@rootedgoods.eu\n"
    "  2. Kies het domein rootedgoods.eu\n"
    "  3. Instellingen > Gebruikers en machtigingen > Gebruiker toevoegen\n"
    "  4. ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com, rechten: Volledig of Beperkt\n\n"
    "Staat rootedgoods.eu er helemaal niet bij, dan is de site nooit geverifieerd.\n"
    "Dat is dan zelf de bevinding: Google heeft nooit zoekdata met je gedeeld."
)

try:
    import google.auth
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError as e:
    sterf(f"bibliotheek ontbreekt ({e}).",
          "./.venv/bin/pip install google-api-python-client google-auth")


def dienst():
    try:
        creds, _ = google.auth.default(scopes=[SCOPE])
    except Exception as e:
        sterf(f"kon niet authenticeren: {e}", "Zie bin/ga4-setup.md voor de eenmalige opzet.")
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def sites(svc):
    try:
        r = svc.sites().list().execute()
    except HttpError as e:
        sterf(f"Search Console weigert ({e.resp.status}).", HOE_TOEGANG)
    return [s for s in r.get("siteEntry", []) if s.get("permissionLevel") != "siteUnverifiedUser"]


def query(svc, site, van, tot, dims, n=25, extra=None):
    body = {"startDate": van, "endDate": tot, "dimensions": dims, "rowLimit": n}
    if extra:
        body.update(extra)
    try:
        return svc.searchanalytics().query(siteUrl=site, body=body).execute().get("rows", [])
    except HttpError as e:
        sterf(f"Search Console-fout {e.resp.status} op {site}", HOE_TOEGANG)


def tabel(rows, kop, basis, labels, breedte=52):
    print(f"\n### {kop}")
    print(f"    basis: {basis}")
    if not rows:
        print("    GEEN RIJEN. Dat is zelf een bevinding, geen leeg resultaat.")
        return
    print("    " + "".join(f"{l:<{breedte+2}}" for l in labels)
          + f"{'vert.':>9}{'klik':>7}{'CTR':>8}{'positie':>9}")
    for r in rows:
        k = "".join(f"{str(v)[:breedte]:<{breedte+2}}" for v in r.get("keys", []))
        print(f"    {k}{r['impressions']:>9.0f}{r['clicks']:>7.0f}"
              f"{100*r['ctr']:>7.1f}%{r['position']:>9.1f}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--site", help="bijvoorbeeld https://rootedgoods.eu/ of sc-domain:rootedgoods.eu")
    p.add_argument("--van", default=(dt.date.today() - dt.timedelta(days=30)).isoformat())
    p.add_argument("--tot", default=(dt.date.today() - dt.timedelta(days=2)).isoformat())
    a = p.parse_args()

    svc = dienst()
    beschikbaar = sites(svc)
    if not beschikbaar:
        sterf("dit serviceaccount ziet geen enkele Search Console-property.", HOE_TOEGANG)

    print("Properties waar dit account bij kan:")
    for s in beschikbaar:
        print(f"   {s['siteUrl']}  ({s['permissionLevel']})")

    site = a.site
    if not site:
        rg = [s["siteUrl"] for s in beschikbaar if "rootedgoods" in s["siteUrl"]]
        if not rg:
            sterf("geen rootedgoods-property in de lijst hierboven.",
                  "Geef --site mee, of voeg het serviceaccount toe bij de juiste property.")
        site = rg[0]

    print(f"\nSearch Console {site} | {a.van} t/m {a.tot}")
    print("Search Console loopt ongeveer twee dagen achter; de laatste dagen zijn incompleet.")

    tabel(query(svc, site, a.van, a.tot, ["query"], 30),
          "1. Waarop wordt je site in Google gevonden?",
          "Organische zoekvragen. Dit is wat Google je toont zonder dat je ervoor betaalt. "
          "Leg het naast de betaalde zoektermen.", ["zoekvraag"], 46)

    tabel(query(svc, site, a.van, a.tot, ["page"], 25),
          "2. Welke pagina's halen vertoningen?",
          "Als je eigen landingspagina's hier ontbreken, bevestigt dat de sitemapbevinding.",
          ["pagina"], 58)

    tabel(query(svc, site, a.van, a.tot, ["device"], 10),
          "3. Per apparaat", "Zelfde verhaal als bij de advertenties?", ["apparaat"], 20)

    tabel(query(svc, site, a.van, a.tot, ["country"], 8),
          "4. Per land", "Verwacht: vrijwel alles Nederland.", ["land"], 20)

    tot_r = query(svc, site, a.van, a.tot, [], 1)
    if tot_r:
        t = tot_r[0]
        print(f"\n### Totaal\n    {t['impressions']:.0f} vertoningen, {t['clicks']:.0f} klikken, "
              f"CTR {100*t['ctr']:.1f}%, gemiddelde positie {t['position']:.1f}")
    print("\nKlaar.")


if __name__ == "__main__":
    main()
