import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp, Download, Calendar, Filter, BarChart3,
  Activity, Target, Award, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981", orange: "#f97316" };

const scoreHistory = [
  { date: "Apr 7", score: 72, kneeAngle: 85, symmetry: 88 },
  { date: "Apr 14", score: 75, kneeAngle: 87, symmetry: 89 },
  { date: "Apr 21", score: 79, kneeAngle: 89, symmetry: 91 },
  { date: "Apr 28", score: 77, kneeAngle: 88, symmetry: 90 },
  { date: "May 5", score: 83, kneeAngle: 91, symmetry: 93 },
  { date: "May 12", score: 86, kneeAngle: 93, symmetry: 95 },
  { date: "May 19", score: 87, kneeAngle: 94, symmetry: 96 },
  { date: "May 21", score: 92, kneeAngle: 96, symmetry: 97 },
];

const weeklyVolume = [
  { week: "W1 Apr", sessions: 3, avgScore: 72 },
  { week: "W2 Apr", sessions: 4, avgScore: 75 },
  { week: "W3 Apr", sessions: 5, avgScore: 79 },
  { week: "W4 Apr", sessions: 3, avgScore: 77 },
  { week: "W1 May", sessions: 6, avgScore: 83 },
  { week: "W2 May", sessions: 5, avgScore: 86 },
  { week: "W3 May", sessions: 7, avgScore: 92 },
];

const metricBreakdown = [
  { subject: "Depth", current: 96, target: 95, prev: 88 },
  { subject: "Symmetry", current: 97, target: 98, prev: 91 },
  { subject: "Balance", current: 88, target: 92, prev: 82 },
  { subject: "Back Angle", current: 85, target: 90, prev: 79 },
  { subject: "Speed", current: 78, target: 85, prev: 71 },
  { subject: "Knee Track", current: 90, target: 94, prev: 84 },
];

const heatmapData = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week, day,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
  }))
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f0f1a", border: "1px solid rgba(139,92,246,0.3)",
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const periods = ["7 days", "30 days", "3 months", "All time"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 days");

  const stats = [
    { label: "Best Score", value: "92", change: "+12", color: NEON.purple, icon: Award },
    { label: "Total Sessions", value: "47", change: "+8", color: NEON.cyan, icon: Activity },
    { label: "Avg Improvement", value: "+22%", change: "all time", color: NEON.green, icon: TrendingUp },
    { label: "Goal Completion", value: "76%", change: "+4%", color: NEON.orange, icon: Target },
  ];

  const heatColor = (v: number) => {
    if (v === 0) return "rgba(255,255,255,0.04)";
    const colors = ["", "rgba(139,92,246,0.2)", "rgba(139,92,246,0.4)", "rgba(139,92,246,0.65)", "rgba(139,92,246,0.9)"];
    return colors[v] || colors[4];
  };

  return (
    <div>
      {/* Header controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {periods.map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPeriod(p)}
              style={{
                padding: "8px 14px", borderRadius: 8,
                background: period === p ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                border: period === p ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: period === p ? NEON.purple : "rgba(240,240,255,0.55)",
                fontSize: 13, cursor: "pointer", fontWeight: period === p ? 600 : 400,
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(240,240,255,0.7)", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Filter size={14} /> Filter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: NEON.purple, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Download size={14} /> Export PDF
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${s.color}20`,
              borderRadius: 14, padding: "20px 18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: NEON.green, marginTop: 4 }}>↑ {s.change}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${s.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main chart — Score over time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 28, marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 4 }}>Performance Evolution</h3>
            <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)" }}>Score, knee angle & symmetry over time</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { color: NEON.purple, label: "Score" },
              { color: NEON.cyan, label: "Knee Angle" },
              { color: NEON.green, label: "Symmetry" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 3, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 12, color: "rgba(240,240,255,0.5)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" stroke={NEON.purple} strokeWidth={2.5} dot={{ r: 5, fill: NEON.purple }} name="Score" />
            <Line type="monotone" dataKey="kneeAngle" stroke={NEON.cyan} strokeWidth={2} dot={{ r: 4, fill: NEON.cyan }} name="Knee Angle" strokeDasharray="5 3" />
            <Line type="monotone" dataKey="symmetry" stroke={NEON.green} strokeWidth={2} dot={{ r: 4, fill: NEON.green }} name="Symmetry" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Middle row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Weekly volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Weekly Sessions & Score</h3>
          <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", marginBottom: 20 }}>Volume vs quality correlation</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="sessions" fill={NEON.cyan} radius={[4, 4, 0, 0]} name="Sessions" opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke={NEON.purple} strokeWidth={2.5} dot={{ r: 4, fill: NEON.purple }} name="Avg Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Metric Comparison</h3>
          <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", marginBottom: 12 }}>Current vs previous month</p>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[
              { color: NEON.purple, label: "Current" },
              { color: NEON.cyan, label: "Previous" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 12, color: "rgba(240,240,255,0.5)" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={metricBreakdown}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(240,240,255,0.45)", fontSize: 11 }} />
              <Radar name="Current" dataKey="current" stroke={NEON.purple} fill={NEON.purple} fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Previous" dataKey="prev" stroke={NEON.cyan} fill={NEON.cyan} fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip contentStyle={{ background: "#0f0f1a", border: `1px solid ${NEON.purple}30`, borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Activity Heatmap</h3>
            <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)" }}>Sessions per day — last 3 months</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>Less</span>
            {[0, 1, 2, 3, 4].map((v) => (
              <div key={v} style={{
                width: 14, height: 14, borderRadius: 3,
                background: heatColor(v),
                border: "1px solid rgba(255,255,255,0.05)",
              }} />
            ))}
            <span style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>More</span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} style={{
                width: 14, fontSize: 10, color: "rgba(240,240,255,0.3)",
                textAlign: "center", marginBottom: 4,
              }}>
                {d[0]}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {heatmapData.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {week.map((day, di) => (
                  <motion.div
                    key={di}
                    whileHover={{ scale: 1.4 }}
                    title={day.value > 0 ? `${day.value} session${day.value > 1 ? 's' : ''}` : 'No sessions'}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: heatColor(day.value),
                      border: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Metric breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, marginTop: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Metric Breakdown</h3>
          <span style={{ fontSize: 13, color: "rgba(240,240,255,0.4)" }}>vs. target & previous month</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Metric", "Current", "Previous", "Target", "Progress"].map((h) => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: 12, color: "rgba(240,240,255,0.4)",
                  fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricBreakdown.map((m, i) => {
              const prog = Math.min(100, Math.round((m.current / m.target) * 100));
              const color = prog >= 100 ? NEON.green : prog >= 85 ? NEON.cyan : NEON.orange;
              return (
                <motion.tr
                  key={m.subject}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 500, color: "rgba(240,240,255,0.85)" }}>
                    {m.subject}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color }}>
                    {m.current}%
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "rgba(240,240,255,0.5)" }}>
                    {m.prev}%
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "rgba(240,240,255,0.5)" }}>
                    {m.target}%
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prog}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                          style={{ height: "100%", background: color, borderRadius: 3 }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color, fontWeight: 600, width: 36 }}>{prog}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
