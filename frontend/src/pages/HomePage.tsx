import React, { useEffect, useState } from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { apiService, Post, Category, Tag } from "../services/apiService";
import PostList from "../components/PostList";
import { Layers, TrendingUp, FileText } from "lucide-react";

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
    <main className="w-full min-h-screen bg-background overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full border-b border-default-200/60 py-14 sm:py-20 overflow-hidden">
        {/* Subtle background tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Text */}
            <div className="text-center lg:text-left">
              {/* Live badge */}
              <div className="flex justify-center lg:justify-start mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/25 text-xs font-semibold text-success/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Updated Daily
                </span>
              </div>

              <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary/70 mb-3">
                Engineering · Dev · Systems
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
                Lilawat
                <span className="text-primary"> TechBlog</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-default-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Practical engineering blogs, real-world development insights,
                and clean coding practices for{" "}
                <span className="text-foreground font-semibold">
                  production-grade systems.
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-end gap-3">
              {[
                {
                  icon: <Layers size={20} className="text-primary" />,
                  value: categories.length,
                  label: "Categories",
                  bg: "bg-primary/8",
                },
                {
                  icon: <TrendingUp size={20} className="text-secondary" />,
                  value: tags.length,
                  label: "Topics",
                  bg: "bg-secondary/8",
                },
                {
                  icon: <FileText size={20} className="text-success" />,
                  value: posts?.length || 0,
                  label: "Articles",
                  bg: "bg-success/8",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex flex-col items-center gap-2 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl ${s.bg} border border-default-200/80`}
                >
                  {s.icon}
                  <span className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-default-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS — sticky ── */}
      <section className="w-full sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-default-200/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <Tabs
            selectedKey={selectedCategory ?? "all"}
            onSelectionChange={(key) => handleCategoryChange(key as string)}
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList:
                "gap-0 sm:gap-1 w-full overflow-x-auto scrollbar-hide py-0",
              tab: "text-xs sm:text-sm font-semibold text-default-400 data-[selected=true]:text-primary px-3 sm:px-4 py-3 sm:py-3.5 transition-all whitespace-nowrap hover:text-default-600 min-w-fit",
              cursor: "h-[2px] bg-primary rounded-full",
            }}
          >
            <Tab
              key="all"
              title={
                <span className="flex items-center gap-1.5">
                  All Posts
                  {posts && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {posts.length}
                    </span>
                  )}
                </span>
              }
            />
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                title={
                  <span className="flex items-center gap-1.5">
                    {cat.name}
                    {cat.postCount !== undefined && (
                      <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-default-100 text-default-500">
                        {cat.postCount}
                      </span>
                    )}
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── TAGS ── */}
      {tags.length > 0 && (
        <section className="w-full py-4 sm:py-5 border-b border-default-100/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-default-400 whitespace-nowrap shrink-0 hidden sm:block">
                Topics:
              </span>
              <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto scrollbar-hide">
                {tags.map((tag) => {
                  const active = selectedTag === tag.id;
                  return (
                    <Chip
                      key={tag.id}
                      as="button"
                      onClick={() =>
                        setSelectedTag(active ? undefined : tag.id)
                      }
                      variant={active ? "solid" : "flat"}
                      color={active ? "primary" : "default"}
                      size="sm"
                      className="cursor-pointer shrink-0 text-xs font-medium transition-all"
                    >
                      #{tag.name}
                    </Chip>
                  );
                })}
              </div>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(undefined)}
                  className="shrink-0 text-xs font-semibold text-default-400 hover:text-danger transition-colors whitespace-nowrap"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── POSTS HEADER ── */}
      {!loading && posts && posts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Latest Articles"}
            </h2>
            <p className="text-sm text-default-400 mt-0.5">
              {selectedTag
                ? `Filtered by #${tags.find((t) => t.id === selectedTag)?.name} · ${posts.length} result${posts.length !== 1 ? "s" : ""}`
                : `${posts.length} article${posts.length !== 1 ? "s" : ""} published`}
            </p>
          </div>
        </section>
      )}

      {/* ── POSTS LIST ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 sm:pb-12">
        <div className="mx-auto max-w-7xl">
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
