import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Activity, BarChart3, Settings, LogOut, Zap,
  Users, Shield, ChevronLeft, ChevronRight, Bell, Crown,
  TrendingUp, Target, Upload
} from "lucide-react";
import { useAuth, Page } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981" };

interface NavItem {
  icon: React.ElementType;
  label: string;
  page: Page;
  badge?: string;
  color?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: Upload, label: "Analyze Squat", page: "analysis", badge: "AI", color: NEON.cyan },
  { icon: BarChart3, label: "Analytics", page: "analytics" },
  { icon: TrendingUp, label: "Progress", page: "analytics" },
  { icon: Target, label: "Goals", page: "dashboard" },
];

const adminItems: NavItem[] = [
  { icon: Users, label: "Users", page: "admin" },
  { icon: Shield, label: "Admin Panel", page: "admin", color: NEON.green },
  { icon: Activity, label: "API Monitor", page: "admin" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, navigate, currentPage, logout } = useAuth();

  const planColors: Record<string, string> = {
    free: "rgba(240,240,255,0.4)",
    pro: NEON.purple,
    enterprise: NEON.cyan,
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        height: "100vh",
        background: "#0a0a14",
        borderRight: "1px solid rgba(139, 92, 246, 0.12)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Logo area */}
      <div style={{
        padding: collapsed ? "20px 16px" : "20px 20px",
        borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        minHeight: 72,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 0 20px rgba(139, 92, 246, 0.4)`,
          }}>
            <Zap size={16} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 16, fontWeight: 800, color: "white", whiteSpace: "nowrap" }}
              >
                AI<span style={{ color: NEON.purple }}>Squat</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(240,240,255,0.5)",
            }}
          >
            <ChevronLeft size={14} />
          </button>
        )}
        {collapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onToggle}
            style={{
              position: "absolute", right: -12, top: 22,
              background: "#0a0a14",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "50%", width: 24, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(240,240,255,0.7)", zIndex: 10,
            }}
          >
            <ChevronRight size={12} />
          </motion.button>
        )}
      </div>

      {/* User info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(139, 92, 246, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                {user?.avatar}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Crown size={10} color={planColors[user?.plan || "free"]} />
                  <span style={{ fontSize: 11, color: planColors[user?.plan || "free"], textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {user?.plan}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px", overflowY: "auto" }}>
        <div style={{ marginBottom: 4 }}>
          {!collapsed && (
            <div style={{ fontSize: 11, color: "rgba(240,240,255,0.3)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "8px 8px 4px" }}>
              Main
            </div>
          )}
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <NavButton
                key={item.label}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
                onClick={() => navigate(item.page)}
              />
            );
          })}
        </div>

        {user?.role === "admin" && (
          <div style={{ marginTop: 16 }}>
            {!collapsed && (
              <div style={{ fontSize: 11, color: "rgba(240,240,255,0.3)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "8px 8px 4px" }}>
                Admin
              </div>
            )}
            {collapsed && <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />}
            {adminItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <NavButton
                  key={item.label}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={() => navigate(item.page)}
                />
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom area */}
      <div style={{
        borderTop: "1px solid rgba(139, 92, 246, 0.08)",
        padding: collapsed ? "12px 8px" : "12px",
      }}>
        {/* Pro upgrade banner */}
        <AnimatePresence>
          {!collapsed && user?.plan === "free" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 12, padding: 14, marginBottom: 12,
                cursor: "pointer",
              }}
            >
              <Crown size={16} color={NEON.purple} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 4 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 11, color: "rgba(240,240,255,0.5)" }}>Unlock unlimited analyses</div>
            </motion.div>
          )}
        </AnimatePresence>

        <NavButton
          item={{ icon: Bell, label: "Notifications", page: "dashboard" }}
          isActive={false}
          collapsed={collapsed}
          onClick={() => {}}
        />
        <NavButton
          item={{ icon: Settings, label: "Settings", page: "dashboard" }}
          isActive={false}
          collapsed={collapsed}
          onClick={() => {}}
        />
        <NavButton
          item={{ icon: LogOut, label: "Sign Out", page: "landing" }}
          isActive={false}
          collapsed={collapsed}
          onClick={logout}
          danger
        />
      </div>
    </motion.div>
  );
}

function NavButton({
  item, isActive, collapsed, onClick, danger,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  const NEON = { purple: "#8b5cf6", cyan: "#06b6d4" };
  const iconColor = danger
    ? "#ef4444"
    : isActive
    ? NEON.purple
    : item.color || "rgba(240,240,255,0.5)";

  return (
    <motion.button
      whileHover={{ x: collapsed ? 0 : 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "10px 0" : "10px 10px",
        borderRadius: 10, border: "none", cursor: "pointer",
        background: isActive
          ? "rgba(139, 92, 246, 0.15)"
          : "transparent",
        borderLeft: isActive && !collapsed
          ? `2px solid ${NEON.purple}`
          : "2px solid transparent",
        marginBottom: 2,
        transition: "background 0.2s",
        position: "relative",
      }}
    >
      <item.icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: 14, color: isActive ? "white" : danger ? "#ef4444" : "rgba(240,240,255,0.65)",
              whiteSpace: "nowrap", fontWeight: isActive ? 600 : 400,
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <span style={{
          marginLeft: "auto",
          background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
          borderRadius: 100, padding: "2px 8px",
          fontSize: 10, fontWeight: 700, color: "white",
        }}>
          {item.badge}
        </span>
      )}
    </motion.button>
  );
}
