"""Numeric seam check. Renders PNG stills of frames N-2, N-1, N, 0, 1 straight from the page
(lossless), then compares them. Also measures step size across the mp4 wrap (frame N-1 -> 0)."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent.parent
N = json.loads((root / "content.json").read_text())["frames"]
out = root / "out"

def still(i):
    p = out / f"seam_{i}.png"
    subprocess.run(["node", str(root / "scripts/capture_html.mjs"), str(root / "index.html"),
                    "--out", str(p), "--start", str(i)], check=True, capture_output=True)
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.float32)

f = {i: still(i) for i in (N - 2, N - 1, N, 0, 1)}
mad = lambda a, b: float(np.abs(a - b).mean())
print(f"frame {N} vs frame 0 : max abs diff = {np.abs(f[N] - f[0]).max():.0f} (must be 0)")
s_prev, s_seam, s_next = mad(f[N-2], f[N-1]), mad(f[N-1], f[0]), mad(f[0], f[1])
print(f"step N-2 -> N-1 = {s_prev:.4f}   seam N-1 -> 0 = {s_seam:.4f}   step 0 -> 1 = {s_next:.4f}")
ok = np.array_equal(f[N], f[0]) and s_seam <= 1.25 * max(s_prev, s_next)
print("SEAM", "PASS" if ok else "FAIL")

# Across the whole mp4: mean step per consecutive pair, including wrap (decoded, lossy).
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(out / "abstract-generative-loop.mp4"),
                      "-vf", "scale=270:270", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                     check=True, capture_output=True).stdout
v = np.frombuffer(raw, np.uint8).reshape(-1, 270, 270, 3).astype(np.float32)
steps = np.array([np.abs(v[(k + 1) % len(v)] - v[k]).mean() for k in range(len(v))])
print(f"mp4 frames={len(v)}  step mean={steps[:-1].mean():.3f} max={steps[:-1].max():.3f}  wrap step={steps[-1]:.3f}")
