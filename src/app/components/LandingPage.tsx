import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import {
  Brain, Zap, Activity, Target, Award, ChevronRight, Play, Star,
  Shield, BarChart3, Camera, Upload, Check, Menu, X, ArrowRight,
  TrendingUp, Users, Globe, Sparkles
} from "lucide-react";
import { useAuth } from "../App";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981", orange: "#f97316" };

function ParticlesBackground() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.id % 3 === 0 ? NEON.purple : p.id % 3 === 1 ? NEON.cyan : NEON.green,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SquatFigure() {
  const [squatPhase, setSquatPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSquatPhase((p) => (p + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const phases = [
    { bodyY: 0, kneeAngle: 0, label: "Standing" },
    { bodyY: 15, kneeAngle: 30, label: "Descent" },
    { bodyY: 40, kneeAngle: 90, label: "Bottom" },
    { bodyY: 15, kneeAngle: 45, label: "Ascent" },
  ];

  const phase = phases[squatPhase];
  const bodyTop = 80 + phase.bodyY;

  return (
    <div style={{ position: "relative", width: 260, height: 340 }}>
      <svg width="260" height="340" viewBox="0 0 260 340">
        {/* Glow effects */}
        <defs>
          <radialGradient id="figureGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <ellipse cx="130" cy="200" rx="80" ry="100" fill="url(#figureGlow)" />

        {/* Skeleton tracking lines (cyan) */}
        <motion.line
          x1="130" y1={bodyTop} x2="130" y2={bodyTop + 60}
          stroke={NEON.cyan} strokeWidth="1" strokeDasharray="4,4" opacity="0.4"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Head */}
        <motion.circle
          cx="130" cy={bodyTop - 22}
          r="18"
          fill="none" stroke={NEON.purple} strokeWidth="2.5"
          filter="url(#glow)"
          animate={{ cy: bodyTop - 22 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Torso */}
        <motion.line
          x1="130" y1={bodyTop} x2="130" y2={bodyTop + 55}
          stroke={NEON.purple} strokeWidth="3" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ y1: bodyTop, y2: bodyTop + 55 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Shoulders */}
        <motion.line
          x1="100" y1={bodyTop + 10} x2="160" y2={bodyTop + 10}
          stroke={NEON.purple} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ y1: bodyTop + 10, y2: bodyTop + 10 }}
          transition={{ duration: 0.6 }}
        />

        {/* Arms */}
        <motion.line
          x1="100" y1={bodyTop + 10}
          x2={90 - phase.bodyY * 0.3} y2={bodyTop + 40 + phase.bodyY * 0.2}
          stroke={NEON.cyan} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ x2: 90 - phase.bodyY * 0.3, y2: bodyTop + 40 + phase.bodyY * 0.2 }}
          transition={{ duration: 0.6 }}
        />
        <motion.line
          x1="160" y1={bodyTop + 10}
          x2={170 + phase.bodyY * 0.3} y2={bodyTop + 40 + phase.bodyY * 0.2}
          stroke={NEON.cyan} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ x2: 170 + phase.bodyY * 0.3, y2: bodyTop + 40 + phase.bodyY * 0.2 }}
          transition={{ duration: 0.6 }}
        />

        {/* Hips */}
        <motion.line
          x1="110" y1={bodyTop + 55} x2="150" y2={bodyTop + 55}
          stroke={NEON.purple} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{ y1: bodyTop + 55, y2: bodyTop + 55 }}
          transition={{ duration: 0.6 }}
        />

        {/* Left thigh */}
        <motion.line
          x1="110" y1={bodyTop + 55}
          x2={100 - phase.kneeAngle * 0.2} y2={bodyTop + 55 + 60 - phase.kneeAngle * 0.3}
          stroke={NEON.green} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x2: 100 - phase.kneeAngle * 0.2,
            y2: bodyTop + 55 + 60 - phase.kneeAngle * 0.3,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Right thigh */}
        <motion.line
          x1="150" y1={bodyTop + 55}
          x2={160 + phase.kneeAngle * 0.2} y2={bodyTop + 55 + 60 - phase.kneeAngle * 0.3}
          stroke={NEON.green} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x2: 160 + phase.kneeAngle * 0.2,
            y2: bodyTop + 55 + 60 - phase.kneeAngle * 0.3,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Left shin */}
        <motion.line
          x1={100 - phase.kneeAngle * 0.2} y1={bodyTop + 115 - phase.kneeAngle * 0.3}
          x2="105" y2={bodyTop + 180 - phase.bodyY}
          stroke={NEON.orange} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: 100 - phase.kneeAngle * 0.2,
            y1: bodyTop + 115 - phase.kneeAngle * 0.3,
            y2: bodyTop + 180 - phase.bodyY,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Right shin */}
        <motion.line
          x1={160 + phase.kneeAngle * 0.2} y1={bodyTop + 115 - phase.kneeAngle * 0.3}
          x2="155" y2={bodyTop + 180 - phase.bodyY}
          stroke={NEON.orange} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow)"
          animate={{
            x1: 160 + phase.kneeAngle * 0.2,
            y1: bodyTop + 115 - phase.kneeAngle * 0.3,
            y2: bodyTop + 180 - phase.bodyY,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Knee dots */}
        <motion.circle
          cx={100 - phase.kneeAngle * 0.2} cy={bodyTop + 115 - phase.kneeAngle * 0.3}
          r="5" fill={NEON.cyan} filter="url(#glow)"
          animate={{
            cx: 100 - phase.kneeAngle * 0.2,
            cy: bodyTop + 115 - phase.kneeAngle * 0.3,
          }}
          transition={{ duration: 0.6 }}
        />
        <motion.circle
          cx={160 + phase.kneeAngle * 0.2} cy={bodyTop + 115 - phase.kneeAngle * 0.3}
          r="5" fill={NEON.cyan} filter="url(#glow)"
          animate={{
            cx: 160 + phase.kneeAngle * 0.2,
            cy: bodyTop + 115 - phase.kneeAngle * 0.3,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Joint dots */}
        {[
          { cx: 130, cy: bodyTop },
          { cx: 100, cy: bodyTop + 10 },
          { cx: 160, cy: bodyTop + 10 },
          { cx: 110, cy: bodyTop + 55 },
          { cx: 150, cy: bodyTop + 55 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx} cy={dot.cy}
            r="4" fill={NEON.purple} filter="url(#glow)"
            animate={{ cy: dot.cy }}
            transition={{ duration: 0.6 }}
          />
        ))}

        {/* Phase label */}
        <motion.text
          x="130" y="320"
          textAnchor="middle"
          fill={NEON.cyan}
          fontSize="12"
          fontFamily="monospace"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {phase.label}
        </motion.text>

        {/* Angle indicator */}
        {phase.kneeAngle > 0 && (
          <motion.text
            x={85 - phase.kneeAngle * 0.2} y={bodyTop + 110 - phase.kneeAngle * 0.3}
            fill={NEON.green} fontSize="10" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {phase.kneeAngle}°
          </motion.text>
        )}
      </svg>

      {/* Floating metric badges */}
      <motion.div
        style={{
          position: "absolute", top: 60, right: -20,
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: 8, padding: "6px 12px",
          backdropFilter: "blur(10px)",
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ color: NEON.green, fontSize: 11, fontFamily: "monospace" }}>Depth: 94%</div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute", top: 120, left: -30,
          background: "rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(139, 92, 246, 0.4)",
          borderRadius: 8, padding: "6px 12px",
          backdropFilter: "blur(10px)",
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div style={{ color: NEON.purple, fontSize: 11, fontFamily: "monospace" }}>Score: 92</div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute", bottom: 70, right: -15,
          background: "rgba(6, 182, 212, 0.15)",
          border: "1px solid rgba(6, 182, 212, 0.4)",
          borderRadius: 8, padding: "6px 12px",
          backdropFilter: "blur(10px)",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div style={{ color: NEON.cyan, fontSize: 11, fontFamily: "monospace" }}>Sym: 98%</div>
      </motion.div>
    </div>
  );
}

