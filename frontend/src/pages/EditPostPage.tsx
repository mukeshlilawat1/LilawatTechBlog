import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { ArrowLeft, Home, Edit3, Plus } from "lucide-react";
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
        const [categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        setCategories(categoriesResponse);
        setTags(tagsResponse);

        if (id) {
          const postResponse = await apiService.getPost(id);
          setPost(postResponse);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load necessary data. Please try again later.");
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
        await apiService.updatePost(id, {
          ...postData,
          id,
        });
      } else {
        await apiService.createPost(postData);
      }

      navigate("/");
    } catch (err) {
      setError("Failed to save the post. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      navigate("/");
    }
  };

  /* ---------- Loading Skeleton ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-default-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <Card className="w-full border border-default-200 shadow-xl">
            <CardBody className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-10 bg-default-200 rounded-lg w-2/3"></div>
                <div className="h-5 bg-default-100 rounded w-1/2"></div>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-default-200 rounded-lg w-full"></div>
                <div className="h-64 bg-default-100 rounded-lg w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-default-200 rounded-lg"></div>
                <div className="h-12 bg-default-200 rounded-lg"></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Breadcrumbs */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs
            size="sm"
            classNames={{
              list: "bg-default-100/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-default-200/50",
            }}
          >
            <BreadcrumbItem
              onPress={() => navigate("/")}
              startContent={<Home size={14} />}
            >
              Home
            </BreadcrumbItem>
            {id && post && (
              <BreadcrumbItem onPress={() => navigate(`/posts/${id}`)}>
                {post.title.length > 30
                  ? post.title.substring(0, 30) + "..."
                  : post.title}
              </BreadcrumbItem>
            )}
            <BreadcrumbItem>{id ? "Edit" : "New Post"}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <Button
              variant="bordered"
              size="lg"
              isIconOnly
              onClick={handleCancel}
              className="w-12 h-12 border-default-300 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <ArrowLeft size={20} />
            </Button>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl 
                  ${
                    id
                      ? "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20"
                      : "bg-gradient-to-br from-success/20 to-success/10 border-success/20"
                  }
                  flex items-center justify-center border
                `}
                >
                  {id ? (
                    <Edit3 size={24} className="text-primary" />
                  ) : (
                    <Plus size={24} className="text-success" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {id ? "Edit Post" : "Create New Post"}
                  </h1>
                  <p className="text-sm sm:text-base text-default-500 mt-1">
                    {id
                      ? "Update your content and refine the details"
                      : "Write and publish a new article"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-danger" />
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-danger font-medium">
                  {error}
                </p>
                <p className="text-xs sm:text-sm text-danger/70 mt-1">
                  Please check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="w-full border border-default-200/50 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardBody className="p-0">
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
          </CardBody>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-lg bg-default-100/50 border border-default-200/50">
          <p className="text-xs sm:text-sm text-default-600 text-center">
            <span className="font-medium">💡 Tip:</span> Save your work
            frequently.
            {id
              ? " Changes will be saved to your existing post."
              : " Your post will be created as a draft by default."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
