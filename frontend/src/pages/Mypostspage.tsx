import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService, Post, PostStatus } from "../services/apiService";
import { Button, Chip, Card, CardBody, Spinner } from "@nextui-org/react";
import { Plus, Send, Eye, Edit2, ChevronDown, ChevronUp } from "lucide-react";

const statusConfig: Record<
  PostStatus,
  {
    label: string;
    color: "default" | "warning" | "success" | "danger";
  }
> = {
  [PostStatus.DRAFT]: { label: "Draft", color: "default" },
  [PostStatus.PENDING]: { label: "Under Review", color: "warning" },
  [PostStatus.PUBLISHED]: { label: "Published", color: "success" },
  [PostStatus.REJECTED]: { label: "Rejected", color: "danger" },
};

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

  const counts = {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-default-200 bg-default-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs font-mono tracking-[0.3em] uppercase mb-2">
            My Workspace
          </p>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
            My Posts
          </h1>
          <p className="text-default-400 text-base">
            Manage your writing — draft, submit, and track your stories.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap items-center">
          {(
            [
              "ALL",
              PostStatus.DRAFT,
              PostStatus.PENDING,
              PostStatus.PUBLISHED,
              PostStatus.REJECTED,
            ] as const
          ).map((status) => {
            const isActive = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-default-100 text-default-600 border-default-200 hover:bg-default-200 hover:text-foreground"
                }`}
              >
                {status === "ALL"
                  ? "All Posts"
                  : statusConfig[status as PostStatus].label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${isActive ? "bg-white/20" : "bg-default-200 text-default-500"}`}
                >
                  {counts[status]}
                </span>
              </button>
            );
          })}

          <Button
            as={Link}
            to="/posts/new"
            size="sm"
            startContent={<Plus size={16} />}
            className="ml-auto font-black text-white bg-gradient-to-r from-primary to-secondary"
          >
            New Post
          </Button>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✍️</div>
            <p className="text-default-400 text-lg font-semibold mb-2">
              No posts here yet.
            </p>
            <Button
              as={Link}
              to="/posts/new"
              startContent={<Plus size={16} />}
              className="mt-2 font-black text-white bg-gradient-to-r from-primary to-secondary"
            >
              Write your first post
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const status = post.status as PostStatus;
              const cfg = statusConfig[status];
              const isRejected = status === PostStatus.REJECTED;
              const isDraft = status === PostStatus.DRAFT;
              const isPending = status === PostStatus.PENDING;
              const isPublished = status === PostStatus.PUBLISHED;

              return (
                <Card
                  key={post.id}
                  shadow="none"
                  className="border border-default-200 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Chip
                            size="sm"
                            color={cfg.color}
                            variant="flat"
                            className="font-semibold"
                          >
                            {cfg.label}
                          </Chip>
                          {post.category && (
                            <span className="text-xs text-default-400 bg-default-100 px-2 py-0.5 rounded-md font-mono">
                              {post.category.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-foreground truncate mb-1">
                          {post.title}
                        </h3>
                        <p className="text-default-400 text-sm">
                          {new Date(post.updatedAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                          {post.readingTime &&
                            ` · ${post.readingTime} min read`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {(isDraft || isRejected) && (
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            isLoading={submitting === post.id}
                            onPress={() => handleSubmitForReview(post.id)}
                            startContent={
                              submitting !== post.id ? (
                                <Send size={13} />
                              ) : undefined
                            }
                            className="font-semibold"
                          >
                            Submit for Review
                          </Button>
                        )}
                        {isPending && (
                          <Chip
                            size="sm"
                            color="warning"
                            variant="flat"
                            className="font-medium"
                          >
                            Awaiting Review...
                          </Chip>
                        )}
                        {(isDraft || isRejected) && (
                          <Button
                            as={Link}
                            to={`/posts/${post.id}/edit`}
                            size="sm"
                            variant="flat"
                            startContent={<Edit2 size={13} />}
                            className="font-semibold"
                          >
                            Edit
                          </Button>
                        )}
                        {isPublished && (
                          <Button
                            as={Link}
                            to={`/posts/${post.id}`}
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<Eye size={13} />}
                            className="font-semibold"
                          >
                            View Post
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Rejection feedback */}
                    {isRejected && post.rejectionMessage && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            setExpandedRejection(
                              expandedRejection === post.id ? null : post.id,
                            )
                          }
                          className="flex items-center gap-1.5 text-danger text-sm font-semibold hover:opacity-80 transition-opacity"
                        >
                          {expandedRejection === post.id ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                          {expandedRejection === post.id
                            ? "Hide admin feedback"
                            : "View admin feedback"}
                        </button>
                        {expandedRejection === post.id && (
                          <div className="mt-3 p-4 rounded-xl bg-danger-50 border border-danger-200">
                            <p className="text-xs font-mono text-danger-400 uppercase tracking-wider mb-2">
                              Admin Feedback
                            </p>
                            <p className="text-danger-700 text-sm leading-relaxed">
                              {post.rejectionMessage}
                            </p>
                            <p className="text-danger-400 text-xs mt-3 font-medium">
                              Edit your post and resubmit when ready.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
