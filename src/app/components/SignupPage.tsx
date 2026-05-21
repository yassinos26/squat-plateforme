import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981" };

const plans = [
  { id: "free", name: "Free", price: "$0", desc: "5 analyses/month" },
  { id: "pro", name: "Pro", price: "$29/mo", desc: "Unlimited analyses", popular: true },
];

export default function SignupPage() {
  const { signup, navigate } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = passwordStrength();
  const strengthColors = ["", "#ef4444", "#f97316", NEON.green];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch {
      setError("Signup failed. Please try again.");
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
    transition: "border-color 0.2s", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080810",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "15%", right: "15%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", left: "15%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: "rgba(240,240,255,0.5)" }}>
            Start analyzing your squats in minutes
          </p>
        </div>

        {/* Plan selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {plans.map((plan) => (
            <motion.button
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                background: selectedPlan === plan.id
                  ? `rgba(139, 92, 246, 0.15)`
                  : "rgba(255, 255, 255, 0.04)",
                border: selectedPlan === plan.id
                  ? `1px solid rgba(139, 92, 246, 0.5)`
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "14px 16px",
                cursor: "pointer", textAlign: "left",
                position: "relative",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -10, right: 10,
                  background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                  borderRadius: 100, padding: "2px 10px",
                  fontSize: 10, fontWeight: 700, color: "white",
                }}>
                  Popular
                </div>
              )}
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: NEON.purple, fontWeight: 600 }}>{plan.price}</div>
              <div style={{ fontSize: 12, color: "rgba(240,240,255,0.5)", marginTop: 4 }}>{plan.desc}</div>
              {selectedPlan === plan.id && (
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  width: 20, height: 20, borderRadius: "50%",
                  background: NEON.purple,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={12} color="white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Card */}
        <div style={{ ...glass, borderRadius: 20, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(240,240,255,0.6)", marginBottom: 8 }}>
                Full name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} color="rgba(240,240,255,0.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = NEON.purple; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
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

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(240,240,255,0.6)", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="rgba(240,240,255,0.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
              {password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 3, borderRadius: 2,
                          background: i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
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
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 13, color: "rgba(240,240,255,0.35)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "14px 0",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "white", fontSize: 15,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34a853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#fbbc05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#ea4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign up with Google
          </motion.button>

          <p style={{ fontSize: 12, color: "rgba(240,240,255,0.35)", textAlign: "center", marginTop: 20 }}>
            By creating an account you agree to our{" "}
            <span style={{ color: NEON.purple, cursor: "pointer" }}>Terms of Service</span> and{" "}
            <span style={{ color: NEON.purple, cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 15, color: "rgba(240,240,255,0.5)" }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("login")}
            style={{ background: "none", border: "none", color: NEON.purple, cursor: "pointer", fontWeight: 600, fontSize: 15 }}
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
