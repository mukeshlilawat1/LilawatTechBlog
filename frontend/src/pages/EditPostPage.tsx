import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Edit3, Plus, AlertCircle } from "lucide-react";
import {
  apiService,
  Post,
  Category,
  Tag,
  PostStatus,
} from "../services/apiService";
import PostForm from "../components/PostForm";

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

    .ep-root {
      background: #0a0a0b;
      min-height: 100vh;
      font-family: 'DM Sans', sans-serif;
      padding-bottom: 80px;
    }

    .ep-inner {
      max-width: 860px;
      margin: 0 auto;
      padding: 32px 20px 40px;
    }

    /* Breadcrumb */
    .ep-breadcrumb {
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 28px;
      font-family: 'DM Mono', monospace;
      font-size: 11px; color: #4a4a52;
    }
    .ep-breadcrumb-btn {
      display: flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer;
      color: #4a4a52; font-family: 'DM Mono', monospace; font-size: 11px;
      padding: 3px 6px; border-radius: 5px; transition: all 0.15s;
    }
    .ep-breadcrumb-btn:hover { color: #f0f0ee; background: rgba(255,255,255,0.05); }
    .ep-breadcrumb-sep { color: #2a2a32; }
    .ep-breadcrumb-current { color: #e8ff47; font-weight: 500; }

    /* Header */
    .ep-header {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 24px;
    }
    .ep-back-btn {
      width: 38px; height: 38px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.03);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #6b6b72;
      transition: all 0.18s; flex-shrink: 0;
    }
    .ep-back-btn:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }

    .ep-icon-badge {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ep-icon-badge.edit   { background: rgba(232,255,71,0.1);  color: #e8ff47; }
    .ep-icon-badge.create { background: rgba(34,197,94,0.1);   color: #22c55e; }

    .ep-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(28px, 5vw, 40px);
      letter-spacing: 0.02em; color: #f0f0ee; line-height: 1;
    }
    .ep-subtitle {
      font-size: 12px; color: #6b6b72;
      font-family: 'DM Mono', monospace; margin-top: 3px;
    }

    /* Error */
    .ep-error {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 16px; border-radius: 12px;
      background: rgba(255,68,68,0.06);
      border: 1px solid rgba(255,68,68,0.2);
      margin-bottom: 20px;
    }
    .ep-error p { font-size: 13px; color: #ff4444; }

    /* Card wrapper */
    .ep-card {
      background: #111113;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px;
      overflow: hidden;
    }
    .ep-card-body { padding: 28px 24px; }
    @media (min-width: 640px) { .ep-card-body { padding: 36px 36px; } }

    /* Tip */
    .ep-tip {
      margin-top: 16px; text-align: center;
      font-family: 'DM Mono', monospace;
      font-size: 11px; color: #3a3a42;
    }

    /* ── Skeleton ── */
    .ep-skel { animation: epPulse 1.5s ease-in-out infinite; }
    @keyframes epPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
    .ep-skel-line { background: #1a1a1d; border-radius: 6px; }
    .ep-skel-block { background: #111113; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; }
  `}</style>
);

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, tagsRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setCategories(categoriesRes);
        setTags(tagsRes);
        if (id) {
          const postRes = await apiService.getPost(id);
          setPost(postRes);
        }
        setError(null);
      } catch {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (postData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
    status: PostStatus;
  }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (id) await apiService.updatePost(id, { ...postData, id });
      else await apiService.createPost(postData);
      navigate("/");
    } catch {
      setError("Failed to save the post. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(`/posts/${id}`);
    else navigate("/");
  };

  const isEdit = !!id;

  /* ── Loading ── */
  if (loading)
    return (
      <>
        <PageStyles />
        <div className="ep-root">
          <div className="ep-inner ep-skel">
            <div
              className="ep-skel-line"
              style={{ height: 14, width: 180, marginBottom: 28 }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                className="ep-skel-line"
                style={{ width: 38, height: 38, borderRadius: 10 }}
              />
              <div
                className="ep-skel-line"
                style={{ width: 38, height: 38, borderRadius: 10 }}
              />
              <div>
                <div
                  className="ep-skel-line"
                  style={{ height: 28, width: 200, marginBottom: 6 }}
                />
                <div
                  className="ep-skel-line"
                  style={{ height: 12, width: 160 }}
                />
              </div>
            </div>
            <div className="ep-skel-block">
              <div
                className="ep-skel-line"
                style={{ height: 44, borderRadius: 10, marginBottom: 16 }}
              />
              <div
                className="ep-skel-line"
                style={{ height: 220, borderRadius: 10, marginBottom: 16 }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div
                  className="ep-skel-line"
                  style={{ height: 44, borderRadius: 10 }}
                />
                <div
                  className="ep-skel-line"
                  style={{ height: 44, borderRadius: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <PageStyles />
      <div className="ep-root">
        <div className="ep-inner">
          {/* Breadcrumb */}
          <nav className="ep-breadcrumb">
            <button className="ep-breadcrumb-btn" onClick={() => navigate("/")}>
              <Home size={11} /> Home
            </button>
            {isEdit && post && (
              <>
                <span className="ep-breadcrumb-sep">/</span>
                <button
                  className="ep-breadcrumb-btn"
                  onClick={() => navigate(`/posts/${id}`)}
                >
                  {post.title.length > 28
                    ? post.title.substring(0, 28) + "…"
                    : post.title}
                </button>
              </>
            )}
            <span className="ep-breadcrumb-sep">/</span>
            <span className="ep-breadcrumb-current">
              {isEdit ? "Edit" : "New Post"}
            </span>
          </nav>

          {/* Header */}
          <div className="ep-header">
            <button className="ep-back-btn" onClick={handleCancel}>
              <ArrowLeft size={17} />
            </button>
            <div className={`ep-icon-badge ${isEdit ? "edit" : "create"}`}>
              {isEdit ? (
                <Edit3 size={17} />
              ) : (
                <Plus size={19} strokeWidth={2.5} />
              )}
            </div>
            <div>
              <div className="ep-title">
                {isEdit ? "Edit Post" : "Create New Post"}
              </div>
              <div className="ep-subtitle">
                {isEdit
                  ? "Update your content and save changes"
                  : "Write and publish a new article"}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="ep-error">
              <AlertCircle
                size={15}
                color="#ff4444"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <p>{error}</p>
            </div>
          )}

          {/* Form card */}
          <div className="ep-card">
            <div className="ep-card-body">
              <PostForm
                initialPost={post}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                categories={categories}
                availableTags={tags}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Tip */}
          <p className="ep-tip">
            {isEdit
              ? "◈ Changes will be saved to your existing post"
              : "◈ Your post will be created as a draft by default"}
          </p>
        </div>
      </div>
    </>
  );
};

export default EditPostPage;
