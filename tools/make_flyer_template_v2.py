# Regenerates the flyer template (A.tpl) with a LARGER photo slot.
# Works on Windows: reads the current embedded template from tools/_gen/tpl.jpeg,
# rebuilds the middle band (background + frame + ribbons) with new geometry,
# keeps the header (choir fade, title, theme ribbon) and bottom details bar intact.
#
# Usage:  python tools/make_flyer_template_v2.py
# Output: tools/_gen/tpl_v2.png  + prints the slot geometry to paste into src/app.jsx
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, '_gen')
FONTS = os.path.join(HERE, 'fonts')
W, H = 1080, 1350

# ---- new photo slot geometry ----
WW, WH = 500, 440            # white photo slot size (was 350x350)
FX = (W - WW) // 2           # slot left  -> WX in app.jsx
FY = 566                     # slot top   -> WY in app.jsx (outer frame top = FY-34 = 532)
BAND_TOP = 532               # first row we repaint (outer frame top edge)
BAND_BOT = 1212              # top of the details bar (kept untouched below this)

FP = {
    'Bold': os.path.join(FONTS, 'Poppins-Bold.ttf'),
    'Medium': os.path.join(FONTS, 'Poppins-Medium.ttf'),
}
def f(sz, w='Bold'):
    return ImageFont.truetype(FP[w], sz)

base = Image.open(os.path.join(GEN, 'tpl.jpeg')).convert('RGB')

# ---- background gradient (same formula as the original generator) ----
g = np.zeros((H, W, 3), float)
top = np.array([6, 28, 130]); mid = np.array([10, 52, 175]); bot = np.array([4, 18, 80])
for y in range(H):
    t = y / H
    c = top + (mid - top) * (t / 0.5) if t < 0.5 else mid + (bot - mid) * ((t - 0.5) / 0.5)
    g[y] = c
bg = Image.fromarray(g.astype('uint8'))

# ---- radial glow behind frame (same ellipse/blur as original) ----
glow = Image.new('RGB', (W, H), (0, 0, 0))
ImageDraw.Draw(glow).ellipse((140, 330, 940, 1130), fill=(40, 120, 255))
glow = glow.filter(ImageFilter.GaussianBlur(160))
bg = ImageChops.screen(bg, glow.point(lambda v: int(v * 0.45)))

