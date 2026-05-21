import { motion } from "motion/react";
import {
  Activity, TrendingUp, Flame, Award, ArrowUpRight, ArrowRight,
  Zap, Brain, Calendar, Clock, ChevronRight, Star
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useAuth } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981", orange: "#f97316" };

const weeklyData = [
  { day: "Mon", score: 78, reps: 12 },
  { day: "Tue", score: 82, reps: 15 },
  { day: "Wed", score: 79, reps: 10 },
  { day: "Thu", score: 88, reps: 18 },
  { day: "Fri", score: 85, reps: 14 },
  { day: "Sat", score: 92, reps: 20 },
  { day: "Sun", score: 87, reps: 16 },
];

const monthlyScore = [
  { week: "W1", avg: 74 }, { week: "W2", avg: 79 }, { week: "W3", avg: 83 },
  { week: "W4", avg: 87 }, { week: "W5", avg: 85 }, { week: "W6", avg: 91 },
  { week: "W7", avg: 89 }, { week: "W8", avg: 94 },
];

const recentAnalyses = [
  { id: 1, date: "Today, 9:41 AM", score: 92, depth: "ATG", kneeAngle: 94, symmetry: 97, duration: "45s" },
  { id: 2, date: "Yesterday, 6:30 PM", score: 87, depth: "Parallel", kneeAngle: 88, symmetry: 94, duration: "38s" },
  { id: 3, date: "May 19, 7:15 AM", score: 79, depth: "Parallel", kneeAngle: 82, symmetry: 91, duration: "41s" },
  { id: 4, date: "May 18, 6:00 PM", score: 85, depth: "ATG", kneeAngle: 91, symmetry: 96, duration: "44s" },
];

const aiTips = [
  { icon: "🦵", tip: "Push your knees further out over your toes during the descent for better depth.", priority: "High" },
  { icon: "🔄", tip: "Your left side is slightly weaker — add single-leg work to improve symmetry.", priority: "Medium" },
  { icon: "💪", tip: "Great improvement this week! Your depth increased by 8% — keep it up.", priority: "Info" },
];

const badges = [
  { icon: "🏆", name: "Century Club", desc: "100 analyses done", earned: true },
  { icon: "⚡", name: "Speed Demon", desc: "Fastest execution", earned: true },
  { icon: "🎯", name: "Perfect Form", desc: "Score 95+ three times", earned: false },
  { icon: "🔥", name: "7-Day Streak", desc: "Analyze daily for a week", earned: false },
];

