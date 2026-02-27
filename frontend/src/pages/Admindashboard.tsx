import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService, Post } from "../services/apiService";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { CheckCircle, XCircle, Eye, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg border transition-all ${
            toast.type === "success"
              ? "bg-success-50 border-success-200 text-success-700"
              : "bg-danger-50 border-danger-200 text-danger-700"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-default-200 bg-default-50 px-6 py-10">
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-primary" />
              <p className="text-primary text-xs font-mono tracking-[0.3em] uppercase">
                Admin Panel
              </p>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
              Review Queue
            </h1>
            <p className="text-default-400 text-base">
              Posts waiting for your approval before going live.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-primary">
              {posts.length}
            </div>
            <div className="text-default-400 text-sm font-medium">pending</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-success-50 border border-success-200 flex items-center justify-center text-3xl mx-auto mb-5">
              <CheckCircle size={32} className="text-success-500" />
            </div>
            <p className="text-foreground text-xl font-bold mb-2">All clear!</p>
            <p className="text-default-400 text-sm">
              No posts waiting for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                shadow="none"
                className="border border-warning-200 hover:shadow-sm transition-all duration-200"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Chip
                          size="sm"
                          color="warning"
                          variant="flat"
                          className="font-semibold"
                        >
                          Pending Review
                        </Chip>
                        {post.category && (
                          <span className="text-xs text-default-400 bg-default-100 px-2 py-0.5 rounded-md font-mono">
                            {post.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 truncate">
                        {post.title}
                      </h3>

                      {/* Author + Date */}
                      <div className="flex items-center gap-3 text-sm text-default-400 mb-3 flex-wrap">
                        {post.author && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {post.author.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-default-600">
                                {post.author.name}
                              </span>
                            </div>
                            <span>·</span>
                          </>
                        )}
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                        {post.readingTime && (
                          <>
                            <span>·</span>
                            <span>{post.readingTime} min read</span>
                          </>
                        )}
                      </div>

                      {/* Preview */}
                      <p className="text-default-400 text-sm line-clamp-2 leading-relaxed mb-3">
                        {post.content.replace(/<[^>]+>/g, "").substring(0, 200)}
                        ...
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {post.tags.map((tag) => (
                            <Chip key={tag.id} size="sm" variant="flat">
                              #{tag.name}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 min-w-[120px]">
                      <Button
                        as={Link}
                        to={`/posts/${post.id}`}
                        size="sm"
                        variant="flat"
                        startContent={<Eye size={13} />}
                        className="font-semibold"
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        isLoading={processing === post.id}
                        onPress={() => handleApprove(post.id)}
                        startContent={
                          processing !== post.id ? (
                            <CheckCircle size={13} />
                          ) : undefined
                        }
                        className="font-semibold"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isDisabled={processing === post.id}
                        onPress={() => {
                          setRejectingId(
                            rejectingId === post.id ? null : post.id,
                          );
                          setRejectMessage("");
                        }}
                        startContent={<XCircle size={13} />}
                        className="font-semibold"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>

                  {/* Reject Panel */}
                  {rejectingId === post.id && (
                    <div className="mt-5 pt-5 border-t border-default-200">
                      <p className="text-xs font-mono text-default-400 uppercase tracking-wider mb-3">
                        Rejection Feedback — shown to the author
                      </p>
                      <Textarea
                        value={rejectMessage}
                        onValueChange={setRejectMessage}
                        placeholder="Explain why this post needs revision..."
                        minRows={3}
                        classNames={{
                          inputWrapper:
                            "bg-default-100 border border-default-200",
                        }}
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          color="danger"
                          isDisabled={!rejectMessage.trim()}
                          isLoading={processing === post.id}
                          onPress={() => handleReject(post.id)}
                          className="font-semibold"
                        >
                          Send Feedback & Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => {
                            setRejectingId(null);
                            setRejectMessage("");
                          }}
                          className="font-semibold"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
