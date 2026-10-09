// Single source of truth for UI geometry, in window pixels (1440x900).
// Components draw at these rects and the camera targets the same rects,
// so a zoom target can never drift off its element.
export type Rect = { x: number; y: number; w: number; h: number };

export const R = {
  window: { x: 0, y: 0, w: 1440, h: 900 },
  chrome: { x: 0, y: 0, w: 1440, h: 44 },
  sidebar: { x: 0, y: 44, w: 240, h: 856 },
  newBtn: { x: 1212, y: 56, w: 188, h: 48 },
  pageTitle: { x: 280, y: 62, w: 230, h: 40 },
  statusChip: { x: 524, y: 64, w: 96, h: 36 },

  // dashboard
  stats: [
    { x: 280, y: 140, w: 350, h: 120 },
    { x: 665, y: 140, w: 350, h: 120 },
    { x: 1050, y: 140, w: 350, h: 120 },
  ] as Rect[],
  chartCard: { x: 280, y: 290, w: 600, h: 330 },
  clientsCard: { x: 910, y: 290, w: 490, h: 330 },
  tableCard: { x: 280, y: 650, w: 1120, h: 220 },

  // new invoice, left card
  leftCard: { x: 280, y: 140, w: 620, h: 730 },
  clientField: { x: 304, y: 190, w: 572, h: 56 },
  clientInfo: { x: 304, y: 258, w: 572, h: 56 },
  issueField: { x: 304, y: 356, w: 274, h: 48 },
  dueField: { x: 602, y: 356, w: 274, h: 48 },
  tableHead: { x: 304, y: 466, w: 572, h: 32 },
  rows: [
    { x: 304, y: 506, w: 572, h: 52 },
    { x: 304, y: 566, w: 572, h: 52 },
  ] as Rect[],
  addItem: { x: 304, y: 632, w: 220, h: 32 },
  notes: { x: 304, y: 700, w: 572, h: 140 },

  // new invoice, summary card
  summaryCard: { x: 930, y: 140, w: 470, h: 730 },
  totalValue: { x: 954, y: 352, w: 422, h: 72 },
  toast: { x: 954, y: 606, w: 422, h: 52 },
  sendBtn: { x: 954, y: 676, w: 422, h: 64 },

  // camera-only focus regions and the cursor's idle spot
  pageFocus: { x: 0, y: 40, w: 1440, h: 860 },
  clientFocus: { x: 304, y: 190, w: 572, h: 120 },
  itemsFocus: { x: 304, y: 330, w: 1072, h: 288 },
  cursorRest: { x: 1290, y: 236, w: 0, h: 0 },
} satisfies Record<string, Rect | Rect[]>;

// table columns inside a line-item row (window x, width)
export const COL = {
  desc: { x: 304, w: 262 },
  qty: { x: 574, w: 56 },
  rate: { x: 638, w: 112 },
  amount: { x: 758, w: 118 },
};

export const centerOf = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const rectByName = (name: string): Rect => {
  const m = /^item(\d)Desc$/.exec(name);
  if (m) {
    const row = R.rows[Number(m[1]) - 1];
    return { x: COL.desc.x, y: row.y, w: COL.desc.w, h: row.h };
  }
  const r = (R as Record<string, Rect | Rect[]>)[name];
  if (!r || Array.isArray(r)) throw new Error(`Unknown layout rect: ${name}`);
  return r;
};
