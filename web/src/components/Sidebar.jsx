import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── NAV DATA ──────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: HomeIcon, label: "Home", path: "/feed" },
      { icon: PopularIcon, label: "Popular", path: "/popular" },
      { icon: ExploreIcon, label: "Explore", path: "/explore" },
      { icon: AllIcon, label: "All", path: "/all" },
    ],
  },
  {
    label: "Topics",
    items: [
      {
        icon: TechIcon,
        label: "Technology",
        path: "/t/technology",
        count: "1.2k",
      },
      { icon: MusicIcon, label: "Music", path: "/t/music", count: "891" },
      { icon: DesignIcon, label: "Design", path: "/t/design", count: "634" },
      {
        icon: CodeIcon,
        label: "Programming",
        path: "/t/programming",
        count: "521",
      },
      {
        icon: OpinionIcon,
        label: "Opinions",
        path: "/t/opinion",
        count: "445",
      },
      {
        icon: StartupIcon,
        label: "Startups",
        path: "/t/startup",
        count: "201",
      },
    ],
  },
  {
    label: "Your stuff",
    items: [
      { icon: ProfileIcon, label: "Profile", path: "/profile" },
      { icon: SavedIcon, label: "Saved", path: "/saved" },
      { icon: HistoryIcon, label: "History", path: "/history" },
      { icon: SettingsIcon, label: "Settings", path: "/settings" },
    ],
  },
];

