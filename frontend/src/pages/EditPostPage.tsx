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
      if (id) {
        await apiService.updatePost(id, { ...postData, id });
      } else {
        await apiService.createPost(postData);
      }
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

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-5">
            <div className="h-5 bg-default-100 rounded w-40" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-default-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-7 bg-default-200 rounded w-40" />
                <div className="h-4 bg-default-100 rounded w-56" />
              </div>
            </div>
            <div className="bg-content1 border border-default-200 rounded-2xl p-6 space-y-4">
              <div className="h-11 bg-default-100 rounded-xl" />
              <div className="h-56 bg-default-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-11 bg-default-100 rounded-xl" />
                <div className="h-11 bg-default-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-xs text-default-400">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 hover:text-foreground transition-colors px-1.5 py-1 rounded hover:bg-default-100"
          >
            <Home size={12} /> Home
          </button>
          {isEdit && post && (
            <>
              <span>/</span>
              <button
                onClick={() => navigate(`/posts/${id}`)}
                className="hover:text-foreground transition-colors px-1.5 py-1 rounded hover:bg-default-100 max-w-[160px] truncate"
              >
                {post.title.length > 30
                  ? post.title.substring(0, 30) + "…"
                  : post.title}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium">
            {isEdit ? "Edit" : "New Post"}
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={handleCancel}
            className="w-10 h-10 rounded-xl border border-default-200 flex items-center justify-center text-default-500 hover:text-foreground hover:border-default-300 hover:bg-default-100 transition-all flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isEdit ? "bg-primary/10" : "bg-success/10"}`}
          >
            {isEdit ? (
              <Edit3 size={18} className="text-primary" />
            ) : (
              <Plus size={20} className="text-success" strokeWidth={2.5} />
            )}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {isEdit ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-sm text-default-400 hidden sm:block">
              {isEdit
                ? "Update your content and save changes"
                : "Write and publish a new article"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-danger-50 border border-danger-200 px-4 py-3">
            <AlertCircle
              size={16}
              className="text-danger mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Form card */}
        <div className="bg-content1 border border-default-200 rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
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
        <p className="mt-4 text-xs text-default-400 text-center">
          💡{" "}
          {isEdit
            ? "Changes will be saved to your existing post."
            : "Your post will be created as a draft by default."}
        </p>
      </div>
    </div>
  );
};

export default EditPostPage;
