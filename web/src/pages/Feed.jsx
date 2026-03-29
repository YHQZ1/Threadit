/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

/* ─── SAMPLE DATA ────────────────────────────────────────── */
const POSTS_DATA = [
  {
    id: 1,
    title:
      "Why does every startup now have the exact same landing page aesthetic?",
    author: "mattk",
    time: "3h ago",
    votes: 847,
    comments: 214,
    tags: ["design", "tech"],
    award: "🔥 Hot",
    pinned: false,
  },
  {
    id: 2,
    title: "The best album of 2024 that absolutely nobody talked about",
    author: "priya_s",
    time: "6h ago",
    votes: 512,
    comments: 89,
    tags: ["music"],
    award: null,
    pinned: false,
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
    award: "💬 Debate",
    pinned: false,
  },
  {
    id: 4,
    title: "I built a full SaaS in a weekend — here's everything I learned",
    author: "zoe_d",
    time: "12h ago",
    votes: 1204,
    comments: 156,
    tags: ["tech", "startup"],
    award: "⭐ Top",
    pinned: true,
  },
  {
    id: 5,
    title: "The quiet death of RSS feeds and why it matters for the open web",
    author: "tomr",
    time: "1d ago",
    votes: 688,
    comments: 92,
    tags: ["tech", "opinion"],
    award: null,
    pinned: false,
  },
  {
    id: 6,
    title: "Stop calling everything a 'community' — it cheapens the word",
    author: "nadia_k",
    time: "1d ago",
    votes: 423,
    comments: 178,
    tags: ["opinion"],
    award: null,
    pinned: false,
  },
  {
    id: 7,
    title: "The real reason dark mode is genuinely hard to get right",
    author: "dev_hn",
    time: "2d ago",
    votes: 934,
    comments: 203,
    tags: ["design", "tech"],
    award: "🔥 Hot",
    pinned: false,
  },
  {
    id: 8,
    title: "Vinyl vs streaming — the numbers actually surprised me",
    author: "rec_head",
    time: "2d ago",
    votes: 291,
    comments: 67,
    tags: ["music"],
    award: null,
    pinned: false,
  },
  {
    id: 9,
    title: "What programming language should every developer learn in 2025?",
    author: "lea_codes",
    time: "3d ago",
    votes: 756,
    comments: 512,
    tags: ["programming", "opinion"],
    award: "💬 Debate",
    pinned: false,
  },
  {
    id: 10,
    title: "My city replaced parking spots with bike lanes — 6 months later",
    author: "citylover",
    time: "4d ago",
    votes: 445,
    comments: 289,
    tags: ["opinion"],
    award: null,
    pinned: false,
  },
];

const TAGS_DATA = [
  { name: "tech", count: 1204, pct: 100 },
  { name: "opinion", count: 892, pct: 74 },
  { name: "design", count: 634, pct: 53 },
  { name: "programming", count: 521, pct: 43 },
  { name: "music", count: 388, pct: 32 },
  { name: "startup", count: 201, pct: 17 },
];

const USERS_DATA = [
  { name: "zoe_d", posts: 47, karma: 8841, bg: "#E8D0B0", fg: "#7A4A1A" },
  { name: "dev_hn", posts: 39, karma: 7203, bg: "#C8D8E8", fg: "#1A4A6A" },
  { name: "mattk", posts: 31, karma: 5104, bg: "#D0E8D0", fg: "#1A5A2A" },
  { name: "priya_s", posts: 28, karma: 3892, bg: "#E8C8D8", fg: "#6A1A4A" },
  { name: "tomr", posts: 22, karma: 2915, bg: "#E8E8C8", fg: "#5A5A1A" },
];

const ALL_TAGS = [
  "tech",
  "design",
  "music",
  "programming",
  "opinion",
  "startup",
  "other",
];

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

