import React from "react";
import { COLORS, content } from "../theme";
import { Abs, Card, PrimaryButton, StatusChip } from "./primitives";
import { R, type Rect } from "../layout";

const D = content.dashboard;

const StatCard: React.FC<{ r: Rect; i: number }> = ({ r, i }) => {
  const s = D.stats[i];
  return (
    <Card r={r}>
      <div style={{ position: "absolute", left: 24, top: 20, fontSize: 16, fontWeight: 600, color: COLORS.muted }}>{s.label}</div>
      <div style={{ position: "absolute", left: 24, top: 50, fontSize: 40, fontWeight: 700, color: COLORS.ink, letterSpacing: -1 }}>
        {s.value}
      </div>
      <div
        style={{
          position: "absolute",
          right: 22,
          top: 24,
          fontSize: 14,
          fontWeight: 600,
          color: i === 2 ? COLORS.overdueInk : COLORS.accentDeep,
          background: i === 2 ? COLORS.overdueBg : COLORS.accentSoft,
          padding: "4px 10px",
          borderRadius: 999,
        }}
      >
        {s.delta}
      </div>
    </Card>
  );
};

const RevenueChart: React.FC = () => {
  const r = R.chartCard;
  const innerW = r.w - 56;
  const innerH = r.h - 120;
  const max = Math.max(...D.revenue);
  const slot = innerW / D.revenue.length;
  return (
    <Card r={r}>
      <div style={{ position: "absolute", left: 28, top: 22, fontSize: 20, fontWeight: 700, color: COLORS.ink }}>Revenue</div>
      <div style={{ position: "absolute", left: 28, top: 52, fontSize: 15, color: COLORS.muted, fontWeight: 500 }}>Last 12 months</div>
      <svg style={{ position: "absolute", left: 28, top: 88 }} width={innerW} height={innerH + 36}>
        {D.revenue.map((v, i) => {
          const h = (v / max) * innerH;
          const last = i === D.revenue.length - 1;
          return (
            <g key={i}>
              <rect x={i * slot + 6} y={innerH - h} width={slot - 12} height={h} rx={7} fill={last ? COLORS.accent : "#D1FAE5"} />
              <text x={i * slot + slot / 2} y={innerH + 26} textAnchor="middle" fontSize="14" fontWeight="500" fill={COLORS.muted}>
                {D.months[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
};

const TopClients: React.FC = () => (
  <Card r={R.clientsCard}>
    <div style={{ position: "absolute", left: 28, top: 22, fontSize: 20, fontWeight: 700, color: COLORS.ink }}>Top clients</div>
    {D.clients.map((c, i) => (
      <div key={c.name} style={{ position: "absolute", left: 28, right: 28, top: 76 + i * 60 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 600, color: COLORS.ink }}>
          <span>{c.name}</span>
          <span style={{ color: COLORS.muted, fontWeight: 500 }}>{c.amount}</span>
        </div>
        <div style={{ marginTop: 10, height: 8, borderRadius: 4, background: COLORS.draftBg }}>
          <div style={{ width: `${c.share * 100}%`, height: 8, borderRadius: 4, background: i === 0 ? COLORS.accent : "#6EE7B7" }} />
        </div>
      </div>
    ))}
  </Card>
);

const RecentTable: React.FC = () => {
  const cols = [28, 150, 520, 760, 940];
  const head = ["Invoice", "Client", "Amount", "Due", "Status"];
  return (
    <Card r={R.tableCard}>
      <div style={{ position: "absolute", left: 28, top: 16, fontSize: 20, fontWeight: 700, color: COLORS.ink }}>Recent invoices</div>
      {head.map((h, i) => (
        <div key={h} style={{ position: "absolute", left: cols[i], top: 56, fontSize: 14, fontWeight: 600, color: COLORS.muted }}>
          {h}
        </div>
      ))}
      {D.rows.map((row, i) => (
        <div
          key={row.no}
          style={{ position: "absolute", left: 0, right: 0, top: 82 + i * 44, height: 44, borderTop: `1px solid ${COLORS.border}` }}
        >
          {[row.no, row.client, row.amount, row.due].map((t, c) => (
            <div
              key={c}
              style={{ position: "absolute", left: cols[c], top: 11, fontSize: 17, fontWeight: c === 0 ? 600 : 500, color: COLORS.ink }}
            >
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: cols[4], top: 7 }}>
            <StatusChip state={row.status as "paid" | "sent" | "overdue"} />
          </div>
        </div>
      ))}
    </Card>
  );
};

export const Dashboard: React.FC<{ btnPress: number }> = ({ btnPress }) => (
  <>
    <Abs r={R.pageTitle} style={{ fontSize: 30, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.6, display: "flex", alignItems: "center" }}>
      Dashboard
    </Abs>
    <PrimaryButton r={R.newBtn} label="New invoice" press={btnPress} icon={<span style={{ fontSize: 24, lineHeight: "20px", fontWeight: 500 }}>+</span>} />
    {R.stats.map((r, i) => (
      <StatCard key={i} r={r} i={i} />
    ))}
    <RevenueChart />
    <TopClients />
    <RecentTable />
  </>
);
