import React, { useEffect, useState } from "react";
import { apiService, Post, Category, Tag } from "../services/apiService";
import PostList from "../components/PostList";

/* ─────────────────────────────────────────
   Inject Google Fonts + global styles once
───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --bg: #0a0a0b;
      --surface: #111113;
      --surface2: #18181b;
      --border: rgba(255,255,255,0.07);
      --accent: #e8ff47;
      --accent2: #ff6b35;
      --text: #f0f0ee;
      --muted: #6b6b72;
      --tag-hover: rgba(232,255,71,0.12);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

    /* noise grain overlay */
    .noise::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 200px 200px;
    }

    /* marquee */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .marquee-inner { animation: marquee 22s linear infinite; }

    /* fade-in stagger */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .delay-1 { animation-delay: 0.08s; }
    .delay-2 { animation-delay: 0.16s; }
    .delay-3 { animation-delay: 0.24s; }
    .delay-4 { animation-delay: 0.32s; }

    /* stat card hover */
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: border-color 0.2s, background 0.2s;
      cursor: default;
    }
    .stat-card:hover {
      border-color: rgba(232,255,71,0.3);
      background: var(--surface2);
    }

    /* category pill */
    .cat-pill {
      padding: 7px 18px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.01em;
      border: 1px solid var(--border);
      color: var(--muted);
      background: transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s;
    }
    .cat-pill:hover {
      color: var(--text);
      border-color: rgba(255,255,255,0.2);
    }
    .cat-pill.active {
      background: var(--accent);
      color: #0a0a0b;
      border-color: var(--accent);
      font-weight: 700;
    }

    /* tag chip */
    .tag-chip {
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .tag-chip:hover {
      color: var(--accent);
      border-color: rgba(232,255,71,0.3);
      background: var(--tag-hover);
    }
    .tag-chip.active {
      color: var(--accent);
      border-color: var(--accent);
      background: var(--tag-hover);
    }

    /* sticky nav */
    .sticky-nav {
      position: sticky;
      top: 0;
      z-index: 40;
      background: rgba(10,10,11,0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }

    /* divider line */
    .h-divider { height: 1px; background: var(--border); width: 100%; }

    /* section label */
    .section-label {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
    }

    /* accent line */
    .accent-line {
      display: inline-block;
      width: 36px;
      height: 2px;
      background: var(--accent);
      border-radius: 1px;
      vertical-align: middle;
      margin-right: 10px;
    }

    /* sort btn */
    .sort-btn {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      border: 1px solid var(--border);
      color: var(--muted);
      background: transparent;
      cursor: pointer;
      transition: all 0.18s;
    }
    .sort-btn:hover, .sort-btn.active {
      color: var(--text);
      border-color: rgba(255,255,255,0.2);
      background: var(--surface2);
    }
    .sort-btn.active { color: var(--accent); border-color: rgba(232,255,71,0.3); }
  `}</style>
);

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedTag, setSelectedTag] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          apiService.getPosts({
            categoryId: selectedCategory,
            tagId: selectedTag,
          }),
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setPosts(postsRes);
        setCategories(categoriesRes);
        setTags(tagsRes);
        setError(null);
      } catch {
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, sortBy, selectedCategory, selectedTag]);

  const handleCategoryChange = (key: string) =>
    setSelectedCategory(key === "all" ? undefined : key);

  const marqueeParts = [
    "Engineering",
    "·",
    "Dev",
    "·",
    "Systems",
    "·",
    "Architecture",
    "·",
    "Performance",
    "·",
  ];
  const marqueeText = [...marqueeParts, ...marqueeParts].join("  ");

  return (
    <main
      className="noise"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg)",
        overflowX: "hidden",
      }}
    >
      <GlobalStyles />

      {/* ── MARQUEE TICKER ── */}
      <div
        style={{
          background: "var(--accent)",
          height: 36,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="marquee-inner"
          style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}
        >
          {[...marquesParts(), ...marquesParts()].map((w, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0a0a0b",
                opacity: w === "·" ? 0.4 : 1,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          padding: "72px 0 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "20%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(ellipse, rgba(232,255,71,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="fade-up" style={{ marginBottom: 12 }}>
            <span className="section-label">
              <span className="accent-line" />
              Lilawat · TechBlog
            </span>
          </div>

          <h1
            className="fade-up delay-1"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(64px, 10vw, 128px)",
              lineHeight: 0.92,
              letterSpacing: "0.01em",
              color: "var(--text)",
              marginBottom: 28,
            }}
          >
            Where Code
            <br />
            <span style={{ color: "var(--accent)", WebkitTextStroke: "0px" }}>
              Meets
            </span>{" "}
            <span
              style={{
                WebkitTextStroke: "1px rgba(240,240,238,0.4)",
                color: "transparent",
              }}
            >
              Craft
            </span>
          </h1>

          <p
            className="fade-up delay-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: 520,
              marginBottom: 48,
            }}
          >
            Practical engineering blogs, real-world dev insights, and clean
            coding practices for{" "}
            <span style={{ color: "var(--text)", fontWeight: 500 }}>
              production-grade systems.
            </span>
          </p>

          {/* STATS ROW */}
          <div
            className="fade-up delay-3"
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            {[
              { value: categories.length, label: "Categories", icon: "⬡" },
              { value: tags.length, label: "Topics", icon: "◈" },
              { value: posts?.length ?? 0, label: "Articles", icon: "◻" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {s.icon} {s.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 42,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                    color: "var(--accent)",
                  }}
                >
                  {String(s.value).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-divider" />

      {/* ── STICKY CATEGORY NAV ── */}
      <div className="sticky-nav">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div
            className="scrollbar-none"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              overflowX: "auto",
              padding: "14px 0",
            }}
          >
            {[{ id: "all", name: "All Posts" }, ...categories].map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${(selectedCategory ?? "all") === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
                {cat.id === "all" && posts && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                      opacity: 0.7,
                    }}
                  >
                    {posts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAGS ── */}
      {tags.length > 0 && (
        <div
          style={{ borderBottom: "1px solid var(--border)", padding: "14px 0" }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span className="section-label" style={{ whiteSpace: "nowrap" }}>
              Tags
            </span>
            <div
              className="scrollbar-none"
              style={{ display: "flex", gap: 8, overflowX: "auto", flex: 1 }}
            >
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className={`tag-chip ${selectedTag === tag.id ? "active" : ""}`}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag.id ? undefined : tag.id)
                  }
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(undefined)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "var(--muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.18s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ff6b35")}
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                ✕ clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── POSTS HEADER ── */}
      {!loading && posts && posts.length > 0 && (
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 8px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 40,
                  letterSpacing: "0.02em",
                  color: "var(--text)",
                  lineHeight: 1,
                }}
              >
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : "Latest Articles"}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginTop: 4,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {selectedTag
                  ? `#${tags.find((t) => t.id === selectedTag)?.name}  ·  ${posts.length} result${posts.length !== 1 ? "s" : ""}`
                  : `${posts.length} article${posts.length !== 1 ? "s" : ""} published`}
              </p>
            </div>
            {/* Sort controls */}
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "createdAt,desc", label: "Latest" },
                { key: "createdAt,asc", label: "Oldest" },
                { key: "title,asc", label: "A → Z" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={`sort-btn ${sortBy === opt.key ? "active" : ""}`}
                  onClick={() => setSortBy(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── POSTS LIST ── */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 32px" }}
      >
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          page={page}
          sortBy={sortBy}
          onPageChange={setPage}
          onSortChange={setSortBy}
        />
      </section>
    </main>
  );
};

/* helper so marquee doesn't break during render */
function marquesParts() {
  return [
    "Engineering",
    "·",
    "Dev",
    "·",
    "Systems",
    "·",
    "Architecture",
    "·",
    "Performance",
    "·",
  ];
}

export default HomePage;
