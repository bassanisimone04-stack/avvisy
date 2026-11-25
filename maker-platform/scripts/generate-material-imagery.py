"""
Generate original, procedural material textures used as placeholder imagery.

These images are created from scratch (no third-party photos), so they carry no
licensing constraints. They stand in for editorial photography until licensed
or commissioned photos are added (see docs/DESIGN_SYSTEM.md -> Photography).

Usage:  python3 scripts/generate-material-imagery.py
Output: public/images/materials/*.jpg
"""

from __future__ import annotations

import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "materials")
os.makedirs(OUT, exist_ok=True)
RNG = np.random.default_rng(7)


def value_noise(h: int, w: int, cell: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    gh, gw = max(2, int(h / cell) + 2), max(2, int(w / cell) + 2)
    grid = rng.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def fbm(h: int, w: int, cell: float, octaves: int, seed: int, stretch=(1.0, 1.0)) -> np.ndarray:
    """Fractal noise; stretch=(sy, sx) elongates features (e.g. along the grain)."""
    total = np.zeros((h, w), np.float32)
    amp, norm = 1.0, 0.0
    for o in range(octaves):
        c = cell / (2**o)
        sh, sw = int(h / stretch[0]) + 1, int(w / stretch[1]) + 1
        n = value_noise(sh, sw, max(c, 1.5), seed + o * 31)
        n = np.asarray(Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
        total += n * amp
        norm += amp
        amp *= 0.5
    return total / norm


def lerp(a, b, t):
    return a + (b - a) * t[..., None]


def hexrgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], np.float32)


def save(arr: np.ndarray, name: str, quality=84):
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    img.save(os.path.join(OUT, name), "JPEG", quality=quality, optimize=True, progressive=True)
    print("wrote", name, img.size)


