import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Activity, Shield, TrendingUp, Search, Filter,
  MoreHorizontal, CheckCircle2, XCircle, AlertTriangle,
  Server, Cpu, Database, Globe, RefreshCw, Download,
  ChevronUp, ChevronDown, Crown, Zap
} from "lucide-react";
import { ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981", orange: "#f97316", red: "#ef4444" };

const users = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", plan: "pro", analyses: 47, score: 87, joined: "Jan 12, 2026", status: "active" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", plan: "enterprise", analyses: 124, score: 91, joined: "Dec 5, 2025", status: "active" },
  { id: 3, name: "Marcus Kim", email: "marcus@example.com", plan: "free", analyses: 3, score: 72, joined: "May 15, 2026", status: "active" },
  { id: 4, name: "Priya Patel", email: "priya@example.com", plan: "pro", analyses: 89, score: 88, joined: "Feb 20, 2026", status: "active" },
  { id: 5, name: "David Okafor", email: "david@example.com", plan: "pro", analyses: 56, score: 83, joined: "Mar 8, 2026", status: "inactive" },
  { id: 6, name: "Emma Wilson", email: "emma@example.com", plan: "enterprise", analyses: 201, score: 95, joined: "Nov 1, 2025", status: "active" },
  { id: 7, name: "Jake Torres", email: "jake@example.com", plan: "free", analyses: 1, score: 68, joined: "May 20, 2026", status: "pending" },
];

const apiLogs = [
  { time: "09:42:11", endpoint: "/api/analyze", status: 200, latency: "1.2s", user: "alex@example.com" },
  { time: "09:40:55", endpoint: "/api/analyze", status: 200, latency: "0.9s", user: "sarah@example.com" },
  { time: "09:38:20", endpoint: "/api/auth/login", status: 200, latency: "0.1s", user: "emma@example.com" },
  { time: "09:35:44", endpoint: "/api/analyze", status: 422, latency: "0.4s", user: "jake@example.com" },
  { time: "09:30:12", endpoint: "/api/analytics", status: 200, latency: "0.3s", user: "priya@example.com" },
  { time: "09:28:01", endpoint: "/api/analyze", status: 200, latency: "1.5s", user: "marcus@example.com" },
];

const apiUsage = [
  { hour: "00:00", calls: 12, errors: 0 },
  { hour: "03:00", calls: 5, errors: 0 },
  { hour: "06:00", calls: 28, errors: 1 },
  { hour: "09:00", calls: 87, errors: 2 },
  { hour: "12:00", calls: 142, errors: 3 },
  { hour: "15:00", calls: 119, errors: 1 },
  { hour: "18:00", calls: 96, errors: 2 },
  { hour: "21:00", calls: 54, errors: 0 },
];

const systemMetrics = [
  { label: "CPU Usage", value: 34, color: NEON.cyan, icon: Cpu },
  { label: "Memory", value: 58, color: NEON.purple, icon: Server },
  { label: "Database", value: 22, color: NEON.green, icon: Database },
  { label: "Network I/O", value: 71, color: NEON.orange, icon: Globe },
];

