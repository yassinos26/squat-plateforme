import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload, Camera, Play, CheckCircle2, AlertTriangle, Info,
  TrendingUp, Activity, Target, RotateCcw, Download, Share2,
  Zap, Brain, Eye, ChevronRight, X
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const NEON = { purple: "#8b5cf6", cyan: "#06b6d4", green: "#10b981", orange: "#f97316", red: "#ef4444" };

type AnalysisState = "idle" | "uploading" | "processing" | "done";

interface SquatMetrics {
  score: number;
  kneeAngle: number;
  hipDepth: number;
  symmetry: number;
  balance: number;
  backAngle: number;
  speed: number;
  feedback: string[];
  warnings: string[];
  phase: string;
}

const mockResult: SquatMetrics = {
  score: 92,
  kneeAngle: 94,
  hipDepth: 96,
  symmetry: 97,
  balance: 88,
  backAngle: 85,
  speed: 78,
  feedback: [
    "Excellent depth — hips broke parallel cleanly",
    "Good knee tracking over toes on left side",
    "Smooth eccentric phase with proper control",
    "Hip crease dropped below knee line — ATG squat",
  ],
  warnings: [
    "Right knee caves slightly at bottom — focus on external rotation cues",
    "Trunk forward lean is slightly excessive — consider thoracic mobility work",
  ],
  phase: "ATG (Below Parallel)",
};

