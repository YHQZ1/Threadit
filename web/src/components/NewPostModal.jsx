import { useState, useEffect, useRef } from "react";
import { CloseIcon } from "../icons/icons";
import { ALL_TAGS } from "../data/tagsData";

export default function NewPostModal({ open, onClose, onSubmit }) {
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