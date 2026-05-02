import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CHART_STYLES = `
  .ac-tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--surface-2, #F0F2F7);
    border-radius: 10px;
    margin-bottom: 24px;
  }
  .ac-tab {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 7px;
    font-family: var(--font, 'Bricolage Grotesque', sans-serif);
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--text-2, #5A6480);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .ac-tab:hover { color: var(--text, #111827); background: var(--surface-3, #E8EBF2); }
  .ac-tab.active {
    background: var(--surface, #FFFFFF);
    color: var(--text, #111827);
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  /* ── Tooltip ── */
  .ac-tooltip {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #DDE1EC);
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.10);
    font-family: var(--font, sans-serif);
    min-width: 140px;
  }
  .ac-tooltip-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-2, #5A6480);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .ac-tooltip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text, #111827);
    margin-bottom: 4px;
  }
  .ac-tooltip-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;
  }

  /* ── Funnel ── */
  .funnel-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 0;
  }
  .funnel-step {
    position: relative;
  }
  .funnel-bar-bg {
    height: 48px;
    border-radius: 8px;
    background: var(--surface-2, #F0F2F7);
    overflow: hidden;
    position: relative;
  }
  .funnel-bar-fill {
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    min-width: 60px;
  }
  .funnel-bar-label {
    font-family: var(--font, sans-serif);
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    z-index: 1;
  }
  .funnel-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding: 0 2px;
  }
  .funnel-step-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-2, #5A6480);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .funnel-step-pct {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-3, #9AA3B8);
    font-family: var(--mono, monospace);
  }
  .funnel-drop {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0 2px 4px;
    font-size: 0.68rem;
    color: var(--text-3, #9AA3B8);
    font-family: var(--mono, monospace);
  }
  .funnel-drop-arrow {
    width: 1px;
    height: 10px;
    background: var(--border, #DDE1EC);
    margin-left: 12px;
  }

  /* ── Donut legend ── */
  .donut-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    min-width: 180px;
  }
  .donut-legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background 0.12s;
  }
  .donut-legend-item:hover { background: var(--surface-2, #F0F2F7); }
  .donut-legend-swatch {
    width: 10px; height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .donut-legend-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text, #111827);
    flex: 1;
  }
  .donut-legend-count {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-2, #5A6480);
    font-family: var(--mono, monospace);
  }
  .donut-center-label {
    pointer-events: none;
  }

  /* ── Empty ── */
  .ac-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    color: var(--text-3, #9AA3B8);
    font-size: 0.85rem;
    gap: 8px;
  }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GREEN = "var(--green,  #00A86B)";
const RED = "var(--red,    #E53E5A)";
const BLUE = "var(--blue,   #2B7FE0)";
const AMBER = "var(--amber,  #D97706)";
const PURPLE = "var(--purple, #7C5FD4)";

const ERROR_COLORS = [RED, AMBER, BLUE, PURPLE, "#F59E0B", "#6366F1"];

const FUNNEL_COLORS = [BLUE, AMBER, "#A855F7", GREEN];

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ac-tooltip">
      <div className="ac-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div className="ac-tooltip-row" key={i}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <span className="ac-tooltip-dot" style={{ background: p.color }} />
            {p.name}
          </span>
          <span>
            {typeof p.value === "number" && p.value > 999
              ? `$${p.value.toLocaleString()}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 1 — AREA CHART (Traffic Flow)
