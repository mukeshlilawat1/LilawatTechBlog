import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { Plus, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService, Post } from "../services/apiService";
import PostList from "../components/PostList";

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
        setError("Failed to load drafts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [page, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center border border-warning/20">
                  <FileText size={24} className="text-warning" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    My Drafts
                  </h1>
                  <p className="text-sm sm:text-base text-default-500 mt-1">
                    {drafts && drafts.length > 0
                      ? `${drafts.length} unpublished ${drafts.length === 1 ? "post" : "posts"}`
                      : "Manage your unpublished posts"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              as={Link}
              to="/posts/new"
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Create New Post
            </Button>
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
                  Please try refreshing the page or contact support if the issue
                  persists.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="border border-default-200/50 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardBody className="p-4 sm:p-6 lg:p-8">
            {/* Empty State */}
            {drafts?.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 text-center px-4">
                <div className="relative mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center border-2 border-warning/20">
                    <FileText size={40} className="text-warning" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Sparkles size={16} className="text-white" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  No drafts yet
                </h3>
                <p className="text-sm sm:text-base text-default-600 max-w-md mb-6">
                  Start writing your first draft and publish when you're ready.
                  Your ideas deserve to be shared!
                </p>

                <Button
                  as={Link}
                  to="/posts/new"
                  color="primary"
                  size="lg"
                  startContent={<Plus size={20} />}
                  className="font-semibold shadow-lg shadow-primary/30"
                >
                  Create Your First Post
                </Button>
              </div>
            )}

            {/* Drafts List */}
            {(loading || (drafts && drafts.length > 0)) && (
              <div className="space-y-6">
                {/* Stats Bar */}
                {!loading && drafts && drafts.length > 0 && (
                  <div className="flex items-center justify-between pb-4 border-b border-default-200">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20">
                        <p className="text-xs sm:text-sm font-semibold text-warning">
                          {drafts.length}{" "}
                          {drafts.length === 1 ? "Draft" : "Drafts"}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-default-500">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Post List */}
                <PostList
                  posts={drafts}
                  loading={loading}
                  error={error}
                  page={page}
                  sortBy={sortBy}
                  onPageChange={setPage}
                  onSortChange={setSortBy}
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DraftsPage;
