#!/usr/bin/env python3
"""Maakt kandidaat.css: haalt !important weg bij declaraties waarvan ALLE gemeten longhands 'gelijk' zijn,
in regels die verder wel nodige !important houden (de 'alles gelijk'-regels zijn al weg).
Gebruik: python3 -I strip-gelijk.py <invoer.css> <uitvoer.css> [van tot]"""
import json,re,sys,os
H=os.path.dirname(os.path.abspath(__file__))
inv,uit=sys.argv[1],sys.argv[2]
van,tot=(int(sys.argv[3]),int(sys.argv[4])) if len(sys.argv)>4 else (1,10**9)
t=open(inv,encoding='utf-8').read()
import os as _o
o=json.load(open(os.path.join(H,_o.environ.get('OORDEEL','oordeel-per-longhand.json'))))
ALLES=bool(_o.environ.get('ALLES'))
DYN=re.compile(r':(hover|focus|focus-visible|focus-within|active|checked|disabled|enabled|visited|target|placeholder-shown|invalid|valid|read-only|indeterminate|-webkit-autofill)\b')
per={}
for k,v in o.items():
    l,p=k.split('|'); per.setdefault(int(l),{})[p]=v['oordeel']
def hoort(name,p):
    return name==p or p.startswith(name+'-') or (name=='border-radius' and re.match(r'^border-.*-radius$',p)) or (name=='inset' and p in('top','right','bottom','left')) or (name=='gap' and p.endswith('-gap')) or (name=='font' and p.startswith('font-')) or (name=='flex' and p.startswith('flex-')) or (name=='grid-template' and p.startswith('grid-template-')) or (name=='overflow' and p.startswith('overflow-'))
def splits(blok):
    d=[];b='';dep=0;q=''
    for c in blok:
        if q:
            b+=c
            if c==q:q=''
            continue
        if c in'"\'':q=c;b+=c;continue
        if c=='(':dep+=1
        if c==')':dep-=1
        if c==';' and dep==0:d.append(b);b=''
        else:b+=c
    d.append(b);return d
starts=[0]
for m in re.finditer('\n',t): starts.append(m.end())
wijz=[];n_decl=0;n_reg=0
for l in sorted(per):
    if not(van<=l<=tot): continue
    props=per[l]
    if not ALLES and 'nodig' not in props.values(): continue   # standaard alleen gemengde regels
    j=t.index('{',starts[l-1]);k=t.index('}',j);blok=t[j+1:k]
    # selector erbij: regels met toestand-pseudo's overslaan (die meet toestand.mjs)
    a=j
    while a>0 and t[a-1] not in '};/' : a-=1
    if DYN.search(t[a:j]): continue
    nieuw=[];ch=False
    for d in splits(blok):
        m=re.match(r'^(\s*)([a-z-]+)(\s*:\s*)(.*?)(\s*!important)(\s*)$',d,flags=re.S)
        if m and not m.group(2).startswith('--'):
            ps=[p for p in props if hoort(m.group(2),p)]
            if ps and all(props[p]=='gelijk' for p in ps):
                d=m.group(1)+m.group(2)+m.group(3)+m.group(4)+m.group(6);ch=True;n_decl+=1
        nieuw.append(d)
    if ch: wijz.append((j+1,k,';'.join(nieuw)));n_reg+=1
res=[];p=0
for a,b,nb in wijz: res.append(t[p:a]);res.append(nb);p=b
res.append(t[p:]);r=''.join(res)
open(uit,'w',encoding='utf-8').write(r)
print(f"{n_decl} declaraties in {n_reg} regels ontdaan van !important; braces {r.count('{')-r.count('}')}, regels {r.count(chr(10))}")