───────────────────────────────────────────── */
function TrafficAreaChart({ data = [] }) {
  if (!data.length)
    return <div className="ac-empty">No traffic data available</div>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00A86B" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E53E5A" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#E53E5A" stopOpacity={0} />
          </linearGradient>
          {/* ── ADD THIS ── */}
          <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border, #DDE1EC)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--text-3, #9AA3B8)", fontFamily: "var(--mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-3, #9AA3B8)", fontFamily: "var(--mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="success"
          name="Success"
          stroke="#00A86B"
          strokeWidth={2.5}
          fill="url(#gradGreen)"
          dot={false}
          activeDot={{ r: 5, fill: "#00A86B" }}
        />
        <Area
          type="monotone"
          dataKey="failed"
          name="Failed"
          stroke="#E53E5A"
          strokeWidth={2}
          fill="url(#gradRed)"
          dot={false}
          activeDot={{ r: 5, fill: "#E53E5A" }}
        />
        {/* ── ADD THIS ── */}
        <Area
          type="monotone"
          dataKey="recovered"
          name="Recovered"
          stroke="#D97706"
          strokeWidth={2}
          fill="url(#gradAmber)"
          dot={false}
          activeDot={{ r: 5, fill: "#D97706" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────────────────────────
   TAB 2 — FUNNEL CHART (Recovery Funnel)
───────────────────────────────────────────── */
function AnimatedFunnelBar({ pct, color, label, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="funnel-bar-bg">
      <div
        className="funnel-bar-fill"
        style={{
          width: `${width}%`,
          background: color,
          boxShadow: `0 2px 12px ${color}33`,
        }}
      >
        <span className="funnel-bar-label">{label}</span>
      </div>
    </div>
  );
}

function RecoveryFunnel({ data, summary }) {
  // Build funnel from real data when available
  const total = summary?.total_events || 0;
  const failed = summary?.failed_events || 0;
  const retried = Math.round(failed * 0.9); // assume 90% retried (adjust if API provides)
  const recovered = summary?.recovered_events || Math.round(retried * 0.75);

  const steps = [
    { name: "Total Payments", value: total, color: "#2B7FE0" },
    { name: "Failed", value: failed, color: "#E53E5A" },
    { name: "Retried", value: retried, color: "#D97706" },
    { name: "Recovered", value: recovered, color: "#00A86B" },
  ];

  const max = steps[0].value || 1;

  if (!total) return <div className="ac-empty">No funnel data available</div>;

  return (
    <div className="funnel-wrap" style={{ padding: "0 8px" }}>
      {steps.map((step, i) => {
        const pct = Math.round((step.value / max) * 100);
        const prevVal = i > 0 ? steps[i - 1].value : null;
        const drop = prevVal ? prevVal - step.value : null;
        const dropPct = prevVal ? Math.round((drop / prevVal) * 100) : null;

        return (
          <div className="funnel-step" key={step.name}>
            {i > 0 && (
              <div className="funnel-drop">
                <div className="funnel-drop-arrow" />
                <span>
                  ↓ {drop?.toLocaleString()} dropped ({dropPct}%)
                </span>
              </div>
            )}
            <AnimatedFunnelBar
              pct={pct}
              color={step.color}
              label={step.value.toLocaleString()}
              delay={i * 120}
            />
            <div className="funnel-meta">
              <span className="funnel-step-name">{step.name}</span>
              <span className="funnel-step-pct">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 3 — DONUT CHART (Failure Reasons)
───────────────────────────────────────────── */
const READABLE_ERRORS = {
  generic_decline: "Generic Decline",
  insufficient_funds: "Insufficient Funds",
  card_expired: "Card Expired",
  do_not_honor: "Do Not Honor",
  authentication_required: "Auth Required",
};

function humanize(msg) {
  if (!msg) return "Unknown";
  const key = msg.toLowerCase().replace(/\s+/g, "_");
  return (
    READABLE_ERRORS[key] ||
    msg.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function DonutCenterLabel({ cx, cy, total }) {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      className="donut-center-label"
    >
      <tspan
        x={cx}
        dy="-0.4em"
        style={{
          fontSize: 22,
          fontWeight: 800,
          fill: "var(--text, #111827)",
          fontFamily: "var(--font)",
        }}
      >
        {total}
      </tspan>
      <tspan
        x={cx}
        dy="1.5em"
        style={{
          fontSize: 11,
          fill: "var(--text-2, #5A6480)",
          fontFamily: "var(--font)",
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        FAILURES
      </tspan>
    </text>
  );
}

function FailureDonut({ errors = [] }) {
  const [activeIdx, setActiveIdx] = useState(null);

  if (!errors.length)
    return <div className="ac-empty">No failure data available</div>;

  const donutData = errors.slice(0, 6).map((e, i) => ({
    name: humanize(e.last_error_message),
    value: e.occurrence,
    color: ERROR_COLORS[i],
  }));

  const total = donutData.reduce((s, d) => s + d.value, 0);
  const cx = 110,
    cy = 110;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <PieChart width={220} height={220}>
          <Pie
            data={donutData}
            cx={cx}
            cy={cy}
            innerRadius={62}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            onMouseEnter={(_, i) => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            stroke="none"
          >
            {donutData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.35}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </Pie>
          <DonutCenterLabel cx={cx} cy={cy} total={total} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="ac-tooltip">
                  <div className="ac-tooltip-label">{d.name}</div>
                  <div className="ac-tooltip-row">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span
                        className="ac-tooltip-dot"
                        style={{ background: d.color }}
                      />
                      Occurrences
                    </span>
                    <span>{d.value}×</span>
                  </div>
                  <div
                    className="ac-tooltip-row"
                    style={{ color: "var(--text-2)" }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span
                        className="ac-tooltip-dot"
                        style={{ background: "transparent" }}
                      />
                      Share
                    </span>
                    <span>{Math.round((d.value / total) * 100)}%</span>
                  </div>
                </div>
              );
            }}
          />
        </PieChart>
      </div>

      <div className="donut-legend">
        {donutData.map((d, i) => (
          <div
            className="donut-legend-item"
            key={i}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            style={{
              opacity: activeIdx === null || activeIdx === i ? 1 : 0.45,
              transition: "opacity 0.2s",
            }}
          >
            <span
              className="donut-legend-swatch"
              style={{ background: d.color }}
            />
            <span className="donut-legend-name">{d.name}</span>
            <span className="donut-legend-count">{d.value}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
const TABS = [
  { id: "traffic", label: "Traffic Flow" },
  { id: "funnel", label: "Recovery Funnel" },
  { id: "failures", label: "Failure Breakdown" },
];

export default function AnalyticsChart({
  data = [],
  darkMode = false,
  summary = {},
  topErrors = [],
}) {
  const [activeTab, setActiveTab] = useState("traffic");

  return (
    <>
      <style>{CHART_STYLES}</style>

      {/* Tab Switcher */}
      <div className="ac-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ac-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      {activeTab === "traffic" && <TrafficAreaChart data={data} />}
      {activeTab === "funnel" && (
        <RecoveryFunnel data={data} summary={summary} />
      )}
      {activeTab === "failures" && <FailureDonut errors={topErrors} />}
    </>
  );
}
