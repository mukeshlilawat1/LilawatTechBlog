import React from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Chip, Pagination, Select, SelectItem } from '@nextui-org/react';
import { Post } from '../services/apiService';
import { Calendar, Clock, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
  page,
  sortBy,
  onPageChange,
  onSortChange,
}) => {
 
  const navigate = useNavigate();
 
  const sortOptions = [
    { value: "createdAt,desc", label: "Newest First" },
    { value: "createdAt,asc", label: "Oldest First" },
    { value: "title,asc", label: "Title A-Z" },
    { value: "title,desc", label: "Title Z-A" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const createExcerpt = (content: string) => {
    // First sanitize the HTML
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
      ALLOWED_ATTR: []
    });
    
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedContent;
    
    // Get the text content and limit it
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    textContent = textContent.trim();
    
    // Limit to roughly 200 characters, ending at the last complete word
    if (textContent.length > 200) {
      textContent = textContent.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
    }
    
    return textContent;
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const navToPostPage = (post: Post) => {
    navigate(`/posts/${post.id}`)
  }

  return (
    <div className="w-full space-y-6">
      {/* <div className="flex justify-end mb-4">
        <Select
          label="Sort by"
          selectedKeys={[sortBy]}
          className="max-w-xs"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div> */}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full animate-pulse">
              <CardBody>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts?.map((post) => (
              <Card key={post.id} className="w-full p-2" isPressable={true} onPress={() => navToPostPage(post)}>
                <CardHeader className="flex gap-3">                 
                    <div className='flex flex-col'>
                    <h2 className="text-xl font-bold text-left">
                      {post.title}
                    </h2>
                    <p className="text-small text-default-500">
                      by {post.author?.name}
                    </p>                
                    </div>
                </CardHeader>
                <CardBody>
                  <p className="line-clamp-3">
                    {createExcerpt(post.content)}
                  </p>
                </CardBody>
                <CardFooter className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-small text-default-500">
                    <Calendar size={16} />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1 text-small text-default-500">
                    <Clock size={16} />
                    {post.readingTime} min read
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Chip
                      className="bg-primary-100 text-primary"
                    >
                      {post.category.name}
                    </Chip>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        className="bg-default-100"
                        startContent={<Tag size={14} />}
                      >
                        {tag.name}
                      </Chip>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* {posts && posts.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={posts.totalPages}
                page={page}
                onChange={onPageChange}
                showControls
              />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default PostList;