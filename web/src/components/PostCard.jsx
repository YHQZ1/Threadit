import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UpIcon,
  DownIcon,
  CommentIcon,
  ShareIcon,
  SaveIcon,
} from "../icons/icons";

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function PostCard({ post, index, onToast, onTagFilter }) {
  const [voteState, setVoteState] = useState(null);
  const [voteCount, setVoteCount] = useState(post.votes);
  const [saved, setSaved] = useState(false);
  const [justShared, setJustShared] = useState(false);

  const vote = (dir, e) => {
    e.stopPropagation();
    if (voteState === dir) {
      setVoteState(null);
      setVoteCount(post.votes);
    } else {
      setVoteState(dir);
      setVoteCount(post.votes + (dir === "up" ? 1 : -1));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/post/${post.id}`);
    setJustShared(true);
    setTimeout(() => setJustShared(false), 2000);
    onToast("Link copied!");
  };

  const voteColor =
    voteState === "up"
      ? "#C45A1A"
      : voteState === "down"
        ? "#2C2B27"
        : "#9B9488";

  return (
    <article
      className="post-card"
      style={{
        background: "#FDFAF6",
        borderBottom: "1px solid #EAE6E0",
        padding: "16px 20px",
        transition: "background .2s ease",
        cursor: "pointer",
        animation: `postIn .4s cubic-bezier(.16,1,.3,1) ${index * 0.055}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F8F5F1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#FDFAF6";
      }}
    >
      {/* Header - Author info */}
      <div className="post-header" style={{ marginBottom: 8 }}>
        <Link
          to={`/user/${post.author}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#5A5450",
            textDecoration: "none",
            transition: "color .12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C45A1A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5450")}
        >
          u/{post.author}
        </Link>
        <span style={{ color: "#C8C0B6", margin: "0 6px" }}>·</span>
        <span style={{ fontSize: 12, color: "#9B9488" }}>{post.time}</span>
        
        {/* Award badge */}
        {post.award && (
          <>
            <span style={{ color: "#C8C0B6", margin: "0 6px" }}>·</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#C45A1A",
                background: "rgba(196,90,26,.08)",
                padding: "2px 6px",
                borderRadius: 2,
              }}
            >
              {post.award}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <Link
        to={`/post/${post.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{ textDecoration: "none" }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1A1917",
            lineHeight: 1.4,
            marginBottom: 12,
            letterSpacing: "-.2px",
            transition: "color .12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C45A1A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1917")}
        >
          {post.title}
        </h2>
      </Link>

      {/* Tags - only if they exist */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {post.tags.map((t) => (
            <button
              key={t}
              onClick={(e) => {
                e.stopPropagation();
                onTagFilter(t);
              }}
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                border: "1px solid #E2DDD6",
                borderRadius: 3,
                color: "#7A7568",
                background: "none",
                cursor: "pointer",
                transition: "all .12s",
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
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Vote buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={(e) => vote("up", e)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
              borderRadius: 4,
              color: voteState === "up" ? "#C45A1A" : "#B8B0A6",
              display: "flex",
              alignItems: "center",
              transition: "color .12s",
            }}
          >
            <UpIcon />
          </button>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: voteColor,
              minWidth: 28,
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmt(voteCount)}
          </span>
          <button
            onClick={(e) => vote("down", e)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
              borderRadius: 4,
              color: voteState === "down" ? "#2C2B27" : "#B8B0A6",
              display: "flex",
              alignItems: "center",
              transition: "color .12s",
            }}
          >
            <DownIcon />
          </button>
        </div>

        {/* Comments button */}
        <Link
          to={`/post/${post.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            color: "#9B9488",
            textDecoration: "none",
            transition: "all .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1A1917";
            e.currentTarget.style.background = "#EFEBe6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9B9488";
            e.currentTarget.style.background = "none";
          }}
        >
          <CommentIcon />
          <span>{fmt(post.comments)} comments</span>
        </Link>

        {/* Share button */}
        <button
          onClick={handleShare}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            color: justShared ? "#C45A1A" : "#9B9488",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "all .12s",
          }}
          onMouseEnter={(e) => {
            if (!justShared) {
              e.currentTarget.style.color = "#1A1917";
              e.currentTarget.style.background = "#EFEBe6";
            }
          }}
          onMouseLeave={(e) => {
            if (!justShared) {
              e.currentTarget.style.color = "#9B9488";
              e.currentTarget.style.background = "none";
            }
          }}
        >
          <ShareIcon />
          <span>{justShared ? "Copied!" : "Share"}</span>
        </button>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
            onToast(saved ? "Removed from saved" : "Saved!");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            color: saved ? "#C45A1A" : "#9B9488",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "all .12s",
          }}
          onMouseEnter={(e) => {
            if (!saved) {
              e.currentTarget.style.color = "#1A1917";
              e.currentTarget.style.background = "#EFEBe6";
            }
          }}
          onMouseLeave={(e) => {
            if (!saved) {
              e.currentTarget.style.color = "#9B9488";
              e.currentTarget.style.background = "none";
            }
          }}
        >
          <SaveIcon />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </article>
  );
}