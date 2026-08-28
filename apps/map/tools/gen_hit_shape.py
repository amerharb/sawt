#!/usr/bin/env python3
"""
Generate the clickable hit shape (`h`) for one country in world.json.

The shape is the country's land plus every point of water that is BOTH
 - inside the convex hull of the country's geometry (so it reaches across
   its own straits and bays but does not claim open ocean), and
 - closer to this country's coastline than to any other country's —
   the equidistance principle real maritime EEZ boundaries use, which is
   what the user pointed at on OpenStreetMap.
"""
import json
import os
import re
import sys
import numpy as np

CODE = sys.argv[1] if len(sys.argv) > 1 else 'ca'
GRID = 0.4          # grid spacing in map units
RESAMPLE = 0.3      # coastline resample step for distance queries
DP_TOL = 0.35       # Douglas-Peucker tolerance
MIN_AREA = 0.15     # drop contour specks smaller than this (units^2) — kept
                    # low so an enclave's hole survives (Brunei in Malaysia,
                    # Oecusse in Indonesia); .hit-shape is fill-rule: evenodd,
                    # so any kept inner loop punches a true hole

HERE = os.path.dirname(os.path.abspath(__file__))
WORLD = os.path.join(HERE, '..', 'public', 'world.json')


def parse_d(d):
    """'M..L..Z' absolute-only path -> list of rings [(x,y), ...]."""
    rings, cur = [], []
    for cmd, body in re.findall(r'([MLZ])([^MLZ]*)', d):
        if cmd == 'Z':
            if cur:
                rings.append(cur)
            cur = []
            continue
        pts = [tuple(map(float, p.split(','))) for p in body.strip().split('L') if p]
        # M may be followed by implicit L points in the same body
        pairs = re.findall(r'(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)', body)
        pts = [(float(x), float(y)) for x, y in pairs]
        if cmd == 'M':
            if cur:
                rings.append(cur)
            cur = list(pts)
        else:
            cur.extend(pts)
    if cur:
        rings.append(cur)
    return [r for r in rings if len(r) >= 3]


def resample(rings, step):
    """Dense point cloud along ring boundaries."""
    out = []
    for r in rings:
        pts = r + [r[0]]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            seg = math_hypot(x1 - x0, y1 - y0)
            n = max(1, int(seg / step))
            for k in range(n):
                t = k / n
                out.append((x0 + t * (x1 - x0), y0 + t * (y1 - y0)))
    return np.array(out)


def math_hypot(a, b):
    return (a * a + b * b) ** 0.5


def convex_hull(points):
    pts = sorted(set(points))
    if len(pts) < 3:
        return pts
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]  # counter-clockwise in math coords


def hull_signed_dist(hull, X, Y):
    """Signed distance into a convex polygon (positive inside)."""
    area2 = sum(x0 * y1 - x1 * y0
                for (x0, y0), (x1, y1) in zip(hull, hull[1:] + [hull[0]]))
    poly = hull if area2 > 0 else hull[::-1]  # force algebraic CCW
    d = np.full(X.shape, np.inf)
    n = len(poly)
    for i in range(n):
        x0, y0 = poly[i]
        x1, y1 = poly[(i + 1) % n]
        nx, ny = -(y1 - y0), (x1 - x0)  # left normal = inward for CCW
        ln = math_hypot(nx, ny) or 1.0
        d = np.minimum(d, ((X - x0) * nx + (Y - y0) * ny) / ln)
    return d


def inside_rings(rings, X, Y):
    """Even-odd point-in-polygon across all rings, vectorized per edge."""
    inside = np.zeros(X.shape, dtype=bool)
    for r in rings:
        rx = np.array([p[0] for p in r])
        ry = np.array([p[1] for p in r])
        j = len(r) - 1
        for i in range(len(r)):
            x0, y0, x1, y1 = rx[j], ry[j], rx[i], ry[i]
            cond = ((y1 > Y) != (y0 > Y)) & (X < (x0 - x1) * (Y - y1) / ((y0 - y1) or 1e-12) + x1)
            inside ^= cond
            j = i
    return inside


def nearest_dist(cloud, qx, qy, chunk=1500):
    """Distance from each query point to the nearest cloud point (chunked)."""
    out = np.empty(qx.shape[0])
    cx, cy = cloud[:, 0], cloud[:, 1]
    for s in range(0, qx.shape[0], chunk):
        e = min(s + chunk, qx.shape[0])
        dx = qx[s:e, None] - cx[None, :]
        dy = qy[s:e, None] - cy[None, :]
        out[s:e] = np.sqrt((dx * dx + dy * dy).min(axis=1))
    return out