function KpiCard({ label, value, unit, change, icon: Icon, color, subtitle }: {
  label: string; value: string | number; unit?: string; change?: string;
  icon: React.ElementType; color: string; subtitle?: string;
}) {
  const positive = change?.startsWith("+");
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 8px 40px ${color}20` }}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}20`,
        borderRadius: 16, padding: 24,
        backdropFilter: "blur(20px)",
        transition: "box-shadow 0.3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "rgba(240,240,255,0.5)", marginBottom: 8 }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: "white", letterSpacing: -1 }}>{value}</span>
            {unit && <span style={{ fontSize: 16, color: "rgba(240,240,255,0.5)" }}>{unit}</span>}
          </div>
          {subtitle && <div style={{ fontSize: 12, color: "rgba(240,240,255,0.4)", marginTop: 4 }}>{subtitle}</div>}
          {change && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <ArrowUpRight size={13} color={positive ? NEON.green : "#ef4444"} style={{ transform: positive ? "none" : "rotate(90deg)" }} />
              <span style={{ fontSize: 13, color: positive ? NEON.green : "#ef4444" }}>{change} vs last week</span>
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f0f1a", border: "1px solid rgba(139,92,246,0.3)",
      borderRadius: 10, padding: "10px 14px",
    }}>
      <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 14, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function DashboardHome() {
  const { user, navigate } = useAuth();

  const kpis = [
    { label: "Total Analyses", value: user?.analyses || 47, icon: Activity, color: NEON.purple, change: "+12%", subtitle: "All time sessions" },
    { label: "Average Score", value: user?.avgScore || 87, unit: "/100", icon: TrendingUp, color: NEON.cyan, change: "+5%", subtitle: "This month" },
    { label: "Calories Est.", value: "2,840", unit: "kcal", icon: Flame, color: NEON.orange, change: "+8%", subtitle: "This week" },
    { label: "Current Streak", value: 7, unit: "days", icon: Award, color: NEON.green, change: "+3", subtitle: "Keep it going!" },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 16, padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 28, flexWrap: "wrap", gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: NEON.cyan, marginBottom: 6 }}>
            <Calendar size={12} style={{ marginRight: 4, display: "inline" }} />
            May 21, 2026
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "white" }}>
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p style={{ fontSize: 14, color: "rgba(240,240,255,0.55)", marginTop: 4 }}>
            Your average score is up 5% this week. Ready for today's session?
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("analysis")}
          style={{
            background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
            border: "none", color: "white", padding: "12px 24px",
            borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 0 20px rgba(139,92,246,0.3)`,
          }}
        >
          <Zap size={16} /> Start Analysis
        </motion.button>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Weekly score chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Weekly Performance</h3>
              <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", marginTop: 2 }}>Score and reps this week</p>
            </div>
            <div style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 8, padding: "4px 10px",
              fontSize: 12, color: NEON.purple,
            }}>
              This Week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={NEON.purple} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={NEON.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" stroke={NEON.purple} strokeWidth={2.5} fill="url(#scoreGrad)" name="Score" dot={{ r: 4, fill: NEON.purple }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Score Trend</h3>
          <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)", marginBottom: 20 }}>8-week average</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyScore}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" fill={NEON.cyan} radius={[4, 4, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Recent analyses */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Recent Analyses</h3>
            <button
              onClick={() => navigate("analytics")}
              style={{ background: "none", border: "none", color: NEON.purple, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentAnalyses.map((analysis) => {
              const scoreColor = analysis.score >= 90 ? NEON.green : analysis.score >= 80 ? NEON.cyan : NEON.orange;
              return (
                <motion.div
                  key={analysis.id}
                  whileHover={{ x: 4, background: "rgba(255,255,255,0.06)" }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                >
                  {/* Score circle */}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `${scoreColor}18`,
                    border: `2px solid ${scoreColor}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: scoreColor, flexShrink: 0,
                  }}>
                    {analysis.score}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "rgba(240,240,255,0.9)", fontWeight: 500 }}>{analysis.date}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(240,240,255,0.45)" }}>Depth: <span style={{ color: "rgba(240,240,255,0.7)" }}>{analysis.depth}</span></span>
                      <span style={{ fontSize: 12, color: "rgba(240,240,255,0.45)" }}>Sym: <span style={{ color: "rgba(240,240,255,0.7)" }}>{analysis.symmetry}%</span></span>
                      <span style={{ fontSize: 12, color: "rgba(240,240,255,0.45)" }}>
                        <Clock size={10} style={{ marginRight: 3 }} />{analysis.duration}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>Knee</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: NEON.cyan }}>{analysis.kneeAngle}°</div>
                  </div>

                  <ArrowRight size={14} color="rgba(240,240,255,0.25)" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* AI Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Brain size={16} color={NEON.purple} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>AI Coaching Tips</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {aiTips.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, color: "rgba(240,240,255,0.7)", lineHeight: 1.5, marginBottom: 4 }}>{tip.tip}</p>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: tip.priority === "High" ? NEON.orange : tip.priority === "Medium" ? NEON.cyan : NEON.green,
                        textTransform: "uppercase", letterSpacing: 0.5,
                      }}>
                        {tip.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Star size={16} color={NEON.orange} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Achievements</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  style={{
                    padding: "10px", borderRadius: 10, textAlign: "center",
                    background: badge.earned ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)",
                    border: badge.earned ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.04)",
                    opacity: badge.earned ? 1 : 0.45,
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{badge.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: badge.earned ? "white" : "rgba(240,240,255,0.5)" }}>{badge.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(240,240,255,0.35)", marginTop: 2 }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
