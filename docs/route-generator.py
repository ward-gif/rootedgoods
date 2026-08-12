#!/usr/bin/env python3
"""
Routegenerator voor /over-ons.

Random walk met richtingsbias. Bewust GEEN alternerende logica: er is een
lopende heading waar per stap een delta bij komt, en het teken van die delta
mag meerdere stappen achter elkaar hetzelfde zijn. Daardoor ontstaat een
onvoorspelbare route in plaats van een trap- of hartslagmotief.

Vaste seed per segment -> de lijn blijft identiek tussen builds.
Output: een SVG-pad met L-commando's en Q's voor de (variabele) afronding.
"""
import math, random

def genereer(seed, start, eind, box, n_seg, lengte_bereik, marge=10):
    rng = random.Random(seed)
    bx, by = box
    lmin, lmax = lengte_bereik
    x, y = start
    ex, ey = eind
    punten = [(x, y)]
    heading = math.atan2(ey - y, ex - x)      # begin richting het doel

    for i in range(n_seg):
        voortgang = i / n_seg

        # zachte terugtrekking naar de richting van het eindpunt; sterker naar
        # het eind toe, zodat de route uitkomt zonder per stap hard te sturen
        gewenst = math.atan2(ey - y, ex - x)
        verschil = (gewenst - heading + math.pi) % (2 * math.pi) - math.pi
        pull = 0.08 + 0.55 * voortgang ** 3
        heading += verschil * pull

        # zachte containment: buiten de marge duwt de rand terug naar binnen
        if x < marge or x > bx - marge or y < marge or y > by - marge:
            naar_binnen = math.atan2(by / 2 - y, bx / 2 - x)
            v = (naar_binnen - heading + math.pi) % (2 * math.pi) - math.pi
            heading += v * 0.35

        # gewogen delta: meestal klein, soms flink, zelden een scherpe knik
        r = rng.random()
        if r < 0.70:   delta = math.radians(rng.uniform(-8, 8))
        elif r < 0.95: delta = math.radians(rng.uniform(-25, 25))
        else:          delta = math.radians(rng.uniform(-70, 70))
        heading += delta

        # scheefverdeelde lengte: veel korte hakkelige stukjes, af en toe lang
        lengte = lmin + (lmax - lmin) * rng.random() ** 2.4

        x += math.cos(heading) * lengte
        y += math.sin(heading) * lengte
        punten.append((x, y))

    punten.append(eind)                        # exact op het volgende punt uitkomen
    return naar_pad(punten, rng)

def naar_pad(punten, rng, afronding=(0.0, 4.0)):
    """Polyline met variabele hoekafronding (Q), geen vaste radius."""
    f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')
    d = [f'M{f(punten[0][0])},{f(punten[0][1])}']
    for i in range(1, len(punten) - 1):
        px, py = punten[i - 1]; cx, cy = punten[i]; nx, ny = punten[i + 1]
        r = rng.uniform(*afronding)
        d1 = math.hypot(cx - px, cy - py); d2 = math.hypot(nx - cx, ny - cy)
        if r < 0.3 or d1 < 1 or d2 < 1:
            d.append(f'L{f(cx)},{f(cy)}')      # scherp laten
            continue
        r = min(r, d1 / 2, d2 / 2)
        ax, ay = cx - (cx - px) / d1 * r, cy - (cy - py) / d1 * r
        bx_, by_ = cx + (nx - cx) / d2 * r, cy + (ny - cy) / d2 * r
        d.append(f'L{f(ax)},{f(ay)}Q{f(cx)},{f(cy)} {f(bx_)},{f(by_)}')
    d.append(f'L{f(punten[-1][0])},{f(punten[-1][1])}')
    return ''.join(d)

# seed, start, eind, viewBox, aantal segmenten, lengtebereik
DESKTOP = {
    0: (2114, (600, 0),  (312, 340), (1200, 340), 86,  (6, 90)),
    1: (5501, (312, 0),  (888, 380), (1200, 380), 104, (6, 90)),
    2: (7723, (888, 0),  (600, 340), (1200, 340), 92,  (6, 90)),
    3: (3391, (600, 0),  (600, 300), (1200, 300), 74,  (6, 80)),
}
MOBIEL = {
    0: (9137, (28, 0), (28, 320), (60, 320), 72, (3, 26)),
    1: (4409, (28, 0), (28, 320), (60, 320), 78, (3, 26)),
    2: (6620, (28, 0), (28, 320), (60, 320), 70, (3, 26)),
    3: (1806, (28, 0), (28, 260), (60, 260), 62, (3, 24)),
}

if __name__ == '__main__':
    import json
    uit = {'desktop': {}, 'mobiel': {}}
    for naam, tabel in (('desktop', DESKTOP), ('mobiel', MOBIEL)):
        for idx, (seed, st, ei, box, n, lb) in tabel.items():
            marge = 6 if naam == 'mobiel' else 14
            uit[naam][idx] = genereer(seed, st, ei, box, n, lb, marge)
    print(json.dumps(uit))
