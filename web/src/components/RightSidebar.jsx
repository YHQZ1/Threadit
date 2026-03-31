import { TAGS_DATA } from "../data/tagsData";
import { USERS_DATA } from "../data/usersData";

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function RightSidebar({ 
  filterTag, 
  onTagFilter, 
  onNewPost, 
  onShowToast 
}) {
  return (
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
            onClick={onNewPost}
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
            onClick={() => onShowToast("All tags soon!")}
          >
            See all →
          </span>
        </div>
        {TAGS_DATA.map((t) => (
          <div
            key={t.name}
            onClick={() => onTagFilter(t.name)}
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
            onClick={() => onShowToast(`u/${u.name}'s profile`)}
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
    </aside>
  );
}