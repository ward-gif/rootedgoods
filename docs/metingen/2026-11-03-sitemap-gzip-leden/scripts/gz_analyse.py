import sys, zlib, struct, gzip, io
for path in sys.argv[1:]:
    data = open(path,'rb').read()
    print("=====", path, "bytes:", len(data))
    # find all gzip magic positions
    pos = [i for i in range(len(data)-2) if data[i:i+3]==b'\x1f\x8b\x08']
    print("gzip-magic posities:", pos)
    # parse members sequentially
    off = 0; n = 0; total = b''
    while off < len(data):
        n += 1
        hdr = data[off:off+10]
        if hdr[:3] != b'\x1f\x8b\x08':
            print(f"  lid {n}: GEEN gzip-header op offset {off}, resterend {len(data)-off} bytes: {data[off:off+16].hex()}")
            break
        flg = hdr[3]; mtime = struct.unpack('<I', hdr[4:8])[0]; xfl=hdr[8]; os_=hdr[9]
        print(f"  lid {n}: offset {off}, FLG={flg:#04x}, MTIME={mtime}, XFL={xfl}, OS={os_}")
        d = zlib.decompressobj(-15)
        out = d.decompress(data[off+10:])
        rest = d.unused_data
        if not d.eof:
            print("   deflate-stroom NIET afgesloten (geen final block)"); 
        end_deflate = len(data) - len(rest)
        trailer = data[end_deflate:end_deflate+8]
        crc, isize = struct.unpack('<II', trailer) if len(trailer)==8 else (None,None)
        print(f"   deflate eindigt op {end_deflate}, uitgepakt {len(out)} bytes, trailer crc={crc:#010x} isize={isize}" if crc is not None else f"   trailer ontbreekt/kort: {trailer.hex()}")
        if crc is not None:
            print(f"   crc klopt: {zlib.crc32(out)&0xffffffff==crc}, isize klopt: {isize==len(out)%2**32}")
        # last bytes of deflate stream
        print("   laatste 12 bytes deflate:", data[end_deflate-12:end_deflate].hex())
        total += out
        off = end_deflate + 8
    print("  totaal leden:", n, "uitgepakt totaal:", len(total))
    # stdlib gzip
    try:
        g = gzip.decompress(data); print("  gzip.decompress OK:", len(g))
    except Exception as e: print("  gzip.decompress FOUT:", e)
    open(path.rsplit('.gz',1)[0], 'wb').write(total)
    print("  begin:", total[:120])
    print("  einde:", total[-200:])
