"""Why the area of a circle is pi r^2 (math-manim template).

Everything editable lives in content.json (narration, colors, wedge counts).
Narration audio + word timings come from assets/audio/timeline.json (tts.py).
"""

import json
import textwrap
from pathlib import Path

import numpy as np
from manim import *

ROOT = Path(__file__).parent
CONTENT = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
TIMELINE = json.loads((ROOT / "assets/audio/timeline.json").read_text(encoding="utf-8"))

# ---- theme (all style tokens in one place) --------------------------------
C = CONTENT["colors"]
BG, TEXT = C["background"], C["text"]
AREA, AREA_ALT, GOLD_R, GREEN = C["area"], C["areaAlt"], C["radius"], C["result"]
PROSE_FONT = CONTENT["fonts"]["prose"]
R = CONTENT["geometry"]["radius"]
N_COARSE = CONTENT["geometry"]["coarseWedges"]
N_FINE = CONTENT["geometry"]["fineWedges"]
GAP = CONTENT["video"]["gapSeconds"]
HOLD = CONTENT["video"]["holdSeconds"]
GEO = np.array([0.0, 0.0, 0.0])  # centre of the geometry area
HEADER_FS = 56
CAPTION_FS = 30
CAPTION_ONE_LINE_MAX = 60  # characters; longer sentences wrap into two balanced lines
CAPTION_SAFE = 0.6  # scene units kept clear below captions (about 80 px at 1080p)
config.background_color = BG


def wedge_mob(apex, start, n, k, stroke):
    """Sector of 1/n of the circle with its apex at `apex`, k picks the tone."""
    return Sector(
        radius=R,
        angle=TAU / n,
        start_angle=start,
        arc_center=np.array(apex),
        fill_color=AREA if k % 2 == 0 else AREA_ALT,
        fill_opacity=0.92,
        stroke_color=BG,
        stroke_width=stroke,
    )


def row_layout(n):
    """Apex positions and start angles that interlock n wedges in a row, centred on GEO."""
    d = TAU / n
    c = 2 * R * np.sin(d / 2)
    h = R * np.cos(d / 2)
    apexes, starts = [], []
    for k in range(n):
        up = k % 2 == 0
        apexes.append(np.array([k * c / 2, 0.0 if up else h, 0.0]))
        starts.append((PI / 2 if up else -PI / 2) - d / 2)
    probe = VGroup(
        *[wedge_mob(a, s, n, k, 0) for k, (a, s) in enumerate(zip(apexes, starts))]
    )
    offset = GEO - probe.get_center()
    return [a + offset for a in apexes], starts, c, h, offset


def paint(mt):
    """One color per quantity: r gold, area A blue."""
    for tex, sub in zip(mt.tex_strings, mt.submobjects):
        if tex == "r":
            sub.set_color(GOLD_R)
        elif tex == "A":
            sub.set_color(AREA)
    return mt


def eq(*parts, fs=HEADER_FS):
    return paint(MathTex(*parts, font_size=fs, color=TEXT))


