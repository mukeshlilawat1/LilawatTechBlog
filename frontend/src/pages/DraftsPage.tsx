import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader,
  CardBody,
  Button,
} from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService, Post } from '../services/apiService';
import PostList from '../components/PostList';

const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt,desc");

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrafts({
          page: page - 1,
          size: 10,
          sort: sortBy,
        });
        setDrafts(response);
        setError(null);
      } catch (err) {
        setError('Failed to load drafts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [page, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Drafts</h1>
          <Button
            as={Link}
            to="/posts/new"
            color="primary"
            startContent={<Plus size={16} />}
          >
            New Post
          </Button>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <PostList
            posts={drafts}
            loading={loading}
            error={error}
            page={page}
            sortBy={sortBy}
            onPageChange={setPage}
            onSortChange={setSortBy}
          />

          {drafts?.length === 0 && !loading && (
            <div className="text-center py-8 text-default-500">
              <p>You don't have any draft posts yet.</p>
              <Button
                as={Link}
                to="/posts/new"
                color="primary"
                variant="flat"
                className="mt-4"
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DraftsPage;