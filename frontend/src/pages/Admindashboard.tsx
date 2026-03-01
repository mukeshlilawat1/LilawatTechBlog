import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService, Post } from "../services/apiService";
import {
  CheckCircle,
  XCircle,
  Eye,
  ShieldCheck,
  Tag,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .ad-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    /* Toast */
    .ad-toast {
      position: fixed; top: 24px; right: 24px; z-index: 100;
      padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
      display: flex; align-items: center; gap: 8px;
      animation: ad-slide-in 0.25s ease; font-family: 'DM Sans', sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .ad-toast-success { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
    .ad-toast-error   { background: rgba(255,68,68,0.1);   border: 1px solid rgba(255,68,68,0.3);  color: #ff4444; }
    @keyframes ad-slide-in { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }

    /* Hero */
    .ad-hero { border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; background: #0a0a0b; position: relative; overflow: hidden; }
    .ad-hero::before { content: ''; position: absolute; top: -120px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 65%); pointer-events: none; }
    .ad-hero-inner { max-width: 860px; margin: 0 auto; position: relative; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .ad-hero-left { }
    .ad-admin-label { display: flex; align-items: center; gap: 6px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8ff47; margin-bottom: 8px; }
    .ad-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px,6vw,52px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; margin-bottom: 6px; }
    .ad-sub { font-size: 13px; color: #4a4a52; }
    .ad-pending-count-wrap { text-align: right; }
    .ad-pending-num { font-family: 'Bebas Neue', sans-serif; font-size: 52px; line-height: 1; color: #e8ff47; }
    .ad-pending-lbl { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; letter-spacing: 0.1em; }

    /* Body */
    .ad-body { max-width: 860px; margin: 0 auto; padding: 28px 24px 80px; }

    /* Empty / loading */
    @keyframes ad-spin { to { transform: rotate(360deg); } }
    .ad-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: ad-spin 0.7s linear infinite; margin: 60px auto; }
    .ad-all-clear { text-align: center; padding: 80px 20px; }
    .ad-all-clear-icon { width: 60px; height: 60px; border-radius: 16px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .ad-all-clear-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #f0f0ee; margin-bottom: 6px; }
    .ad-all-clear-sub { font-size: 13px; color: #4a4a52; }

    /* Post card */
    .ad-card { background: #111113; border: 1px solid rgba(245,158,11,0.2); border-radius: 16px; padding: 22px 22px 18px; margin-bottom: 14px; transition: border-color 0.2s; }
    .ad-card:hover { border-color: rgba(245,158,11,0.35); }

    .ad-card-top { display: flex; align-items: flex-start; gap: 20px; }
    .ad-card-left { flex: 1; min-width: 0; }
    .ad-card-right { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; min-width: 110px; }

    /* Badges */
    .ad-pending-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); margin-right: 8px; margin-bottom: 10px; }
    .ad-cat-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 10px; }

    .ad-post-title { font-size: 17px; font-weight: 800; color: #f0f0ee; margin-bottom: 8px; line-height: 1.3; }
    .ad-post-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; }
    .ad-meta-item { display: flex; align-items: center; gap: 5px; font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }
    .ad-author-init { width: 20px; height: 20px; border-radius: 50%; background: rgba(232,255,71,0.1); border: 1px solid rgba(232,255,71,0.2); display: inline-flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 11px; color: #e8ff47; }

    .ad-preview-text { font-size: 13px; color: #4a4a52; line-height: 1.65; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    .ad-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .ad-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }

    /* Action buttons */
    .ad-action-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; border: 1px solid; width: 100%;
    }
    .ad-btn-preview { color: #6b6b72; background: transparent; border-color: rgba(255,255,255,0.1); }
    .ad-btn-preview:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .ad-btn-approve { color: #22c55e; background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }
    .ad-btn-approve:hover:not(:disabled) { background: rgba(34,197,94,0.15); }
    .ad-btn-approve:disabled { opacity: 0.4; cursor: not-allowed; }
    .ad-btn-reject { color: #ff4444; background: rgba(255,68,68,0.08); border-color: rgba(255,68,68,0.25); }
    .ad-btn-reject:hover:not(:disabled) { background: rgba(255,68,68,0.14); }
    .ad-btn-reject:disabled { opacity: 0.4; cursor: not-allowed; }
    .ad-btn-reject-active { background: rgba(255,68,68,0.14) !important; }

    /* Reject panel */
    .ad-reject-panel { margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.06); }
    .ad-reject-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,68,68,0.4); margin-bottom: 10px; }
    .ad-reject-textarea { width: 100%; background: #0d0d0f; border: 1px solid rgba(255,68,68,0.2); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #b0b0b8; font-family: 'DM Sans', sans-serif; outline: none; resize: vertical; min-height: 90px; transition: border-color 0.18s; box-sizing: border-box; line-height: 1.6; }
    .ad-reject-textarea:focus { border-color: rgba(255,68,68,0.4); }
    .ad-reject-textarea::placeholder { color: #2e2e35; }
    .ad-reject-actions { display: flex; gap: 8px; margin-top: 12px; }
    .ad-reject-send { padding: 8px 16px; border-radius: 8px; border: none; background: #ff4444; color: white; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; }
    .ad-reject-send:hover:not(:disabled) { background: #ff6666; }
    .ad-reject-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .ad-reject-cancel { padding: 8px 14px; border-radius: 8px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #6b6b72; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; }
    .ad-reject-cancel:hover { color: #f0f0ee; }

    @media (max-width: 560px) {
      .ad-card-top { flex-direction: column; }
      .ad-card-right { flex-direction: row; min-width: 0; width: 100%; }
      .ad-action-btn { width: auto; flex: 1; }
    }
  `}</style>
);

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMsg, setRejectMsg] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPendingPosts();
      setPosts(data);
    } catch {
      console.error("Failed to fetch pending posts");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3200);
  };

  const handleApprove = async (postId: string) => {
    try {
      setProcessing(postId);
      await apiService.approvePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast("success", "Post approved and published!");
    } catch {
      showToast("error", "Failed to approve post.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (postId: string) => {
    if (!rejectMsg.trim()) return;
    try {
      setProcessing(postId);
      await apiService.rejectPost(postId, rejectMsg);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setRejectingId(null);
      setRejectMsg("");
      showToast("success", "Post rejected with feedback.");
    } catch {
      showToast("error", "Failed to reject post.");
    } finally {
      setProcessing(null);
    }
  };

  const toggleReject = (id: string) => {
    setRejectingId((prev) => (prev === id ? null : id));
    setRejectMsg("");
  };

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <AdminStyles />
      <div className="ad-root">
        {/* Toast */}
        {toast && (
          <div className={`ad-toast ad-toast-${toast.type}`}>
            {toast.type === "success" ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {toast.msg}
          </div>
        )}

        {/* Hero */}
        <div className="ad-hero">
          <div className="ad-hero-inner">
            <div className="ad-hero-left">
              <div className="ad-admin-label">
                <ShieldCheck size={11} /> Admin Panel
              </div>
              <div className="ad-title">Review Queue</div>
              <p className="ad-sub">
                Posts waiting for your approval before going live.
              </p>
            </div>
            {!loading && (
              <div className="ad-pending-count-wrap">
                <div className="ad-pending-num">
                  {String(posts.length).padStart(2, "0")}
                </div>
                <div className="ad-pending-lbl">pending</div>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="ad-body">
          {loading ? (
            <div className="ad-spinner" />
          ) : posts.length === 0 ? (
            <div className="ad-all-clear">
              <div className="ad-all-clear-icon">
                <CheckCircle size={26} color="#22c55e" />
              </div>
              <div className="ad-all-clear-title">All Clear!</div>
              <p className="ad-all-clear-sub">No posts waiting for review.</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <div key={post.id} className="ad-card">
                  <div className="ad-card-top">
                    <div className="ad-card-left">
                      <div>
                        <span className="ad-pending-badge">
                          ⏳ Pending Review
                        </span>
                        {post.category && (
                          <span className="ad-cat-badge">
                            {post.category.name}
                          </span>
                        )}
                      </div>

                      <div className="ad-post-title">{post.title}</div>

                      <div className="ad-post-meta">
                        {post.author && (
                          <span className="ad-meta-item">
                            <span className="ad-author-init">
                              {post.author.name.charAt(0).toUpperCase()}
                            </span>
                            <span style={{ color: "#b0b0b8", fontWeight: 600 }}>
                              {post.author.name}
                            </span>
                          </span>
                        )}
                        <span className="ad-meta-item">
                          <Clock size={10} />
                          {formatDate(post.createdAt)}
                        </span>
                        {post.readingTime && (
                          <span className="ad-meta-item">
                            {post.readingTime} min read
                          </span>
                        )}
                      </div>

                      <p className="ad-preview-text">
                        {post.content.replace(/<[^>]+>/g, "").substring(0, 200)}
                        ...
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="ad-tags">
                          {post.tags.map((tag) => (
                            <span key={tag.id} className="ad-tag">
                              <Tag size={9} />#{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ad-card-right">
                      <Link
                        to={`/posts/${post.id}`}
                        className="ad-action-btn ad-btn-preview"
                      >
                        <Eye size={12} /> Preview
                      </Link>
                      <button
                        className="ad-action-btn ad-btn-approve"
                        disabled={processing === post.id}
                        onClick={() => handleApprove(post.id)}
                      >
                        <CheckCircle size={12} />{" "}
                        {processing === post.id ? "..." : "Approve"}
                      </button>
                      <button
                        className={`ad-action-btn ad-btn-reject ${rejectingId === post.id ? "ad-btn-reject-active" : ""}`}
                        disabled={processing === post.id}
                        onClick={() => toggleReject(post.id)}
                      >
                        <XCircle size={12} /> Reject
                        {rejectingId === post.id ? (
                          <ChevronUp size={10} />
                        ) : (
                          <ChevronDown size={10} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Reject panel */}
                  {rejectingId === post.id && (
                    <div className="ad-reject-panel">
                      <div className="ad-reject-label">
                        Rejection Feedback — shown to the author
                      </div>
                      <textarea
                        className="ad-reject-textarea"
                        placeholder="Explain why this post needs revision..."
                        value={rejectMsg}
                        onChange={(e) => setRejectMsg(e.target.value)}
                        autoFocus
                      />
                      <div className="ad-reject-actions">
                        <button
                          className="ad-reject-send"
                          disabled={!rejectMsg.trim() || processing === post.id}
                          onClick={() => handleReject(post.id)}
                        >
                          {processing === post.id
                            ? "Sending..."
                            : "Send Feedback & Reject"}
                        </button>
                        <button
                          className="ad-reject-cancel"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectMsg("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
