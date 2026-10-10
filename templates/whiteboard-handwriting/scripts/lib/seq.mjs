import { layoutText, textWidth } from "./font.mjs";
import { length, resample, wobble } from "./geom.mjs";


// Sequencer: places strokes one after another on the frame axis and records them.
export class Seq {
  constructor({ startFrame, group, zone, font, pen, palette, rand }) {
    Object.assign(this, { group, zone, font, pen, palette, rand });
    this.f = startFrame;
    this.strokes = [];
  }

  color(name) {
    return this.palette[name] ?? name;
  }

  wait(frames) {
    this.f += frames;
    return this;
  }

  // kind: "letter" | "doodle" | "arrow"
  stroke(pts, { color = "ink", width = 5, kind = "doodle", lift, dx = 0, dy = 0 } = {}) {
    const isLetter = kind === "letter";
    const ramp = isLetter ? this.pen.letterRampFrames : this.pen.rampFrames;
    const gap = lift ?? (isLetter ? this.pen.letterLiftFrames : this.pen.strokeLiftFrames);
    const moved = pts.map(([x, y]) => [x + dx, y + dy]);
    const dense = kind === "letter" ? moved : resample(moved, 10);
    const shaped = wobble(dense, this.rand, this.pen.wobblePx);
    const len = length(shaped);
    const speed = { letter: this.pen.letterPxPerSec, doodle: this.pen.doodlePxPerSec, arrow: this.pen.arrowPxPerSec }[kind];
    const frames = len / (speed / 30) + ramp; // fractional frames: a stroke can be shorter than one frame; ramps cost `ramp` frames
    const s = this.f;
    this.strokes.push({ pts: shaped, len, s, e: s + frames, ramp, color: this.color(color), width, group: this.group, zone: this.zone });
    this.f = s + frames + gap;
    return this;
  }

  // Lettering. Returns the right edge x so callers can chain.
  text(str, { x, y, size, color = "ink", width = 6, dx = 0, dy = 0 }) {
    const glyphs = layoutText(this.font, str, { x: x + dx, y: y + dy, size, rand: this.rand });
    let prev = null;
    glyphs.forEach((g) => {
      if (prev) {
        const newWord = g.word !== prev.word;
        if (newWord) this.f += this.pen.wordGapFrames;
      }
      this.stroke(g.pts, { color, width, kind: "letter" });
      prev = g;
    });
    return x + dx + textWidth(this.font, str, size);
  }
}
