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
} from "lucide-react";

const AdminStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .ad-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .ad-toast { position: fixed; top: 24px; right: 24px; z-index: 999; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); font-family: 'DM Sans', sans-serif; animation: ad-in 0.2s ease; }
    @keyframes ad-in { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
    .ad-toast-success { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
    .ad-toast-error { background: rgba(255,68,68,0.10); border: 1px solid rgba(255,68,68,0.3); color: #ff4444; }

    .ad-hero { border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; position: relative; overflow: hidden; background: #0a0a0b; }
    .ad-hero::before { content:''; position:absolute; top:-100px; right:-60px; width:380px; height:380px; background:radial-gradient(circle, rgba(232,255,71,0.05) 0%, transparent 65%); pointer-events:none; }
    .ad-hero-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px; position: relative; }
    .ad-hero-label { display: flex; align-items: center; gap: 6px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8ff47; margin-bottom: 8px; }
    .ad-hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px,6vw,52px); color: #f0f0ee; line-height: 1; margin-bottom: 6px; }
    .ad-hero-sub { font-size: 13px; color: #4a4a52; }
    .ad-count-num { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: #e8ff47; line-height: 1; text-align: right; }
    .ad-count-lbl { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; letter-spacing: 0.1em; text-align: right; }

    .ad-body { max-width: 900px; margin: 0 auto; padding: 28px 24px 80px; }

    @keyframes ad-spin { to { transform: rotate(360deg); } }
    .ad-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: ad-spin 0.7s linear infinite; margin: 80px auto; }

    .ad-empty { text-align: center; padding: 80px 20px; }
    .ad-empty-icon { width: 64px; height: 64px; border-radius: 18px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .ad-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 30px; color: #f0f0ee; margin-bottom: 6px; }
    .ad-empty-sub { font-size: 13px; color: #4a4a52; }

    .ad-card { background: #111113; border: 1px solid rgba(245,158,11,0.2); border-radius: 16px; padding: 22px; margin-bottom: 14px; transition: border-color 0.2s; }
    .ad-card:hover { border-color: rgba(245,158,11,0.4); }
    .ad-card-inner { display: flex; align-items: flex-start; gap: 20px; }
    .ad-card-content { flex: 1; min-width: 0; }
    .ad-card-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; min-width: 110px; }

    .ad-badges { margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .ad-badge-pending { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); }
    .ad-badge-cat { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }
    .ad-post-title { font-size: 17px; font-weight: 800; color: #f0f0ee; margin-bottom: 8px; line-height: 1.3; }
    .ad-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }
    .ad-meta-item { display: flex; align-items: center; gap: 5px; }
    .ad-author-init { width: 20px; height: 20px; border-radius: 50%; background: rgba(232,255,71,0.1); border: 1px solid rgba(232,255,71,0.2); display: inline-flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 11px; color: #e8ff47; }
    .ad-preview { font-size: 13px; color: #4a4a52; line-height: 1.65; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .ad-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .ad-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }

    .ad-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; text-decoration: none; border: 1px solid; width: 100%; box-sizing: border-box; }
    .ad-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .ad-btn-view { color: #6b6b72; background: transparent; border-color: rgba(255,255,255,0.1); }
    .ad-btn-view:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .ad-btn-approve { color: #22c55e; background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); }
    .ad-btn-approve:hover:not(:disabled) { background: rgba(34,197,94,0.16); }
    .ad-btn-reject { color: #ff4444; background: rgba(255,68,68,0.08); border-color: rgba(255,68,68,0.25); }
    .ad-btn-reject:hover:not(:disabled) { background: rgba(255,68,68,0.15); }
    .ad-btn-reject.open { background: rgba(255,68,68,0.15); }

    .ad-reject-panel { margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.06); }
    .ad-reject-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,68,68,0.5); margin-bottom: 10px; }
    .ad-reject-ta { width: 100%; background: #0d0d0f; border: 1px solid rgba(255,68,68,0.2); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #b0b0b8; font-family: 'DM Sans', sans-serif; outline: none; resize: vertical; min-height: 90px; transition: border-color 0.18s; box-sizing: border-box; line-height: 1.6; }
    .ad-reject-ta:focus { border-color: rgba(255,68,68,0.4); }
    .ad-reject-ta::placeholder { color: #2e2e35; }
    .ad-reject-row { display: flex; gap: 8px; margin-top: 12px; }
    .ad-reject-send { padding: 8px 16px; border-radius: 8px; border: none; background: #ff4444; color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.18s; }
    .ad-reject-send:hover:not(:disabled) { background: #ff6666; }
    .ad-reject-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .ad-reject-cancel { padding: 8px 14px; border-radius: 8px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #6b6b72; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.18s; }
    .ad-reject-cancel:hover { color: #f0f0ee; }

    @media (max-width: 560px) {
      .ad-card-inner { flex-direction: column; }
      .ad-card-actions { flex-direction: row; min-width: 0; width: 100%; }
      .ad-btn { flex: 1; }
    }
  `}</style>
);

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState("");
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
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
    if (!rejectMessage.trim()) return;
    try {
      setProcessing(postId);
      await apiService.rejectPost(postId, rejectMessage);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setRejectingId(null);
      setRejectMessage("");
      showToast("success", "Post rejected with feedback.");
    } catch {
      showToast("error", "Failed to reject post.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <>
      <AdminStyles />
      <div className="ad-root">
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

        <div className="ad-hero">
          <div className="ad-hero-inner">
            <div>
              <div className="ad-hero-label">
                <ShieldCheck size={11} /> Admin Panel
              </div>
              <div className="ad-hero-title">Review Queue</div>
              <p className="ad-hero-sub">
                Posts waiting for your approval before going live.
              </p>
            </div>
            {!loading && (
              <div>
                <div className="ad-count-num">
                  {String(posts.length).padStart(2, "0")}
                </div>
                <div className="ad-count-lbl">pending</div>
              </div>
            )}
          </div>
        </div>

        <div className="ad-body">
          {loading ? (
            <div className="ad-spinner" />
          ) : posts.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-icon">
                <CheckCircle size={28} color="#22c55e" />
              </div>
              <div className="ad-empty-title">All Clear!</div>
              <p className="ad-empty-sub">No posts waiting for review.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="ad-card">
                <div className="ad-card-inner">
                  <div className="ad-card-content">
                    <div className="ad-badges">
                      <span className="ad-badge-pending">
                        ⏳ Pending Review
                      </span>
                      {post.category && (
                        <span className="ad-badge-cat">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <div className="ad-post-title">{post.title}</div>
                    <div className="ad-meta">
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
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {post.readingTime && (
                        <span className="ad-meta-item">
                          {post.readingTime} min read
                        </span>
                      )}
                    </div>
                    <p className="ad-preview">
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

                  <div className="ad-card-actions">
                    <Link
                      to={`/posts/${post.id}`}
                      className="ad-btn ad-btn-view"
                    >
                      <Eye size={12} /> Preview
                    </Link>
                    <button
                      className="ad-btn ad-btn-approve"
                      disabled={processing === post.id}
                      onClick={() => handleApprove(post.id)}
                    >
                      <CheckCircle size={12} />
                      {processing === post.id ? "..." : "Approve"}
                    </button>
                    <button
                      className={`ad-btn ad-btn-reject ${rejectingId === post.id ? "open" : ""}`}
                      disabled={processing === post.id}
                      onClick={() => {
                        setRejectingId(
                          rejectingId === post.id ? null : post.id,
                        );
                        setRejectMessage("");
                      }}
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                </div>

                {rejectingId === post.id && (
                  <div className="ad-reject-panel">
                    <div className="ad-reject-lbl">
                      Rejection Feedback — shown to the author
                    </div>
                    <textarea
                      className="ad-reject-ta"
                      placeholder="Explain why this post needs revision..."
                      value={rejectMessage}
                      onChange={(e) => setRejectMessage(e.target.value)}
                      autoFocus
                    />
                    <div className="ad-reject-row">
                      <button
                        className="ad-reject-send"
                        disabled={
                          !rejectMessage.trim() || processing === post.id
                        }
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
                          setRejectMessage("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