# ---- pipe organ along bottom (same math as original) ----
mo = Image.new('RGBA', (W, H), (0, 0, 0, 0))
md = ImageDraw.Draw(mo)
n = 27; pw = W / n
for i in range(n):
    hgt = 190 + 170 * abs(math.sin(i * 0.37 + 0.6)) + (60 if i % 5 == 0 else 0)
    x0 = i * pw + 4; x1 = (i + 1) * pw - 4
    tp = H - hgt - 120
    for k in range(int(x1 - x0)):
        t_ = k / (x1 - x0); sh = int(60 + 150 * math.sin(t_ * math.pi))
        md.line((x0 + k, tp, x0 + k, H), fill=(120 + sh // 3, 170 + sh // 3, 255, int(70 + sh * 0.35)))
    md.ellipse((x0 + (x1 - x0) / 2 - 9, tp + 30, x0 + (x1 - x0) / 2 + 9, tp + 60), fill=(10, 30, 110, 150))
    md.rectangle((x0, tp, x1, tp + 6), fill=(255, 215, 100, 150))
mo = mo.filter(ImageFilter.GaussianBlur(0.6))
_a = np.array(mo).astype(float)
_yy = np.linspace(0, 1, H)[:, None]
_f = np.clip((_yy - 0.62) / 0.38, 0, 1) ** 1.2 * 0.55
_a[..., 3] *= _f
mo = Image.fromarray(_a.astype('uint8'), 'RGBA')

# ---- staff lines + notes (same positions as original) ----
st = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sd2 = ImageDraw.Draw(st)
try:
    fnt = ImageFont.truetype(r'C:\Windows\Fonts\DejaVuSans.ttf', 64)
except OSError:
    try:
        fnt = ImageFont.truetype(r'C:\Windows\Fonts\seguisym.ttf', 64)
    except OSError:
        fnt = ImageFont.truetype(r'C:\Windows\Fonts\arial.ttf', 64)
for (xa, xb, y0) in [(0, 300, 640), (780, W, 640), (0, 300, 860), (780, W, 860)]:
    for k in range(5):
        sd2.line((xa, y0 + k * 14, xb, y0 + k * 14), fill=(255, 255, 255, 70), width=2)
for (x, y, ch_) in [(40, 606, '\u266B'), (150, 640, '\u266A'), (215, 614, '\u266B'),
                    (820, 622, '\u266A'), (920, 600, '\u266B'), (1000, 640, '\u266A'),
                    (60, 826, '\u266A'), (170, 846, '\u266B'), (840, 830, '\u266B'), (950, 850, '\u266A')]:
    sd2.text((x, y), ch_, font=fnt, fill=(255, 215, 100, 150))

# ---- composite rebuilt background into the band only ----
band = bg.convert('RGBA')
band.alpha_composite(mo)
band.alpha_composite(st)
band = band.convert('RGB')
img = base.copy()
mask = Image.new('L', (W, H), 0)
ImageDraw.Draw(mask).rectangle((0, BAND_TOP, W, BAND_BOT - 1), fill=255)
img = Image.composite(band, img, mask).convert('RGBA')

d = ImageDraw.Draw(img)

def ctext(y, t, font, fill, sp_=0, shadow=True):
    w = sum(d.textlength(c, font=font) + sp_ for c in t) - sp_
    x = (W - w) / 2
    if shadow:
        xx = x
        for c in t:
            d.text((xx + 3, y + 4), c, font=font, fill=(0, 0, 30, 200)); xx += d.textlength(c, font=font) + sp_
    for c in t:
        d.text((x, y), c, font=font, fill=fill); x += d.textlength(c, font=font) + sp_

# ---- photo frame (gold/navy/gold/navy/white), sized to the new slot ----
fx, fy, fs_w, fs_h = FX - 34, FY - 34, WW + 68, WH + 68
fr = Image.new('RGBA', (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(fr)
def ring(pad, color):
    fd.rectangle((FX - pad, FY - pad, FX + WW + pad, FY + WH + pad), fill=color)
ring(34, (255, 200, 40, 255))
ring(28, (8, 30, 110, 255))
ring(12, (255, 200, 40, 255))
ring(6, (8, 30, 110, 255))
fd.rectangle((FX, FY, FX + WW, FY + WH), fill=(255, 255, 255, 255))
fr_sh = fr.filter(ImageFilter.GaussianBlur(18))
img.alpha_composite(fr_sh)
img.alpha_composite(fr)
d = ImageDraw.Draw(img)

# ---- I WILL BE ribbon ----
fy_end = FY + WH + 34
by = fy_end + 10
rib = Image.new('RGBA', (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(rib)
rd.polygon([(300, by), (780, by), (765, by + 36), (780, by + 72), (300, by + 72), (315, by + 36)], fill=(205, 28, 28, 255))
rd.polygon([(300, by), (780, by), (780, by + 8), (300, by + 8)], fill=(240, 80, 70, 255))
rd.rectangle((300, by + 66, 780, by + 72), fill=(120, 10, 20, 255))
img.alpha_composite(rib)
d = ImageDraw.Draw(img)
ctext(by + 12, "I WILL BE", f(40), (255, 255, 255), 9, False)

# ---- ATTENDING (gold gradient text, slightly smaller to fit the bigger photo) ----
ay = by + 42
fa = f(112)
w = d.textlength("ATTENDING", font=fa)
while w > 860:
    fa = ImageFont.truetype(FP['Bold'], fa.size - 4)
    w = d.textlength("ATTENDING", font=fa)
tm = Image.new('L', (W, H), 0)
ImageDraw.Draw(tm).text(((W - w) / 2, ay), "ATTENDING", font=fa, fill=255)
y0 = ay + 16; y1 = ay + fa.size + 32
grad = np.zeros((H, W, 4), np.uint8)
for y in range(H):
    t_ = min(max((y - y0) / (y1 - y0), 0), 1)
    grad[y, :] = [255, int(240 - 70 * t_), int(60 - 30 * t_), 255]
gold = Image.fromarray(grad, 'RGBA')
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
shadow.putalpha(tm.point(lambda v: int(v * 0.8)))
shadow = shadow.filter(ImageFilter.GaussianBlur(6))
img.alpha_composite(shadow, (4, 8))
gold.putalpha(tm)
img.alpha_composite(gold)

out = Image.open(os.path.join(GEN, 'tpl_v2.png')) if False else img.convert('RGB')
out.save(os.path.join(GEN, 'tpl_v2.png'))
out.save(os.path.join(GEN, 'tpl_v2.jpg'), quality=88)
print('saved tools/_gen/tpl_v2.png / tpl_v2.jpg')
print('app.jsx constants ->  WX = %d, WY = %d, WW = %d, WH = %d' % (FX, FY, WW, WH))
print('frame outer bottom=%d, ribbon by=%d, ATTENDING ay=%d size=%d' % (fy_end, by, ay, fa.size))
