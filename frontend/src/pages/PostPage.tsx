import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Card, CardBody, Chip, Button, Avatar } from "@nextui-org/react";
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Share,
} from "lucide-react";
import { apiService, Post } from "../services/apiService";

interface PostPageProps {
  isAuthenticated?: boolean;
  currentUserId?: string;
}

const PostPage: React.FC<PostPageProps> = ({
  isAuthenticated,
  currentUserId,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!post || !window.confirm("Are you sure you want to delete this post?"))
      return;

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate("/");
    } catch {
      setError("Failed to delete the post. Please try again later.");
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const createSanitizedHTML = (content: string) => ({
    __html: DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "strong", "em", "br"],
      ALLOWED_ATTR: [],
    }),
  });

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-10 bg-default-200 rounded-xl w-3/4 mb-6" />
        <div className="h-4 bg-default-200 rounded w-full mb-3" />
        <div className="h-4 bg-default-200 rounded w-5/6 mb-3" />
        <div className="h-4 bg-default-200 rounded w-4/6" />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-danger mb-6">{error || "Post not found"}</p>
        <Button
          as={Link}
          to="/"
          variant="flat"
          startContent={<ArrowLeft size={16} />}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-default-100/40">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        {/* ===== Top Bar ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <Button
            as={Link}
            to="/"
            variant="light"
            startContent={<ArrowLeft size={16} />}
          >
            Back
          </Button>

          <div className="flex gap-2">
            {isAuthenticated && (
              <>
                <Button
                  as={Link}
                  to={`/posts/${post.id}/edit`}
                  variant="flat"
                  startContent={<Edit size={16} />}
                >
                  Edit
                </Button>
                <Button
                  variant="flat"
                  color="danger"
                  startContent={<Trash size={16} />}
                  isLoading={isDeleting}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}
            <Button
              variant="flat"
              startContent={<Share size={16} />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </div>

        {/* ===== Article Card ===== */}
        <Card className="bg-background/80 backdrop-blur-xl border border-default-200/60 shadow-xl rounded-3xl">
          <CardBody className="p-6 sm:p-10">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-default-600 mb-10">
              <div className="flex items-center gap-2">
                <Avatar name={post.author?.name} size="sm" />
                <span className="font-medium text-foreground">
                  {post.author?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Content */}
            <article
              className="
                prose prose-base sm:prose-lg max-w-none
                prose-headings:font-bold
                prose-p:text-default-700
                leading-relaxed
                mb-14
              "
              dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
            />

            {/* Footer */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-default-200">
              <Chip color="primary" variant="flat">
                {post.category.name}
              </Chip>
              {post.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  variant="flat"
                  startContent={<Tag size={14} />}
                >
                  {tag.name}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
};

export default PostPage;
