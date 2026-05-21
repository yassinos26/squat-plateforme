import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Search, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4" };

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back! Here's your fitness overview." },
  analysis: { title: "AI Squat Analysis", subtitle: "Upload a video or use webcam for real-time analysis." },
  analytics: { title: "Analytics & Reports", subtitle: "Track your performance over time." },
  admin: { title: "Admin Panel", subtitle: "Platform management and monitoring." },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, currentPage } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pageInfo = pageTitles[currentPage] || pageTitles.dashboard;
  const sidebarWidth = collapsed ? 72 : 260;

  const notifications = [
    { text: "Your squat analysis is ready", time: "2m ago", dot: NEON.purple },
    { text: "New personal best: Score 96", time: "1h ago", dot: "#10b981" },
    { text: "Weekly report generated", time: "3h ago", dot: NEON.cyan },
  ];

  return (
    <div style={{ display: "flex", background: "#080810", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Top bar */}
        <header style={{
          height: 72,
          background: "rgba(8, 8, 16, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
          display: "flex", alignItems: "center",
          padding: "0 28px",
          position: "sticky", top: 0, zIndex: 40,
          gap: 16,
        }}>
          {/* Page title */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 2 }}>{pageInfo.title}</h1>
            <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)" }}>{pageInfo.subtitle}</p>
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "8px 14px",
            width: 220,
          }}>
            <Search size={15} color="rgba(240,240,255,0.35)" />
            <input
              placeholder="Search..."
              style={{
                background: "none", border: "none", outline: "none",
                color: "white", fontSize: 14, width: "100%",
              }}
            />
          </div>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(240,240,255,0.7)",
                position: "relative",
              }}
            >
              <Bell size={18} />
              <div style={{
                position: "absolute", top: 8, right: 8,
                width: 8, height: 8, borderRadius: "50%",
                background: NEON.purple,
                border: "2px solid #080810",
              }} />
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute", top: "100%", right: 0, marginTop: 8,
                    width: 300,
                    background: "#0f0f1a",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Notifications</span>
                  </div>
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        display: "flex", gap: 12, alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.dot, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, color: "rgba(240,240,255,0.85)" }}>{n.text}</div>
                        <div style={{ fontSize: 12, color: "rgba(240,240,255,0.35)", marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "white",
            }}>
              {user?.avatar}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{user?.name?.split(" ")[0]}</span>
              <ChevronDown size={14} color="rgba(240,240,255,0.4)" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
