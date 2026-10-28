#!/usr/bin/env python3
"""Microsoft Clarity uitlezen voor rootedgoods.eu, en naast GA4 leggen.

Draaien:  bin/clarity.sh                 (laatste 3 dagen, alle dimensies)
          bin/clarity.sh --dagen 1
          bin/clarity.sh --dim Device --dim Source

Clarity-project y9d3vyhhk8, al actief via GTM.

De token komt uit CLARITY_TOKEN of uit ~/.config/gcloud-rootedgoods/clarity-token.
Hij wordt nooit afgedrukt en hoort niet in de repo.

WAAROM DIT RAPPORT: Clarity hangt in GTM aan dezelfde toestemmingsvoorwaarde als GA4
(consent: analytics_storage). Als beide hetzelfde aantal sessies zien, is toestemming
de volledige verklaring voor het meetgat. Ziet Clarity er duidelijk meer, dan heeft GA4
een eigen probleem bovenop de toestemming. Dat onderscheid is de hele reden om dit te
draaien; de heatmaps zijn bijvangst.
"""
import argparse, json, os, sys, datetime as dt, urllib.error, urllib.parse, urllib.request

API = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
HOE = (
    "Een token maak je in Clarity:\n\n"
    "  1. clarity.microsoft.com, project Rooted Goods (y9d3vyhhk8)\n"
    "  2. Settings > Data export (of: Instellingen > Gegevensexport)\n"
    "  3. Generate new API token, kopieer hem\n\n"
    "Opslaan, buiten de repo, en plak de TOKEN, niet dit commando:\n"
    "  pbpaste > ~/.config/gcloud-rootedgoods/clarity-token\n"
    "  chmod 600 ~/.config/gcloud-rootedgoods/clarity-token"
)


def sterf(m, hint=""):
    print(f"\nAFGEBROKEN: {m}", file=sys.stderr)
    if hint:
        print(f"\n{hint}", file=sys.stderr)
    sys.exit(1)


def token():
    t = os.environ.get("CLARITY_TOKEN")
    waar = "CLARITY_TOKEN"
    if not t:
        pad = os.path.expanduser("~/.config/gcloud-rootedgoods/clarity-token")
        if not os.path.exists(pad):
            sterf("geen Clarity-token gevonden.", HOE)
        waar = pad
        with open(pad) as f:
            t = f.read()
    t = (t or "").strip()
    if not t:
        sterf(f"de token in {waar} is leeg.", HOE)
    if len(t.split()) > 1 or len(t) < 20:
        sterf(f"wat in {waar} staat lijkt geen token "
              f"({len(t.splitlines())} regels, {len(t)} tekens).",
              "Het ziet ernaar uit dat er een commando of meerdere regels in staan.\n\n" + HOE)
    return t


def haal(tok, dagen, dims):
    q = [("numOfDays", str(dagen))]
    for i, d in enumerate(dims[:3], 1):
        q.append((f"dimension{i}", d))
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(q),
                                 headers={"Authorization": f"Bearer {tok}",
                                          "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        lijf = e.read().decode("utf-8", "replace")[:300]
        if e.code in (401, 403):
            sterf(f"Clarity weigert de token ({e.code}).", HOE)
        if e.code == 429:
            sterf("Clarity-daglimiet bereikt (10 aanroepen per project per dag).",
                  "Morgen weer, of gebruik de handmatige export uit het dashboard.")
        sterf(f"Clarity-fout {e.code}", lijf)
    except Exception as e:
        sterf(f"kon Clarity niet bereiken: {e}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dagen", type=int, default=3, choices=[1, 2, 3],
                   help="de API geeft maximaal 3 dagen terug; oktober haal je hier niet mee op")
    p.add_argument("--dim", action="append", default=None,
                   help="herhaalbaar, max 3. Bijvoorbeeld Device, Source, URL, Browser, Country")
    a = p.parse_args()
    dims = a.dim or ["Device"]

    tok = token()
    data = haal(tok, a.dagen, dims)

    tot = (dt.date.today() - dt.timedelta(days=1))
    van = tot - dt.timedelta(days=a.dagen - 1)
    print(f"Clarity y9d3vyhhk8 | laatste {a.dagen} dagen (ongeveer {van} t/m {tot})"
          f" | dimensies: {', '.join(dims)}")
    print("Let op: deze API geeft alleen de laatste dagen. Voor oktober is een handmatige")
    print("export uit het dashboard nodig; opnames leven daar ongeveer 30 dagen.\n")

    if not data:
        print("GEEN DATA. Dat is zelf een bevinding: of er was geen verkeer, of de tag vuurt niet.")
        return

    sessies = None
    for blok in data:
        naam = blok.get("metricName", "?")
        info = blok.get("information", [])
        print(f"### {naam}")
        if not info:
            print("    (leeg)\n")
            continue
        sleutels = [k for k in info[0].keys()]
        print("    " + "".join(f"{k[:26]:<28}" for k in sleutels))
        for rij in info[:15]:
            print("    " + "".join(f"{str(rij.get(k, ''))[:26]:<28}" for k in sleutels))
        if naam == "Traffic":
            try:
                sessies = sum(int(r.get("totalSessionCount", 0)) for r in info)
                bots = sum(int(r.get("totalBotSessionCount", 0)) for r in info)
                print(f"\n    totaal sessies: {sessies} | waarvan bot: {bots}")
            except Exception:
                pass
        print()

    if sessies is not None:
        print("### De vergelijking die ertoe doet")
        print(f"    Clarity telde {sessies} sessies over deze {a.dagen} dagen.")
        print("    Draai nu hetzelfde venster in GA4 en leg het ernaast:")
        print(f"      bin/ga4.sh --van {van} --tot {tot}")
        print("    Vergelijkbaar  -> toestemming verklaart het meetgat volledig.")
        print("    Clarity hoger  -> GA4 heeft daarbovenop een eigen probleem.")


if __name__ == "__main__":
    main()