const features = [
  {
    icon: Brain, color: NEON.purple, title: "AI Pose Detection",
    desc: "Real-time skeleton tracking with sub-millisecond precision using our fine-tuned vision model.",
  },
  {
    icon: Activity, color: NEON.cyan, title: "Biomechanical Analysis",
    desc: "Deep analysis of knee angles, hip depth, back alignment and symmetry score in every rep.",
  },
  {
    icon: BarChart3, color: NEON.green, title: "Progress Tracking",
    desc: "Interactive dashboards showing your strength curve evolution over weeks and months.",
  },
  {
    icon: Camera, color: NEON.orange, title: "Live Webcam Mode",
    desc: "Analyze squats in real-time using your webcam — no upload required.",
  },
  {
    icon: Shield, color: NEON.purple, title: "Injury Prevention",
    desc: "AI flags dangerous movement patterns before they become chronic injuries.",
  },
  {
    icon: Target, color: NEON.cyan, title: "Personalized Feedback",
    desc: "GPT-powered coaching advice tailored to your specific movement deficiencies.",
  },
];

const pricing = [
  {
    name: "Free", price: "0", period: "forever",
    color: NEON.cyan,
    features: ["5 analyses/month", "Basic metrics", "7-day history", "Email support"],
    cta: "Get Started",
  },
  {
    name: "Pro", price: "29", period: "month",
    color: NEON.purple, popular: true,
    features: [
      "Unlimited analyses", "Advanced metrics", "Full history", "Priority support",
      "PDF reports", "Webcam mode", "AI coaching", "API access",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Enterprise", price: "99", period: "month",
    color: NEON.orange,
    features: [
      "Everything in Pro", "Team management", "Custom branding", "Dedicated CSM",
      "SLA guarantee", "Custom integrations", "Admin dashboard", "Audit logs",
    ],
    cta: "Contact Sales",
  },
];

const testimonials = [
  {
    name: "Marcus Chen", role: "Olympic Weightlifting Coach",
    text: "AI Squat Analyzer transformed how I coach my athletes. The biomechanical insights are on par with $10,000 motion capture setups.",
    score: 5, avatar: "MC",
  },
  {
    name: "Sarah Williams", role: "CrossFit Level 3 Trainer",
    text: "My clients improved their squat form by 40% in just 3 weeks. The AI feedback is incredibly detailed and actionable.",
    score: 5, avatar: "SW",
  },
  {
    name: "David Okafor", role: "Physical Therapist",
    text: "I use this to screen patients for movement dysfunction. The injury risk scoring is remarkably accurate.",
    score: 5, avatar: "DO",
  },
];

const steps = [
  { icon: Upload, label: "Upload or Stream", desc: "Upload your squat video or go live with your webcam" },
  { icon: Brain, label: "AI Analyzes", desc: "Our model processes every frame in real-time" },
  { icon: Award, label: "Get Your Score", desc: "Receive detailed metrics and personalized coaching" },
];

const stats = [
  { value: "2.4M+", label: "Squats Analyzed", icon: Activity },
  { value: "98.7%", label: "Accuracy Rate", icon: Target },
  { value: "50K+", label: "Active Athletes", icon: Users },
  { value: "140+", label: "Countries", icon: Globe },
];

export default function LandingPage() {
  const { navigate } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const glass = {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  };

  return (
    <div style={{ background: "#080810", color: "#f0f0ff", overflowX: "hidden" }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          ...glass, borderTop: "none", borderLeft: "none", borderRight: "none",
          borderBottom: "1px solid rgba(139, 92, 246, 0.15)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("landing")}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 20px rgba(139, 92, 246, 0.4)`,
              }}>
                <Zap size={18} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
                AI<span style={{ color: NEON.purple }}>Squat</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
              {["Features", "How It Works", "Pricing", "About"].map((item) => (
                <button
                  key={item}
                  style={{ background: "none", border: "none", color: "rgba(240,240,255,0.7)", cursor: "pointer", fontSize: 14 }}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={() => navigate("login")}
                style={{ background: "none", border: "none", color: "rgba(240,240,255,0.8)", cursor: "pointer", fontSize: 14 }}
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("signup")}
                style={{
                  background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                  border: "none", color: "white", padding: "10px 20px",
                  borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600,
                  boxShadow: `0 0 20px rgba(139, 92, 246, 0.35)`,
                }}
              >
                Start Free
              </motion.button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: "none", background: "none", border: "none", color: "white", cursor: "pointer" }}
                className="block md:hidden"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", paddingTop: 80, overflow: "hidden" }}>
        <ParticlesBackground />

        {/* Background gradients */}
        <div style={{
          position: "absolute", top: "10%", left: "5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", y: heroY }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            {/* Left content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(139, 92, 246, 0.12)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  borderRadius: 100, padding: "6px 16px", marginBottom: 24,
                }}
              >
                <Sparkles size={14} color={NEON.purple} />
                <span style={{ fontSize: 13, color: NEON.purple }}>AI-Powered Squat Analysis</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ fontSize: "clamp(40px, 5vw, 70px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}
              >
                Perfect Your{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Squat Form
                </span>
                <br />with AI Vision
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: 18, color: "rgba(240,240,255,0.65)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}
              >
                Upload your squat video and get instant AI analysis — knee angles, depth, symmetry, and a quality score. Like having an Olympic coach in your pocket.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 0 40px rgba(139, 92, 246, 0.5)` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("signup")}
                  style={{
                    background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                    border: "none", color: "white", padding: "16px 32px",
                    borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: `0 0 30px rgba(139, 92, 246, 0.35)`,
                  }}
                >
                  Start Free Analysis <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white", padding: "16px 28px",
                    borderRadius: 12, cursor: "pointer", fontSize: 16,
                    display: "flex", alignItems: "center", gap: 8,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Play size={16} /> Watch Demo
                </motion.button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}
              >
                <div style={{ display: "flex" }}>
                  {["AJ", "MK", "SR", "DL", "+"].map((a, i) => (
                    <div
                      key={a}
                      style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: i < 4 ? `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})` : "rgba(255,255,255,0.15)",
                        border: "2px solid #080810",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: "white",
                        marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i,
                        position: "relative",
                      }}
                    >
                      {a}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} color="#f97316" fill="#f97316" />)}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(240,240,255,0.6)", marginTop: 2 }}>
                    50,000+ athletes trust AI Squat
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — animated figure */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <div style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: 24, padding: "40px 50px",
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 60px rgba(139, 92, 246, 0.15)`,
              }}>
                {/* Live indicator */}
                <div style={{
                  position: "absolute", top: 16, left: 16,
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: 100, padding: "4px 12px",
                }}>
                  <motion.div
                    style={{ width: 7, height: 7, borderRadius: "50%", background: NEON.green }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span style={{ fontSize: 11, color: NEON.green, fontFamily: "monospace" }}>ANALYZING</span>
                </div>

                <SquatFigure />

                {/* Bottom metrics */}
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
                  {[
                    { label: "Knee", value: "92°", color: NEON.cyan },
                    { label: "Score", value: "94", color: NEON.purple },
                    { label: "Depth", value: "↓ ATG", color: NEON.green },
                  ].map((m) => (
                    <div key={m.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "monospace" }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: "rgba(240,240,255,0.5)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "white", letterSpacing: -1 }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: "rgba(240,240,255,0.5)", marginTop: 4 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              borderRadius: 100, padding: "6px 16px", marginBottom: 16,
            }}>
              <Sparkles size={14} color={NEON.cyan} />
              <span style={{ fontSize: 13, color: NEON.cyan }}>Powered by Computer Vision AI</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
              Everything You Need to{" "}
              <span style={{
                background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Move Better
              </span>
            </h2>
            <p style={{ fontSize: 18, color: "rgba(240,240,255,0.55)", maxWidth: 560, margin: "0 auto" }}>
              Cutting-edge AI meets sports science to give you professional-grade movement analysis.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: `0 8px 40px rgba(139, 92, 246, 0.2)` }}
                style={{
                  ...glass,
                  borderRadius: 16, padding: 28,
                  cursor: "default",
                  transition: "box-shadow 0.3s",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 18,
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(240,240,255,0.55)", lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", background: "rgba(139, 92, 246, 0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
              Analyze in 3 Simple Steps
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
            {/* Connector line */}
            <div style={{
              position: "absolute", top: 48, left: "16%", right: "16%", height: 1,
              background: `linear-gradient(90deg, ${NEON.purple}, ${NEON.cyan})`,
              opacity: 0.3,
            }} />

            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                style={{ textAlign: "center" }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${NEON.purple}22, ${NEON.cyan}22)`,
                    border: `2px solid ${NEON.purple}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px",
                    position: "relative",
                    boxShadow: `0 0 30px rgba(139, 92, 246, 0.2)`,
                  }}
                >
                  <step.icon size={28} color={NEON.purple} />
                  <div style={{
                    position: "absolute", top: -10, right: -10,
                    width: 28, height: 28, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "white",
                  }}>
                    {i + 1}
                  </div>
                </motion.div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{step.label}</h3>
                <p style={{ fontSize: 14, color: "rgba(240,240,255,0.55)", lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
              Simple, Transparent{" "}
              <span style={{
                background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Pricing
              </span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }}>
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                style={{
                  ...glass,
                  borderRadius: 20, padding: 32,
                  position: "relative",
                  border: plan.popular
                    ? `1px solid ${NEON.purple}60`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: plan.popular ? `0 0 40px rgba(139, 92, 246, 0.2)` : undefined,
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                    borderRadius: 100, padding: "4px 16px",
                    fontSize: 12, fontWeight: 700, color: "white",
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, color: plan.color, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 800 }}>${plan.price}</span>
                    <span style={{ fontSize: 14, color: "rgba(240,240,255,0.5)" }}>/{plan.period}</span>
                  </div>
                </div>

                <ul style={{ listStyle: "none", marginBottom: 32, padding: 0 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Check size={15} color={plan.color} />
                      <span style={{ fontSize: 14, color: "rgba(240,240,255,0.75)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("signup")}
                  style={{
                    width: "100%",
                    background: plan.popular
                      ? `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`
                      : `${plan.color}18`,
                    border: plan.popular ? "none" : `1px solid ${plan.color}35`,
                    color: "white", padding: "14px 0",
                    borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 600,
                    boxShadow: plan.popular ? `0 0 20px rgba(139, 92, 246, 0.35)` : undefined,
                  }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "rgba(6, 182, 212, 0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
              Trusted by Top Athletes
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ ...glass, borderRadius: 16, padding: 28 }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} color={NEON.orange} fill={NEON.orange} />)}
                </div>
                <p style={{ fontSize: 15, color: "rgba(240,240,255,0.75)", lineHeight: 1.7, marginBottom: 20 }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "white",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(240,240,255,0.5)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              ...glass,
              borderRadius: 24, padding: "60px 40px",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              boxShadow: `0 0 80px rgba(139, 92, 246, 0.1)`,
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400, height: 400, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <TrendingUp size={48} color={NEON.purple} style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
              Ready to Perfect Your Squat?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(240,240,255,0.6)", marginBottom: 40, lineHeight: 1.7 }}>
              Join 50,000+ athletes already training smarter with AI analysis.
            </p>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: `0 0 50px rgba(139, 92, 246, 0.6)` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("signup")}
              style={{
                background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                border: "none", color: "white", padding: "18px 48px",
                borderRadius: 14, cursor: "pointer", fontSize: 18, fontWeight: 700,
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: `0 0 30px rgba(139, 92, 246, 0.4)`,
              }}
            >
              Start Free Today <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={14} color="white" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>AI<span style={{ color: NEON.purple }}>Squat</span></span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(240,240,255,0.4)" }}>
          © 2026 AISquat. All rights reserved. Built with ❤️ for athletes.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <button key={l} style={{ background: "none", border: "none", color: "rgba(240,240,255,0.4)", fontSize: 13, cursor: "pointer" }}>
              {l}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
