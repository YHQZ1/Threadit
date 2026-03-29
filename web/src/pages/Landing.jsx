/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

/* ─── DATA ─────────────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    title:
      "Why does every startup now have the exact same landing page aesthetic?",
    author: "mattk",
    time: "3h ago",
    votes: 847,
    comments: 214,
    tags: ["design", "tech"],
  },
  {
    id: 2,
    title: "The best album of 2024 that absolutely nobody talked about",
    author: "priya_s",
    time: "6h ago",
    votes: 512,
    comments: 89,
    tags: ["music"],
  },
  {
    id: 3,
    title:
      "Hot take: tabs are objectively better than spaces and I will not be taking questions",
    author: "arifh",
    time: "9h ago",
    votes: 301,
    comments: 403,
    tags: ["programming", "opinion"],
  },
];

const TICKER_ITEMS = [
  "Post a thread",
  "Vote the best",
  "Nested replies",
  "Real discussions",
  "No algorithm",
  "Just threads",
  "Search anything",
  "Your profile",
];

const FEATURES = [
  {
    label: "01",
    title: "Vote what matters",
    desc: "Upvote and downvote posts and comments. The best rises, the rest fades.",
  },
  {
    label: "02",
    title: "Nested threads",
    desc: "Fully nested replies — real conversations, not flat comment sections.",
  },
  {
    label: "03",
    title: "Your profile",
    desc: "Everything you've posted and voted on in one clean, permanent place.",
  },
  {
    label: "04",
    title: "Search everything",
    desc: "Find any post, thread, or user instantly. Nothing gets buried.",
  },
  {
    label: "05",
    title: "Post anything",
    desc: "Text, links, questions, rants. If it's worth saying, post it.",
  },
  {
    label: "06",
    title: "Sort: Hot, New, Top",
    desc: "Choose your view — trending, freshest, or all-time best.",
  },
];

const STATS = [
  ["12k+", "Active users"],
  ["48k+", "Threads posted"],
  ["200k+", "Votes cast"],
];

/* ─── ICONS ─────────────────────────────────────────────── */
const ArrowIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M2 12L12 2M12 2H5M12 2V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const UpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
  </svg>
);
const DownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
  </svg>
);
const CommentIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2 2h9v7H8l-2.5 2V9H2V2Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── ANIMATED COUNTER ───────────────────────────────────── */
function AnimatedCounter({ target }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const isPlus = target.includes("+");
    const num = parseInt(target.replace(/[^0-9]/g, ""), 10);
    const controls = animate(0, num, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        const rounded = Math.round(v);
        setDisplay(
          rounded >= 1000
            ? `${(rounded / 1000).toFixed(0)}k${isPlus ? "+" : ""}`
            : `${rounded}${isPlus ? "+" : ""}`,
        );
      },
    });
    return controls.stop;
  }, [inView, target]);

  return <span ref={ref}>{display}</span>;
}