class CircleArea(Scene):
    # -- timing helpers ------------------------------------------------------
    def until(self, t):
        """Wait until absolute scene time t (seconds)."""
        d = t - self.renderer.time
        if d > 1 / 60:
            self.wait(d)

    def build_schedule(self):
        t = 0.0
        self.seg = {}
        for s in TIMELINE["segments"]:
            words = {i: w["start_ms"] / 1000 for i, w in enumerate(s["words"])}
            self.seg[s["id"]] = dict(
                t0=t, dur=s["duration_ms"] / 1000, words=words, file=s["file"]
            )
            t += s["duration_ms"] / 1000 + GAP
        self.total = t - GAP

    def cue(self, sid, ms):
        return self.seg[sid]["t0"] + ms / 1000

    def start_segment(self, sid):
        self.until(self.seg[sid]["t0"])
        self.add_sound(str(ROOT / "assets/audio" / self.seg[sid]["file"]))

    # -- captions (sentence style, driven by narration word timings) --------------
    def add_captions(self):
        for s in CONTENT["segments"]:
            info = self.seg[s["id"]]
            sentences = [
                x.strip()
                for x in s["text"].replace("?", "?|").replace(".", ".|").split("|")
                if x.strip()
            ]
            idx = 0
            for j, sent in enumerate(sentences):
                n_words = len(sent.replace("-", " ").split())
                t_start = (
                    info["t0"] + info["words"][idx]
                    if idx in info["words"]
                    else info["t0"]
                )
                idx += n_words
                if j + 1 < len(sentences) and idx in info["words"]:
                    t_end = info["t0"] + info["words"][idx]
                else:
                    t_end = info["t0"] + info["dur"]
                self.add_one_caption(sent, t_start - 0.05, t_end)

    def add_one_caption(self, sent, t0, t1):
        if len(sent) <= CAPTION_ONE_LINE_MAX:
            wrapped = sent
        else:  # two lines of similar length, so no single orphaned word
            wrapped = "\n".join(textwrap.wrap(sent, len(sent) // 2 + 6))
        cap = Text(
            wrapped, font=PROSE_FONT, font_size=CAPTION_FS, color=TEXT, line_spacing=0.9
        )
        # Anchor the caption's bottom edge inside the safe area, whatever its line count.
        bottom = -config.frame_height / 2 + CAPTION_SAFE
        cap.move_to(np.array([0, 0, 0])).align_to(np.array([0, bottom, 0]), DOWN)
        cap.set_opacity(0)

        def upd(m, t0=t0, t1=t1):
            m.set_opacity(1 if t0 <= self.renderer.time < t1 else 0)

        cap.add_updater(upd)
        self.add(cap)

    # -- wedge motion ---------------------------------------------------------
    def move_wedges(self, wedges, state, targets, run_time, lag, stroke=2.5):
        """Animate every wedge from its current (apex, start) to the target, lagged."""
        anims = []
        n = len(wedges)
        new_state = []
        for k, (w, (a0, s0), (a1, s1)) in enumerate(zip(wedges, state, targets)):
            ds = (s1 - s0 + PI) % TAU - PI
            new_state.append((a1, s0 + ds))

            def f(m, alpha, a0=a0, s0=s0, a1=a1, ds=ds, k=k):
                m.become(
                    wedge_mob(a0 + (a1 - a0) * alpha, s0 + ds * alpha, n, k, stroke)
                )

            anims.append(UpdateFromAlphaFunc(w, f, rate_func=smooth))
        self.play(LaggedStart(*anims, lag_ratio=lag), run_time=run_time)
        return new_state

    # -- the film --------------------------------------------------------------
    def construct(self):
        self.build_schedule()
        self.add_captions()
        s = self.seg

        # S1 - the question ---------------------------------------------------
        circle = Circle(
            radius=R, stroke_width=0, fill_color="#4A8DF8", fill_opacity=0.92
        ).move_to(GEO)
        r_line = Line(GEO, GEO + R * RIGHT, color=GOLD_R, stroke_width=4)
        r_lab = paint(MathTex("r", font_size=48, color=TEXT)).next_to(
            r_line, UP, buff=0.12
        )
        hdr0 = eq("A", "=", "\\pi", "r", "^{2}", "\\,?").to_edge(UP, buff=0.6)

        self.start_segment("s1")
        self.play(FadeIn(circle, scale=0.9), run_time=1.2)
        self.play(Create(r_line), FadeIn(r_lab, shift=UP * 0.2), run_time=0.9)
        self.until(self.cue("s1", 3868))  # "pi"
        self.play(Write(hdr0), run_time=1.5)
        self.until(self.cue("s1", 5150))  # "But why"
        self.play(Indicate(hdr0[5], color=GOLD_R, scale_factor=1.4), run_time=1.0)

        # S2 - cut into wedges ------------------------------------------------------
        self.start_segment("s2")
        self.until(self.cue("s2", 900))  # "radius"
        self.play(
            Indicate(r_line, color=GOLD_R), Indicate(r_lab, color=GOLD_R), run_time=1.0
        )
        self.until(self.cue("s2", 1900))  # "and cut"
        d = TAU / N_COARSE
        cuts = VGroup(
            *[
                Line(
                    GEO,
                    GEO + R * np.array([np.cos(k * d), np.sin(k * d), 0]),
                    color=BG,
                    stroke_width=4,
                )
                for k in range(N_COARSE)
            ]
        )
        self.play(FadeOut(r_line), FadeOut(r_lab), run_time=0.3)
        self.play(LaggedStart(*[Create(c) for c in cuts], lag_ratio=0.12), run_time=1.3)
        wedges = [wedge_mob(GEO, k * d, N_COARSE, k, 2.5) for k in range(N_COARSE)]
        self.add(*wedges)
        self.remove(circle, cuts)
        state = [(GEO.copy(), k * d) for k in range(N_COARSE)]
        self.until(self.cue("s2", 3180))  # "wedges"
        out = [
            (
                GEO
                + 0.12 * np.array([np.cos((k + 0.5) * d), np.sin((k + 0.5) * d), 0]),
                k * d,
            )
            for k in range(N_COARSE)
        ]
        state = self.move_wedges(wedges, state, out, 1.0, 0.0)

        # S3 - unroll into a row ------------------------------------------------------
        self.start_segment("s3")
        self.until(self.cue("s3", 450))
        apexes, starts, c, h, _ = row_layout(N_COARSE)
        state = self.move_wedges(wedges, state, list(zip(apexes, starts)), 4.6, 0.1)

        # S4 - near parallelogram, then more wedges ---------------------------------------
        self.start_segment("s4")
        row16 = VGroup(*wedges)
        x0 = apexes[0][0]
        y0 = apexes[0][1]
        para = Polygon(
            [x0, y0, 0],
            [x0 + (N_COARSE / 2) * c, y0, 0],
            [x0 + (N_COARSE / 2) * c - c / 2, y0 + h, 0],
            [x0 - c / 2, y0 + h, 0],
            color=TEXT,
            stroke_width=2,
            stroke_opacity=0.8,
        )
        self.until(self.cue("s4", 2500))  # "almost a parallelogram"
        self.play(Create(para), run_time=1.2)
        self.until(self.cue("s4", 4289))  # "Cut more wedges"
        a64, s64, _, _, _ = row_layout(N_FINE)
        row64 = VGroup(
            *[
                wedge_mob(a, st, N_FINE, k, 0.6)
                for k, (a, st) in enumerate(zip(a64, s64))
            ]
        )
        self.play(FadeOut(row16), FadeOut(para), FadeIn(row64), run_time=1.3)

        # S5 - rectangle with height r ---------------------------------------------------------
        self.start_segment("s5")
        rect = Rectangle(
            width=PI * R,
            height=R,
            stroke_width=0,
            fill_color="#4A8DF8",
            fill_opacity=0.92,
        )
        rect.move_to(row64.get_center())
        self.until(self.cue("s5", 1000))  # "it becomes a perfect rectangle"
        self.play(ReplacementTransform(row64, rect), run_time=1.6)
        self.until(self.cue("s5", 3250))  # "Its height"
        h_brace = Brace(rect, LEFT, color=GOLD_R, buff=0.15)
        h_lab = paint(MathTex("r", font_size=48, color=TEXT)).next_to(
            h_brace, LEFT, buff=0.2
        )
        self.play(
            GrowFromCenter(h_brace), FadeIn(h_lab, shift=RIGHT * 0.2), run_time=0.9
        )
        self.until(self.cue("s5", 4050))  # "radius"
        self.play(Indicate(h_lab, color=GOLD_R), run_time=1.0)

        # S6 - width is half the circumference ----------------------------------------------------
        self.start_segment("s6")
        w_brace = Brace(rect, DOWN, color=TEXT, buff=0.15)
        l1 = eq("\\frac{C}{2}", fs=48).next_to(w_brace, DOWN, buff=0.2)
        l2 = eq("C", "=", "2", "\\pi", "r", fs=48).next_to(w_brace, DOWN, buff=0.2)
        l3 = eq("\\frac{C}{2}", "=", "\\pi", "r", fs=48).next_to(
            w_brace, DOWN, buff=0.2
        )
        self.until(self.cue("s6", 250))  # "width"
        self.play(GrowFromCenter(w_brace), run_time=0.8)
        self.until(self.cue("s6", 1395))  # "circumference"
        self.play(Write(l1), run_time=1.0)
        self.until(self.cue("s6", 2900))  # "whole circumference"
        self.play(TransformMatchingTex(l1, l2), run_time=1.4)
        self.until(self.cue("s6", 4950))  # "so half of it"
        self.play(TransformMatchingTex(l2, l3), run_time=1.5)

        # S7 - area = width x height -----------------------------------------------------------------
        self.start_segment("s7")
        hw = eq("A", "=", "\\text{width}", "\\times", "\\text{height}")
        h1 = eq("A", "=", "\\pi", "r", "\\times", "r")
        h2 = eq("A", "=", "\\pi", "r", "^{2}")
        for m in (hw, h1, h2):
            m.move_to(hdr0)
        hw.align_to(hdr0, LEFT)
        self.until(self.cue("s7", 100))
        self.play(TransformMatchingTex(hdr0, hw), run_time=1.0)
        self.until(self.cue("s7", 2158))  # "Pi r times r"
        self.play(ReplacementTransform(hw, h1), run_time=1.2)
        self.until(self.cue("s7", 3760))  # "gives"
        self.play(TransformMatchingTex(h1, h2), run_time=1.2)

        # S8 - payoff and recap ------------------------------------------------------------------------
        self.start_segment("s8")
        context = VGroup(rect, h_brace, h_lab, w_brace, l3)
        self.play(
            context.animate.set_opacity(0.0),
            h2.animate.scale(1.7).move_to(GEO + UP * 0.3),
            run_time=1.5,
        )
        box = SurroundingRectangle(
            h2, color=GREEN, buff=0.35, stroke_width=5, corner_radius=0.15
        )
        self.until(self.cue("s8", 2500))  # "area pi r squared"
        self.play(Create(box), run_time=1.0)
        self.until(s_end := self.seg["s8"]["t0"] + self.seg["s8"]["dur"])
        self.play(Circumscribe(h2, color=GREEN, run_time=1.0))
        self.wait(HOLD)
