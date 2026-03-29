/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ─── SAMPLE POSTS (ambient ticker) ─────────────────────── */
const TICKER_POSTS = [
  {
    author: "mattk",
    votes: 847,
    title: "Why does every startup now have the exact same landing page?",
  },
  {
    author: "priya_s",
    votes: 512,
    title: "The best album of 2024 that absolutely nobody talked about",
  },
  {
    author: "arifh",
    votes: 301,
    title: "Hot take: tabs are objectively better than spaces",
  },
  {
    author: "zoe_d",
    votes: 1204,
    title: "I built a full SaaS in a weekend — here's what I learned",
  },
  {
    author: "tomr",
    votes: 688,
    title: "The quiet death of RSS and why it matters",
  },
  {
    author: "nadia_k",
    votes: 423,
    title: "Stop calling everything a 'community'",
  },
  {
    author: "dev_hn",
    votes: 934,
    title: "The real reason dark mode is so hard to get right",
  },
];

/* ─── ICONS ─────────────────────────────────────────────── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7C1 7 3.2 3 7 3C10.8 3 13 7 13 7C13 7 10.8 11 7 11C3.2 11 1 7 1 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 2L12 12M5.8 4A4.2 4.2 0 0 1 7 3.5C10.8 3.5 13 7 13 7C13 7 12.2 8.3 10.8 9.3M8.8 10.2C8.3 10.6 7.7 10.8 7 10.8C3.2 10.8 1 7 1 7C1 7 1.9 5.5 3.4 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M1.5 5L3.8 7.5L8.5 2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6H10M10 6L7 3M10 6L7 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ animation: "authSpin 0.7s linear infinite" }}
  >
    <circle
      cx="7"
      cy="7"
      r="5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeOpacity="0.2"
    />
    <path
      d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const UpArrow = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M4.5 1.5L7.5 5.5H1.5L4.5 1.5Z" fill="currentColor" />
  </svg>
);

/* ─── AMBIENT ORBS (continuous float) ───────────────────── */
function AmbientOrb({ cx, cy, r, delay, duration, color, opacity }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${r * 0.6}px)`,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
      }}
      animate={{ x: [0, 18, -12, 8, 0], y: [0, -14, 10, -6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── ANIMATED GRID LINES ────────────────────────────────── */
function GridLines({
  count = 6,
  color = "rgba(196,90,26,0.06)",
  vertical = true,
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            ...(vertical
              ? {
                  left: `${(i / (count - 1)) * 100}%`,
                  top: 0,
                  width: "1px",
                  height: "100%",
                  background: color,
                }
              : {
                  top: `${(i / (count - 1)) * 100}%`,
                  left: 0,
                  height: "1px",
                  width: "100%",
                  background: color,
                }),
          }}
          animate={{ opacity: [1, 1, 1] }}
          transition={{
            duration: 3 + i * 0.4,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── SCROLLING TICKER (posts) ───────────────────────────── */
function PostTicker({ direction = 1, speed = 28 }) {
  const items = [...TICKER_POSTS, ...TICKER_POSTS];
  const w = items.length * 280;
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: "10px", width: `${w * 2}px` }}
        animate={{ x: direction > 0 ? [0, -w * 0.5] : [-w * 0.5, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((p, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "260px",
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px",
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#5A5852",
                marginBottom: "5px",
                fontWeight: "600",
                letterSpacing: "0.02em",
              }}
            >
              u/{p.author}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#9A9288",
                lineHeight: "1.45",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#C45A1A",
                fontWeight: "700",
              }}
            >
              <UpArrow />
              {p.votes}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── FIELD ──────────────────────────────────────────────── */
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";
  const inputType = isPw ? (showPw ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={id}
        style={{
          fontSize: "10px",
          fontWeight: "700",
          color: "#7A7468",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 3px rgba(196,90,26,0.12)"
              : "0 0 0 0px rgba(196,90,26,0)",
          }}
          transition={{ duration: 0.2 }}
          style={{ borderRadius: "3px" }}
        >
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              padding: isPw ? "11px 40px 11px 13px" : "11px 13px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              background: focused ? "#FAF8F5" : "#F2EEE9",
              border: `1px solid ${error ? "#C45A1A" : focused ? "#1A1917" : "#D8D2CA"}`,
              borderRadius: "3px",
              color: "#1A1917",
              outline: "none",
              transition: "border-color 0.15s, background 0.2s",
              display: "block",
            }}
          />
        </motion.div>
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            style={{
              position: "absolute",
              right: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: focused ? "#7A7468" : "#9B9488",
              display: "flex",
              alignItems: "center",
              padding: "2px",
              transition: "color 0.15s",
            }}
          >
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: "11px", color: "#C45A1A", fontWeight: "600" }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── PASSWORD STRENGTH ──────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ chars", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColors = ["#C45A1A", "#D98A3A", "#4A9E6B"];
  const strengthLabel = ["Weak", "Fair", "Strong"][score - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: "7px" }}
    >
      <div style={{ display: "flex", gap: "3px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              background: i < score ? barColors[score - 1] : "#E0DCD5",
            }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, height: "3px", borderRadius: "2px" }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {checks.map(({ label, ok }) => (
            <span
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "10px",
                color: ok ? "#4A9E6B" : "#9B9488",
                fontWeight: "600",
                transition: "color 0.2s",
              }}
            >
              {ok && <CheckIcon />}
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: barColors[score - 1],
              letterSpacing: "0.05em",
            }}
          >
            {strengthLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────── */
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        translateX: "-50%",
        background: type === "error" ? "#2C1608" : "#0C1F12",
        border: `1px solid ${type === "error" ? "#C45A1A" : "#3A8A5A"}`,
        borderRadius: "4px",
        padding: "10px 20px",
        fontSize: "13px",
        fontWeight: "600",
        color: type === "error" ? "#E8906A" : "#6ABCA0",
        zIndex: 200,
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {message}
    </motion.div>
  );
}

/* ─── CURSOR GLOW (right panel) ─────────────────────────── */
function CursorGlow({ containerRef }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  const sy = useSpring(y, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 0,
        width: 360,
        height: 360,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(196,90,26,0.06) 0%, transparent 70%)",
        translateX: "-50%",
        translateY: "-50%",
        x: sx,
        y: sy,
      }}
    />
  );
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const rightPanelRef = useRef(null);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();

  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const isLogin = mode === "login";

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const switchMode = (m) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", m);
    navigate(`/auth?${params.toString()}`);

    setForm({ username: "", email: "", password: "" });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (mode === "signup") {
      if (!form.username.trim()) errs.username = "Username is required";
      else if (form.username.length < 3)
        errs.username = "At least 3 characters";
    }
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (mode === "signup" && form.password.length < 8)
      errs.password = "Min 8 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              username: form.username,
              email: form.email,
              password: form.password,
            };
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
  
      login(data);
navigate("/feed");

      setToast({
        type: "success",
        message:
          mode === "login"
            ? `Welcome back, ${data.user.username}!`
            : `Welcome, ${data.user.username}!`,
      });
      // window.location.href = "/";
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
          background: #0E0D0C;
          color: #1A1917;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        input::placeholder { color: #B8B0A6; }
        @keyframes authSpin { to { transform: rotate(360deg); } }

        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.5; }
          50%  { transform: scale(1.06); opacity: 0.15; }
          100% { transform: scale(0.92); opacity: 0.5; }
        }
        @keyframes drift-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33%       { transform: translate(12px, -18px) rotate(1.5deg); }
          66%       { transform: translate(-8px, 10px) rotate(-1deg); }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          40%       { transform: translate(-15px, -10px) rotate(-2deg); }
          70%       { transform: translate(10px, 14px) rotate(1deg); }
        }
        @keyframes drift-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%       { transform: translate(8px, 12px) rotate(1deg); }
          75%       { transform: translate(-12px, -8px) rotate(-1.5deg); }
        }
        .drift-1 { animation: drift-1 9s ease-in-out infinite; }
        .drift-2 { animation: drift-2 11s ease-in-out infinite 1s; }
        .drift-3 { animation: drift-3 8s ease-in-out infinite 2s; }

        .tab-btn {
          flex: 1; padding: 9px 0; font-size: 13px; font-weight: 700;
          border: none; background: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; border-radius: 2px;
          transition: color 0.2s; letter-spacing: 0.01em; position: relative; z-index: 1;
        }
        .tab-active   { color: #1A1917; }
        .tab-inactive { color: #9B9488; }
        .tab-inactive:hover { color: #5A5248; }

        .submit-btn {
          width: 100%; padding: 12px 20px;
          color: #fff; border: none; border-radius: 3px;
          font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; letter-spacing: 0.015em;
          transition: background 0.15s, transform 0.1s;
          cursor: pointer;
        }
        .submit-btn:hover:not(:disabled) { background: #A84C14 !important; }
        .submit-btn:active:not(:disabled) { transform: scale(0.985); }
        .submit-btn:disabled { cursor: not-allowed; }

        .divider-line { flex: 1; height: 1px; background: #E8E3DC; }

        .forgot-link {
          font-size: 12px; color: #9B9488; font-weight: 600;
          text-decoration: none; transition: color 0.15s;
        }
        .forgot-link:hover { color: #C45A1A; }

        /* Noise overlay */
        .noise::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025; pointer-events: none; border-radius: inherit;
        }
      `}</style>

      {/* ════════ FULL PAGE ════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
        }}
      >
        {/* ══ LEFT — dark, full of ambient life ══ */}
        <div
          style={{
            background: "#131210",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated grid */}
          <GridLines count={12} color="rgba(196,90,26,0.05)" vertical={true} />
          <GridLines count={12} color="rgba(196,90,26,0.04)" vertical={false} />

          {/* Pulsing ring behind logo */}
          <div
            style={{
              position: "absolute",
              top: "42px",
              left: "42px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "1px solid rgba(196,90,26,0.3)",
              animation: "pulse-ring 3s ease-in-out infinite",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "52px 52px 40px",
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img
                src="/logo.png"
                alt="Threadit"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  objectFit: "contain",
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#FAF7F2",
                  letterSpacing: "-0.5px",
                }}
              >
                Threadit
              </span>
            </motion.div>

            {/* Headline */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingBottom: "80px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.25,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#C45A1A",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                The forum worth reading
              </motion.div>

              {[
                "Post threads.",
                "Cast votes.",
                "Have",
                "real conversations.",
              ].map((word, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.35 + i * 0.08,
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      fontSize: "clamp(32px, 3vw, 46px)",
                      fontWeight: "800",
                      color: i === 2 || i === 3 ? "#6A6460" : "#FAF7F2",
                      letterSpacing: "-1.5px",
                      lineHeight: "1.1",
                    }}
                  >
                    {word}
                  </motion.div>
                </div>
              ))}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.6 }}
                style={{
                  fontSize: "14px",
                  color: "#5A5652",
                  lineHeight: "1.75",
                  maxWidth: "320px",
                  marginTop: "22px",
                }}
              >
                No algorithm pushing content at you. Just the best rising to the
                top.
              </motion.p>

              {/* Floating post cards — 3 drifting
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7 }}
                style={{
                  position: "relative",
                  marginTop: "48px",
                  height: "110px",
                }}
              >
                {TICKER_POSTS.slice(0, 3).map((p, i) => {
                  const styles = [
                    { left: "0%", top: 0, zIndex: 3, cls: "drift-1" },
                    { left: "18%", top: 18, zIndex: 2, cls: "drift-2" },
                    { left: "36%", top: 36, zIndex: 1, cls: "drift-3" },
                  ][i];
                  return (
                    <div
                      key={i}
                      className={styles.cls}
                      style={{
                        position: "absolute",
                        left: styles.left,
                        top: styles.top,
                        zIndex: styles.zIndex,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "4px",
                        padding: "10px 14px",
                        width: "240px",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#4A4844",
                          fontWeight: "600",
                          marginBottom: "5px",
                        }}
                      >
                        u/{p.author}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9A9288",
                          lineHeight: "1.4",
                          fontWeight: "500",
                          marginBottom: "7px",
                        }}
                      >
                        {p.title.slice(0, 52)}
                        {p.title.length > 52 ? "…" : ""}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#C45A1A",
                          fontWeight: "700",
                        }}
                      >
                        <UpArrow />
                        {p.votes}
                      </div>
                    </div>
                  );
                })}
              </motion.div> */}
            </div>

            {/* Bottom ticker strips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <PostTicker direction={1} speed={35} />
              <PostTicker direction={-1} speed={42} />
            </motion.div>
          </div>
        </div>

        {/* ══ RIGHT — light, form ══ */}
        <div
          ref={rightPanelRef}
          style={{
            background: "#FDFAF6",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Cursor glow */}
          <CursorGlow containerRef={rightPanelRef} />

          {/* Subtle ambient orb */}
          <AmbientOrb
            cx="80%"
            cy="15%"
            r={160}
            delay={0.5}
            duration={12}
            color="rgba(196,90,26,0.06)"
            opacity={1}
          />
          <AmbientOrb
            cx="15%"
            cy="80%"
            r={120}
            delay={2}
            duration={10}
            color="rgba(196,90,26,0.05)"
            opacity={1}
          />

          {/* Very faint grid */}
          <GridLines count={5} color="rgba(196,90,26,0.04)" vertical={true} />

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: "400px",
              background: "#FFFFFF",
              border: "1px solid #E2DDD6",
              borderRadius: "6px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.07)",
              overflow: "hidden",
              margin: "24px",
            }}
          >
            {/* Card top accent bar */}
            <div
              style={{
                height: "3px",
                background: "linear-gradient(90deg, #C45A1A, #E8903A, #C45A1A)",
                backgroundSize: "200% 100%",
                animation: "none",
              }}
            />

            <div style={{ padding: "32px 36px 36px" }}>
              {/* Logo row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "28px",
                }}
              >
                <a
                  href="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Threadit"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "4px",
                      objectFit: "contain",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#1A1917",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Threadit
                  </span>
                </a>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#B0A898",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                  }}
                >
                  {isLogin ? "Sign in" : "New account"}
                </span>
              </div>

              {/* Tab switcher */}
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  background: "#F2EEE9",
                  borderRadius: "4px",
                  padding: "3px",
                  marginBottom: "28px",
                }}
              >
                <motion.div
                  animate={{ x: isLogin ? 0 : "100%" }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    width: "calc(50% - 3px)",
                    height: "calc(100% - 6px)",
                    background: "#FFFFFF",
                    borderRadius: "2px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.09)",
                  }}
                />
                <button
                  className={`tab-btn ${isLogin ? "tab-active" : "tab-inactive"}`}
                  onClick={() => switchMode("login")}
                >
                  Log in
                </button>
                <button
                  className={`tab-btn ${!isLogin ? "tab-active" : "tab-inactive"}`}
                  onClick={() => switchMode("signup")}
                >
                  Sign up
                </button>
              </div>

              {/* Form body */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Heading */}
                  <div style={{ marginBottom: "2px" }}>
                    <motion.h1
                      key={mode + "h"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#1A1917",
                        letterSpacing: "-0.5px",
                        marginBottom: "5px",
                      }}
                    >
                      {isLogin
                        ? "Good to see you again."
                        : "Create your account."}
                    </motion.h1>
                    <motion.p
                      key={mode + "p"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      style={{ fontSize: "13px", color: "#9B9488" }}
                    >
                      {isLogin
                        ? "Enter your credentials to continue."
                        : "Takes about 20 seconds."}
                    </motion.p>
                  </div>

                  {/* Username (signup) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <Field
                          label="Username"
                          id="username"
                          value={form.username}
                          onChange={set("username")}
                          error={errors.username}
                          placeholder="e.g. mattk"
                          autoComplete="username"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <Field
                      label="Password"
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      error={errors.password}
                      placeholder={
                        isLogin ? "Your password" : "Min 8 characters"
                      }
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                    />
                    {!isLogin && <PasswordStrength password={form.password} />}
                  </div>

                  {isLogin && (
                    <div style={{ textAlign: "right", marginTop: "-4px" }}>
                      <a href="#" className="forgot-link">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {!isLogin && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#A8A098",
                        lineHeight: "1.6",
                      }}
                    >
                      By signing up you agree to our{" "}
                      <a
                        href="#"
                        style={{
                          color: "#7A7268",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        style={{
                          color: "#7A7268",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                    whileHover={!loading ? { scale: 1.008 } : {}}
                    whileTap={!loading ? { scale: 0.985 } : {}}
                    style={{
                      background: loading ? "#8A6050" : "#C45A1A",
                      marginTop: "2px",
                    }}
                  >
                    {loading ? (
                      <>
                        <SpinnerIcon />
                        {isLogin ? "Signing in…" : "Creating account…"}
                      </>
                    ) : (
                      <>
                        {isLogin ? "Sign in" : "Create account"} <ArrowRight />
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div className="divider-line" />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#C0B8B0",
                        fontWeight: "600",
                      }}
                    >
                      or
                    </span>
                    <div className="divider-line" />
                  </div>

                  {/* Switch mode */}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#9B9488",
                      marginTop: "-4px",
                    }}
                  >
                    {isLogin ? "New to Threadit?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => switchMode(isLogin ? "signup" : "login")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#C45A1A",
                        padding: 0,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.75")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      {isLogin ? "Create account" : "Log in"}
                    </button>
                  </p>
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
