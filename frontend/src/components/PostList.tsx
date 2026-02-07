import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Button,
} from "@nextui-org/react";
import { Post } from "../services/apiService";
import { Calendar, Clock, Tag, ArrowRight, User } from "lucide-react";
import DOMPurify from "dompurify";

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, loading, error }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const createExcerpt = (content: string) => {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "strong", "em", "br"],
      ALLOWED_ATTR: [],
    });

    const div = document.createElement("div");
    div.innerHTML = sanitized;

    let text = div.textContent || "";
    text = text.trim();

    if (text.length > 180) {
      text = text.substring(0, 180).split(" ").slice(0, -1).join(" ") + "…";
    }

    return text;
  };

  if (error) {
    return (
      <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
        <div className="space-y-2">
          <p className="text-danger font-medium">{error}</p>
          <p className="text-sm text-danger/70">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-default-200 animate-pulse">
            <CardHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
              <div className="w-full space-y-3">
                <div className="h-6 bg-default-200 rounded-lg w-4/5" />
                <div className="h-4 bg-default-100 rounded w-2/5" />
              </div>
            </CardHeader>
            <CardBody className="px-5 sm:px-6 py-2">
              <div className="space-y-2">
                <div className="h-4 bg-default-100 rounded w-full" />
                <div className="h-4 bg-default-100 rounded w-full" />
                <div className="h-4 bg-default-100 rounded w-4/5" />
              </div>
            </CardBody>
            <CardFooter className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
              <div className="w-full space-y-3">
                <div className="flex gap-3">
                  <div className="h-6 bg-default-100 rounded-full w-20" />
                  <div className="h-6 bg-default-100 rounded-full w-16" />
                </div>
                <div className="h-9 bg-default-200 rounded-lg w-28" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  /* ---------- Empty State ---------- */
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20 px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-default-100 flex items-center justify-center">
            <Tag size={32} className="text-default-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            No posts found
          </h3>
          <p className="text-sm sm:text-base text-default-500">
            Try adjusting your filters or check back later for new content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {posts.map((post) => (
        <Card
          key={post.id}
          isPressable
          onPress={() => navigate(`/posts/${post.id}`)}
          className="
            group border border-default-200/50 
            transition-all duration-300 ease-out
            hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10
            hover:border-primary/30
            bg-gradient-to-b from-background to-default-50/30
          "
          classNames={{
            base: "h-full flex flex-col",
          }}
        >
          {/* Header */}
          <CardHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex-col items-start gap-2">
            {/* Category Badge */}
            <Chip
              size="sm"
              color="primary"
              variant="flat"
              className="mb-1 font-semibold"
            >
              {post.category.name}
            </Chip>

            {/* Title */}
            <h2
              className="
                text-lg sm:text-xl font-bold leading-tight
                group-hover:text-primary transition-colors duration-300
                line-clamp-2
              "
            >
              {post.title}
            </h2>

            {/* Author */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-default-500">
              <User size={14} className="text-default-400" />
              <span className="font-medium">{post.author?.name}</span>
            </div>
          </CardHeader>

          {/* Body */}
          <CardBody className="px-5 sm:px-6 py-2 flex-grow">
            <p className="text-sm sm:text-base text-default-600 leading-relaxed line-clamp-3">
              {createExcerpt(post.content)}
            </p>
          </CardBody>

          {/* Footer */}
          <CardFooter className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 flex flex-col gap-3 sm:gap-4">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-default-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-default-400" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-default-300" />
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-default-400" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag.id}
                    size="sm"
                    variant="bordered"
                    startContent={<Tag size={10} />}
                    className="text-xs border-default-300 hover:border-primary/50 transition-colors"
                  >
                    {tag.name}
                  </Chip>
                ))}
                {post.tags.length > 3 && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    +{post.tags.length - 3}
                  </Chip>
                )}
              </div>
            )}

            {/* Read More Button */}
            <Button
              size="sm"
              color="primary"
              variant="flat"
              endContent={
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              }
              className="mt-1 self-start font-semibold group-hover:bg-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/posts/${post.id}`);
              }}
            >
              Read Article
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
