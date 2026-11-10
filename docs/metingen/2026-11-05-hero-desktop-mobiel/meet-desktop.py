from PIL import Image
im=Image.open('refs-ward/hero-desktop-1800px.png').convert('RGB'); W,H=im.size; px=im.load()
L,R=344,3819; TOP=138  # content-area links/rechts, en de bovenkant van de viewport (onder de Arc-balk), in device-px (2x)
def close(c,t,tol): return all(abs(c[i]-t[i])<=tol for i in range(3))
green=(45,69,40); cognac=(173,99,49); ink=(44,42,38); soft=(93,109,85); white=(255,255,255)
def rows_with(color,tol,y0,y1,x0=L,x1=R,minn=1,step=1):
    out=[]
    for y in range(y0,y1):
        n=0
        for x in range(x0,x1,step):
            if close(px[x,y],color,tol): n+=1
            if n>=minn: break
        out.append(n>=minn)
    return out
def runs(flags,y0):
    res=[];start=None
    for i,f in enumerate(flags):
        if f and start is None: start=i
        if not f and start is not None: res.append((y0+start,y0+i-1)); start=None
    if start is not None: res.append((y0+start,y0+len(flags)-1))
    return res
def bbox(color,tol,y0,y1,x0=L,x1=R):
    xs=[];ys=[]
    for y in range(y0,y1):
        for x in range(x0,x1,2):
            if close(px[x,y],color,tol): xs.append(x); ys.append(y)
    return (min(xs),min(ys),max(xs),max(ys)) if xs else None
def css(v): return round(v/2)
print('viewport (css px): breedte',css(R-L+1),'hoogte',css(2140-TOP))
# tekstregels in bosgroen (titel) tussen header-onderkant 388 en band 1329
g=runs(rows_with(green,14,388,1329,minn=3),388)
g=[r for r in g if r[1]-r[0]>6]
print('groene regels (titel):',[(css(a-TOP),css(b-TOP),css(b-a+1)) for a,b in g])
for a,b in g:
    bb=bbox(green,14,a,b+1); print('  x-bereik css',css(bb[0]-L),css(bb[2]-L),'breedte',css(bb[2]-bb[0]))
# inkt (feiten/vraag vet) regels
i=runs(rows_with(ink,10,388,1329,minn=3),388); i=[r for r in i if r[1]-r[0]>5]
print('inkt-regels (vet in feiten/vraag):',[(css(a-TOP),css(b-TOP),css(b-a+1)) for a,b in i])
for a,b in i:
    bb=bbox(ink,10,a,b+1); print('  x-bereik css',css(bb[0]-L),css(bb[2]-L),'breedte',css(bb[2]-bb[0]))
s=runs(rows_with(soft,12,388,1329,minn=3),388); s=[r for r in s if r[1]-r[0]>5]
print('zachtgroene regels:',[(css(a-TOP),css(b-TOP),css(b-a+1)) for a,b in s])
for a,b in s:
    bb=bbox(soft,12,a,b+1); print('  x-bereik css',css(bb[0]-L),css(bb[2]-L),'breedte',css(bb[2]-bb[0]))
# knop
bb=bbox(cognac,10,388,1329); print('knop bbox css: x',css(bb[0]-L),'-',css(bb[2]-L),'y',css(bb[1]-TOP),'-',css(bb[3]-TOP),'=> b x h',css(bb[2]-bb[0]),css(bb[3]-bb[1]))
# logo's: niet-crème pixels tussen knop-onderkant en band-bovenkant
y0=bb[3]+10
flags=[]
for y in range(y0,1329):
    n=sum(1 for x in range(L,R,2) if not close(px[x,y],(247,245,242),8))
    flags.append(n>=2)
lr=runs(flags,y0); print('logorij-regels css:',[(css(a-TOP),css(b-TOP),css(b-a+1)) for a,b in lr if b-a>4])
if lr:
    a=min(r[0] for r in lr if r[1]-r[0]>4); b=max(r[1] for r in lr if r[1]-r[0]>4)
    xs=[x for y in range(a,b+1,2) for x in range(L,R,2) if not close(px[x,y],(247,245,242),8)]
    print('  logorij x css',css(min(xs)-L),css(max(xs)-L),'breedte',css(max(xs)-min(xs)))
# band: witte tegels
wflags=rows_with(white,4,1200,2140,minn=40,step=2); wr=runs(wflags,1200)
print('witte tegelzones css y:',[(css(a-TOP),css(b-TOP),css(b-a+1)) for a,b in wr if b-a>20])
# tegelkolommen op y midden
ym=(wr[0][0]+wr[-1][1])//2 if wr else 1500
cols=runs([close(px[x,ym],white,4) for x in range(L,R)],L)
print('tegelkolommen css x:',[(css(a-L),css(b-L),css(b-a+1)) for a,b in cols if b-a>40])
# link onder band
bb2=bbox(cognac,14,1900,2100); print('link onder band bbox css: x',css(bb2[0]-L),css(bb2[2]-L),'y',css(bb2[1]-TOP),css(bb2[3]-TOP)) if bb2 else print('geen link gevonden')
# zwaartepunten: hero-midden t.o.v. viewport
print('horizontaal midden viewport css:',css((R-L+1)/2))
