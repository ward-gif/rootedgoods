#!/usr/bin/env python3
"""PageSpeed-meting voor de advertentiepagina's, mobiel en desktop.

Draaien:  bin/psi.sh            (alle standaardpagina's, mobiel)
          bin/psi.sh --desktop
          bin/psi.sh --url https://rootedgoods.eu/offerte

Schrijft elke meting weg in docs/metingen/psi-<datum>.json, zodat voor en na
naast elkaar te leggen zijn in plaats van uit het hoofd vergeleken.

De API-sleutel komt uit PSI_API_KEY of uit ~/.config/gcloud-rootedgoods/psi-api-key.
Hij wordt nooit afgedrukt en hoort niet in de repo.
"""
import argparse, json, os, sys, time, urllib.parse, urllib.request, datetime as dt

PAGINAS = [
    "https://rootedgoods.eu/",
    "https://rootedgoods.eu/eindejaarsgeschenken",
    "https://rootedgoods.eu/alle-producten/",
    "https://rootedgoods.eu/offerte",
]
AUDITS = [("largest-contentful-paint", "LCP"), ("cumulative-layout-shift", "CLS"),
          ("total-blocking-time", "TBT"), ("speed-index", "SI"),
          ("first-contentful-paint", "FCP")]


def sterf(m, hint=""):
    print(f"\nAFGEBROKEN: {m}", file=sys.stderr)
    if hint:
        print(f"\n{hint}", file=sys.stderr)
    sys.exit(1)


HOE_SLEUTEL = (
    "Maak er een in project rootedgoods-analytics:\n"
    "  console.cloud.google.com/apis/credentials  >  Create credentials  >  API key\n"
    "  beperk hem daarna tot 'PageSpeed Insights API'\n\n"
    "Kopieer in de console de SLEUTEL (kopieerpictogram ernaast), niet dit commando, en:\n"
    "  pbpaste > ~/.config/gcloud-rootedgoods/psi-api-key\n"
    "  chmod 600 ~/.config/gcloud-rootedgoods/psi-api-key\n\n"
    "Of plak hem met de hand:  code ~/.config/gcloud-rootedgoods/psi-api-key")


def keur(k, waar):
    """Een Google API-sleutel is 39 tekens en begint met AIza.

    Zonder deze controle loopt een verkeerd geplakt bestand pas tien seconden
    later vast op een onbegrijpelijke 400 van Google.
    """
    k = (k or "").strip()
    if not k:
        sterf(f"de sleutel in {waar} is leeg.", HOE_SLEUTEL)
    if "\n" in k or len(k.split()) > 1:
        sterf(f"{waar} bevat meer dan alleen een sleutel ({len(k.splitlines())} regels).",
              "Het ziet ernaar uit dat er een commando of meerdere regels in staan.\n\n" + HOE_SLEUTEL)
    if not k.startswith("AIza") or len(k) != 39:
        sterf(f"wat in {waar} staat is geen Google API-sleutel "
              f"(lengte {len(k)}, begint met '{k[:4]}'; verwacht 39 en 'AIza').",
              HOE_SLEUTEL)
    return k


def sleutel():
    k = os.environ.get("PSI_API_KEY")
    if k:
        return keur(k, "PSI_API_KEY")
    pad = os.path.expanduser("~/.config/gcloud-rootedgoods/psi-api-key")
    if os.path.exists(pad):
        with open(pad) as f:
            return keur(f.read(), "~/.config/gcloud-rootedgoods/psi-api-key")
    sterf("geen PageSpeed-sleutel gevonden.",
          "Maak er een in project rootedgoods-analytics:\n"
          "  console.cloud.google.com/apis/credentials  >  Create credentials  >  API key\n"
          "  beperk hem daarna tot 'PageSpeed Insights API'\n\n"
          "Opslaan, buiten de repo:\n"
          "  mkdir -p ~/.config/gcloud-rootedgoods\n"
          "  pbpaste > ~/.config/gcloud-rootedgoods/psi-api-key\n"
          "  chmod 600 ~/.config/gcloud-rootedgoods/psi-api-key")


