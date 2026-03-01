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
    <div
      style={{
        background: "#0a0a0b",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            padding: "12px 18px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background:
              toast.type === "success"
                ? "rgba(34,197,94,0.12)"
                : "rgba(255,68,68,0.10)",
            border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(255,68,68,0.3)"}`,
            color: toast.type === "success" ? "#22c55e" : "#ff4444",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "40px 24px 32px",
          background: "#0a0a0b",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#e8ff47",
                marginBottom: 8,
              }}
            >
              <ShieldCheck size={11} /> Admin Panel
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(32px,6vw,52px)",
                color: "#f0f0ee",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              Review Queue
            </div>
            <p style={{ fontSize: 13, color: "#4a4a52", margin: 0 }}>
              Posts waiting for your approval before going live.
            </p>
          </div>
          {!loading && (
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 52,
                  color: "#e8ff47",
                  lineHeight: 1,
                }}
              >
                {String(posts.length).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#4a4a52",
                  letterSpacing: "0.1em",
                }}
              >
                pending
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 80px" }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 192,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: "2px solid rgba(232,255,71,0.15)",
                borderTopColor: "#e8ff47",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle size={28} color="#22c55e" />
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 30,
                color: "#f0f0ee",
                marginBottom: 6,
              }}
            >
              All Clear!
            </div>
            <p style={{ fontSize: 13, color: "#4a4a52" }}>
              No posts waiting for review.
            </p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "#111113",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: 16,
                  padding: 22,
                  marginBottom: 14,
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 20 }}
                >
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 10px",
                          borderRadius: 5,
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#f59e0b",
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.25)",
                        }}
                      >
                        ⏳ Pending Review
                      </span>
                      {post.category && (
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: "#4a4a52",
                            background: "#18181b",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#f0f0ee",
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        flexWrap: "wrap",
                        marginBottom: 10,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        color: "#4a4a52",
                      }}
                    >
                      {post.author && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "rgba(232,255,71,0.1)",
                              border: "1px solid rgba(232,255,71,0.2)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 11,
                              color: "#e8ff47",
                            }}
                          >
                            {post.author.name.charAt(0).toUpperCase()}
                          </span>
                          <span style={{ color: "#b0b0b8", fontWeight: 600 }}>
                            {post.author.name}
                          </span>
                        </span>
                      )}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Clock size={10} />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {post.readingTime && (
                        <span>{post.readingTime} min read</span>
                      )}
                    </div>

                    <p
                      style={
                        {
                          fontSize: 13,
                          color: "#4a4a52",
                          lineHeight: 1.65,
                          marginBottom: 10,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        } as React.CSSProperties
                      }
                    >
                      {post.content.replace(/<[^>]+>/g, "").substring(0, 200)}
                      ...
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {post.tags.map((tag) => (
                          <span
                            key={tag.id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 10,
                              color: "#4a4a52",
                              background: "#18181b",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <Tag size={9} />#{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flexShrink: 0,
                      minWidth: 110,
                    }}
                  >
                    <Link
                      to={`/posts/${post.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "none",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#6b6b72",
                        background: "transparent",
                      }}
                    >
                      <Eye size={12} /> Preview
                    </Link>
                    <button
                      disabled={processing === post.id}
                      onClick={() => handleApprove(post.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor:
                          processing === post.id ? "not-allowed" : "pointer",
                        border: "1px solid rgba(34,197,94,0.25)",
                        color: "#22c55e",
                        background: "rgba(34,197,94,0.08)",
                        opacity: processing === post.id ? 0.4 : 1,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <CheckCircle size={12} />{" "}
                      {processing === post.id ? "..." : "Approve"}
                    </button>
                    <button
                      disabled={processing === post.id}
                      onClick={() => {
                        setRejectingId(
                          rejectingId === post.id ? null : post.id,
                        );
                        setRejectMessage("");
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor:
                          processing === post.id ? "not-allowed" : "pointer",
                        border: "1px solid rgba(255,68,68,0.25)",
                        color: "#ff4444",
                        background:
                          rejectingId === post.id
                            ? "rgba(255,68,68,0.15)"
                            : "rgba(255,68,68,0.08)",
                        opacity: processing === post.id ? 0.4 : 1,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                </div>

                {/* Reject Panel */}
                {rejectingId === post.id && (
                  <div
                    style={{
                      marginTop: 18,
                      paddingTop: 18,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,68,68,0.5)",
                        marginBottom: 10,
                      }}
                    >
                      Rejection Feedback — shown to the author
                    </p>
                    <textarea
                      value={rejectMessage}
                      onChange={(e) => setRejectMessage(e.target.value)}
                      placeholder="Explain why this post needs revision..."
                      autoFocus
                      style={{
                        width: "100%",
                        background: "#0d0d0f",
                        border: "1px solid rgba(255,68,68,0.2)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        fontSize: 13,
                        color: "#b0b0b8",
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                        resize: "vertical",
                        minHeight: 90,
                        boxSizing: "border-box",
                        lineHeight: 1.6,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        disabled={
                          !rejectMessage.trim() || processing === post.id
                        }
                        onClick={() => handleReject(post.id)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: "none",
                          background: "#ff4444",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor:
                            !rejectMessage.trim() || processing === post.id
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            !rejectMessage.trim() || processing === post.id
                              ? 0.4
                              : 1,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {processing === post.id
                          ? "Sending..."
                          : "Send Feedback & Reject"}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectMessage("");
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 8,
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#6b6b72",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
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
  );
};

export default AdminDashboard;
