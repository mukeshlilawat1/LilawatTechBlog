import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService, Post, PostStatus } from "../services/apiService";
import { Plus, Send, Eye, Edit2, ChevronDown, ChevronUp } from "lucide-react";

const statusConfig: Record<
  PostStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  [PostStatus.DRAFT]: {
    label: "Draft",
    color: "#6b6b72",
    bg: "rgba(107,107,114,0.1)",
    border: "rgba(107,107,114,0.2)",
  },
  [PostStatus.PENDING]: {
    label: "Under Review",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  [PostStatus.PUBLISHED]: {
    label: "Published",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
  },
  [PostStatus.REJECTED]: {
    label: "Rejected",
    color: "#ff4444",
    bg: "rgba(255,68,68,0.1)",
    border: "rgba(255,68,68,0.25)",
  },
};

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

    .mp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .mp-header { border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; }
    .mp-header-inner { max-width: 960px; margin: 0 auto; }
    .mp-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #e8ff47; margin-bottom: 8px; }
    .mp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px,6vw,56px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; margin-bottom: 6px; }
    .mp-subtitle { font-size: 13px; color: #6b6b72; }

    .mp-body { max-width: 960px; margin: 0 auto; padding: 28px 24px 80px; }

    /* Filters */
    .mp-filters { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
    .mp-filter-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.07); background: transparent; color: #6b6b72;
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .mp-filter-btn:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.15); }
    .mp-filter-btn.active { background: #e8ff47; color: #0a0a0b; border-color: #e8ff47; }
    .mp-filter-count { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: rgba(255,255,255,0.1); }
    .mp-filter-btn.active .mp-filter-count { background: rgba(0,0,0,0.15); }

    .mp-new-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 700;
      color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer;
      transition: all 0.18s; font-family: 'DM Sans', sans-serif; text-decoration: none; margin-left: auto;
    }
    .mp-new-btn:hover { background: #f5ff6e; transform: translateY(-1px); }

    /* Card */
    .mp-card { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px 20px; transition: border-color 0.2s; margin-bottom: 10px; }
    .mp-card:hover { border-color: rgba(232,255,71,0.15); }
    .mp-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .mp-card-left { flex: 1; min-width: 0; }
    .mp-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }

    .mp-status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; border: 1px solid; margin-bottom: 8px; }
    .mp-cat-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #6b6b72; background: #18181b; border: 1px solid rgba(255,255,255,0.06); margin-left: 6px; }
    .mp-post-title { font-size: 15px; font-weight: 700; color: #f0f0ee; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
    .mp-post-meta { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }

    .mp-action-btn {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; border: 1px solid;
    }
    .mp-action-submit { color: #e8ff47; background: rgba(232,255,71,0.08); border-color: rgba(232,255,71,0.25); }
    .mp-action-submit:hover { background: rgba(232,255,71,0.15); }
    .mp-action-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .mp-action-edit { color: #6b6b72; background: transparent; border-color: rgba(255,255,255,0.1); }
    .mp-action-edit:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .mp-action-view { color: #22c55e; background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }
    .mp-action-view:hover { background: rgba(34,197,94,0.15); }
    .mp-pending-badge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); font-family: 'DM Mono', monospace; }

    .mp-rejection-toggle { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; color: #ff4444; font-size: 12px; font-weight: 600; margin-top: 14px; padding: 0; transition: opacity 0.15s; font-family: 'DM Sans', sans-serif; }
    .mp-rejection-toggle:hover { opacity: 0.7; }
    .mp-rejection-box { margin-top: 10px; padding: 14px 16px; border-radius: 10px; background: rgba(255,68,68,0.05); border: 1px solid rgba(255,68,68,0.2); }
    .mp-rejection-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,68,68,0.5); margin-bottom: 6px; }
    .mp-rejection-text { font-size: 13px; color: rgba(255,68,68,0.85); line-height: 1.6; }
    .mp-rejection-hint { font-size: 11px; color: rgba(255,68,68,0.4); margin-top: 8px; font-family: 'DM Mono', monospace; }

    @keyframes mp-spin { to { transform: rotate(360deg); } }
    .mp-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.07); border-top-color: #e8ff47; animation: mp-spin 0.7s linear infinite; margin: 80px auto; }

    .mp-empty { text-align: center; padding: 80px 20px; }
    .mp-empty-icon { font-size: 56px; margin-bottom: 16px; }
    .mp-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #3a3a42; margin-bottom: 8px; }
    .mp-empty-sub { font-size: 13px; color: #3a3a42; margin-bottom: 24px; }
  `}</style>
);

const MyPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostStatus | "ALL">("ALL");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [expandedRejection, setExpandedRejection] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (postId: string) => {
    try {
      setSubmitting(postId);
      const updated = await apiService.submitPostForReview(postId);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  const filtered =
    filter === "ALL" ? posts : posts.filter((p) => p.status === filter);
  const counts: Record<string, number> = {
    ALL: posts.length,
    [PostStatus.DRAFT]: posts.filter((p) => p.status === PostStatus.DRAFT)
      .length,
    [PostStatus.PENDING]: posts.filter((p) => p.status === PostStatus.PENDING)
      .length,
    [PostStatus.PUBLISHED]: posts.filter(
      (p) => p.status === PostStatus.PUBLISHED,
    ).length,
    [PostStatus.REJECTED]: posts.filter((p) => p.status === PostStatus.REJECTED)
      .length,
  };

  const filterTabs = [
    { key: "ALL" as const, label: "All" },
    { key: PostStatus.DRAFT, label: "Draft" },
    { key: PostStatus.PENDING, label: "In Review" },
    { key: PostStatus.PUBLISHED, label: "Published" },
    { key: PostStatus.REJECTED, label: "Rejected" },
  ];

  return (
    <>
      <PageStyles />
      <div className="mp-root">
        <div className="mp-header">
          <div className="mp-header-inner">
            <div className="mp-label">My Workspace</div>
            <div className="mp-title">My Posts</div>
            <p className="mp-subtitle">
              Manage your writing — draft, submit, and track your stories.
            </p>
          </div>
        </div>

        <div className="mp-body">
          <div className="mp-filters">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`mp-filter-btn ${filter === tab.key ? "active" : ""}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                <span className="mp-filter-count">{counts[tab.key]}</span>
              </button>
            ))}
            <Link to="/posts/new" className="mp-new-btn">
              <Plus size={14} strokeWidth={2.5} /> New Post
            </Link>
          </div>

          {loading ? (
            <div className="mp-spinner" />
          ) : filtered.length === 0 ? (
            <div className="mp-empty">
              <div className="mp-empty-icon">✍️</div>
              <div className="mp-empty-title">No posts here yet</div>
              <p className="mp-empty-sub">
                Start writing something and publish your thoughts.
              </p>
              <Link
                to="/posts/new"
                className="mp-new-btn"
                style={{ display: "inline-flex", margin: "0 auto" }}
              >
                <Plus size={14} strokeWidth={2.5} /> Write your first post
              </Link>
            </div>
          ) : (
            <div>
              {filtered.map((post) => {
                const status = post.status as PostStatus;
                const cfg = statusConfig[status];
                return (
                  <div key={post.id} className="mp-card">
                    <div className="mp-card-top">
                      <div className="mp-card-left">
                        <div>
                          <span
                            className="mp-status-badge"
                            style={{
                              color: cfg.color,
                              background: cfg.bg,
                              borderColor: cfg.border,
                            }}
                          >
                            {cfg.label}
                          </span>
                          {post.category && (
                            <span className="mp-cat-badge">
                              {post.category.name}
                            </span>
                          )}
                        </div>
                        <div className="mp-post-title">{post.title}</div>
                        <div className="mp-post-meta">
                          {new Date(post.updatedAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                          {post.readingTime &&
                            ` · ${post.readingTime} min read`}
                        </div>
                      </div>

                      <div className="mp-card-right">
                        {(status === PostStatus.DRAFT ||
                          status === PostStatus.REJECTED) && (
                          <button
                            className="mp-action-btn mp-action-submit"
                            disabled={submitting === post.id}
                            onClick={() => handleSubmitForReview(post.id)}
                          >
                            {submitting === post.id ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send size={12} /> Submit for Review
                              </>
                            )}
                          </button>
                        )}
                        {status === PostStatus.PENDING && (
                          <span className="mp-pending-badge">
                            ⏳ Awaiting Review
                          </span>
                        )}
                        {(status === PostStatus.DRAFT ||
                          status === PostStatus.REJECTED) && (
                          <Link
                            to={`/posts/${post.id}/edit`}
                            className="mp-action-btn mp-action-edit"
                          >
                            <Edit2 size={12} /> Edit
                          </Link>
                        )}
                        {status === PostStatus.PUBLISHED && (
                          <Link
                            to={`/posts/${post.id}`}
                            className="mp-action-btn mp-action-view"
                          >
                            <Eye size={12} /> View Post
                          </Link>
                        )}
                      </div>
                    </div>

                    {status === PostStatus.REJECTED &&
                      post.rejectionMessage && (
                        <div>
                          <button
                            className="mp-rejection-toggle"
                            onClick={() =>
                              setExpandedRejection(
                                expandedRejection === post.id ? null : post.id,
                              )
                            }
                          >
                            {expandedRejection === post.id ? (
                              <ChevronUp size={13} />
                            ) : (
                              <ChevronDown size={13} />
                            )}
                            {expandedRejection === post.id
                              ? "Hide admin feedback"
                              : "View admin feedback"}
                          </button>
                          {expandedRejection === post.id && (
                            <div className="mp-rejection-box">
                              <div className="mp-rejection-label">
                                Admin Feedback
                              </div>
                              <p className="mp-rejection-text">
                                {post.rejectionMessage}
                              </p>
                              <p className="mp-rejection-hint">
                                Edit your post and resubmit when ready.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPostsPage;