def meet(url, strategy, key):
    q = urllib.parse.urlencode({"url": url, "strategy": strategy,
                                "category": "performance", "key": key})
    for poging in range(3):
        try:
            with urllib.request.urlopen(
                    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + q,
                    timeout=180) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and poging < 2:
                time.sleep(12 * (poging + 1))
                continue
            lijf = e.read().decode("utf-8", "replace")[:300]
            if e.code == 403:
                sterf(f"PageSpeed weigert de sleutel ({e.code}).",
                      "Staat de PageSpeed Insights API aan in dit project, en is de sleutel\n"
                      "niet te streng beperkt?\n"
                      "  gcloud services enable pagespeedonline.googleapis.com --project=rootedgoods-analytics")
            sterf(f"PageSpeed-fout {e.code} op {url}", lijf)
        except Exception as e:
            if poging < 2:
                time.sleep(8)
                continue
            sterf(f"kon {url} niet meten: {e}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--desktop", action="store_true")
    p.add_argument("--url", action="append", help="herhaalbaar; vervangt de standaardlijst")
    p.add_argument("--label", default="", help="korte notitie, bijvoorbeeld 'voor lazy' of 'na lazy'")
    p.add_argument("--runs", type=int, default=3,
                   help="metingen per pagina; de mediaan wordt gerapporteerd. "
                        "Een losse PSI-meting schommelt hier met een factor 2 tot 3, "
                        "dus 1 is alleen zinvol om snel iets te proeven.")
    a = p.parse_args()

    key = sleutel()
    strat = "desktop" if a.desktop else "mobile"
    urls = a.url or PAGINAS
    stamp = dt.datetime.now().strftime("%Y-%m-%d_%H%M")

    print(f"PageSpeed, {strat}, {len(urls)} pagina's, {dt.date.today().isoformat()}"
          + (f" | {a.label}" if a.label else ""))
    print("Mediaan van de metingen. Een losse PSI-meting schommelt op deze site met een")
    print("factor 2 tot 3, dus een enkel getal zegt hier niets. Spreiding staat achteraan.\n")
    kop = f"{'pagina':38} {'score':>6}" + "".join(f"{n:>10}" for _, n in AUDITS)
    print(kop)
    print("-" * len(kop))

    def mediaan(xs):
        xs = sorted(v for v in xs if v is not None)
        if not xs:
            return None
        n = len(xs)
        return xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2

    uit = []
    for url in urls:
        runs = []
        for _ in range(max(1, a.runs)):
            d = meet(url, strat, key)
            lr = d["lighthouseResult"]
            r = {"score": round(lr["categories"]["performance"]["score"] * 100)}
            for k, _n in AUDITS:
                r[k] = lr["audits"].get(k, {}).get("numericValue")
            runs.append(r)
        rij = {"url": url, "strategy": strat, "label": a.label, "runs": len(runs),
               "gemeten": dt.datetime.now().isoformat(timespec="seconds"),
               "alle_scores": [r["score"] for r in runs]}
        rij["score"] = mediaan([r["score"] for r in runs])
        cellen = ""
        for k, n in AUDITS:
            m = mediaan([r[k] for r in runs])
            rij[k] = m
            if m is None:
                cellen += f"{'-':>10}"
            elif k == "cumulative-layout-shift":
                cellen += f"{m:>10.3f}"
            else:
                cellen += f"{m/1000:>9.1f}s"
        naam = url.replace("https://rootedgoods.eu", "") or "/"
        spreiding = f"  [{min(rij['alle_scores'])}-{max(rij['alle_scores'])}]" if len(runs) > 1 else ""
        print(f"{naam:38} {int(rij['score']):>6}{cellen}{spreiding}")
        uit.append(rij)

    d = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "metingen")
    os.makedirs(d, exist_ok=True)
    pad = os.path.join(d, f"psi-{stamp}-{strat}{('-' + a.label.replace(' ', '-')) if a.label else ''}.json")
    with open(pad, "w", encoding="utf-8") as f:
        json.dump(uit, f, indent=1, ensure_ascii=False)
    print(f"\nopgeslagen: {os.path.relpath(pad)}")


if __name__ == "__main__":
    main()
