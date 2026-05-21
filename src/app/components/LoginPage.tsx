import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4" };

export default function LoginPage() {
  const { login, navigate } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials. Try any email + password.");
    } finally {
      setLoading(false);
    }
  };

  const glass = {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px 14px 44px",
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10, color: "white", fontSize: 15, outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080810",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Background effects */}
      <div style={{
        position: "absolute", top: "20%", left: "20%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "20%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{
              width: 52, height: 52, borderRadius: 14,
              background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: `0 0 30px rgba(139, 92, 246, 0.4)`,
              cursor: "pointer",
            }}
            onClick={() => navigate("landing")}
          >
            <Zap size={24} color="white" />
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: "white", marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: "rgba(240,240,255,0.5)" }}>
            Sign in to your AI Squat account
          </p>
        </div>

        {/* Card */}
        <div style={{ ...glass, borderRadius: 20, padding: 36 }}>
          {/* Demo hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <Sparkles size={14} color={NEON.purple} />
            <span style={{ fontSize: 13, color: "rgba(240,240,255,0.7)" }}>
              Demo: use any email/password. Use <strong style={{ color: NEON.purple }}>admin@</strong> for admin access.
            </span>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(240,240,255,0.6)", marginBottom: 8 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="rgba(240,240,255,0.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = NEON.purple; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, color: "rgba(240,240,255,0.6)" }}>Password</label>
                <button type="button" style={{ background: "none", border: "none", color: NEON.purple, fontSize: 13, cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="rgba(240,240,255,0.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) => { e.target.style.borderColor = NEON.purple; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "rgba(240,240,255,0.35)",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: 8, padding: "10px 14px",
                  fontSize: 13, color: "#ef4444", marginBottom: 20,
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              style={{
                width: "100%", padding: "16px 0",
                background: loading
                  ? "rgba(139, 92, 246, 0.4)"
                  : `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                border: "none", color: "white", borderRadius: 12,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 16, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: `0 0 25px rgba(139, 92, 246, 0.3)`,
                transition: "background 0.3s",
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 13, color: "rgba(240,240,255,0.35)" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "14px 0",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "white", fontSize: 15,
              transition: "background 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34a853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#fbbc05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#ea4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </motion.button>
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 15, color: "rgba(240,240,255,0.5)" }}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("signup")}
            style={{ background: "none", border: "none", color: NEON.purple, cursor: "pointer", fontWeight: 600, fontSize: 15 }}
          >
            Sign up free
          </button>
        </p>
      </motion.div>
    </div>
  );
}