/* ─── SVG ICONS ─────────────────────────────────────────── */
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 6.5L8 2L14 6.5V14H10V10H6V14H2V6.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PopularIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2C8 5.5 5 6 5 9A3 3 0 0 0 11 9C11 6 8 5.5 8 2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.5C10 12.9 9.1 14 8 14C6.9 14 6 12.9 6 11.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ExploreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10.5 5.5L9 9L5.5 10.5L7 7L10.5 5.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AllIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="5"
        height="5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="2"
        width="5"
        height="5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="2"
        y="9"
        width="5"
        height="5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="9"
        width="5"
        height="5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function TechIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="3"
        width="12"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 14H11M8 11V14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M5 6.5L7 8L5 9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5H11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MusicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 12V4L13 3V11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="4.5"
        cy="12"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="11.5"
        cy="11"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function DesignIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 2V4M8 12V14M2 8H4M12 8H14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M3.8 3.8L5.2 5.2M10.8 10.8L12.2 12.2M3.8 12.2L5.2 10.8M10.8 5.2L12.2 3.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5 5L2 8L5 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5L14 8L11 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 3.5L6.5 12.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function OpinionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3H13V10H9L7 13V10H3V3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function StartupIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2C10 2 13 4 13 7C13 9.5 11.5 11 11.5 11H4.5C4.5 11 3 9.5 3 7C3 4 6 2 8 2Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M6 11V12.5C6 13.3 6.9 14 8 14C9.1 14 10 13.3 10 12.5V11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3 14C3 11.2 5.2 9 8 9C10.8 9 13 11.2 13 14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SavedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3H13V14L8 11L3 14V3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8A5 5 0 1 0 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M3 4V8H7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.5V8L9.5 9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 2V3.5M8 12.5V14M2 8H3.5M12.5 8H14M3.6 3.6L4.7 4.7M11.3 11.3L12.4 12.4M3.6 12.4L4.7 11.3M11.3 4.7L12.4 3.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevronIcon({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transition: "transform .25s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7H7M7 7L4.5 4.5M7 7L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3V11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function NewPostIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 3V11M3 7H11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── NAV ITEM ───────────────────────────────────────────── */
function NavItem({ item, collapsed, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  const isActive = active;

  return (
    <button
      onClick={() => onClick(item.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: collapsed ? "9px 0" : "9px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        border: "none",
        background: isActive
          ? "rgba(196,90,26,0.09)"
          : hovered
            ? "#F0EDE8"
            : "transparent",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .14s",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            height: "60%",
            width: 2.5,
            background: "#C45A1A",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      <span
        style={{
          color: isActive ? "#C45A1A" : hovered ? "#1A1917" : "#6B6760",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "color .14s",
        }}
      >
        <Icon />
      </span>
      {!collapsed && (
        <>
          <span
            style={{
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#1A1917" : hovered ? "#1A1917" : "#4A4740",
              letterSpacing: "-.1px",
              flex: 1,
              textAlign: "left",
              transition: "color .14s",
            }}
          >
            {item.label}
          </span>
          {item.count && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9B9488",
                letterSpacing: ".02em",
              }}
            >
              {item.count}
            </span>
          )}
        </>
      )}
    </button>
  );
}

/* ─── SECTION ────────────────────────────────────────────── */
function SidebarSection({ section, collapsed, activePath, onNavigate }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: collapsed ? 0 : 6 }}>
      {section.label && !collapsed && (
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "6px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#9B9488",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            {section.label}
          </span>
          <ChevronIcon open={open} />
        </button>
      )}
      {(open || collapsed) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {section.items.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              active={activePath === item.path}
              onClick={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN SIDEBAR ───────────────────────────────────────── */
export default function Sidebar({ user, onNewPost }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveringCollapse, setHoveringCollapse] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const SIDEBAR_W = collapsed ? 56 : 220;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <aside
      style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        background: "#FDFAF6",
        borderRight: "1px solid #E8E3DC",
        height: "calc(100vh - 52px)",
        position: "sticky",
        top: 52,
        display: "flex",
        flexDirection: "column",
        transition:
          "width .25s cubic-bezier(.16,1,.3,1), min-width .25s cubic-bezier(.16,1,.3,1)",
        overflow: "hidden",
        flexShrink: 0,
        zIndex: 30,
      }}
    >
      {/* Collapse toggle */}
      <div
        style={{
          padding: collapsed ? "12px 0" : "12px 10px",
          borderBottom: "1px solid #E8E3DC",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-end",
        }}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          onMouseEnter={() => setHoveringCollapse(true)}
          onMouseLeave={() => setHoveringCollapse(false)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: hoveringCollapse ? "#F0EDE8" : "transparent",
            border: "1px solid",
            borderColor: hoveringCollapse ? "#DDD8D0" : "transparent",
            borderRadius: 4,
            cursor: "pointer",
            padding: "5px 7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9B9488",
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition:
              "background .14s, border-color .14s, transform .25s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <CollapseIcon />
        </button>
      </div>

      {/* New Post button */}
      <div
        style={{
          padding: collapsed ? "10px 8px" : "10px 12px",
          borderBottom: "1px solid #E8E3DC",
        }}
      >
        <button
          onClick={onNewPost}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            padding: collapsed ? "9px 0" : "9px 12px",
            background: "#C45A1A",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: ".01em",
            transition: "background .14s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#A84C14")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C45A1A")}
        >
          <NewPostIcon />
          {!collapsed && "New post"}
        </button>
      </div>

      {/* Nav sections — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "10px 8px" : "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {NAV_SECTIONS.map((section, i) => (
          <div key={i}>
            {i > 0 && !collapsed && (
              <div
                style={{
                  height: 1,
                  background: "#E8E3DC",
                  margin: "8px 4px",
                }}
              />
            )}
            <SidebarSection
              section={section}
              collapsed={collapsed}
              activePath={activePath}
              onNavigate={handleNavigate}
            />
          </div>
        ))}
      </div>

      {/* User footer */}
      {user && (
        <div
          style={{
            borderTop: "1px solid #E8E3DC",
            padding: collapsed ? "10px 8px" : "10px 12px",
          }}
        >
          <button
            onClick={() => handleNavigate("/profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
              padding: collapsed ? "6px 0" : "6px 6px",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "background .14s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EDE8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(196,90,26,.12)",
                border: "1.5px solid rgba(196,90,26,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#C45A1A",
                flexShrink: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1A1917",
                    letterSpacing: "-.1px",
                  }}
                >
                  u/{user.username}
                </div>
                <div style={{ fontSize: 10, color: "#9B9488" }}>
                  {user.karma ? `${user.karma} karma` : "View profile"}
                </div>
              </div>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
