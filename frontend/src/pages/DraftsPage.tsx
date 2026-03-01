import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, ArrowUpDown } from "lucide-react";
import { apiService, Post } from "../services/apiService";
import PostList from "../components/PostList";

const DraftsStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .dp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .dp-hero { position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; }
    .dp-hero::before { content: ''; position: absolute; top: -150px; left: -100px; width: 500px; height: 400px; background: radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 65%); pointer-events: none; }
    .dp-hero-inner { max-width: 960px; margin: 0 auto; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .dp-hero-left { display: flex; align-items: center; gap: 18px; }
    .dp-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .dp-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #f59e0b; margin-bottom: 4px; }
    .dp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(28px,5vw,42px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; }
    .dp-count { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; margin-top: 3px; }

    .dp-new-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 800; color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; text-decoration: none; white-space: nowrap; }
    .dp-new-btn:hover { background: #f5ff6e; transform: translateY(-1px); }

    .dp-body { max-width: 960px; margin: 0 auto; padding: 28px 24px 80px; }

    .dp-error { padding: 12px 16px; border-radius: 10px; background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.2); color: rgba(255,68,68,0.9); font-size: 13px; margin-bottom: 20px; }

    /* Sort bar */
    .dp-sort-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .dp-draft-count-badge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 7px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); font-family: 'DM Mono', monospace; font-size: 11px; color: #f59e0b; font-weight: 600; }
    .dp-sort-group { display: flex; align-items: center; gap: 6px; }
    .dp-sort-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4a4a52; }
    .dp-sort-select { background: #111113; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px 10px; font-size: 12px; color: #b0b0b8; font-family: 'DM Mono', monospace; outline: none; cursor: pointer; transition: border-color 0.18s; appearance: none; }
    .dp-sort-select:focus { border-color: rgba(232,255,71,0.3); }

    /* Empty */
    .dp-empty { text-align: center; padding: 80px 20px; }
    .dp-empty-icon-wrap { position: relative; width: 72px; height: 72px; margin: 0 auto 20px; }
    .dp-empty-icon-box { width: 72px; height: 72px; border-radius: 18px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center; }
    .dp-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #3a3a42; margin-bottom: 8px; }
    .dp-empty-sub { font-size: 13px; color: #4a4a52; max-width: 320px; margin: 0 auto 24px; line-height: 1.6; }

    @keyframes dp-spin { to { transform: rotate(360deg); } }
    .dp-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: dp-spin 0.7s linear infinite; margin: 60px auto; }
  `}</style>
);

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
      } catch {
        setError("Failed to load drafts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [page, sortBy]);

  return (
    <>
      <DraftsStyles />
      <div className="dp-root">
        <div className="dp-hero">
          <div className="dp-hero-inner">
            <div className="dp-hero-left">
              <div className="dp-icon-wrap">
                <FileText size={22} color="#f59e0b" />
              </div>
              <div>
                <div className="dp-label">My Workspace</div>
                <div className="dp-title">My Drafts</div>
                <div className="dp-count">
                  {drafts && drafts.length > 0
                    ? `${drafts.length} unpublished ${drafts.length === 1 ? "post" : "posts"}`
                    : "Manage your unpublished posts"}
                </div>
              </div>
            </div>
            <Link to="/posts/new" className="dp-new-btn">
              <Plus size={15} strokeWidth={2.5} /> New Post
            </Link>
          </div>
        </div>

        <div className="dp-body">
          {error && <div className="dp-error">{error}</div>}

          {loading ? (
            <div className="dp-spinner" />
          ) : drafts?.length === 0 ? (
            <div className="dp-empty">
              <div className="dp-empty-icon-wrap">
                <div className="dp-empty-icon-box">
                  <FileText size={30} color="#f59e0b" />
                </div>
              </div>
              <div className="dp-empty-title">No Drafts Yet</div>
              <p className="dp-empty-sub">
                Start writing your first draft and publish when you're ready.
                Your ideas deserve to be shared!
              </p>
              <Link
                to="/posts/new"
                className="dp-new-btn"
                style={{ display: "inline-flex", margin: "0 auto" }}
              >
                <Plus size={15} /> Create Your First Post
              </Link>
            </div>
          ) : (
            <>
              {/* Sort bar */}
              {drafts && drafts.length > 0 && (
                <div className="dp-sort-bar">
                  <span className="dp-draft-count-badge">
                    {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
                  </span>
                  <div className="dp-sort-group">
                    <span className="dp-sort-label">
                      <ArrowUpDown
                        size={10}
                        style={{ display: "inline", marginRight: 4 }}
                      />
                      Sort
                    </span>
                    <select
                      className="dp-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="updatedAt,desc">Newest First</option>
                      <option value="updatedAt,asc">Oldest First</option>
                      <option value="title,asc">Title A→Z</option>
                    </select>
                  </div>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DraftsPage;