/* ─── MAGNETIC BUTTON ────────────────────────────────────── */
function MagneticButton({ children, className, style, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ─── WORD SPLIT ANIMATION ───────────────────────────────── */
function SplitHeading({ text, highlight, className, style, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <h1 ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.25em",
          }}
        >
          <motion.span
            style={{
              display: "inline-block",
              color: highlight && word === highlight ? "#C45A1A" : "inherit",
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.07,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ─── POST CARD ──────────────────────────────────────────── */
function PostCard({ post, index }) {
  const [votes, setVotes] = useState(post.votes);
  const [voted, setVoted] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  const handleVote = (dir) => {
    if (voted === dir) {
      setVoted(null);
      setVotes(post.votes);
    } else {
      setVoted(dir);
      setVotes(post.votes + (dir === "up" ? 1 : -1));
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.09,
      }}
      className="post-card"
      style={{ display: "flex", borderBottom: "1px solid #E8E3DC" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "16px 14px",
          borderRight: "1px solid #E8E3DC",
          minWidth: "52px",
          background: "#FAF8F5",
        }}
      >
        <motion.button
          onClick={() => handleVote("up")}
          whileTap={{ scale: 1.4 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            color: voted === "up" ? "#C45A1A" : "#9B9488",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
        >
          <UpIcon />
        </motion.button>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: voted ? (voted === "up" ? "#C45A1A" : "#2C2B27") : "#4A4740",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.3px",
          }}
        >
          {votes}
        </span>
        <motion.button
          onClick={() => handleVote("down")}
          whileTap={{ scale: 1.4 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            color: voted === "down" ? "#2C2B27" : "#9B9488",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
        >
          <DownIcon />
        </motion.button>
      </div>
      <div style={{ flex: 1, padding: "16px 20px" }}>
        <div
          style={{ fontSize: "11px", color: "#9B9488", marginBottom: "6px" }}
        >
          u/{post.author} · {post.time}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#1A1917",
            lineHeight: "1.45",
            marginBottom: "10px",
          }}
        >
          {post.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "10px",
                fontWeight: "600",
                padding: "2px 8px",
                border: "1px solid #E2DDD6",
                borderRadius: "2px",
                color: "#7A7568",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "#9B9488",
            }}
          >
            <CommentIcon />
            {post.comments}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── FEATURE CARD ───────────────────────────────────────── */
function FeatureCard({ f, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.07,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#C45A1A",
          letterSpacing: "0.06em",
          marginBottom: "14px",
        }}
      >
        {f.label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "#1A1917",
          marginBottom: "8px",
          letterSpacing: "-0.3px",
        }}
      >
        {f.title}
      </div>
      <div style={{ fontSize: "13px", color: "#6B6760", lineHeight: "1.65" }}>
        {f.desc}
      </div>
    </motion.div>
  );
}

/* ─── CURSOR GLOW ────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
        width: 480,
        height: 480,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(196,90,26,0.07) 0%, transparent 70%)",
        translateX: "-50%",
        translateY: "-50%",
        x: sx,
        y: sy,
      }}
    />
  );
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <CursorGlow />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FDFAF6; color: #1A1917; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        .nav-link-item {
          font-size: 13px; color: #6B6760; padding: 6px 10px; border-radius: 4px;
          transition: color 0.15s, background 0.15s; cursor: pointer; border: none;
          background: none; font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .nav-link-item:hover { color: #1A1917; background: #F0EDE8; }

        .btn-primary {
          background: #C45A1A; color: #fff; border: none; padding: 8px 18px;
          font-size: 13px; font-weight: 700; border-radius: 3px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #A84C14; }

        .btn-secondary {
          background: transparent; color: #4A4740; border: 1px solid #D4CFC8;
          padding: 8px 18px; font-size: 13px; font-weight: 600; border-radius: 3px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-secondary:hover { border-color: #A89F95; color: #1A1917; background: #F5F2EE; }

        .feature-card {
          padding: 28px 26px; background: #FDFAF6;
          transition: background 0.2s; cursor: default;
        }
        .feature-card:hover { background: #F7F3EE; }

        .post-card { transition: background 0.15s; cursor: pointer; }
        .post-card:hover > div:last-child { background: #F9F6F2; }

        .ticker-track {
          display: flex; width: max-content;
          animation: ticker 20s linear infinite; will-change: transform;
        }
        .ticker-item {
          display: flex; align-items: center; white-space: nowrap;
          font-size: 11px; font-weight: 700; color: #7A7568;
          letter-spacing: 0.09em; text-transform: uppercase;
          padding: 0 24px; border-right: 1px solid #DDD8D0; height: 34px;
        }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(253,250,246,0.92)" : "#FDFAF6",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: "1px solid #E8E3DC",
          transition: "background 0.4s",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 32px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <img
              src="/logo.png"
              alt="Threadit"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "4px",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                fontSize: "17px",
                fontWeight: "800",
                color: "#1A1917",
                letterSpacing: "-0.5px",
              }}
            >
              Threadit
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {["Explore", "Popular", "New"].map((l) => (
              <button key={l} className="nav-link-item">
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="nav-link-item"
              onClick={() => navigate("/auth?mode=login")}
            >
              Log in
            </button>

            <MagneticButton
              className="btn-primary"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Sign up
            </MagneticButton>
          </div>
        </div>
      </motion.nav>

      {/* TICKER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          borderBottom: "1px solid #E8E3DC",
          overflow: "hidden",
          background: "#F5F1EB",
          height: "34px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
            (item, i) => (
              <div key={i} className="ticker-item">
                {item}
              </div>
            ),
          )}
        </div>
      </motion.div>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "80px 32px 72px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "56px",
          alignItems: "start",
          position: "relative",
        }}
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <SplitHeading
            text="Threads that actually matter"
            highlight="actually"
            style={{
              fontSize: "clamp(40px, 4.5vw, 56px)",
              fontWeight: "800",
              lineHeight: "1.06",
              letterSpacing: "-2px",
              color: "#1A1917",
              marginBottom: "22px",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "16px",
              color: "#6B6760",
              lineHeight: "1.7",
              marginBottom: "34px",
              maxWidth: "380px",
            }}
          >
            A lightweight place to post, discuss, and vote on things worth
            talking about. No algorithm. No noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: "10px" }}
          >
            <MagneticButton
              className="btn-primary"
              style={{ padding: "11px 24px", fontSize: "14px" }}
            >
              Get started
            </MagneticButton>
            <MagneticButton
              className="btn-secondary"
              style={{ padding: "11px 24px", fontSize: "14px" }}
            >
              Browse threads
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px solid #E8E3DC",
            }}
          >
            {STATS.map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#1A1917",
                    letterSpacing: "-0.8px",
                  }}
                >
                  <AnimatedCounter target={n} />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9B9488",
                    marginTop: "2px",
                  }}
                >
                  {l}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feed preview with parallax */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            perspective: "1000px",
            y: useTransform(scrollYProgress, [0, 1], [0, 40]),
          }}
        >
          <motion.div
            whileHover={{
              y: -6,
              boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 },
            }}
            style={{
              border: "1px solid #E2DDD6",
              borderRadius: "4px",
              overflow: "hidden",
              background: "#FDFAF6",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                background: "#F5F1EB",
                borderBottom: "1px solid #E8E3DC",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <motion.div
                  key={c}
                  whileHover={{ scale: 1.3 }}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: c,
                    cursor: "pointer",
                  }}
                />
              ))}
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "11px",
                  color: "#9B9488",
                }}
              >
                threadit.app
              </span>
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #E8E3DC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {["Hot", "New", "Top"].map((t, i) => (
                  <button
                    key={t}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      background: i === 0 ? "#1A1917" : "transparent",
                      color: i === 0 ? "#FDFAF6" : "#7A7568",
                      fontWeight: i === 0 ? "700" : "500",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ fontSize: "11px", padding: "5px 12px" }}
              >
                + New post
              </button>
            </div>
            {POSTS.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section
        style={{ maxWidth: "100%", margin: "0 auto", padding: "0 32px 80px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#9B9488",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              What you get
            </motion.div>
            <SplitHeading
              text="Everything a forum should be"
              style={{
                fontSize: "34px",
                fontWeight: "800",
                letterSpacing: "-1.2px",
                color: "#1A1917",
                lineHeight: "1.08",
              }}
              delay={0.05}
            />
          </div>
          <motion.button
            className="btn-secondary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "4px",
            }}
          >
            View all threads <ArrowIcon />
          </motion.button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "#E2DDD6",
            border: "1px solid #E2DDD6",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.label} f={f} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ maxWidth: "100%", margin: "0 auto", padding: "0 32px 80px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: "4px",
            padding: "64px 56px",
            background: "#1A1917",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Animated background grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#C45A1A",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Join today
            </motion.div>
            <SplitHeading
              text="Start a thread. Say something."
              style={{
                fontSize: "38px",
                fontWeight: "800",
                letterSpacing: "-1.2px",
                color: "#FAF7F2",
                lineHeight: "1.08",
                marginBottom: "14px",
              }}
              delay={0.1}
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: "15px",
                color: "#8A8479",
                lineHeight: "1.65",
                maxWidth: "360px",
              }}
            >
              Join Threadit and be part of conversations worth having.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minWidth: "190px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <MagneticButton
              className="btn-primary"
              style={{
                padding: "13px 28px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/auth?mode=signup")}
            >
              Create account <ArrowIcon />
            </MagneticButton>
            <motion.button
              whileHover={{ borderColor: "#6A6460", color: "#C8C0B8" }}
              style={{
                background: "transparent",
                border: "1px solid #3A3834",
                color: "#8A8479",
                padding: "13px 28px",
                fontSize: "14px",
                borderRadius: "3px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: "500",
                transition: "border-color 0.15s, color 0.15s",
              }}
            >
              Browse first
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ borderTop: "1px solid #E8E3DC", background: "#F5F1EB" }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/logo.png"
              alt="Threadit"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "3px",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#4A4740",
                letterSpacing: "-0.3px",
              }}
            >
              Threadit
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#9B9488" }}>
            A lightweight Reddit-style forum · MERN stack · 2025
          </span>
        </div>
      </motion.footer>
    </>
  );
}
