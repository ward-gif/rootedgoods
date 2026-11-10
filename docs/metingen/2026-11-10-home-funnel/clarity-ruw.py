#!/usr/bin/env python3
"""Bewaart de ruwe Clarity-API-uitvoer (laatste 3 dagen) als JSON, zonder afkappen.
bin/clarity.py drukt maar 15 rijen per metric af en kapt URL's op 26 tekens; hier
staat alles. Draaien vanuit de repo-wortel met .venv/bin/python. Eén API-aanroep
per draai (daglimiet 10)."""
import importlib.util, json, sys, datetime as dt, pathlib
HIER = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("clarity", HIER.parents[2] / "bin" / "clarity.py")
clarity = importlib.util.module_from_spec(spec); spec.loader.exec_module(clarity)
dims = sys.argv[1:] or ["URL", "Device"]
data = clarity.haal(clarity.token(), 3, dims)
uit = HIER / f"clarity-3dagen-{'-'.join(d.lower() for d in dims)}-{dt.date.today().isoformat()}.json"
uit.write_text(json.dumps({"opgehaald": dt.datetime.now().isoformat(timespec='seconds'),
                           "numOfDays": 3, "dimensies": dims, "data": data}, indent=1, ensure_ascii=False))
print("bewaard:", uit, "| metrics:", [b.get("metricName") for b in data])
