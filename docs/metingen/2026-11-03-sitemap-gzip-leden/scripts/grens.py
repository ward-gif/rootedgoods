import sys, zlib, re
def members(data):
    off=0; out=[]
    while off < len(data):
        d=zlib.decompressobj(-15); o=d.decompress(data[off+10:])
        end=len(data)-len(d.unused_data); out.append(o); off=end+8
    return out
for path in sys.argv[1:]:
    ms=members(open(path,'rb').read())
    full=ms[-1].decode()
    urls=re.findall(r'<url>(.*?)</url>', full)
    print("=====", path, "volledig lid:", len(urls), "urls")
    for m in ms[:-1]:
        n=m.count(b'<url>')
        print(f"  partieel lid met {n} urls; eindigt precies op </url>-grens: {m.endswith(b'</url>')}")
        for i in (n-2, n-1, n, n+1):
            if 0 <= i < len(urls):
                print(f"    url #{i+1}: {re.search(r'<loc>(.*?)</loc>', urls[i]).group(1)}  {re.search(r'<lastmod>(.*?)</lastmod>', urls[i]).group(1)} {re.search(r'<priority>(.*?)</priority>', urls[i]).group(1)}")
    # URL-typen: categorie (priority 0.5?) vs product
    import collections
    kinds=collections.Counter((re.search(r'<changefreq>(.*?)</changefreq>',u).group(1), re.search(r'<priority>(.*?)</priority>',u).group(1)) for u in urls)
    print("  (changefreq, priority) verdeling:", kinds)
    # positie van eerste 'hourly'
    firsth=next((i for i,u in enumerate(urls) if 'hourly' in u), None); print("  eerste hourly-url op positie:", firsth+1 if firsth is not None else None)
    print("  grootte per url gemiddeld:", round(len(ms[-1])/len(urls),1), "bytes")
