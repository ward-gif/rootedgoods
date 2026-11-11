#!/usr/bin/env python3
"""Toont per sectie (regelbereik) de !important-regels die 'nodig' bleken, met voorbeeld van het verschil.
Gebruik: python3 -I sectie-lijst.py <van> <tot>"""
import json,re,sys,os
H=os.path.dirname(os.path.abspath(__file__))
van,tot=int(sys.argv[1]),int(sys.argv[2])
css=open(os.path.join(H,'../../../rootedgoods.css'),encoding='utf-8').read().split('\n')
o=json.load(open(os.path.join(H,'oordeel-per-longhand.json')))
per={}
for k,v in o.items():
    l,p=k.split('|'); l=int(l)
    if van<=l<=tot and v['oordeel']=='nodig': per.setdefault(l,[]).append((p,v['verschil']))
def sel(l):
    i=l-1; st=[css[i]]
    while i>0 and not re.search(r'(\}|\*/|;|\{)\s*$',css[i-1]) and css[i-1].strip(): i-=1; st.insert(0,css[i])
    return re.sub(r'\s+',' ',' '.join(st)).strip()[:120]
for l in sorted(per):
    print(f"r{l}: {sel(l)}")
    for p,d in per[l][:3]: print(f"      {p}: {d}")
print(len(per),'regels nodig in',van,'-',tot)