def marching_squares(F, xs, ys, level=0.0):
    """Extract level contours as closed loops of (x, y)."""
    segs = []
    nx, ny = len(xs), len(ys)
    for j in range(ny - 1):
        for i in range(nx - 1):
            v = [F[j, i], F[j, i + 1], F[j + 1, i + 1], F[j + 1, i]]
            idx = sum((1 << k) for k in range(4) if v[k] > level)
            if idx in (0, 15):
                continue
            x0, x1 = xs[i], xs[i + 1]
            y0, y1 = ys[j], ys[j + 1]
            def interp(a, b, pa, pb):
                t = (level - a) / (b - a) if b != a else 0.5
                return (pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1]))
            e = {
                't': interp(v[0], v[1], (x0, y0), (x1, y0)),
                'r': interp(v[1], v[2], (x1, y0), (x1, y1)),
                'b': interp(v[3], v[2], (x0, y1), (x1, y1)),
                'l': interp(v[0], v[3], (x0, y0), (x0, y1)),
            }
            TABLE = {
                1: [('l', 't')], 2: [('t', 'r')], 3: [('l', 'r')],
                4: [('r', 'b')], 5: [('l', 't'), ('r', 'b')], 6: [('t', 'b')],
                7: [('l', 'b')], 8: [('b', 'l')], 9: [('b', 't')],
                10: [('t', 'r'), ('b', 'l')], 11: [('b', 'r')],
                12: [('r', 'l')], 13: [('r', 't')], 14: [('t', 'l')],
            }
            for a, b in TABLE[idx]:
                segs.append((e[a], e[b]))
    # chain segments into loops, matching endpoints in either direction
    from collections import defaultdict
    key = lambda p: (round(p[0], 6), round(p[1], 6))
    at = defaultdict(list)  # endpoint key -> [seg ids touching it]
    for si, (a, b) in enumerate(segs):
        at[key(a)].append(si)
        at[key(b)].append(si)
    loops, used = [], set()
    for start in range(len(segs)):
        if start in used:
            continue
        a, b = segs[start]
        used.add(start)
        loop = [a, b]
        while key(loop[-1]) != key(loop[0]):
            k = key(loop[-1])
            si = next((s for s in at[k] if s not in used), None)
            if si is None:
                break
            used.add(si)
            sa, sb = segs[si]
            loop.append(sb if key(sa) == k else sa)
        if key(loop[-1]) == key(loop[0]) and len(loop) > 3:
            loops.append(loop[:-1])
    return loops


def dp_simplify(pts, tol):
    """Douglas-Peucker on a closed ring (split at the two farthest points)."""
    if len(pts) < 5:
        return pts
    def simplify_open(p):
        if len(p) < 3:
            return p
        ax, ay = p[0]
        bx, by = p[-1]
        dx, dy = bx - ax, by - ay
        ln = math_hypot(dx, dy) or 1e-12
        dmax, imax = -1.0, 0
        for i in range(1, len(p) - 1):
            d = abs((p[i][0] - ax) * dy - (p[i][1] - ay) * dx) / ln
            if d > dmax:
                dmax, imax = d, i
        if dmax > tol:
            left = simplify_open(p[:imax + 1])
            right = simplify_open(p[imax:])
            return left[:-1] + right
        return [p[0], p[-1]]
    # anchor at two extremes so the ring split is stable
    i0 = max(range(len(pts)), key=lambda i: pts[i][0] + pts[i][1])
    rot = pts[i0:] + pts[:i0]
    half = len(rot) // 2
    a = simplify_open(rot[:half + 1])
    b = simplify_open(rot[half:] + [rot[0]])
    return a[:-1] + b[:-1]


def ring_area(pts):
    s = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + [pts[0]]):
        s += x0 * y1 - x1 * y0
    return abs(s) / 2


