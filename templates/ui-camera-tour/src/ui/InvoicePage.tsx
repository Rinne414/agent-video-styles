import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, content, FONT, MOTION } from "../theme";
import { Abs, Caret, Card, CheckIcon, Label, PrimaryButton, SendIcon, StatusChip } from "./primitives";
import { COL, R, type Rect } from "../layout";
import {
  chipAt,
  CLIENT_TIMES,
  clickFx,
  focusAt,
  formatMoney,
  ITEM_TIMES,
  PAID_FRAME,
  SEND_CLICK,
  SENT_FRAME,
  totalsAt,
  typedText,
} from "../timeline";

const inv = content.invoice;

const Field: React.FC<{
  r: Rect;
  text: string;
  placeholder?: string;
  focused: boolean;
  caret: boolean;
  align?: "left" | "right";
  boxed?: boolean;
}> = ({ r, text, placeholder, focused, caret, align = "left", boxed = true }) => (
  <Abs
    r={r}
    style={{
      boxSizing: "border-box",
      borderRadius: 12,
      background: boxed ? COLORS.surface : "transparent",
      border: boxed ? `${focused ? 2 : 1}px solid ${focused ? COLORS.accent : COLORS.fieldBorder}` : "none",
      boxShadow: focused ? `0 0 0 4px ${COLORS.accent}33` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      padding: boxed ? "0 14px" : "0 8px",
      fontSize: 19,
      fontWeight: 500,
      color: COLORS.ink,
      whiteSpace: "nowrap",
    }}
  >
    {text === "" && !focused ? <span style={{ color: "#98A2B3" }}>{placeholder}</span> : text}
    {focused ? <Caret visible={caret} /> : null}
  </Abs>
);

const useCaret = (since: number, typing: boolean) => {
  const frame = useCurrentFrame();
  return typing || Math.floor((frame - since) / MOTION.blinkFrames) % 2 === 0;
};

const LineItem: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const t = ITEM_TIMES[i];
  const it = inv.items[i];
  const row = R.rows[i];
  const focus = focusAt(frame);
  const desc = typedText(it.desc, t.start, frame);
  const qty = typedText(String(it.qty), t.qtyStart, frame);
  const rateTyped = typedText(String(it.rate), t.rateStart, frame);
  const committed = frame >= t.commit;
  const rate = committed ? formatMoney(it.rate) : rateTyped ? `$${rateTyped}` : "";
  const amount = committed ? formatMoney(it.qty * it.rate) : "";
  const typingNow = (a: number, b: number) => frame >= a && frame <= b + 1;
  const caretDesc = useCaret(t.click + 2, typingNow(t.start, t.descEnd));
  const caretQty = useCaret(t.qtyStart, typingNow(t.qtyStart, t.qtyEnd));
  const caretRate = useCaret(t.rateStart, typingNow(t.rateStart, t.rateEnd));
  const cell = (x: number, w: number): Rect => ({ x, y: row.y + 2, w, h: row.h - 4 });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: row.x,
          top: row.y + row.h + 3,
          width: row.w,
          height: 1,
          background: COLORS.border,
        }}
      />
      <Field r={cell(COL.desc.x, COL.desc.w)} text={desc} placeholder="Description" focused={focus?.field === `item${i}.desc`} caret={caretDesc} />
      <Field r={cell(COL.qty.x, COL.qty.w)} text={qty} placeholder="1" focused={focus?.field === `item${i}.qty`} caret={caretQty} align="right" />
      <Field r={cell(COL.rate.x, COL.rate.w)} text={rate} placeholder="$0.00" focused={focus?.field === `item${i}.rate`} caret={caretRate} align="right" />
      <Abs
        r={cell(COL.amount.x, COL.amount.w)}
        style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 20, fontWeight: 600, color: COLORS.ink }}
      >
        {amount}
      </Abs>
    </>
  );
};

const ClientBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = typedText(inv.client, CLIENT_TIMES.start, frame);
  const typing = frame >= CLIENT_TIMES.start && frame <= CLIENT_TIMES.end + 1;
  const focused = focusAt(frame)?.field === "client";
  const caret = useCaret(CLIENT_TIMES.click + 2, typing);
  const card = spring({ frame: frame - CLIENT_TIMES.cardAt, fps, config: { damping: 22, stiffness: 140 } });
  return (
    <>
      <Label r={{ x: 304, y: 160, w: 300, h: 24 }} text="Client" />
      <Field r={R.clientField} text={typed} placeholder="Choose a client" focused={focused} caret={caret} />
      <Abs
        r={R.clientInfo}
        style={{
          opacity: card,
          transform: `translateY(${(1 - card) * -8}px)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 6px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: COLORS.accentSoft,
            color: COLORS.accentDeep,
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AS
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.ink }}>{inv.client}</div>
          <div style={{ fontSize: 15, color: COLORS.muted, fontWeight: 500 }}>{inv.clientEmail}</div>
        </div>
      </Abs>
    </>
  );
};

const SummaryRow: React.FC<{ y: number; label: string; value: string }> = ({ y, label, value }) => (
  <div style={{ position: "absolute", left: 954, width: 422, top: y, display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 500 }}>
    <span style={{ color: COLORS.muted }}>{label}</span>
    <span style={{ color: COLORS.ink, fontWeight: 600 }}>{value}</span>
  </div>
);

const SendBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = clickFx(frame).press;
  const sent = frame >= SENT_FRAME;
  const sentBtn = sent
    ? { background: COLORS.accentDeep, color: COLORS.white }
    : { background: COLORS.accent, color: COLORS.accentInk };
  const toast = spring({ frame: frame - (SENT_FRAME + 3), fps, config: { damping: 20, stiffness: 150 } });
  const nearSend = Math.abs(frame - SEND_CLICK) < 10 ? press : 0;
  return (
    <>
      <Abs
        r={R.toast}
        style={{
          opacity: toast,
          transform: `translateY(${(1 - toast) * 14}px)`,
          borderRadius: 12,
          background: "#ECFDF3",
          border: `1px solid ${COLORS.accent}66`,
          color: COLORS.accentDeep,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          boxSizing: "border-box",
          fontSize: 17,
          fontWeight: 600,
        }}
      >
        <CheckIcon color={COLORS.accentDeep} size={20} />
        {frame >= PAID_FRAME ? `Payment received, ${formatMoney(totalsAt(frame).total)}` : `Sent to ${inv.client}`}
      </Abs>
      {sent ? (
        <Abs
          r={R.sendBtn}
          style={{
            ...sentBtn,
            borderRadius: 14,
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <CheckIcon color={COLORS.white} size={22} />
          Sent
        </Abs>
      ) : (
        <PrimaryButton r={R.sendBtn} label="Send" press={nearSend} icon={<SendIcon color={COLORS.accentInk} />} />
      )}
    </>
  );
};

export const InvoicePage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totals = totalsAt(frame);
  const chip = chipAt(frame);
  const pop = chip === "paid" ? spring({ frame: frame - PAID_FRAME, fps, config: { damping: 9, stiffness: 160 } }) : 0;
  const popPulse = chip === "paid" ? Math.max(0, 1 - Math.abs(pop - 1) * 1.8) * interpolate(frame - PAID_FRAME, [0, 24], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const flash = chip === "sent" ? interpolate(frame - SENT_FRAME, [0, 10], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const totalScale = 1 + totals.pulse * 0.06;
  return (
    <>
      <Abs r={R.pageTitle} style={{ fontSize: 30, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.6, display: "flex", alignItems: "center" }}>
        New invoice
      </Abs>
      <StatusChip state={chip} r={R.statusChip} size={17} pop={Math.max(popPulse, flash * 0.5)} />
      <PrimaryButton r={R.newBtn} label="Save draft" ghost />

      <Card r={R.leftCard} />
      <ClientBlock />
      <Label r={{ x: 304, y: 326, w: 200, h: 24 }} text="Issue date" />
      <Label r={{ x: 602, y: 326, w: 200, h: 24 }} text="Due date" />
      <Field r={R.issueField} text="Oct 10, 2026" focused={false} caret={false} />
      <Field r={R.dueField} text="Oct 24, 2026" focused={false} caret={false} />

      <Label r={{ x: 304, y: 434, w: 300, h: 24 }} text="Line items" />
      {[
        ["Description", COL.desc.x, "left"],
        ["Qty", COL.qty.x, "right"],
        ["Rate", COL.rate.x, "right"],
        ["Amount", COL.amount.x, "right"],
      ].map(([h, x, a]) => (
        <div
          key={h as string}
          style={{
            position: "absolute",
            left: x as number,
            top: R.tableHead.y + 4,
            width: h === "Description" ? COL.desc.w : h === "Qty" ? COL.qty.w : h === "Rate" ? COL.rate.w : COL.amount.w,
            textAlign: a as "left" | "right",
            padding: "0 10px",
            boxSizing: "border-box",
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.muted,
          }}
        >
          {h}
        </div>
      ))}
      <div style={{ position: "absolute", left: 304, top: R.tableHead.y + R.tableHead.h, width: 572, height: 1, background: COLORS.border }} />
      <LineItem i={0} />
      <LineItem i={1} />
      <Abs r={R.addItem} style={{ fontSize: 17, fontWeight: 600, color: COLORS.accentDeep, display: "flex", alignItems: "center" }}>
        + Add line item
      </Abs>
      <Abs
        r={R.notes}
        style={{
          boxSizing: "border-box",
          border: `1px dashed ${COLORS.fieldBorder}`,
          borderRadius: 12,
          padding: 16,
          fontSize: 18,
          color: "#98A2B3",
          fontWeight: 500,
        }}
      >
        Notes for the client (optional)
      </Abs>

      <Card r={R.summaryCard} />
      <div style={{ position: "absolute", left: 954, top: 160, fontSize: 22, fontWeight: 700, color: COLORS.ink }}>Summary</div>
      <SummaryRow y={212} label="Subtotal" value={formatMoney(totals.subtotal)} />
      <SummaryRow y={256} label={`Tax (${Math.round(inv.taxRate * 100)}%)`} value={formatMoney(totals.tax)} />
      <div style={{ position: "absolute", left: 954, top: 306, width: 422, height: 1, background: COLORS.border }} />
      <div style={{ position: "absolute", left: 954, top: 322, fontSize: 15, fontWeight: 600, color: COLORS.muted }}>Total due</div>
      <Abs
        r={R.totalValue}
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 58,
          fontWeight: 700,
          letterSpacing: -1.5,
          color: totals.pulse > 0.05 ? COLORS.accentDeep : COLORS.ink,
          transform: `scale(${totalScale})`,
          transformOrigin: "left center",
        }}
      >
        {formatMoney(totals.total)}
      </Abs>
      <SummaryRow y={446} label="Invoice" value={inv.number} />
      <SummaryRow y={486} label="Terms" value={inv.terms} />
      <SummaryRow y={526} label="Online payment" value="On" />
      <SendBlock />
      <div style={{ position: "absolute", left: 954, top: 758, width: 422, fontSize: 15, color: COLORS.muted, fontWeight: 500, lineHeight: "22px" }}>
        {inv.client} gets a secure payment link by email.
      </div>
    </>
  );
};