function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const scoreColor = score >= 90 ? NEON.green : score >= 75 ? NEON.cyan : NEON.orange;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={scoreColor} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{ fontSize: size * 0.26, fontWeight: 800, color: scoreColor, lineHeight: 1 }}
        >
          {score}
        </motion.div>
        <div style={{ fontSize: 11, color: "rgba(240,240,255,0.5)" }}>/100</div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, color, unit = "%" }: { label: string; value: number; color: string; unit?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(240,240,255,0.65)" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}{unit}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          style={{ height: "100%", background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

const radarData = (m: SquatMetrics) => [
  { subject: "Depth", value: m.hipDepth, fullMark: 100 },
  { subject: "Symmetry", value: m.symmetry, fullMark: 100 },
  { subject: "Balance", value: m.balance, fullMark: 100 },
  { subject: "Back", value: m.backAngle, fullMark: 100 },
  { subject: "Speed", value: m.speed, fullMark: 100 },
  { subject: "Knee", value: Math.min(m.kneeAngle, 100), fullMark: 100 },
];

export default function AnalysisPage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SquatMetrics | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"upload" | "webcam">("upload");
  const fileRef = useRef<HTMLInputElement>(null);

  const simulate = useCallback((name: string) => {
    setFileName(name);
    setState("uploading");
    setProgress(0);

    const up = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(up); setState("processing"); return 100; }
        return p + 8;
      });
    }, 120);

    setTimeout(() => {
      setState("done");
      setResult(mockResult);
    }, 3500);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) simulate(file.name);
  }, [simulate]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulate(file.name);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setResult(null);
    setFileName("");
  };

  const processingSteps = [
    { label: "Extracting frames", done: progress >= 30 },
    { label: "Detecting skeleton", done: progress >= 60 },
    { label: "Calculating metrics", done: progress >= 80 },
    { label: "Generating score", done: progress >= 100 },
  ];

  return (
    <div>
      {state === "idle" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {(["upload", "webcam"] as const).map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode(m)}
                style={{
                  padding: "10px 20px", borderRadius: 10, cursor: "pointer",
                  background: mode === m ? `rgba(139,92,246,0.15)` : "rgba(255,255,255,0.04)",
                  border: mode === m ? `1px solid rgba(139,92,246,0.4)` : "1px solid rgba(255,255,255,0.08)",
                  color: mode === m ? NEON.purple : "rgba(240,240,255,0.6)",
                  fontSize: 14, fontWeight: mode === m ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {m === "upload" ? <Upload size={16} /> : <Camera size={16} />}
                {m === "upload" ? "Upload Video" : "Webcam Live"}
              </motion.button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            {/* Upload zone */}
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              whileHover={{ borderColor: "rgba(139,92,246,0.5)" }}
              animate={{
                borderColor: isDragging ? NEON.purple : "rgba(139,92,246,0.2)",
                background: isDragging ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
              }}
              style={{
                border: "2px dashed rgba(139,92,246,0.2)",
                borderRadius: 20, padding: "60px 40px",
                textAlign: "center", cursor: "pointer",
                transition: "all 0.2s",
                backdropFilter: "blur(20px)",
              }}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} style={{ display: "none" }} />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))",
                  border: "1px solid rgba(139,92,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Upload size={32} color={NEON.purple} />
              </motion.div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 10 }}>
                {isDragging ? "Drop your video here" : "Drop your squat video"}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(240,240,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
                Drag & drop or click to browse. We support MP4, MOV, AVI up to 500MB.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {["MP4", "MOV", "AVI", "WebM"].map((f) => (
                  <span key={f} style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "4px 10px",
                    fontSize: 12, color: "rgba(240,240,255,0.5)",
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                style={{
                  marginTop: 28,
                  background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                  border: "none", color: "white", padding: "14px 32px",
                  borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  boxShadow: `0 0 20px rgba(139,92,246,0.3)`,
                }}
              >
                <Upload size={16} /> Browse File
              </motion.button>

              {/* Demo */}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); simulate("demo_squat.mp4"); }}
                  style={{
                    background: "none", border: "none",
                    color: NEON.cyan, cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", gap: 6, margin: "0 auto",
                  }}
                >
                  <Play size={14} /> Run demo analysis
                </button>
              </div>
            </motion.div>

            {/* Tips panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Brain size={16} color={NEON.purple} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>AI Analysis Tips</h3>
                </div>
                {[
                  { icon: Eye, tip: "Film from a 45° angle for best detection" },
                  { icon: Activity, tip: "Ensure full body visible in frame" },
                  { icon: Zap, tip: "Good lighting improves accuracy by 20%" },
                  { icon: Camera, tip: "Film in landscape mode (horizontal)" },
                  { icon: Target, tip: "Perform 3-5 reps for better averaging" },
                ].map(({ icon: Icon, tip }, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "rgba(139,92,246,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={13} color={NEON.purple} />
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(240,240,255,0.65)", lineHeight: 1.5 }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* Metrics preview */}
              <div style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: 16, padding: 20,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14 }}>What We Analyze</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Knee Angle", color: NEON.cyan },
                    { label: "Hip Depth", color: NEON.purple },
                    { label: "Back Angle", color: NEON.green },
                    { label: "Symmetry", color: NEON.orange },
                    { label: "Balance", color: NEON.cyan },
                    { label: "Speed", color: NEON.green },
                  ].map((m) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
                      <span style={{ fontSize: 12, color: "rgba(240,240,255,0.65)" }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploading / Processing */}
      {(state === "uploading" || state === "processing") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 80, height: 80, borderRadius: "50%",
              border: `3px solid rgba(139,92,246,0.2)`,
              borderTopColor: NEON.purple,
              margin: "0 auto 32px",
              boxShadow: `0 0 30px rgba(139,92,246,0.3)`,
            }}
          />

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>
            {state === "uploading" ? "Uploading video..." : "Analyzing your squat..."}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(240,240,255,0.5)", marginBottom: 32 }}>
            {fileName && `Processing: ${fileName}`}
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "rgba(240,240,255,0.5)" }}>
                {state === "uploading" ? "Uploading" : "Processing"}
              </span>
              <span style={{ fontSize: 13, color: NEON.purple }}>{progress}%</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${NEON.purple}, ${NEON.cyan})`,
                  borderRadius: 4,
                  boxShadow: `0 0 12px rgba(139,92,246,0.5)`,
                  transition: "width 0.2s",
                }}
              />
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processingSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px",
                  background: step.done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${step.done ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 10,
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: step.done ? NEON.green : "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {step.done ? <CheckCircle2 size={14} color="white" /> : (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: progress > (i * 25) ? NEON.purple : "rgba(255,255,255,0.3)",
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 14, color: step.done ? "rgba(240,240,255,0.9)" : "rgba(240,240,255,0.45)" }}>
                  {step.label}
                </span>
                {step.done && <CheckCircle2 size={14} color={NEON.green} style={{ marginLeft: "auto" }} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {state === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CheckCircle2 size={20} color={NEON.green} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "white" }}>Analysis Complete</h2>
                <p style={{ fontSize: 13, color: "rgba(240,240,255,0.45)" }}>{fileName}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "rgba(240,240,255,0.8)",
                  cursor: "pointer", fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <Download size={14} /> Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "rgba(240,240,255,0.8)",
                  cursor: "pointer", fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <Share2 size={14} /> Share
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={reset}
                style={{
                  padding: "10px 16px",
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: 10, color: NEON.purple,
                  cursor: "pointer", fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <RotateCcw size={14} /> New Analysis
              </motion.button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 28,
                display: "flex", gap: 28, alignItems: "center",
              }}
            >
              <CircularScore score={result.score} size={130} />
              <div>
                <div style={{ fontSize: 13, color: "rgba(240,240,255,0.5)", marginBottom: 6 }}>Overall Quality Score</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6 }}>
                  {result.score >= 90 ? "Excellent" : result.score >= 75 ? "Good" : "Needs Work"}
                </div>
                <div style={{ fontSize: 13, color: "rgba(240,240,255,0.55)", marginBottom: 16 }}>
                  Squat phase: <span style={{ color: NEON.cyan }}>{result.phase}</span>
                </div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 8, padding: "4px 12px",
                  fontSize: 12, color: NEON.green,
                }}>
                  Top 8% of users this week
                </div>
              </div>
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 20,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>Movement Profile</h3>
              <p style={{ fontSize: 12, color: "rgba(240,240,255,0.4)", marginBottom: 8 }}>Multi-dimensional analysis</p>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData(result)}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(240,240,255,0.5)", fontSize: 11 }} />
                  <Radar name="Score" dataKey="value" stroke={NEON.purple} fill={NEON.purple} fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: "#0f0f1a", border: `1px solid ${NEON.purple}30`, borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Metrics + Feedback */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 24,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 20 }}>Detailed Metrics</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Knee Angle", value: `${result.kneeAngle}°`, color: NEON.cyan },
                  { label: "Hip Depth", value: `${result.hipDepth}%`, color: NEON.purple },
                  { label: "Symmetry", value: `${result.symmetry}%`, color: NEON.green },
                  { label: "Balance", value: `${result.balance}%`, color: NEON.orange },
                ].map((m) => (
                  <div key={m.label} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 10, padding: "12px 14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: m.color, letterSpacing: -0.5 }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: "rgba(240,240,255,0.45)", marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <MetricBar label="Depth" value={result.hipDepth} color={NEON.purple} />
              <MetricBar label="Symmetry" value={result.symmetry} color={NEON.cyan} />
              <MetricBar label="Balance" value={result.balance} color={NEON.green} />
              <MetricBar label="Speed Control" value={result.speed} color={NEON.orange} />
            </motion.div>

            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Brain size={16} color={NEON.purple} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>AI Feedback</h3>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <CheckCircle2 size={14} color={NEON.green} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: NEON.green }}>Positives</span>
                </div>
                {result.feedback.map((f, i) => (
                  <div key={i} style={{
                    padding: "8px 12px", marginBottom: 6,
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 8, fontSize: 13, color: "rgba(240,240,255,0.8)",
                    display: "flex", gap: 8, alignItems: "flex-start",
                  }}>
                    <CheckCircle2 size={13} color={NEON.green} style={{ flexShrink: 0, marginTop: 1 }} />
                    {f}
                  </div>
                ))}
              </div>

              {result.warnings.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <AlertTriangle size={14} color={NEON.orange} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: NEON.orange }}>Corrections</span>
                  </div>
                  {result.warnings.map((w, i) => (
                    <div key={i} style={{
                      padding: "8px 12px", marginBottom: 6,
                      background: "rgba(249,115,22,0.08)",
                      border: "1px solid rgba(249,115,22,0.15)",
                      borderRadius: 8, fontSize: 13, color: "rgba(240,240,255,0.8)",
                      display: "flex", gap: 8, alignItems: "flex-start",
                    }}>
                      <AlertTriangle size={13} color={NEON.orange} style={{ flexShrink: 0, marginTop: 1 }} />
                      {w}
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", marginTop: 20,
                  background: `linear-gradient(135deg, ${NEON.purple}, ${NEON.cyan})`,
                  border: "none", color: "white", padding: "12px 0",
                  borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <Brain size={14} /> Get Personalized Program <ChevronRight size={14} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