def main():
    sys.setrecursionlimit(100000)
    world = json.load(open(WORLD))
    me = next(sh for sh in world['shapes'] if sh.get('c') == CODE)
    my_rings = parse_d(me['d'])
    my_pts = [p for r in my_rings for p in r]
    hull = convex_hull(my_pts)
    hx = [p[0] for p in hull]
    hy = [p[1] for p in hull]
    print(f'{CODE}: {len(my_rings)} rings, {len(my_pts)} pts, hull {len(hull)} pts,'
          f' bbox x[{min(hx):.0f},{max(hx):.0f}] y[{min(hy):.0f},{max(hy):.0f}]')

    # foreign shapes whose bbox comes near the hull
    pad = 12
    bx0, bx1 = min(hx) - pad, max(hx) + pad
    by0, by1 = min(hy) - pad, max(hy) + pad
    foreign_rings = []
    foreign_codes = []
    for sh in world['shapes']:
        if sh.get('c') == CODE:
            continue
        rings = parse_d(sh['d'])
        near = [r for r in rings
                if max(p[0] for p in r) > bx0 and min(p[0] for p in r) < bx1
                and max(p[1] for p in r) > by0 and min(p[1] for p in r) < by1]
        if near:
            foreign_rings.extend(near)
            foreign_codes.append(sh.get('c') or sh.get('n'))
    print('neighbours considered:', ', '.join(foreign_codes))

    my_cloud = resample(my_rings, RESAMPLE)
    fo_cloud = resample(foreign_rings, RESAMPLE)
    print(f'clouds: own {len(my_cloud)}, foreign {len(fo_cloud)}')

    xs = np.arange(bx0, bx1 + GRID, GRID)
    ys = np.arange(by0, by1 + GRID, GRID)
    X, Y = np.meshgrid(xs, ys)
    Hd = hull_signed_dist(hull, X, Y)
    n_in = int((Hd > 0).sum())
    print('grid:', X.shape, ' inside hull:', n_in)
    assert 0 < n_in < X.size, 'hull field is degenerate'

    # equidistance field only where it can matter
    mask = Hd > -GRID
    qi = np.where(mask.ravel())[0]
    qx, qy = X.ravel()[qi], Y.ravel()[qi]
    d_own = nearest_dist(my_cloud, qx, qy)
    d_for = nearest_dist(fo_cloud, qx, qy)
    EPS = 0.4  # daylight: the water line sits slightly Canada-ward of true midline
    Eq = np.full(X.size, -1e9)
    Eq[qi] = d_for - d_own - EPS
    Eq = Eq.reshape(X.shape)

    # land overrides: own land is always in, foreign land never
    own_land = inside_rings(my_rings, X, Y)
    fo_land = inside_rings(foreign_rings, X, Y)
    F = np.minimum(Eq, Hd)
    F[own_land] = np.maximum(F[own_land], GRID)   # own land: in, even at hull edge
    F[fo_land] = -GRID                            # foreign land: out, always
    print('field: in', int((F > 0).sum()), 'out', int((F <= 0).sum()))

    loops = marching_squares(F, xs, ys)
    loops = [lp for lp in loops if ring_area(lp) > MIN_AREA]
    loops.sort(key=ring_area, reverse=True)
    print('contours:', len(loops), ' largest area:', round(ring_area(loops[0]), 1))

    simplified = [dp_simplify(lp, DP_TOL) for lp in loops]

    # safety: how far (if at all) does the simplified line dip into foreign land?
    bad, worst = 0, 0.0
    for lp in simplified:
        for (x0, y0), (x1, y1) in zip(lp, lp[1:] + [lp[0]]):
            n = max(2, int(math_hypot(x1 - x0, y1 - y0) / 0.2))
            sx = np.linspace(x0, x1, n)
            sy = np.linspace(y0, y1, n)
            hit = inside_rings(foreign_rings, sx[None, :], sy[None, :])[0]
            if hit.any():
                bad += 1
                # depth = distance from the trespassing sample to foreign coast
                d = nearest_dist(fo_cloud, sx[hit], sy[hit])
                worst = max(worst, float(d.max()))
    print(f'edges nicking foreign land: {bad}, deepest: {worst:.2f} units'
          f' (~{worst * 1.28:.2f}px at 1280w)')

    parts = []
    total_pts = 0
    for lp in simplified:
        total_pts += len(lp)
        parts.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in lp) + 'Z')
    h = ''.join(parts)
    print(f'h: {len(simplified)} subpaths, {total_pts} points, {len(h)} chars')
    out = os.path.join(HERE, CODE + '_h.txt')
    open(out, 'w').write(h)
    print('written:', out, '— paste into the shape\'s "h" in world.json'
          ' and raise the cacheVersion in src/audioCache.ts')


if __name__ == '__main__':
    main()
