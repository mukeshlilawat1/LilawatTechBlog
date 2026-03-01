import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  User,
} from "lucide-react";
import { apiService, Post } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const PostPageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    .ppp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    /* Top bar */
    .ppp-topbar { max-width: 780px; margin: 0 auto; padding: 28px 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .ppp-back {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
      color: #6b6b72; background: transparent; border: 1px solid rgba(255,255,255,0.1);
      text-decoration: none; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .ppp-back:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .ppp-topbar-actions { display: flex; gap: 8px; }
    .ppp-action-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; border: 1px solid; background: transparent;
    }
    .ppp-btn-edit   { color: #e8ff47; border-color: rgba(232,255,71,0.25); }
    .ppp-btn-edit:hover { background: rgba(232,255,71,0.08); }
    .ppp-btn-delete { color: #ff4444; border-color: rgba(255,68,68,0.25); }
    .ppp-btn-delete:hover { background: rgba(255,68,68,0.08); }
    .ppp-btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }
    .ppp-btn-share  { color: #6b6b72; border-color: rgba(255,255,255,0.1); }
    .ppp-btn-share:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }

    /* Article */
    .ppp-article { max-width: 780px; margin: 0 auto; padding: 40px 24px 80px; }

    /* Category + tags top */
    .ppp-top-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .ppp-cat-chip {
      display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 5px;
      font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      color: #e8ff47; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2);
    }
    .ppp-tag-chip {
      display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 4px;
      font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52;
      background: #18181b; border: 1px solid rgba(255,255,255,0.06);
    }

    /* Title */
    .ppp-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(36px, 7vw, 62px);
      letter-spacing: 0.02em; color: #f0f0ee; line-height: 1.05;
      margin-bottom: 24px;
    }

    /* Author row */
    .ppp-author-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .ppp-author-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #1e1e22, #2a2a30);
      border: 1px solid rgba(232,255,71,0.2);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 15px; color: #e8ff47; flex-shrink: 0;
    }
    .ppp-author-name { font-size: 14px; font-weight: 700; color: #f0f0ee; }
    .ppp-author-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .ppp-meta-item { display: flex; align-items: center; gap: 5px; font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }

    /* Content prose */
    .ppp-content {
      font-family: 'Lora', serif;
      font-size: 17px; line-height: 1.85;
      color: #b0b0b8;
    }
    .ppp-content p   { margin-bottom: 1.4em; }
    .ppp-content h1  { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 0.02em; color: #f0f0ee; margin: 1.8em 0 0.6em; }
    .ppp-content h2  { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.02em; color: #f0f0ee; margin: 1.6em 0 0.5em; }
    .ppp-content h3  { font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 700; color: #e0e0de; margin: 1.4em 0 0.4em; }
    .ppp-content strong { color: #f0f0ee; font-weight: 700; }
    .ppp-content em   { font-style: italic; color: #c8c8c0; }
    .ppp-content a    { color: #e8ff47; text-decoration: underline; text-underline-offset: 3px; }
    .ppp-content code {
      font-family: 'DM Mono', monospace; font-size: 13px;
      background: #18181b; border: 1px solid rgba(255,255,255,0.08);
      padding: 2px 7px; border-radius: 5px; color: #e8ff47;
    }
    .ppp-content pre  {
      background: #111113; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
      padding: 20px; overflow-x: auto; margin: 1.6em 0;
    }
    .ppp-content pre code { background: none; border: none; padding: 0; color: #b0b0b8; }
    .ppp-content blockquote {
      border-left: 3px solid #e8ff47; padding-left: 20px; margin: 1.6em 0;
      color: #6b6b72; font-style: italic;
    }
    .ppp-content ul, .ppp-content ol { padding-left: 24px; margin-bottom: 1.4em; }
    .ppp-content li  { margin-bottom: 0.5em; }
    .ppp-content img { max-width: 100%; border-radius: 12px; margin: 1.6em 0; }

    /* Bottom tags */
    .ppp-bottom-tags { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.07); margin-top: 48px; }

    /* Loading */
    @keyframes ppp-spin { to { transform: rotate(360deg); } }
    .ppp-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0b; }
    .ppp-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: ppp-spin 0.7s linear infinite; }

    /* Shimmer skeleton */
    @keyframes ppp-shimmer { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
    .ppp-skel { background: #18181b; border-radius: 8px; animation: ppp-shimmer 1.6s ease-in-out infinite; }

    /* Error */
    .ppp-error { max-width: 480px; margin: 80px auto; padding: 24px; background: rgba(255,68,68,0.05); border: 1px solid rgba(255,68,68,0.2); border-radius: 14px; }
    .ppp-error p { color: rgba(255,68,68,0.85); font-size: 14px; margin-bottom: 16px; }
  `}</style>
);

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated, isAdmin, profile } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Post ID is required");
        const fetchedPost = await apiService.getPost(id);
        setPost(fetchedPost);
        setError(null);
      } catch {
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const isOwner = !!profile && post?.author?.id === profile.id;
  const canEdit = isAuthenticated && (isAdmin || isOwner);
  const canDelete = isAuthenticated && (isAdmin || isOwner);

  const handleDelete = async () => {
    if (!post || !window.confirm("Delete this post permanently?")) return;
    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate("/");
    } catch {
      setError("Failed to delete the post.");
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: post?.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sanitizedHTML = (content: string) => ({
    __html: DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p",
        "strong",
        "em",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "ul",
        "ol",
        "li",
        "a",
        "code",
        "pre",
        "blockquote",
        "img",
        "figure",
        "figcaption",
        "hr",
        "span",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
    }),
  });

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getInitials = (name?: string) =>
    (name || "A")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <>
        <PostPageStyles />
        <div
          style={{
            background: "#0a0a0b",
            minHeight: "100vh",
            padding: "40px 24px",
          }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div
              className="ppp-skel"
              style={{ height: 20, width: 120, marginBottom: 40 }}
            />
            <div
              className="ppp-skel"
              style={{ height: 14, width: 80, marginBottom: 16 }}
            />
            <div
              className="ppp-skel"
              style={{ height: 60, width: "75%", marginBottom: 24 }}
            />
            <div
              className="ppp-skel"
              style={{ height: 14, width: "100%", marginBottom: 12 }}
            />
            <div
              className="ppp-skel"
              style={{ height: 14, width: "90%", marginBottom: 12 }}
            />
            <div className="ppp-skel" style={{ height: 14, width: "80%" }} />
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <PostPageStyles />
        <div className="ppp-article">
          <div className="ppp-error">
            <p>{error || "Post not found"}</p>
            <Link to="/" className="ppp-back">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PostPageStyles />
      <div className="ppp-root">
        {/* Top bar */}
        <div className="ppp-topbar">
          <Link to="/" className="ppp-back">
            <ArrowLeft size={13} /> Back
          </Link>
          <div className="ppp-topbar-actions">
            {canEdit && (
              <Link
                to={`/posts/${post.id}/edit`}
                className="ppp-action-btn ppp-btn-edit"
              >
                <Edit size={12} /> Edit
              </Link>
            )}
            {canDelete && (
              <button
                className="ppp-action-btn ppp-btn-delete"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                <Trash2 size={12} /> {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
            <button
              className="ppp-action-btn ppp-btn-share"
              onClick={handleShare}
            >
              <Share2 size={12} /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Article */}
        <div className="ppp-article">
          {/* Category + tags */}
          <div className="ppp-top-meta">
            <span className="ppp-cat-chip">{post.category?.name}</span>
            {post.tags?.map((tag) => (
              <span key={tag.id} className="ppp-tag-chip">
                <Tag size={9} />
                {tag.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="ppp-title">{post.title}</h1>

          {/* Author row */}
          <div className="ppp-author-row">
            <div className="ppp-author-avatar">
              {getInitials(post.author?.name)}
            </div>
            <div>
              <div className="ppp-author-name">
                {post.author?.name || "Unknown Author"}
              </div>
              <div className="ppp-author-meta">
                <span className="ppp-meta-item">
                  <Calendar size={11} />
                  {formatDate(post.createdAt)}
                </span>
                {post.readingTime && (
                  <span className="ppp-meta-item">
                    <Clock size={11} />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <article
            className="ppp-content"
            dangerouslySetInnerHTML={sanitizedHTML(post.content)}
          />

          {/* Bottom tags */}
          <div className="ppp-bottom-tags">
            <span className="ppp-cat-chip">{post.category?.name}</span>
            {post.tags?.map((tag) => (
              <span key={tag.id} className="ppp-tag-chip">
                <Tag size={9} />
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