/* ─── ICONS ──────────────────────────────────────────────── */
const UpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
    <path d="M5.5 1.5L9.5 7H1.5L5.5 1.5Z" />
  </svg>
);
const DownIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
    <path d="M5.5 9.5L1.5 4H9.5L5.5 9.5Z" />
  </svg>
);
const CommentIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2 2.5H11V9H8.5L6.5 11.5V9H2V2.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);
const ShareIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="10" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="10" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M4.4 5.8L8.6 3.7M4.4 7.2L8.6 9.3"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);
const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M2.5 2.5H10.5V12L6.5 9.5L2.5 12V2.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M9.5 9.5L12.5 12.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const HotIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M7 1.5C7 5 4 5.5 4 8C4 9.7 5.3 11 7 11"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M9.5 5.5C9.5 8.5 7.5 9.5 7.5 11C7.5 11.8 8.3 12.5 9.5 12.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const NewIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M6.5 3.5V6.5L8.5 8.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const TopIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M6.5 1.5L8 4.5H5L6.5 1.5Z" fill="currentColor" />
    <path
      d="M2 7.5H11M3 10.5H10"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const RisingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M1.5 10L4.5 6L7 8.5L10.5 3.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 3.5H10.5V5.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path
      d="M5.5 1L7 4H10L7.5 6L8.5 9.5L5.5 7.5L2.5 9.5L3.5 6L1 4H4L5.5 1Z"
      fill="#C45A1A"
      fillOpacity=".7"
    />
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 3L11 11M11 3L3 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── TOAST ──────────────────────────────────────────────── */
function Toast({ msg, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        background: "#1A1917",
        color: "#FAF7F2",
        padding: "10px 22px",
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        opacity: visible ? 1 : 0,
        transition: "opacity .25s, transform .25s",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 300,
        border: "1px solid #3A3834",
        letterSpacing: "-.1px",
      }}
    >
      {msg}
    </div>
  );
}

