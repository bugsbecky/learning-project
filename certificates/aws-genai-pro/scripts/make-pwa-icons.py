#!/usr/bin/env python3
"""Render hexagonal AWS-cert-inspired GenAI Professional app icons."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parents[1] / "icons"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"

NAVY = (12, 18, 32, 255)
NAVY_HI = (22, 32, 54, 255)
GOLD = (214, 162, 46, 255)
GOLD_HI = (255, 214, 110, 255)
GOLD_LO = (168, 118, 22, 255)
ORANGE = (255, 153, 0, 255)
WHITE = (247, 249, 252, 255)
SPARK = (255, 206, 92, 255)
BG = (15, 17, 21, 255)


def hex_pts(cx: float, cy: float, r: float) -> list[tuple[float, float]]:
    pts = []
    for i in range(6):
        a = math.radians(-90 + 60 * i)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def sparkle(cx: float, cy: float, outer: float, inner: float, n: int = 4) -> list[tuple[float, float]]:
    pts = []
    for i in range(n * 2):
        r = outer if i % 2 == 0 else inner
        a = math.radians(-90 + i * (180 / n))
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def poly(draw: ImageDraw.ImageDraw, pts, fill=None, outline=None, width=1):
    draw.polygon(pts, fill=fill, outline=outline, width=width)


def smile_pts(cx: float, cy: float, w: float, h: float, steps: int = 28) -> list[tuple[float, float]]:
    # AWS-like smile: wide shallow arc (quadratic bezier)
    x0, y0 = cx - w / 2, cy
    x1, y1 = cx, cy + h
    x2, y2 = cx + w / 2, cy
    pts = []
    for i in range(steps + 1):
        t = i / steps
        u = 1 - t
        x = u * u * x0 + 2 * u * t * x1 + t * t * x2
        y = u * u * y0 + 2 * u * t * y1 + t * t * y2
        pts.append((x, y))
    return pts


def smile_poly(cx, cy, w, h, thickness):
    outer = smile_pts(cx, cy, w, h)
    inner = list(reversed(smile_pts(cx, cy - thickness * 0.35, w * 0.82, max(h * 0.35, 1))))
    return outer + inner


def draw_smile(draw: ImageDraw.ImageDraw, cx, cy, w, h, width, color=ORANGE):
    poly(draw, smile_poly(cx, cy, w, h, width), fill=color)


def load_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def render_badge(size: int, *, padded: bool, label: bool) -> Image.Image:
    s = 4
    canvas = size * s
    img = Image.new("RGBA", (canvas, canvas), BG if not padded else BG)
    draw = ImageDraw.Draw(img)
    cx = cy = canvas / 2
    r = canvas * (0.36 if padded else 0.46)

    # Soft gold glow
    glow = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    poly(gdraw, hex_pts(cx, cy, r + canvas * 0.03), fill=(214, 162, 46, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=canvas * 0.03))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Outer gold hex
    poly(draw, hex_pts(cx, cy, r), fill=GOLD_LO)
    poly(draw, hex_pts(cx, cy, r * 0.955), fill=GOLD_HI)
    poly(draw, hex_pts(cx, cy, r * 0.90), fill=GOLD)
    # Inner navy field
    poly(draw, hex_pts(cx, cy, r * 0.84), fill=NAVY)
    # Subtle inner highlight ring
    poly(draw, hex_pts(cx, cy, r * 0.84), outline=GOLD_HI, width=max(2, int(canvas * 0.006)))
    poly(draw, hex_pts(cx, cy, r * 0.78), outline=(214, 162, 46, 70), width=max(2, int(canvas * 0.004)))

    # AWS-like smile
    smile_w = r * 0.78
    smile_y = cy - r * 0.46
    draw_smile(draw, cx, smile_y, smile_w, r * 0.22, width=r * 0.11)
    draw_smile(draw, cx, smile_y + r * 0.01, smile_w * 0.9, r * 0.16, width=r * 0.06, color=(255, 176, 32, 255))

    # GenAI sparkles
    poly(draw, sparkle(cx, cy - r * 0.06, r * 0.26, r * 0.09), fill=SPARK)
    poly(draw, sparkle(cx - r * 0.30, cy + r * 0.00, r * 0.10, r * 0.034), fill=GOLD_HI)
    poly(draw, sparkle(cx + r * 0.32, cy - r * 0.16, r * 0.08, r * 0.028), fill=ORANGE)

    if label and size >= 96:
        # Gold professional ribbon across lower hex
        band_y0 = cy + r * 0.28
        band_y1 = cy + r * 0.52
        # Clip-ish trapezoid that sits inside the hex
        x_top = r * 0.62
        x_bot = r * 0.46
        ribbon = [
            (cx - x_top, band_y0),
            (cx + x_top, band_y0),
            (cx + x_bot, band_y1),
            (cx - x_bot, band_y1),
        ]
        poly(draw, ribbon, fill=GOLD)
        # inner highlight
        ribbon_in = [
            (cx - x_top + canvas * 0.01, band_y0 + canvas * 0.006),
            (cx + x_top - canvas * 0.01, band_y0 + canvas * 0.006),
            (cx + x_bot - canvas * 0.008, band_y1 - canvas * 0.006),
            (cx - x_bot + canvas * 0.008, band_y1 - canvas * 0.006),
        ]
        poly(draw, ribbon_in, fill=GOLD_HI)
        poly(draw, ribbon, outline=GOLD_LO, width=max(2, int(canvas * 0.004)))

        text = "PROFESSIONAL" if size >= 256 else "PRO"
        font_size = int(canvas * (0.055 if text == "PROFESSIONAL" else 0.07))
        font = load_font(FONT_BOLD, font_size)
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = cx - tw / 2 - bbox[0]
        ty = (band_y0 + band_y1) / 2 - th / 2 - bbox[1]
        draw.text((tx, ty), text, font=font, fill=NAVY)

    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img.convert("RGB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    specs = {
        "icon-192.png": (192, False, True),
        "icon-512.png": (512, False, True),
        "icon-512-maskable.png": (512, True, True),
        "apple-touch-icon.png": (180, False, True),
        "favicon-48.png": (48, False, False),
        "favicon-32.png": (32, False, False),
    }
    for name, (size, padded, label) in specs.items():
        render_badge(size, padded=padded, label=label).save(OUT / name, "PNG", optimize=True)
        print("wrote", name)


if __name__ == "__main__":
    main()
