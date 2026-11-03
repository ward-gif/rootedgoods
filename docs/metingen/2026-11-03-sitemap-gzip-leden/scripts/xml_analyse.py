import sys, zlib, struct, re
from xml.etree import ElementTree as ET
from urllib.parse import urlparse
NS='{http://www.sitemaps.org/schemas/sitemap/0.9}'
def members(data):
    off=0; out=[]
    while off < len(data):
        d=zlib.decompressobj(-15); o=d.decompress(data[off+10:])
        end=len(data)-len(d.unused_data); out.append(o); off=end+8
    return out
def check(label, xml):
    print(f"--- {label}: {len(xml)} bytes")
    try:
        root=ET.fromstring(xml)
    except ET.ParseError as e:
        print("   XML-parser: FOUT:", e)
        # count urls anyway
        print("   ruwe <url>-tellingen:", xml.count(b'<url>'), "</url>:", xml.count(b'</url>'), "<urlset:", xml.count(b'<urlset'), "</urlset>:", xml.count(b'</urlset>'), "<?xml:", xml.count(b'<?xml'))
        return
    print("   XML-parser: OK, root:", root.tag)
    urls=root.findall(NS+'url')
    locs=[u.findtext(NS+'loc') for u in urls]
    print("   url-elementen:", len(urls), "unieke loc:", len(set(locs)))
    hosts=set(urlparse(l).netloc for l in locs); print("   hosts:", hosts)
    bad_len=[l for l in locs if len(l)>2048]; print("   loc > 2048 tekens:", len(bad_len))
    nonascii=[l for l in locs if any(ord(c)>127 for c in l)]; print("   loc met non-ascii:", len(nonascii), nonascii[:3])
    unesc=[l for l in locs if '&' in l and '&amp;' not in l]; print("   loc met onge-escapete &:", len(unesc))
    sp=[l for l in locs if ' ' in l]; print("   loc met spatie:", len(sp), sp[:3])
    lastmods=[u.findtext(NS+'lastmod') for u in urls]
    badlm=[x for x in lastmods if x is not None and not re.fullmatch(r'\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?', x)]
    print("   lastmod afwijkend:", len(badlm), badlm[:3], " ontbrekend:", lastmods.count(None))
    cf=set(u.findtext(NS+'changefreq') for u in urls); print("   changefreq-waarden:", cf)
    pr=set(u.findtext(NS+'priority') for u in urls); print("   priority-waarden:", pr)
    other=set(c.tag for u in urls for c in u if c.tag not in (NS+'loc',NS+'lastmod',NS+'changefreq',NS+'priority')); print("   overige kindelementen:", other)
    # duplicates
    from collections import Counter
    dup=[(l,c) for l,c in Counter(locs).items() if c>1]; print("   dubbele loc:", len(dup), dup[:3])
    # scheme/host categories
    paths=Counter(urlparse(l).path.split('/')[1] if urlparse(l).path.count('/')>=2 else '(root-niveau)' for l in locs)
    print("   eerste padsegment:", paths.most_common(8))
    return locs
for path in sys.argv[1:]:
    data=open(path,'rb').read()
    print("=====", path)
    ms=members(data)
    all_locs=[]
    for i,m in enumerate(ms,1):
        r=check(f"lid {i}", m)
        if r: all_locs.append(r)
    if len(ms)>1:
        check("aaneengeschakeld (alle leden)", b''.join(ms))
        print("   lid-inhoud identiek? ", [ms[i]==ms[j] for i in range(len(ms)) for j in range(i+1,len(ms))])
        # is lid 1 a prefix of final lid?
        print("   lid 1 is prefix van laatste lid:", ms[-1].startswith(ms[0]))
        print("   lid 1 eindigt op:", ms[0][-80:])
