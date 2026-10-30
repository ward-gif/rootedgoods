#!/usr/bin/env python3
"""Haalt HTML-commentaar uit een blok en ruimt op wat dat achterlaat.

    python3 bin/ontdoe-commentaar.py blokken-def/over-ons.html

Eén implementatie, gebruikt door plakklaar.sh en plak.sh. Twee kopieën van deze
regel zouden precies de drift opleveren waar deze hele opzet vanaf moest.
"""
import re, sys

def ontdoe(s: str) -> str:
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    # Eerst regels die daarna alleen nog spaties bevatten, dan lege regels op een
    # rij. Die volgorde is nodig: anders blijft de inspringing van een weggehaald
    # commentaar als onzichtbare regel staan.
    s = re.sub(r'(?m)^[ \t]+$', '', s)
    return re.sub(r'\n{3,}', '\n\n', s).strip()

if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit("gebruik: ontdoe-commentaar.py <bestand>")
    with open(sys.argv[1], encoding='utf-8') as f:
        uit = ontdoe(f.read())
    if not uit:
        sys.exit(f"AFGEBROKEN: {sys.argv[1]} levert niets op na het strippen.")
    print(uit)
