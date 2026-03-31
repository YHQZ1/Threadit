/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const fmt = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
};

export default function Navbar({ 
  user, 
  onSearchChange, 
  searchValue = "",
  onLogout,
  onProfileClick,
  onLogoClick 
}) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/auth?mode=login");
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick && localUser) {
      onProfileClick(localUser);
    } else if (localUser) {
      navigate(`/profile/${localUser.username}`);
    }
  };

  const handleLogoClick = () => {
    // Clear search when clicking logo
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const currentUser = user || localUser;

  return (
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
      <style>{`
        @keyframes navIn {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Logo */}
      <div
        onClick={handleLogoClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          textDecoration: "none",
          flexShrink: 0,
          cursor: "pointer",
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
          onError={(e) => {
            e.target.style.display = "none";
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
      </div>

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
          value={searchValue}
          onChange={handleSearchChange}
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
        {currentUser && (
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
            onClick={handleProfileClick}
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
              {currentUser.username?.[0]?.toUpperCase() || "U"}
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
                u/{currentUser.username}
              </div>
              <div style={{ fontSize: 10, color: "#9B9488" }}>
                {currentUser.karma ? `${fmt(currentUser.karma)} karma` : "Member"}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
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
  );
}