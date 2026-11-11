#!/usr/bin/env python3
"""Samenvatting van toestand-meting-*.json en kandidaat-toestand.css: !important weg bij declaraties waarvan alle
gemeten longhands in de geforceerde toestand 'gelijk' waren (geen enkele 'nodig'). Regelnummers = huidige rootedgoods.css."""
import json,re,sys,os,glob,collections
H=os.path.dirname(os.path.abspath(__file__))
rows=[]
for f in sorted(glob.glob(H+'/toestand-meting-*.json')): rows+=json.load(open(f))
per={}
for r in rows:
    e=per.setdefault((r['l'],r['p']),{'nodig':0,'gelijk':0,'nm':0,'d':None})
    if r['st']=='nodig': e['nodig']+=1; e['d']=e['d'] or f"{r['vp']} {r['pad']}: {r['d']}"
    elif r['st']=='gelijk': e['gelijk']+=1
    else: e['nm']+=1
def oordeel(e): return 'nodig' if e['nodig'] else ('gelijk' if e['gelijk'] else 'niet-gemeten')
tel=collections.Counter(oordeel(e) for e in per.values())
print('metingen',len(rows),'| longhands in toestandsregels:',len(per),dict(tel))
json.dump({f"{l}|{p}":dict(oordeel=oordeel(e),verschil=e['d']) for (l,p),e in per.items()},open(H+'/toestand-oordeel.json','w'),ensure_ascii=False)
if len(sys.argv)<2: sys.exit()
inv,uit=sys.argv[1],sys.argv[2]
t=open(inv,encoding='utf-8').read()
props={}
for (l,p),e in per.items(): props.setdefault(l,{})[p]=oordeel(e)
def hoort(name,p): return name==p or p.startswith(name+'-') or (name=='border-radius' and re.match(r'^border-.*-radius$',p)) or (name=='inset' and p in('top','right','bottom','left')) or (name=='gap' and p.endswith('-gap')) or (name=='font' and p.startswith('font-')) or (name=='overflow' and p.startswith('overflow-'))
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
wijz=[];n=0
for l in sorted(props):
    ps=props[l]; j=t.index('{',starts[l-1]); k=t.index('}',j); blok=t[j+1:k]; ch=False; nieuw=[]
    for d in splits(blok):
        m=re.match(r'^(\s*)([a-z-]+)(\s*:\s*)(.*?)(\s*!important)(\s*)$',d,flags=re.S)
        if m and not m.group(2).startswith('--'):
            pp=[p for p in ps if hoort(m.group(2),p)]
            if pp and all(ps[p]=='gelijk' for p in pp): d=m.group(1)+m.group(2)+m.group(3)+m.group(4)+m.group(6);ch=True;n+=1
        nieuw.append(d)
    if ch: wijz.append((j+1,k,';'.join(nieuw)))
res=[];p=0
for a,b,nb in wijz: res.append(t[p:a]);res.append(nb);p=b
res.append(t[p:]);r=''.join(res); open(uit,'w',encoding='utf-8').write(r)
print(f"{n} declaraties in {len(wijz)} regels ontdaan; braces {r.count('{')-r.count('}')}")