const planColors: Record<string, string> = {
  free: "rgba(240,240,255,0.4)",
  pro: NEON.purple,
  enterprise: NEON.cyan,
};

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  active: { color: NEON.green, icon: CheckCircle2 },
  inactive: { color: "rgba(240,240,255,0.3)", icon: XCircle },
  pending: { color: NEON.orange, icon: AlertTriangle },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f0f1a", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("analyses");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<"users" | "api" | "system">("users");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const av = (a as any)[sortField];
    const bv = (b as any)[sortField];
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sortDir === "desc" ? -cmp : cmp;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const platformStats = [
    { label: "Total Users", value: "52,847", change: "+1.2K", color: NEON.purple },
    { label: "Analyses Today", value: "3,291", change: "+14%", color: NEON.cyan },
    { label: "Revenue MRR", value: "$41,290", change: "+8%", color: NEON.green },
    { label: "API Uptime", value: "99.97%", change: "SLA met", color: NEON.orange },
  ];

  return (
    <div>
      {/* Platform stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {platformStats.map((s, i) => (
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
            <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color, marginTop: 4 }}>↑ {s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* API Usage chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>API Usage Today</h3>
            <p style={{ fontSize: 13, color: "rgba(240,240,255,0.4)" }}>Calls and errors by hour</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 8, padding: "4px 12px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: NEON.green }}
              />
              <span style={{ fontSize: 12, color: NEON.green }}>API Online</span>
            </div>
            <button style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 12px", color: "rgba(240,240,255,0.7)",
              cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
            }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={apiUsage}>
            <defs>
              <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={NEON.purple} stopOpacity={0.2} />
                <stop offset="95%" stopColor={NEON.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="hour" stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(240,240,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="calls" stroke={NEON.purple} strokeWidth={2.5} fill="url(#callsGrad)" name="API Calls" />
            <Bar dataKey="errors" fill={NEON.red} radius={[2, 2, 0, 0]} name="Errors" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* System metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {systemMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <m.icon size={15} color={m.color} />
                <span style={{ fontSize: 13, color: "rgba(240,240,255,0.65)" }}>{m.label}</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.06 }}
                style={{ height: "100%", background: m.color, borderRadius: 3, boxShadow: `0 0 6px ${m.color}60` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>User Management</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 12px",
            }}>
              <Search size={14} color="rgba(240,240,255,0.35)" />
              <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "white", fontSize: 13, width: 160,
                }}
              />
            </div>
            <button style={{
              padding: "8px 14px",
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 8, color: NEON.purple, cursor: "pointer", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                {[
                  { label: "User", field: "name" },
                  { label: "Plan", field: "plan" },
                  { label: "Analyses", field: "analyses" },
                  { label: "Avg Score", field: "score" },
                  { label: "Joined", field: "joined" },
                  { label: "Status", field: "status" },
                  { label: "", field: "" },
                ].map((h) => (
                  <th
                    key={h.label}
                    onClick={() => h.field && toggleSort(h.field)}
                    style={{
                      padding: "10px 14px", textAlign: "left",
                      fontSize: 12, color: "rgba(240,240,255,0.4)",
                      fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5,
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      cursor: h.field ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {h.label}
                      {h.field && sortField === h.field && (
                        sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const StatusIcon = statusConfig[user.status].icon;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    whileHover={{ background: "rgba(255,255,255,0.03)" }}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                        }}>
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(240,240,255,0.9)" }}>{user.name}</div>
                          <div style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Crown size={11} color={planColors[user.plan]} />
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: planColors[user.plan],
                          textTransform: "capitalize",
                        }}>
                          {user.plan}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px", fontSize: 14, fontWeight: 600, color: "rgba(240,240,255,0.85)" }}>
                      {user.analyses}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{
                        fontSize: 14, fontWeight: 700,
                        color: user.score >= 88 ? NEON.green : user.score >= 75 ? NEON.cyan : NEON.orange,
                      }}>
                        {user.score}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontSize: 13, color: "rgba(240,240,255,0.5)" }}>{user.joined}</td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StatusIcon size={13} color={statusConfig[user.status].color} />
                        <span style={{
                          fontSize: 12, color: statusConfig[user.status].color,
                          textTransform: "capitalize",
                        }}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button style={{
                        background: "none", border: "none", color: "rgba(240,240,255,0.4)",
                        cursor: "pointer", padding: 4,
                      }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent API logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, marginTop: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Recent API Logs</h3>
          <button style={{
            background: "none", border: "none", color: NEON.cyan, cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <RefreshCw size={13} /> Live
          </button>
        </div>

        <div style={{
          fontFamily: "monospace",
          background: "#060610", borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          {apiLogs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
              style={{
                display: "grid", gridTemplateColumns: "80px 1fr 60px 60px 1fr",
                gap: 16, padding: "10px 16px",
                borderBottom: i < apiLogs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>{log.time}</span>
              <span style={{ fontSize: 12, color: NEON.cyan }}>{log.endpoint}</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: log.status === 200 ? NEON.green : NEON.red,
              }}>
                {log.status}
              </span>
              <span style={{ fontSize: 12, color: "rgba(240,240,255,0.5)" }}>{log.latency}</span>
              <span style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}>{log.user}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
