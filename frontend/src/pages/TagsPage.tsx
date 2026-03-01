import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Hash, Tag as TagIcon } from "lucide-react";
import { apiService, Tag } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const TagsStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .tp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    /* Hero */
    .tp-hero { position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; }
    .tp-hero::before { content: ''; position: absolute; top: -150px; right: -100px; width: 500px; height: 400px; background: radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 65%); pointer-events: none; }
    .tp-hero-inner { max-width: 960px; margin: 0 auto; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .tp-hero-left { display: flex; align-items: center; gap: 18px; }
    .tp-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .tp-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8b5cf6; margin-bottom: 4px; }
    .tp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(28px,5vw,42px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; }
    .tp-count { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; margin-top: 3px; }

    .tp-add-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 800;
      color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer;
      transition: all 0.18s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
    }
    .tp-add-btn:hover { background: #f5ff6e; transform: translateY(-1px); }

    /* Body */
    .tp-body { max-width: 960px; margin: 0 auto; padding: 28px 24px 80px; }

    /* Stats */
    .tp-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
    @media (max-width: 480px) { .tp-stats { grid-template-columns: 1fr 1fr; } }
    .tp-stat { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px; }
    .tp-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 32px; line-height: 1; margin-bottom: 4px; }
    .tp-stat-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4a4a52; }

    /* Error */
    .tp-error { padding: 12px 16px; border-radius: 10px; background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.2); color: rgba(255,68,68,0.9); font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .tp-error-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff4444; flex-shrink: 0; }

    /* Table card */
    .tp-table-card { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
    .tp-table-header { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 8px; }
    .tp-table-header-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #4a4a52; }

    .tp-table { width: 100%; border-collapse: collapse; }
    .tp-th { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; padding: 10px 20px; text-align: left; background: #0d0d0f; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .tp-th-right { text-align: right; }
    .tp-tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    .tp-tr:last-child { border-bottom: none; }
    .tp-tr:hover { background: rgba(255,255,255,0.02); }
    .tp-td { padding: 14px 20px; font-size: 13px; color: #b0b0b8; vertical-align: middle; }
    .tp-td-right { text-align: right; }

    .tp-tag-name { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); color: #a78bfa; font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600; }
    .tp-tag-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.15); display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; }

    .tp-post-count { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600; }
    .tp-post-count-active { color: #a78bfa; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); }
    .tp-post-count-empty  { color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }

    .tp-del-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,68,68,0.2);
      background: rgba(255,68,68,0.06); color: #ff4444; cursor: pointer; transition: all 0.18s;
    }
    .tp-del-btn:hover:not(:disabled) { background: rgba(255,68,68,0.14); }
    .tp-del-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    /* Loading / empty */
    @keyframes tp-spin { to { transform: rotate(360deg); } }
    .tp-spinner { width: 24px; height: 24px; border: 2px solid rgba(139,92,246,0.2); border-top-color: #8b5cf6; border-radius: 50%; animation: tp-spin 0.7s linear infinite; margin: 0 auto; }
    .tp-empty-state { text-align: center; padding: 60px 20px; }
    .tp-empty-icon { width: 52px; height: 52px; border-radius: 14px; background: #18181b; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
    .tp-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: #3a3a42; margin-bottom: 6px; }
    .tp-empty-sub { font-size: 13px; color: #3a3a42; }

    /* Modal overlay */
    .tp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .tp-modal { background: #111113; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 440px; overflow: hidden; }
    .tp-modal-header { padding: 20px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
    .tp-modal-title-row { display: flex; align-items: center; gap: 12px; }
    .tp-modal-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25); display: flex; align-items: center; justify-content: center; }
    .tp-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.04em; color: #f0f0ee; }
    .tp-modal-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; margin-top: 2px; }
    .tp-close-btn { width: 30px; height: 30px; border-radius: 8px; background: #18181b; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b6b72; transition: all 0.15s; }
    .tp-close-btn:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }

    .tp-modal-body { padding: 20px 24px; }
    .tp-input-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; margin-bottom: 8px; display: block; }
    .tp-input-wrap { display: flex; align-items: center; gap: 0; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; transition: border-color 0.18s; margin-bottom: 4px; }
    .tp-input-wrap:focus-within { border-color: rgba(139,92,246,0.4); }
    .tp-input-icon { padding: 0 12px; color: #4a4a52; display: flex; align-items: center; }
    .tp-tag-input { flex: 1; background: none; border: none; outline: none; padding: 11px 12px 11px 0; font-size: 14px; color: #f0f0ee; font-family: 'DM Sans', sans-serif; }
    .tp-tag-input::placeholder { color: #2e2e35; }
    .tp-input-hint { font-family: 'DM Mono', monospace; font-size: 10px; color: #2e2e35; margin-top: 6px; }

    /* Tag chips preview */
    .tp-chips-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4a4a52; margin-bottom: 8px; margin-top: 16px; }
    .tp-chips-wrap { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; min-height: 48px; }
    .tp-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 7px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa; font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600; }
    .tp-chip-x { width: 16px; height: 16px; border-radius: 4px; background: rgba(139,92,246,0.15); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s; }
    .tp-chip-x:hover { background: rgba(139,92,246,0.3); }

    .tp-modal-footer { padding: 16px 24px 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; justify-content: flex-end; }
    .tp-btn-cancel { padding: 9px 18px; border-radius: 9px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #6b6b72; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; }
    .tp-btn-cancel:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .tp-btn-submit { padding: 9px 20px; border-radius: 9px; background: #e8ff47; border: none; color: #0a0a0b; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
    .tp-btn-submit:hover:not(:disabled) { background: #f5ff6e; transform: translateY(-1px); }
    .tp-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  `}</style>
);

const TagsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTags();
      setTags(response);
      setError(null);
    } catch {
      setError("Failed to load tags.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async () => {
    if (newTags.length === 0) return;
    try {
      setIsSubmitting(true);
      await apiService.createTags(newTags);
      await fetchTags();
      closeModal();
    } catch {
      setError("Failed to create tags.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(`Delete tag "#${tag.name}"?`)) return;
    try {
      setLoading(true);
      await apiService.deleteTag(tag.id);
      await fetchTags();
    } catch {
      setError("Failed to delete tag.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setNewTags([]);
    setTagInput("");
    setModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = tagInput.trim().toLowerCase();
      if (v && !newTags.includes(v)) setNewTags([...newTags, v]);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && newTags.length > 0) {
      setNewTags(newTags.slice(0, -1));
    }
  };

  const withPosts = tags.filter((t) => (t.postCount ?? 0) > 0).length;

  return (
    <>
      <TagsStyles />
      <div className="tp-root">
        {/* Hero */}
        <div className="tp-hero">
          <div className="tp-hero-inner">
            <div className="tp-hero-left">
              <div className="tp-icon-wrap">
                <TagIcon size={22} color="#8b5cf6" />
              </div>
              <div>
                <div className="tp-label">Admin Panel</div>
                <div className="tp-title">Tags</div>
                <div className="tp-count">
                  {tags.length} {tags.length === 1 ? "tag" : "tags"} total
                </div>
              </div>
            </div>
            <button className="tp-add-btn" onClick={() => setModalOpen(true)}>
              <Plus size={15} strokeWidth={2.5} /> Add Tags
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="tp-body">
          {error && (
            <div className="tp-error">
              <div className="tp-error-dot" />
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="tp-stats">
            <div className="tp-stat">
              <div className="tp-stat-val" style={{ color: "#8b5cf6" }}>
                {tags.length}
              </div>
              <div className="tp-stat-lbl">Total Tags</div>
            </div>
            <div className="tp-stat">
              <div className="tp-stat-val" style={{ color: "#22c55e" }}>
                {withPosts}
              </div>
              <div className="tp-stat-lbl">With Posts</div>
            </div>
            <div className="tp-stat">
              <div className="tp-stat-val" style={{ color: "#f59e0b" }}>
                {tags.length - withPosts}
              </div>
              <div className="tp-stat-lbl">Unused</div>
            </div>
          </div>

          {/* Table */}
          <div className="tp-table-card">
            <div className="tp-table-header">
              <Hash size={14} color="#4a4a52" />
              <span className="tp-table-header-label">All Tags</span>
            </div>

            {loading ? (
              <div style={{ padding: "60px 20px" }}>
                <div className="tp-spinner" />
              </div>
            ) : tags.length === 0 ? (
              <div className="tp-empty-state">
                <div className="tp-empty-icon">
                  <TagIcon size={22} color="#3a3a42" />
                </div>
                <div className="tp-empty-title">No Tags Yet</div>
                <p className="tp-empty-sub">Click "Add Tags" to get started</p>
              </div>
            ) : (
              <table className="tp-table">
                <thead>
                  <tr>
                    <th className="tp-th">Tag</th>
                    <th className="tp-th">Posts</th>
                    <th className="tp-th tp-th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id} className="tp-tr">
                      <td className="tp-td">
                        <span className="tp-tag-icon">
                          <Hash size={12} color="#8b5cf6" />
                        </span>
                        <span className="tp-tag-name">#{tag.name}</span>
                      </td>
                      <td className="tp-td">
                        <span
                          className={`tp-post-count ${(tag.postCount ?? 0) > 0 ? "tp-post-count-active" : "tp-post-count-empty"}`}
                        >
                          {tag.postCount || 0}{" "}
                          {tag.postCount === 1 ? "post" : "posts"}
                        </span>
                      </td>
                      <td className="tp-td tp-td-right">
                        <button
                          className="tp-del-btn"
                          disabled={(tag.postCount ?? 0) > 0}
                          onClick={() => handleDelete(tag)}
                          title={
                            (tag.postCount ?? 0) > 0
                              ? "Has posts — cannot delete"
                              : "Delete tag"
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="tp-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="tp-modal">
            <div className="tp-modal-header">
              <div className="tp-modal-title-row">
                <div className="tp-modal-icon">
                  <Plus size={16} color="#8b5cf6" />
                </div>
                <div>
                  <div className="tp-modal-title">Add New Tags</div>
                  <div className="tp-modal-sub">
                    Type + Enter or comma to add
                  </div>
                </div>
              </div>
              <button className="tp-close-btn" onClick={closeModal}>
                <X size={13} />
              </button>
            </div>

            <div className="tp-modal-body">
              <label className="tp-input-label">Tag Name</label>
              <div className="tp-input-wrap">
                <span className="tp-input-icon">
                  <Hash size={14} />
                </span>
                <input
                  className="tp-tag-input"
                  placeholder="react, spring-boot, docker..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
              <p className="tp-input-hint">
                Press Enter or comma (,) to add each tag · Backspace to remove
                last
              </p>

              {newTags.length > 0 && (
                <>
                  <div className="tp-chips-label">
                    Tags to add ({newTags.length})
                  </div>
                  <div className="tp-chips-wrap">
                    {newTags.map((t) => (
                      <span key={t} className="tp-chip">
                        #{t}
                        <span
                          className="tp-chip-x"
                          onClick={() =>
                            setNewTags(newTags.filter((x) => x !== t))
                          }
                        >
                          <X size={9} />
                        </span>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="tp-modal-footer">
              <button className="tp-btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="tp-btn-submit"
                disabled={newTags.length === 0 || isSubmitting}
                onClick={handleAddTags}
              >
                {isSubmitting
                  ? "Adding..."
                  : `Add ${newTags.length > 0 ? newTags.length + " " : ""}Tags`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TagsPage;
