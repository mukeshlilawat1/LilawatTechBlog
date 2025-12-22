import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Divider,
  Avatar,
} from '@nextui-org/react';
import { 
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Share
} from 'lucide-react';
import { apiService, Post } from '../services/apiService';

interface PostPageProps {
  isAuthenticated?: boolean;
  currentUserId?: string;
}

const PostPage: React.FC<PostPageProps> = ({ 
  isAuthenticated,
  currentUserId
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Post ID is required');
        const fetchedPost = await apiService.getPost(id);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const createSanitizedHTML = (content: string) => {
    return {
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
        ALLOWED_ATTR: []
      })
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full animate-pulse">
          <CardBody>
            <div className="h-8 bg-default-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-2/3"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardBody>
            <p className="text-danger">{error || 'Post not found'}</p>
            <Button
              as={Link}
              to="/"
              color="primary"
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              className="mt-4"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-3">
          <div className="flex justify-between w-full">
            <Button
              as={Link}
              to="/"
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              size="sm"
            >
              Back to Posts
            </Button>
            <div className="flex gap-2">
              {isAuthenticated && (
                <>
                  <Button
                    as={Link}
                    to={`/posts/${post.id}/edit`}
                    color="primary"
                    variant="flat"
                    startContent={<Edit size={16} />}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<Trash size={16} />}
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    size="sm"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="flat"
                startContent={<Share size={16} />}
                onClick={handleShare}
                size="sm"
              >
                Share
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar
                name={post.author?.name}
                size="sm"
              />
              <span className="text-default-600">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-default-500">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-default-500">
              <Clock size={16} />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />
        </CardBody>

        <CardFooter className="flex flex-col items-start gap-4">
          <Divider />
          <div className="flex flex-wrap gap-2">
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostPage;