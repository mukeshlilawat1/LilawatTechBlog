import React, { useEffect, useState } from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { apiService, Post, Category, Tag } from "../services/apiService";
import PostList from "../components/PostList";
import { Sparkles, TrendingUp, Layers } from "lucide-react";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedTag, setSelectedTag] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          apiService.getPosts({
            categoryId: selectedCategory,
            tagId: selectedTag,
          }),
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        setPosts(postsRes);
        setCategories(categoriesRes);
        setTags(tagsRes);
        setError(null);
      } catch {
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sortBy, selectedCategory, selectedTag]);

  const handleCategoryChange = (key: string) => {
    setSelectedCategory(key === "all" ? undefined : key);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-background via-background to-default-100/30">
      {/* ===== HERO HEADER ===== */}
      <section className="w-full relative overflow-hidden border-b border-default-200/50">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/10 via-secondary/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-success/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 backdrop-blur-sm shadow-lg shadow-success/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-lg shadow-success/50"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Updated Daily
              </span>
              <Sparkles size={14} className="text-primary animate-pulse" />
            </div>

            {/* Main Title */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60 drop-shadow-sm">
                  LilawatTechBlog
                </span>
              </h1>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-primary via-secondary to-success rounded-full shadow-lg" />
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-default-600 max-w-2xl leading-relaxed font-light">
              Practical engineering blogs, real-world development insights, and
              clean coding practices for production-grade systems.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-background/80 backdrop-blur-sm border border-default-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex flex-col items-start gap-1 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                      <Layers size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
                      {categories.length}
                    </div>
                    <div className="text-xs sm:text-sm text-default-500 font-medium">
                      Categories
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-background/80 backdrop-blur-sm border border-default-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-secondary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10">
                  <div className="flex flex-col items-start gap-1 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center border border-secondary/20">
                      <TrendingUp size={18} className="text-secondary" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
                      {tags.length}
                    </div>
                    <div className="text-xs sm:text-sm text-default-500 font-medium">
                      Topics
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-background/80 backdrop-blur-sm border border-default-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-success/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-success/10">
                  <div className="flex flex-col items-start gap-1 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border border-success/20">
                      <Sparkles size={18} className="text-success" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
                      {posts?.length || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-default-500 font-medium">
                      Articles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES NAVIGATION ===== */}
      <section className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-default-200/50 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs
            selectedKey={selectedCategory}
            onSelectionChange={(key) => handleCategoryChange(key as string)}
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList:
                "gap-3 sm:gap-4 lg:gap-6 w-full overflow-x-auto scrollbar-hide",
              tab: "text-sm sm:text-base font-bold text-default-500 data-[selected=true]:text-foreground px-3 sm:px-4 py-3.5 transition-all hover:text-foreground/80 whitespace-nowrap data-[selected=true]:scale-105",
              cursor:
                "h-1 bg-gradient-to-r from-primary via-secondary to-primary shadow-lg shadow-primary/50 rounded-full",
            }}
          >
            <Tab
              key="all"
              title={
                <span className="flex items-center gap-2">
                  <span>All Posts</span>
                </span>
              }
            />
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                title={
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="hidden sm:inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-[10px] font-black rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20">
                      {cat.postCount}
                    </span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
      </section>

      {/* ===== TAGS FILTER ===== */}
      {tags.length > 0 && (
        <section className="w-full py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-default-50/30 to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-5 sm:space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-foreground">
                      Filter by Topic
                    </h2>
                    <p className="text-xs text-default-500 mt-0.5">
                      {selectedTag
                        ? `Showing posts tagged with "${tags.find((t) => t.id === selectedTag)?.name}"`
                        : "Browse by your interests"}
                    </p>
                  </div>
                </div>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(undefined)}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Tags Grid */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {tags.map((tag) => {
                  const active = selectedTag === tag.id;
                  return (
                    <Chip
                      key={tag.id}
                      as="button"
                      onClick={() =>
                        setSelectedTag(active ? undefined : tag.id)
                      }
                      variant={active ? "flat" : "bordered"}
                      color={active ? "primary" : "default"}
                      size="md"
                      className={`
                        text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300
                        ${
                          active
                            ? "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/40 text-primary scale-110 shadow-lg shadow-primary/20"
                            : "hover:border-primary/40 hover:bg-primary/5 hover:scale-105"
                        }
                      `}
                    >
                      <span className="flex items-center gap-1">
                        <span className={active ? "animate-pulse" : ""}>#</span>
                        {tag.name}
                      </span>
                    </Chip>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== POSTS GRID ===== */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          {!loading && posts && posts.length > 0 && (
            <div className="mb-8 sm:mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-gradient-to-b from-primary to-secondary rounded-full" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {selectedCategory
                      ? categories.find((c) => c.id === selectedCategory)?.name
                      : "Latest Articles"}
                  </h2>
                  <p className="text-xs sm:text-sm text-default-500 mt-1">
                    Discover insights and best practices
                  </p>
                </div>
              </div>
            </div>
          )}

          <PostList
            posts={posts}
            loading={loading}
            error={error}
            page={page}
            sortBy={sortBy}
            onPageChange={setPage}
            onSortChange={setSortBy}
          />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
