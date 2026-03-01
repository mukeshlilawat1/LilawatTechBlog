import React from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../services/apiService";
import { Calendar, Clock, Tag, ArrowRight, User } from "lucide-react";
import DOMPurify from "dompurify";

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
}

const PostListStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

    .pl-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 640px) { .pl-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .pl-grid { grid-template-columns: repeat(3, 1fr); } }

    .pl-card {
      background: #111113;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      display: flex; flex-direction: column;
      cursor: pointer;
      transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
      overflow: hidden;
      position: relative;
    }
    .pl-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(232,255,71,0), transparent);
      transition: background 0.3s;
    }
    .pl-card:hover {
      border-color: rgba(232,255,71,0.25);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,255,71,0.05);
    }
    .pl-card:hover::before {
      background: linear-gradient(90deg, transparent, rgba(232,255,71,0.4), transparent);
    }

    .pl-card-top {
      padding: 22px 22px 0;
    }
    .pl-cat-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 5px;
      background: rgba(232,255,71,0.08);
      border: 1px solid rgba(232,255,71,0.18);
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: #e8ff47;
      margin-bottom: 12px;
    }
    .pl-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 17px; font-weight: 700; line-height: 1.35;
      color: #f0f0ee;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      transition: color 0.18s;
      margin-bottom: 8px;
    }
    .pl-card:hover .pl-title { color: #e8ff47; }

    .pl-author {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #6b6b72;
      font-family: 'DM Sans', sans-serif;
      margin-bottom: 14px;
    }

    .pl-body {
      padding: 0 22px;
      flex: 1;
    }
    .pl-excerpt {
      font-size: 13px; line-height: 1.7;
      color: #4a4a52;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }

    .pl-footer {
      padding: 16px 22px 20px;
    }
    .pl-meta {
      display: flex; align-items: center; gap: 10px;
      font-family: 'DM Mono', monospace;
      font-size: 11px; color: #4a4a52;
      margin-bottom: 12px;
    }
    .pl-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: #333; }

    .pl-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .pl-tag {
      padding: 3px 9px; border-radius: 5px;
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      color: #6b6b72; background: #18181b;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.15s;
    }
    .pl-card:hover .pl-tag { border-color: rgba(232,255,71,0.12); }

    .pl-read-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 700;
      color: #e8ff47; background: rgba(232,255,71,0.08);
      border: 1px solid rgba(232,255,71,0.2);
      cursor: pointer; transition: all 0.18s;
    }
    .pl-read-btn:hover { background: rgba(232,255,71,0.15); border-color: rgba(232,255,71,0.4); }
    .pl-read-btn svg { transition: transform 0.2s; }
    .pl-card:hover .pl-read-btn svg { transform: translateX(3px); }

    /* ── Skeleton ── */
    .pl-skeleton { animation: plPulse 1.5s ease-in-out infinite; }
    @keyframes plPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .pl-skel-line { background: #1e1e21; border-radius: 6px; }

    /* ── Empty ── */
    .pl-empty {
      text-align: center; padding: 80px 16px;
      font-family: 'DM Sans', sans-serif;
    }
    .pl-empty-icon {
      width: 64px; height: 64px; border-radius: 16px;
      background: #111113; border: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .pl-empty-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px; letter-spacing: 0.03em; color: #f0f0ee;
    }
    .pl-empty-sub { font-size: 14px; color: #6b6b72; margin-top: 6px; }

    /* ── Error ── */
    .pl-error {
      padding: 24px; border-radius: 14px;
      background: rgba(255,68,68,0.05);
      border: 1px solid rgba(255,68,68,0.2);
      text-align: center; font-family: 'DM Sans', sans-serif;
    }
    .pl-error-title { color: #ff4444; font-weight: 600; font-size: 14px; }
    .pl-error-sub { color: rgba(255,68,68,0.6); font-size: 12px; margin-top: 4px; }
  `}</style>
);

const PostList: React.FC<PostListProps> = ({ posts, loading, error }) => {
  const navigate = useNavigate();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const createExcerpt = (content: string) => {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "strong", "em", "br"],
      ALLOWED_ATTR: [],
    });
    const div = document.createElement("div");
    div.innerHTML = sanitized;
    let text = (div.textContent || "").trim();
    if (text.length > 180)
      text = text.substring(0, 180).split(" ").slice(0, -1).join(" ") + "…";
    return text;
  };

  if (error)
    return (
      <>
        <PostListStyles />
        <div className="pl-error">
          <p className="pl-error-title">{error}</p>
          <p className="pl-error-sub">
            Please try again later or contact support.
          </p>
        </div>
      </>
    );

  if (loading)
    return (
      <>
        <PostListStyles />
        <div className="pl-grid">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="pl-card pl-skeleton"
              style={{ padding: 22, gap: 12 }}
            >
              <div
                className="pl-skel-line"
                style={{ height: 20, width: "35%", marginBottom: 8 }}
              />
              <div
                className="pl-skel-line"
                style={{ height: 22, width: "90%" }}
              />
              <div
                className="pl-skel-line"
                style={{ height: 22, width: "70%", marginBottom: 12 }}
              />
              <div
                className="pl-skel-line"
                style={{ height: 14, width: "100%" }}
              />
              <div
                className="pl-skel-line"
                style={{ height: 14, width: "80%" }}
              />
              <div
                className="pl-skel-line"
                style={{ height: 14, width: "60%", marginBottom: 16 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  className="pl-skel-line"
                  style={{ height: 24, width: 56, borderRadius: 5 }}
                />
                <div
                  className="pl-skel-line"
                  style={{ height: 24, width: 44, borderRadius: 5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    );

  if (!posts || posts.length === 0)
    return (
      <>
        <PostListStyles />
        <div className="pl-empty">
          <div className="pl-empty-icon">
            <Tag size={28} color="#6b6b72" />
          </div>
          <div className="pl-empty-title">No Posts Found</div>
          <p className="pl-empty-sub">
            Try adjusting your filters or check back later.
          </p>
        </div>
      </>
    );

  return (
    <>
      <PostListStyles />
      <div className="pl-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="pl-card"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className="pl-card-top">
              <span className="pl-cat-badge">{post.category.name}</span>
              <h2 className="pl-title">{post.title}</h2>
              <div className="pl-author">
                <User size={12} color="#6b6b72" />
                <span>{post.author?.name}</span>
              </div>
            </div>

            <div className="pl-body">
              <p className="pl-excerpt">{createExcerpt(post.content)}</p>
            </div>

            <div className="pl-footer">
              <div className="pl-meta">
                <Calendar size={11} />
                <span>{formatDate(post.createdAt)}</span>
                <span className="pl-meta-dot" />
                <Clock size={11} />
                <span>{post.readingTime} min read</span>
              </div>

              {post.tags.length > 0 && (
                <div className="pl-tags">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id} className="pl-tag">
                      #{tag.name}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="pl-tag">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}

              <button
                className="pl-read-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/posts/${post.id}`);
                }}
              >
                Read Article <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