/* ─── NEW POST MODAL ─────────────────────────────────────── */
function NewPostModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => titleRef.current?.focus(), 80);
  }, [open]);

  const toggleTag = (t) =>
    setSelectedTags((prev) =>
      prev.includes(t)
        ? prev.filter((x) => x !== t)
        : prev.length < 3
          ? [...prev, t]
          : prev,
    );

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      body,
      tags: selectedTags.length ? selectedTags : ["other"],
    });
    setTitle("");
    setBody("");
    setSelectedTags([]);
  };

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,9,8,.65)",
        zIndex: 200,
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#FDFAF6",
          border: "1px solid #E2DDD6",
          borderRadius: 6,
          width: 580,
          maxWidth: "95vw",
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,.18)",
          animation: "modalIn .28s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#C45A1A,#E8903A,#C45A1A)",
            backgroundSize: "200% 100%",
          }}
        />
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E8E3DC",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#1A1917",
              letterSpacing: "-.3px",
            }}
          >
            Create a thread
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9B9488",
              display: "flex",
              padding: 3,
              borderRadius: 3,
              transition: "color .12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1917")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9B9488")}
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Title — be specific, be interesting"
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #DDD8D0",
              borderRadius: 3,
              padding: "11px 14px",
              fontSize: 15,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
              color: "#1A1917",
              outline: "none",
              marginBottom: 12,
              transition: "border-color .14s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1A1917")}
            onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts, a link, a question… (optional)"
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #DDD8D0",
              borderRadius: 3,
              padding: "11px 14px",
              fontSize: 13,
              fontFamily: "'DM Sans',sans-serif",
              color: "#1A1917",
              outline: "none",
              resize: "vertical",
              minHeight: 100,
              marginBottom: 14,
              transition: "border-color .14s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1A1917")}
            onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
          />
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9B9488",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                paddingTop: 3,
              }}
            >
              Tag:
            </span>
            {ALL_TAGS.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    border: `1px solid ${active ? "#C45A1A" : "#DDD8D0"}`,
                    borderRadius: 2,
                    background: active ? "rgba(196,90,26,.08)" : "transparent",
                    color: active ? "#C45A1A" : "#7A7568",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    letterSpacing: ".02em",
                    transition: "all .14s",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                color: "#4A4740",
                border: "1px solid #DDD8D0",
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 3,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                transition: "all .14s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F5F2EE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              style={{
                background: title.trim() ? "#C45A1A" : "#D4C4BC",
                color: "#fff",
                border: "none",
                padding: "9px 22px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 3,
                cursor: title.trim() ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background .14s",
              }}
              onMouseEnter={(e) => {
                if (title.trim()) e.currentTarget.style.background = "#A84C14";
              }}
              onMouseLeave={(e) => {
                if (title.trim()) e.currentTarget.style.background = "#C45A1A";
              }}
            >
              Post thread <span style={{ opacity: 0.7, fontSize: 14 }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── POST CARD ──────────────────────────────────────────── */
function PostCard({ post, index, onToast, onTagFilter }) {
  const [voteState, setVoteState] = useState(null);
  const [voteCount, setVoteCount] = useState(post.votes);
  const [saved, setSaved] = useState(false);
  const [pulse, setPulse] = useState(null);

  const vote = (dir, e) => {
    e.stopPropagation();
    setPulse(dir);
    setTimeout(() => setPulse(null), 200);
    if (voteState === dir) {
      setVoteState(null);
      setVoteCount(post.votes);
    } else {
      setVoteState(dir);
      setVoteCount(post.votes + (dir === "up" ? 1 : -1));
    }
  };

  const voteColor =
    voteState === "up"
      ? "#C45A1A"
      : voteState === "down"
        ? "#2C2B27"
        : "#9B9488";

  return (
    <article
      onClick={() => onToast(`Opening thread by u/${post.author}…`)}
      style={{
        display: "flex",
        borderBottom: "1px solid #EAE6E0",
        background: post.pinned ? "rgba(196,90,26,.025)" : "#FDFAF6",
        cursor: "pointer",
        transition: "background .12s",
        animation: `postIn .4s cubic-bezier(.16,1,.3,1) ${index * 0.055}s both`,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = post.pinned
          ? "rgba(196,90,26,.05)"
          : "#F8F5F1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = post.pinned
          ? "rgba(196,90,26,.025)"
          : "#FDFAF6";
      }}
    >
      {/* Pinned accent */}
      {post.pinned && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg,#C45A1A,transparent)",
          }}
        />
      )}

      {/* Vote column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: "18px 10px",
          borderRight: "1px solid #EAE6E0",
          minWidth: 44,
          background: "rgba(250,248,245,.6)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={(e) => vote("up", e)}
          style={{
            background: voteState === "up" ? "rgba(196,90,26,.1)" : "none",
            border: "none",
            cursor: "pointer",
            padding: "5px 6px",
            borderRadius: 4,
            color: voteState === "up" ? "#C45A1A" : "#B8B0A6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: pulse === "up" ? "scale(1.5)" : "scale(1)",
            transition: "color .12s, background .12s, transform .15s",
          }}
        >
          <UpIcon />
        </button>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: voteColor,
            letterSpacing: "-.4px",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            transition: "color .15s",
            minWidth: 24,
            textAlign: "center",
          }}
        >
          {fmt(voteCount)}
        </span>
        <button
          onClick={(e) => vote("down", e)}
          style={{
            background: voteState === "down" ? "rgba(0,0,0,.06)" : "none",
            border: "none",
            cursor: "pointer",
            padding: "5px 6px",
            borderRadius: 4,
            color: voteState === "down" ? "#2C2B27" : "#B8B0A6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: pulse === "down" ? "scale(1.5)" : "scale(1)",
            transition: "color .12s, background .12s, transform .15s",
          }}
        >
          <DownIcon />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "16px 20px", minWidth: 0 }}>
        {/* Meta row */}
        <div
          style={{
            fontSize: 11,
            color: "#9B9488",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {post.pinned && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10,
                fontWeight: 700,
                color: "#C45A1A",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              <PinIcon /> Pinned
            </span>
          )}
          <span
            style={{ fontWeight: 700, color: "#5A5450", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onToast(`u/${post.author}'s profile`);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C45A1A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5450")}
          >
            u/{post.author}
          </span>
          <span style={{ color: "#C8C0B6" }}>·</span>
          <span>{post.time}</span>

          {/* Tags */}
          {post.tags.map((t) => (
            <button
              key={t}
              onClick={(e) => {
                e.stopPropagation();
                onTagFilter(t);
              }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                border: "1px solid #E2DDD6",
                borderRadius: 2,
                color: "#7A7568",
                letterSpacing: ".05em",
                textTransform: "uppercase",
                background: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                transition: "border-color .12s, color .12s, background .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C45A1A";
                e.currentTarget.style.color = "#C45A1A";
                e.currentTarget.style.background = "rgba(196,90,26,.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2DDD6";
                e.currentTarget.style.color = "#7A7568";
                e.currentTarget.style.background = "none";
              }}
            >
              {t}
            </button>
          ))}

          {post.award && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 2,
                background: "rgba(196,90,26,.08)",
                color: "#C45A1A",
                letterSpacing: ".04em",
              }}
            >
              {post.award}
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1A1917",
            lineHeight: 1.42,
            marginBottom: 12,
            letterSpacing: "-.25px",
          }}
        >
          {post.title}
        </h2>

        {/* Action bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[
            {
              icon: <CommentIcon />,
              label: `${post.comments} comments`,
              action: () => onToast(`Opening ${post.comments} comments…`),
            },
            {
              icon: <ShareIcon />,
              label: "Share",
              action: () => onToast("Link copied!"),
            },
            {
              icon: <SaveIcon />,
              label: saved ? "Saved" : "Save",
              action: (e) => {
                e.stopPropagation();
                setSaved((s) => !s);
                onToast(saved ? "Removed from saved" : "Saved!");
              },
              active: saved,
            },
          ].map(({ icon, label, action, active }) => (
            <button
              key={label}
              onClick={(e) => {
                e.stopPropagation();
                action(e);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: active ? "#C45A1A" : "#9B9488",
                padding: "5px 9px",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color .12s, background .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1A1917";
                e.currentTarget.style.background = "#EFEBe6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = active ? "#C45A1A" : "#9B9488";
                e.currentTarget.style.background = "none";
              }}
            >
              {icon}
              {label}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToast("Reported");
            }}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#C8C0B6",
              padding: "5px 6px",
              borderRadius: 3,
              fontSize: 16,
              lineHeight: 1,
              transition: "color .12s, background .12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#9B9488";
              e.currentTarget.style.background = "#EFEBe6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#C8C0B6";
              e.currentTarget.style.background = "none";
            }}
          >
            ···
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── FEED PAGE ──────────────────────────────────────────── */
export default function Feed() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const [posts, setPosts] = useState(POSTS_DATA);
  const [sort, setSort] = useState("hot");
  const [filterTag, setFilterTag] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2400,
    );
  };

  const handleTagFilter = (tag) => {
    setFilterTag(tag);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDisplayPosts = () => {
    let list = [...posts];
    if (filterTag !== "all")
      list = list.filter((p) => p.tags.includes(filterTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }
    // Always show pinned first within sort
    const pinned = list.filter((p) => p.pinned);
    let rest = list.filter((p) => !p.pinned);
    if (sort === "new") rest.sort((a, b) => a.id - b.id);
    else if (sort === "top") rest.sort((a, b) => b.votes - a.votes);
    else if (sort === "rising") rest.sort((a, b) => b.comments - a.comments);
    return [...pinned, ...rest];
  };

  const handleNewPost = ({ title, body, tags }) => {
    const newPost = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      title,
      author: user?.username || "you",
      time: "just now",
      votes: 1,
      comments: 0,
      tags,
      award: null,
      pinned: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setModalOpen(false);
    showToast("Thread posted! 🎉");
  };

  const displayPosts = getDisplayPosts();
  const SORT_OPTS = [
    { key: "hot", icon: <HotIcon />, label: "Hot" },
    { key: "new", icon: <NewIcon />, label: "New" },
    { key: "top", icon: <TopIcon />, label: "Top" },
    { key: "rising", icon: <RisingIcon />, label: "Rising" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-family: 'DM Sans', sans-serif; background: #FDFAF6; color: #1A1917; -webkit-font-smoothing: antialiased; }
        body { background: #FDFAF6; }
        input, textarea, button { font-family: 'DM Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: #B8B0A6; }

        @keyframes postIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navIn {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #DDD8D0; border-radius: 3px; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 52,
          background: scrolled ? "rgba(253,250,246,.94)" : "#FDFAF6",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#DDD8D0" : "#E8E3DC"}`,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 16,
          transition: "background .35s, border-color .35s, box-shadow .35s",
          boxShadow: scrolled ? "0 1px 0 #E8E3DC" : "none",
          animation: "navIn .5s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="Threadit"
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1A1917",
              letterSpacing: "-.5px",
            }}
          >
            Threadit
          </span>
        </a>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 440, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9B9488",
              pointerEvents: "none",
              display: "flex",
            }}
          >
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads, users, tags…"
            style={{
              width: "100%",
              background: "#F0EDE8",
              border: "1px solid #DDD8D0",
              borderRadius: 3,
              padding: "7px 12px 7px 34px",
              fontSize: 13,
              color: "#1A1917",
              outline: "none",
              transition: "border-color .14s, background .14s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1A1917";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#DDD8D0";
              e.target.style.background = "#F0EDE8";
            }}
          />
        </div>

        {/* Right: user info */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px 5px 6px",
                border: "1px solid #E2DDD6",
                borderRadius: 4,
                cursor: "pointer",
                background: "transparent",
                transition: "background .14s, border-color .14s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F5F2EE";
                e.currentTarget.style.borderColor = "#CCC8C0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "#E2DDD6";
              }}
              onClick={() => showToast(`u/${user.username}'s profile`)}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(196,90,26,.12)",
                  border: "1.5px solid rgba(196,90,26,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#C45A1A",
                }}
              >
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1A1917",
                    lineHeight: 1.2,
                  }}
                >
                  u/{user.username}
                </div>
                <div style={{ fontSize: 10, color: "#9B9488" }}>
                  {user.karma ? `${fmt(user.karma)} karma` : "Member"}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/auth?mode=login");
            }}
            style={{
              background: "transparent",
              color: "#7A7568",
              border: "1px solid #E2DDD6",
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 3,
              cursor: "pointer",
              transition: "all .14s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C45A1A";
              e.currentTarget.style.color = "#C45A1A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2DDD6";
              e.currentTarget.style.color = "#7A7568";
            }}
          >
            Log out
          </button>
        </div>
      </nav>

      {/* ─── BODY: sidebar + content ─── */}
      <div style={{ display: "flex", maxWidth: "100%" }}>
        {/* Sidebar */}
        <Sidebar user={user} onNewPost={() => setModalOpen(true)} />

        {/* Feed + right panel */}
        <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
          {/* CENTER FEED */}
          <div
            style={{
              flex: 1,
              borderRight: "1px solid #E8E3DC",
              minHeight: "calc(100vh - 52px)",
              minWidth: 0,
            }}
          >
            {/* Sort + filter bar */}
            <div
              style={{
                borderBottom: "1px solid #E8E3DC",
                padding: "0 32px",
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "#FDFAF6",
                position: "sticky",
                top: 52,
                zIndex: 40,
              }}
            >
              {SORT_OPTS.map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "11px 12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: sort === key ? 800 : 600,
                    color: sort === key ? "#1A1917" : "#9B9488",
                    borderBottom:
                      sort === key
                        ? "2px solid #C45A1A"
                        : "2px solid transparent",
                    marginBottom: -1,
                    transition: "color .14s, border-color .14s",
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {["all", "tech", "design", "music", "opinion"].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleTagFilter(f)}
                    style={{
                      padding: "6px 9px",
                      border: "none",
                      background:
                        filterTag === f ? "rgba(196,90,26,.08)" : "none",
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      color: filterTag === f ? "#C45A1A" : "#9B9488",
                      transition: "color .14s, background .14s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick compose bar */}
            <div
              onClick={() => setModalOpen(true)}
              style={{
                margin: "16px 32px 0",
                background: "#fff",
                border: "1px solid #E8E3DC",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                cursor: "pointer",
                transition: "border-color .14s, box-shadow .14s",
                animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) .1s both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#B8B0A6";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E8E3DC";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* User avatar mini */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(196,90,26,.1)",
                  border: "1.5px solid rgba(196,90,26,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#C45A1A",
                  flexShrink: 0,
                }}
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#F5F2EE",
                  border: "1px solid #E2DDD6",
                  borderRadius: 3,
                  padding: "8px 14px",
                  fontSize: 13,
                  color: "#B8B0A6",
                  pointerEvents: "none",
                }}
              >
                What's on your mind? Start a thread…
              </div>
            </div>

            {/* Divider label */}
            <div
              style={{
                padding: "14px 32px 0",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#EAE6E0" }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#B8B0A6",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {filterTag === "all" ? "All threads" : `#${filterTag}`}
                {search && ` · "${search}"`}
              </span>
              <div style={{ flex: 1, height: 1, background: "#EAE6E0" }} />
            </div>

            {/* Post list */}
            <div style={{ marginTop: 6 }}>
              {displayPosts.length > 0 ? (
                displayPosts.map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={i}
                    onToast={showToast}
                    onTagFilter={handleTagFilter}
                  />
                ))
              ) : (
                <div
                  style={{
                    padding: "56px 32px",
                    textAlign: "center",
                    color: "#9B9488",
                    fontSize: 14,
                  }}
                >
                  No threads match.{" "}
                  <span
                    style={{
                      color: "#C45A1A",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                    onClick={() => {
                      setSearch("");
                      setFilterTag("all");
                    }}
                  >
                    Clear filters
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "24px 32px",
                textAlign: "center",
                fontSize: 11,
                color: "#9B9488",
                borderTop: "1px solid #E8E3DC",
              }}
            >
              Showing top threads ·{" "}
              <span
                style={{ color: "#C45A1A", cursor: "pointer", fontWeight: 700 }}
                onClick={() => showToast("Loading more…")}
              >
                Load more
              </span>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside
            style={{
              width: 288,
              minWidth: 288,
              padding: "20px 0 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* About card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2DDD6",
                borderRadius: 4,
                overflow: "hidden",
                animation: "fadeUp .5s ease .3s both",
              }}
            >
              <div
                style={{
                  background: "#1A1917",
                  padding: "14px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Grid bg */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.05,
                    backgroundImage:
                      "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                    backgroundSize: "20px 20px",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#C45A1A",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Forum
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#FAF7F2",
                      letterSpacing: "-.4px",
                    }}
                  >
                    Threadit
                  </div>
                  <div style={{ fontSize: 12, color: "#6A6460", marginTop: 2 }}>
                    The forum worth reading
                  </div>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#4A4740",
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}
                >
                  Post threads, cast votes, have real conversations. No
                  algorithm. No noise. Just the best rising to the top.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    width: "100%",
                    background: "#C45A1A",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "background .14s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#A84C14")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#C45A1A")
                  }
                >
                  + Create a thread
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  borderTop: "1px solid #E8E3DC",
                }}
              >
                {[
                  ["12k+", "Members"],
                  ["48k+", "Threads"],
                  ["201k+", "Votes"],
                ].map(([n, l], i) => (
                  <div
                    key={l}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      textAlign: "center",
                      borderRight: i < 2 ? "1px solid #E8E3DC" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#1A1917",
                        letterSpacing: "-.6px",
                      }}
                    >
                      {n}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#9B9488", marginTop: 2 }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2DDD6",
                borderRadius: 4,
                overflow: "hidden",
                animation: "fadeUp .5s ease .4s both",
              }}
            >
              <div
                style={{
                  padding: "11px 16px",
                  borderBottom: "1px solid #E8E3DC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#1A1917",
                    letterSpacing: "-.1px",
                    textTransform: "uppercase",
                    
                  }}
                >
                  Trending tags
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#C45A1A",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                  onClick={() => showToast("All tags soon!")}
                >
                  See all →
                </span>
              </div>
              {TAGS_DATA.map((t) => (
                <div
                  key={t.name}
                  onClick={() => handleTagFilter(t.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    borderBottom: "1px solid #F0EDE8",
                    cursor: "pointer",
                    transition: "background .12s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F8F5F1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1A1917",
                        marginBottom: 5,
                      }}
                    >
                      #{t.name}
                    </div>
                    <div
                      style={{
                        height: 2.5,
                        background: "#EAE6E0",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${t.pct}%`,
                          background:
                            filterTag === t.name
                              ? "#C45A1A"
                              : "linear-gradient(90deg,#C45A1A,#E8903A)",
                          borderRadius: 2,
                          transition: "width .4s cubic-bezier(.16,1,.3,1)",
                        }}
                      />
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9B9488",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {fmt(t.count)}
                  </span>
                </div>
              ))}
            </div>

            {/* Top contributors */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2DDD6",
                borderRadius: 4,
                overflow: "hidden",
                animation: "fadeUp .5s ease .5s both",
              }}
            >
              <div
                style={{
                  padding: "11px 16px",
                  borderBottom: "1px solid #E8E3DC",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#1A1917",
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                  }}
                >
                  Top contributors
                </span>
              </div>
              {USERS_DATA.map((u, i) => (
                <div
                  key={u.name}
                  onClick={() => showToast(`u/${u.name}'s profile`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px",
                    borderBottom:
                      i < USERS_DATA.length - 1 ? "1px solid #F0EDE8" : "none",
                    cursor: "pointer",
                    transition: "background .12s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F8F5F1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#C8C0B6",
                      width: 14,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: u.bg,
                      color: u.fg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {u.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1A1917",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      u/{u.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#9B9488" }}>
                      {u.posts} posts
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#C45A1A",
                      flexShrink: 0,
                    }}
                  >
                    ▲ {fmt(u.karma)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: 10,
                color: "#9B9488",
                lineHeight: 1.9,
                animation: "fadeUp .5s ease .6s both",
              }}
            >
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px" }}
              >
                {["Help", "Privacy", "Terms", "About"].map((l) => (
                  <span
                    key={l}
                    style={{ cursor: "pointer", transition: "color .12s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C45A1A")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9B9488")
                    }
                    onClick={() => showToast(`${l} page coming soon`)}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 6 }}>Threadit · MERN stack · 2025</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      <NewPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />

      {/* Toast */}
      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