def plank(h: int, w: int, early: str, late: str, seed: int, ring_freq=0.045, figure=1.0, pores=0.10):
    """A flat-sawn board: wavy growth rings, cathedral figure and fine pores."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    warp = fbm(h, w, 260, 4, seed, stretch=(1, 6)) - 0.5
    cx = w * (0.3 + 0.4 * np.random.default_rng(seed).random())
    cathedral = figure * 0.00045 * (x - cx) ** 2 / max(h, 1) * 60
    phase = (y + warp * 160 + cathedral) * ring_freq
    t = phase - np.floor(phase)
    latewood = np.clip((t - 0.62) / 0.38, 0, 1) ** 1.6
    base = lerp(hexrgb(early), hexrgb(late), latewood)
    tone = fbm(h, w, 400, 3, seed + 5, stretch=(1, 4)) - 0.5
    streak = fbm(h, w, 40, 3, seed + 9, stretch=(0.25, 18)) - 0.5
    pore = (RNG.random((h, w)) < 0.018).astype(np.float32)
    pore = np.asarray(Image.fromarray((pore * 255).astype(np.uint8)).resize((w, h)).filter(ImageFilter.BoxBlur(0)), np.float32) / 255
    shade = 1 + tone * 0.22 + streak * 0.16 - pore * pores
    return base * shade[..., None]


def boards(w: int, h: int, widths: list[int], palette: list[tuple[str, str]], seed: int, **kw):
    """Several planks laid side by side across the height with thin seams."""
    out = np.zeros((h, w, 3), np.float32)
    y0 = 0
    for i, bw in enumerate(widths):
        e, l = palette[i % len(palette)]
        bh = min(bw, h - y0)
        if bh <= 0:
            break
        out[y0 : y0 + bh] = plank(bh, w, e, l, seed + i * 101, **kw) * (0.94 + 0.12 * ((i * 37) % 5) / 5)
        out[y0 : y0 + 2] *= 0.55
        y0 += bh
    return out


def vignette(arr: np.ndarray, strength=0.25):
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    return arr * (1 - strength * np.clip(d - 0.35, 0, 1))[..., None]


def light(arr: np.ndarray, angle_deg=-30, strength=0.18):
    """Soft directional window light, like a workshop photo."""
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle_deg)
    g = (x / w) * math.cos(a) + (y / h) * math.sin(a)
    g = (g - g.min()) / (g.max() - g.min())
    return arr * (1 + strength * (0.5 - g))[..., None]


# --- Woods -----------------------------------------------------------------
walnut = [("#6b4630", "#3a2418"), ("#5e3c28", "#2f1d13"), ("#734d35", "#3f281a")]
white_oak = [("#c9a77a", "#9c7a50"), ("#c19f72", "#8f6e46")]
maple = [("#e8d3b0", "#d3b98f"), ("#ecd9b8", "#d8bf97")]
cherry = [("#b06d4a", "#7d4129"), ("#a8633f", "#743a23")]

save(light(vignette(boards(2000, 1400, [260, 300, 240, 320, 280], walnut, 11, ring_freq=0.05))), "walnut-bench.jpg")
save(light(vignette(boards(1600, 1200, [300, 280, 320, 300], white_oak, 21, ring_freq=0.035, pores=0.22), 0.18), -20), "white-oak.jpg")
save(light(vignette(boards(1600, 1200, [400, 400, 400], maple, 31, ring_freq=0.03, figure=0.6), 0.15), 10), "maple.jpg")
save(light(vignette(boards(1600, 1200, [380, 420, 400], cherry, 41, ring_freq=0.04)), -40), "cherry.jpg")

# End grain checkerboard (cutting boards)
def end_grain(w=1600, h=1200, block=200, seed=51):
    out = np.zeros((h, w, 3), np.float32)
    cols = [("#c8a578", "#9b774c"), ("#5e3c28", "#2f1d13"), ("#b06d4a", "#7d4129")]
    for by in range(0, h, block):
        for bx in range(0, w, block):
            k = ((bx // block) + (by // block)) % len(cols)
            e, l = cols[k]
            yy, xx = np.mgrid[0:block, 0:block].astype(np.float32)
            r = np.sqrt((xx + 600 + 50 * k) ** 2 + (yy - 300) ** 2)
            n = fbm(block, block, 60, 3, seed + bx + by) - 0.5
            t = ((r + n * 30) * 0.12) % 1
            lw = np.clip((t - 0.6) / 0.4, 0, 1)
            tile = lerp(hexrgb(e), hexrgb(l), lw)
            tile *= (1 + (RNG.random((block, block)) - 0.5) * 0.12)[..., None]
            tile[:2] *= 0.6
            tile[:, :2] *= 0.6
            out[by : by + block, bx : bx + block] = tile[: h - by, : w - bx]
    return light(vignette(out, 0.2))

save(end_grain(), "end-grain.jpg")

# Plywood edge stack (laser cutting / CNC)
def plywood(w=1600, h=1200, seed=61):
    out = np.zeros((h, w, 3), np.float32)
    y = 0
    i = 0
    while y < h:
        th = int(28 + (i % 3) * 6)
        light_ply = i % 2 == 0
        e, l = (("#e6cfa6", "#d1b383") if light_ply else ("#c7a271", "#a98353"))
        band = plank(th, w, e, l, seed + i, ring_freq=0.12, figure=0.2)
        band[: max(1, th // 12)] *= 0.72
        out[y : y + th] = band[: h - y]
        y += th
        i += 1
    # a laser-cut edge darkens the right third
    xx = np.linspace(0, 1, w)[None, :, None]
    out *= 1 - 0.55 * np.clip((xx - 0.72) / 0.28, 0, 1) ** 1.5
    return light(vignette(out, 0.2), 20)

save(plywood(), "plywood-edge.jpg")

# --- Quilting ----------------------------------------------------------------
def quilt(w=1600, h=1200, cell=200, seed=71):
    palette = ["#263B32", "#78866B", "#C47751", "#F1E9DA", "#D9A441", "#8E4B3A", "#E4C9B5", "#3E5A6B"]
    rng = np.random.default_rng(seed)
    img = Image.new("RGB", (w, h), "#F1E9DA")
    d = ImageDraw.Draw(img)
    for gy in range(0, h, cell):
        for gx in range(0, w, cell):
            a, b = rng.choice(len(palette), 2, replace=False)
            ca, cb = palette[a], palette[b]
            kind = rng.integers(0, 3)
            box = [gx, gy, gx + cell, gy + cell]
            d.rectangle(box, fill=ca)
            if kind == 0:
                d.polygon([(gx, gy), (gx + cell, gy), (gx, gy + cell)], fill=cb)
            elif kind == 1:
                m = cell // 2
                d.polygon([(gx + m, gy), (gx + cell, gy + m), (gx + m, gy + cell), (gx, gy + m)], fill=cb)
            else:
                q = cell // 4
                d.rectangle([gx + q, gy + q, gx + cell - q, gy + cell - q], fill=cb)
    arr = np.asarray(img, np.float32)
    # woven texture + quilting stitch rows
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    weave = (np.sin(x * 1.9) * np.sin(y * 1.9)) * 0.04
    puff = (np.cos((x % cell) / cell * 2 * math.pi) + np.cos((y % cell) / cell * 2 * math.pi)) * 0.035
    arr *= (1 + weave + puff + (fbm(h, w, 300, 3, seed) - 0.5) * 0.12)[..., None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    for gy in range(0, h, cell):
        for gx in range(0, w, cell):
            for k in range(0, cell, 14):
                d.line([(gx + k, gy + cell // 2 - 1), (gx + k + 7, gy + cell // 2 - 1)], fill=(246, 240, 228), width=2)
    return light(vignette(np.asarray(img, np.float32), 0.3), -50, 0.25)

save(quilt(), "quilt.jpg")

# --- Leather -----------------------------------------------------------------
def leather(w=1600, h=1200, seed=81):
    n1 = fbm(h, w, 18, 3, seed)
    n2 = fbm(h, w, 220, 3, seed + 3)
    pebble = np.clip((n1 - 0.45) * 3, 0, 1)
    base = lerp(hexrgb("#7a4a2c"), hexrgb("#a0643c"), n2)
    arr = base * (0.86 + 0.18 * pebble)[..., None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    yline = int(h * 0.78)
    d.line([(0, yline - 26), (w, yline - 26)], fill=(70, 40, 24), width=3)
    for x in range(10, w, 34):
        d.line([(x, yline), (x + 18, yline - 6)], fill=(232, 214, 186), width=5)
    arr = np.asarray(img, np.float32)
    arr[yline + 40 :] *= 0.72
    return light(vignette(arr, 0.35), -30, 0.25)

save(leather(), "leather.jpg")

# --- Jewelry: brushed silver --------------------------------------------------
def brushed(w=1600, h=1200, seed=91):
    s = fbm(h, w, 6, 2, seed, stretch=(1, 60))
    g = fbm(h, w, 500, 2, seed + 4)
    arr = lerp(hexrgb("#8d9095"), hexrgb("#e3e5e8"), np.clip(s * 0.7 + g * 0.6 - 0.15, 0, 1))
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    band = np.exp(-(((y - h * 0.4) / (h * 0.12)) ** 2)) * 0.25
    arr *= (1 + band)[..., None]
    return vignette(arr, 0.3)

save(brushed(), "brushed-silver.jpg")

# --- Ceramics: thrown clay ----------------------------------------------------
def clay(w=1600, h=1200, seed=101):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt((x - w * 0.5) ** 2 + (y - h * 1.35) ** 2)
    n = fbm(h, w, 80, 3, seed) - 0.5
    rings = np.sin((r + n * 40) * 0.09) * 0.5 + 0.5
    base = lerp(hexrgb("#b8683f"), hexrgb("#d48a5f"), fbm(h, w, 300, 2, seed + 2))
    arr = base * (0.9 + 0.14 * rings)[..., None]
    arr *= (1 + (RNG.random((h, w)) - 0.5) * 0.06)[..., None]
    return light(vignette(arr, 0.3), -60, 0.3)

save(clay(), "clay.jpg")

# --- Paper (plan sheets) ------------------------------------------------------
def paper(w=1600, h=1200, seed=111):
    n = fbm(h, w, 120, 4, seed) - 0.5
    arr = np.ones((h, w, 3), np.float32) * hexrgb("#F8F6F0")
    arr *= (1 + n * 0.035 + (RNG.random((h, w)) - 0.5) * 0.025)[..., None]
    return arr

save(paper(), "paper.jpg", quality=80)
