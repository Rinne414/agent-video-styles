"""Bake the paper texture once (grain, fold, vignette) so render needs no live noise."""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parent.parent
theme = json.loads((root / "content.json").read_text(encoding="utf-8"))["theme"]
w, h = 1920, 1080
paper = np.array([int(theme["paper"][i : i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)
ink = np.array([int(theme["ink"][i : i + 2], 16) for i in (1, 3, 5)], dtype=np.float32)

rng = np.random.default_rng(7)
img = np.ones((h, w, 3), dtype=np.float32) * paper

# soft blotches + fine grain, multiplied at 10 percent
blot = Image.fromarray((rng.random((h // 8, w // 8)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
blot = np.asarray(blot.filter(ImageFilter.GaussianBlur(24)), dtype=np.float32) / 255.0
grain = rng.random((h, w)).astype(np.float32)
tex = 0.6 * grain + 0.4 * blot
img *= (1.0 - 0.10 + 0.10 * tex)[..., None] * 1.0

# horizontal fold at 50 percent height, 2 px, 8 percent brown
y = h // 2
img[y : y + 2] = img[y : y + 2] * 0.92 + ink * 0.08

# vignette, 25 percent at the corners
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
v = np.clip((d - 0.45) / 0.55, 0, 1) ** 1.6 * 0.25
img = img * (1 - v[..., None]) + ink * v[..., None] * 0.6

Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(root / "assets" / "paper.jpg", quality=92)
print("paper.jpg written")
