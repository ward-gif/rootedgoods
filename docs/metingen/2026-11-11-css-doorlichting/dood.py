#!/usr/bin/env python3
"""Zoekt regels met !important waarvan de selector een eigen (rg-*) of themaklasse bevat die nergens voorkomt:
niet in 35 live pagina's (ruwe HTML), niet in blokken-def/, niet in rootedgoods.js.
Invoer: kandidaten-gelijk.tsv (niet gemeten) op de oude regelnummering (css-voor-opschoning-ed4514f.css)."""
import re,csv,os,glob,json
H=os.path.dirname(os.path.abspath(__file__)); R=os.path.abspath(os.path.join(H,'../../..'))
bronnen={}
def tokens(t): return set(re.findall(r'[A-Za-z_][\w-]*',t))
html=set();
for f in glob.glob(H+'/dood/p*.html'): html|=tokens(open(f,encoding='utf-8',errors='ignore').read())
blok=set()
for f in glob.glob(R+'/blokken-def/*.html'): blok|=tokens(open(f,encoding='utf-8',errors='ignore').read())
js=tokens(open(R+'/rootedgoods.js',encoding='utf-8').read())
oud=open(H+'/css-voor-opschoning-ed4514f.css',encoding='utf-8').read().split('\n')
def selector(l):
    i=l-1; st=[oud[i]]
    while i>0 and not re.search(r'(\}|\*/|;|\{)\s*$',oud[i-1]) and oud[i-1].strip(): i-=1; st.insert(0,oud[i])
    return re.sub(r'\s+',' ',' '.join(st)).split('{')[0].strip()
def delen(s):
    uit=[];d=0;b=''
    for c in s:
        if c in '([':d+=1
        if c in ')]':d-=1
        if c==',' and d==0: uit.append(b.strip());b=''
        else:b+=c
    if b.strip():uit.append(b.strip())
    return uit
def klassen(part):
    p=re.sub(r':(not|where|is|has)\((?:[^()]|\([^()]*\))*\)','',part)       # negatieve/optionele delen weg
    p=re.sub(r'\[[^\]]*\]','',p)
    return re.findall(r'(?<![\w-])[.#]([A-Za-z_][\w-]*)',p)
rij=[]
for x in csv.DictReader(open(H+'/kandidaten-gelijk.tsv'),delimiter='\t'):
    if x['oordeel']!='niet gemeten': continue
    l=int(x['regel']); sel=selector(l); delen_=delen(sel)
    dood_delen=0; ontbrekend=set()
    for d in delen_:
        ks=klassen(d)
        mis=[k for k in ks if k not in html and k not in blok and k not in js]
        if mis: dood_delen+=1; ontbrekend|=set(mis)
    status='dood' if delen_ and dood_delen==len(delen_) else ('deels-dood' if dood_delen else 'levend')
    rij.append(dict(regel=l,sectie=x['sectie'],selector=sel[:160],status=status,ontbrekend=sorted(ontbrekend)))
import collections
print(collections.Counter(r['status'] for r in rij))
eigen=[r for r in rij if r['status']=='dood' and any(k.startswith('rg-') for k in r['ontbrekend'])]
thema=[r for r in rij if r['status']=='dood' and not any(k.startswith('rg-') for k in r['ontbrekend'])]
print('dood, eigen rg-klasse ontbreekt overal:',len(eigen),'| dood, alleen themaklasse ontbreekt:',len(thema))
json.dump(rij,open(H+'/dood-kandidaten.json','w'),ensure_ascii=False,indent=1)
print('\n--- eigen (rg-*) ---')
for r in eigen: print(f"r{r['regel']} [{r['sectie'][:22]}] {r['selector'][:100]}  ontbreekt: {','.join(r['ontbrekend'][:3])}")
