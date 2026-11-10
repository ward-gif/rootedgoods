import json,sys
# Gebruik: python3 vergelijk.py <variant-zonder-js> [referentie=met-js]
v=sys.argv[1]; ref=sys.argv[2] if len(sys.argv)>2 else 'met-js'
a=json.load(open(f'hoogtes-{v}.json')); b=json.load(open(f'hoogtes-{ref}.json'))
velden=[('hero','y'),('hero','h'),('titel','y'),('knop','y'),('noot','y'),('slider','y'),('sliderSectie','y'),('sliderSectie','h'),('scrollH',None)]
print(f'verschil per veld: {v} min {ref} (px; + = lager/groter dan na de JS)')
print('veld'.ljust(22),*[k.split('x')[0].rjust(7) for k in a])
for n,p in velden:
    rij=[]
    for k in a:
        x=a[k].get(n) if p else a[k].get(n); y=b[k].get(n)
        if p is None: d=x-y
        else: d=(x[p]-y[p]) if (x and y) else None
        rij.append('   -   ' if d is None else f'{d:7.1f}')
    print(f'{n}.{p or ""}'.ljust(22),*rij)
