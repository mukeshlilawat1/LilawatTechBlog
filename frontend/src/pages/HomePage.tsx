import React, { useEffect, useState } from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { apiService, Post, Category, Tag } from "../services/apiService";
import PostList from "../components/PostList";
import { Sparkles, TrendingUp, Layers, Zap } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {/* ============================================================
          HERO — full-bleed editorial with animated grid + orbs
      ============================================================ */}
      <section className="relative w-full overflow-hidden border-b border-default-200/40">
        {/* Animated dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(var(--nextui-primary-500)/0.18) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Colour blobs */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-success/20 via-primary/10 to-transparent blur-[100px] animate-[pulse_8s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] rounded-full bg-gradient-to-t from-secondary/20 to-transparent blur-[80px]" />

        {/* Diagonal accent stripe */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -right-32 top-0 bottom-0 w-[2px] opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--nextui-primary), transparent)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left — copy */}
            <div className="space-y-8 sm:space-y-10">
              {/* Live badge */}
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--nextui-success-500)/0.12), rgba(var(--nextui-primary-500)/0.12))",
                  borderColor: "rgba(var(--nextui-success-500)/0.35)",
                  transitionDelay: "0ms",
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-70" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-lg shadow-success/60" />
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide text-foreground/80">
                  Updated Daily
                </span>
                <Sparkles size={13} className="text-primary" />
              </div>

              {/* Headline — stacked editorial style */}
              <div
                className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "80ms" }}
              >
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-primary mb-4 opacity-80">
                    Engineering · Dev · Systems
                  </p>
                </div>
                <h1 className="font-black tracking-tight leading-[0.92] text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  <span className="block text-foreground">Lilawat</span>
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--nextui-primary), var(--nextui-secondary), var(--nextui-success))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    TechBlog
                  </span>
                </h1>

                {/* Animated underline */}
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-success shadow-lg transition-all duration-1000 ${mounted ? "w-36 sm:w-48" : "w-0"}`}
                    style={{ transitionDelay: "400ms" }}
                  />
                  <div
                    className={`h-1 w-3 rounded-full bg-success/60 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: "700ms" }}
                  />
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-base sm:text-lg lg:text-xl text-default-500 max-w-xl leading-relaxed font-light transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "160ms" }}
              >
                Practical engineering blogs, real-world development insights,
                and clean coding practices for{" "}
                <span className="text-foreground/80 font-semibold">
                  production-grade systems.
                </span>
              </p>

              {/* CTA scroll hint */}
              <div
                className={`flex items-center gap-3 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "240ms" }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-default-400">
                  <Zap size={12} className="text-primary" />
                  Scroll to explore
                </div>
                <div className="flex-1 max-w-[80px] h-px bg-gradient-to-r from-default-300 to-transparent" />
              </div>
            </div>

            {/* Right — floating stat cards */}
            <div
              className={`hidden lg:flex flex-col gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: "320ms" }}
            >
              {[
                {
                  icon: <Layers size={20} className="text-primary" />,
                  value: categories.length,
                  label: "Categories",
                  from: "from-primary/20",
                  to: "to-primary/5",
                  border: "border-primary/20",
                  shadow: "shadow-primary/10",
                  glow: "from-primary/30",
                },
                {
                  icon: <TrendingUp size={20} className="text-secondary" />,
                  value: tags.length,
                  label: "Topics",
                  from: "from-secondary/20",
                  to: "to-secondary/5",
                  border: "border-secondary/20",
                  shadow: "shadow-secondary/10",
                  glow: "from-secondary/30",
                },
                {
                  icon: <Sparkles size={20} className="text-success" />,
                  value: posts?.length || 0,
                  label: "Articles",
                  from: "from-success/20",
                  to: "to-success/5",
                  border: "border-success/20",
                  shadow: "shadow-success/10",
                  glow: "from-success/30",
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="relative group"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {/* Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.glow} to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative flex items-center gap-5 bg-background/70 backdrop-blur-xl border ${stat.border} rounded-2xl px-6 py-4 shadow-xl ${stat.shadow} hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-w-[200px]`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.from} ${stat.to} flex items-center justify-center border ${stat.border} shadow-inner`}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-black text-foreground tabular-nums">
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-default-400 tracking-wide uppercase">
                        {stat.label}
                      </div>
                    </div>
                    {/* Corner accent */}
                    <div
                      className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${stat.from} to-transparent`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile stats row */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mt-10">
            {[
              {
                icon: <Layers size={16} className="text-primary" />,
                value: categories.length,
                label: "Categories",
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/20",
              },
              {
                icon: <TrendingUp size={16} className="text-secondary" />,
                value: tags.length,
                label: "Topics",
                color: "text-secondary",
                bg: "bg-secondary/10",
                border: "border-secondary/20",
              },
              {
                icon: <Sparkles size={16} className="text-success" />,
                value: posts?.length || 0,
                label: "Articles",
                color: "text-success",
                bg: "bg-success/10",
                border: "border-success/20",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border ${s.border} ${s.bg} backdrop-blur-sm`}
              >
                {s.icon}
                <span className={`text-2xl font-black ${s.color}`}>
                  {s.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-default-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CATEGORIES — sticky pill tab nav
      ============================================================ */}
      <section className="w-full sticky top-0 z-40 bg-background/90 backdrop-blur-2xl border-b border-default-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs
            selectedKey={selectedCategory ?? "all"}
            onSelectionChange={(key) => handleCategoryChange(key as string)}
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList:
                "gap-1 sm:gap-2 w-full overflow-x-auto scrollbar-hide py-0",
              tab: "text-sm font-bold text-default-400 data-[selected=true]:text-foreground px-4 py-4 transition-all whitespace-nowrap data-[selected=true]:scale-105 hover:text-foreground/70 rounded-xl",
              cursor:
                "h-0.5 bg-gradient-to-r from-primary via-secondary to-success shadow-lg shadow-primary/40 rounded-full",
            }}
          >
            <Tab
              key="all"
              title={
                <span className="flex items-center gap-2">
                  <span>All Posts</span>
                  {posts && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-foreground/10 text-foreground/60">
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
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                    {cat.postCount !== undefined && (
                      <span className="hidden sm:inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-[10px] font-black rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 text-primary border border-primary/20">
                        {cat.postCount}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
      </section>

      {/* ============================================================
          TAGS — horizontal scrollable chip filter
      ============================================================ */}
      {tags.length > 0 && (
        <section className="w-full py-8 sm:py-10 relative overflow-hidden">
          {/* Subtle section bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-default-50/60 to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-5">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Vertical accent */}
                  <div className="flex flex-col gap-1">
                    <div className="w-1 h-3 rounded-full bg-primary" />
                    <div className="w-1 h-5 rounded-full bg-secondary" />
                    <div className="w-1 h-2 rounded-full bg-success" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                      Filter by Topic
                    </h2>
                    <p className="text-xs text-default-400 mt-0.5">
                      {selectedTag
                        ? `Showing: #${tags.find((t) => t.id === selectedTag)?.name}`
                        : "Browse by interest"}
                    </p>
                  </div>
                </div>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(undefined)}
                    className="text-xs font-bold text-primary hover:text-primary/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-primary/20 hover:border-primary/40"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {tags.map((tag, i) => {
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
                      style={{ animationDelay: `${i * 30}ms` }}
                      className={`
                        text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300
                        ${
                          active
                            ? "scale-110 shadow-lg shadow-primary/25 border-primary/50"
                            : "hover:scale-105 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
                        }
                      `}
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className={`font-black ${active ? "text-primary" : "text-default-400"}`}
                        >
                          #
                        </span>
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

      {/* ============================================================
          POSTS GRID
      ============================================================ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          {!loading && posts && posts.length > 0 && (
            <div className="mb-8 sm:mb-12 flex items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Big number accent */}
                <div className="hidden sm:flex flex-col items-center">
                  <span
                    className="text-6xl font-black leading-none tabular-nums"
                    style={{
                      background:
                        "linear-gradient(180deg, var(--nextui-primary), transparent)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      opacity: 0.25,
                    }}
                  >
                    {String(posts.length).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.25em] uppercase text-primary/70 mb-1">
                    Now Showing
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {selectedCategory
                      ? categories.find((c) => c.id === selectedCategory)?.name
                      : "Latest Articles"}
                  </h2>
                  <p className="text-sm text-default-400 mt-1 font-medium">
                    {selectedTag
                      ? `Tagged #${tags.find((t) => t.id === selectedTag)?.name}`
                      : "Discover insights and best practices"}
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              <div className="flex-1 hidden sm:block max-w-xs">
                <div className="h-px bg-gradient-to-l from-transparent via-default-200 to-transparent" />
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
