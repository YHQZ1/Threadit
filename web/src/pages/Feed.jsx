/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import NewPostModal from "../components/NewPostModal";
import Toast from "../components/Toast";
import RightSidebar from "../components/RightSidebar";
import { POSTS_DATA } from "../data/postsData";
import {
  HotIcon,
  NewIcon,
  TopIcon,
  RisingIcon
} from "../icons/icons";


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
    const pinned = list.filter((p) => p.pinned);
    let rest = list.filter((p) => !p.pinned);
    if (sort === "new") rest.sort((a, b) => a.id - b.id);
    else if (sort === "top") rest.sort((a, b) => b.votes - a.votes);
    else if (sort === "rising") rest.sort((a, b) => b.comments - a.comments);
    return [...pinned, ...rest];
  };

  const handleNewPost = ({ title, body, tags }) => {
    const newPost = {
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

      {/* Navbar */}
      <Navbar 
        searchValue={search}
        onSearchChange={setSearch}
        user={user}
      />

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", maxWidth: "100%" }}>
        <Sidebar user={user} onNewPost={() => setModalOpen(true)} />

        <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
          {/* Center Feed */}
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

          {/* Right Sidebar */}
          <RightSidebar
            filterTag={filterTag}
            onTagFilter={handleTagFilter}
            onNewPost={() => setModalOpen(true)}
            onShowToast={showToast}
          />
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