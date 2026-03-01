import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Folder, Hash, Tag } from "lucide-react";
import { X } from "lucide-react";
import { apiService, Category } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const CatStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .cp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .cp-hero { position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 24px 32px; }
    .cp-hero::before { content: ''; position: absolute; top: -150px; right: -100px; width: 500px; height: 400px; background: radial-gradient(ellipse, rgba(232,255,71,0.05) 0%, transparent 65%); pointer-events: none; }
    .cp-hero-inner { max-width: 960px; margin: 0 auto; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .cp-hero-left { display: flex; align-items: center; gap: 18px; }
    .cp-icon-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .cp-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8ff47; margin-bottom: 4px; }
    .cp-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(28px,5vw,42px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; }
    .cp-count { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; margin-top: 3px; }

    .cp-add-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 800; color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
    .cp-add-btn:hover { background: #f5ff6e; transform: translateY(-1px); }

    .cp-body { max-width: 960px; margin: 0 auto; padding: 28px 24px 80px; }

    .cp-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
    @media (max-width: 480px) { .cp-stats { grid-template-columns: 1fr 1fr; } }
    .cp-stat { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px; }
    .cp-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 32px; line-height: 1; margin-bottom: 4px; }
    .cp-stat-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #4a4a52; }

    .cp-error { padding: 12px 16px; border-radius: 10px; background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.2); color: rgba(255,68,68,0.9); font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

    .cp-table-card { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
    .cp-table-hdr { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 8px; }
    .cp-table-hdr-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #4a4a52; }
    .cp-table { width: 100%; border-collapse: collapse; }
    .cp-th { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; padding: 10px 20px; text-align: left; background: #0d0d0f; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .cp-th-right { text-align: right; }
    .cp-tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    .cp-tr:last-child { border-bottom: none; }
    .cp-tr:hover { background: rgba(255,255,255,0.02); }
    .cp-td { padding: 14px 20px; font-size: 13px; color: #b0b0b8; vertical-align: middle; }
    .cp-td-right { text-align: right; }

    .cp-cat-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(232,255,71,0.06); border: 1px solid rgba(232,255,71,0.15); display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; vertical-align: middle; }
    .cp-cat-name { font-size: 13px; font-weight: 700; color: #f0f0ee; vertical-align: middle; }

    .cp-post-count { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600; }
    .cp-post-count-active { color: #e8ff47; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); }
    .cp-post-count-empty  { color: #4a4a52; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }

    .cp-action-btns { display: inline-flex; gap: 8px; align-items: center; }
    .cp-edit-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(232,255,71,0.2); background: rgba(232,255,71,0.06); color: #e8ff47; cursor: pointer; transition: all 0.18s; }
    .cp-edit-btn:hover { background: rgba(232,255,71,0.12); }
    .cp-del-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,68,68,0.2); background: rgba(255,68,68,0.06); color: #ff4444; cursor: pointer; transition: all 0.18s; }
    .cp-del-btn:hover:not(:disabled) { background: rgba(255,68,68,0.14); }
    .cp-del-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    @keyframes cp-spin { to { transform: rotate(360deg); } }
    .cp-spinner { width: 24px; height: 24px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: cp-spin 0.7s linear infinite; margin: 0 auto; }
    .cp-empty { text-align: center; padding: 60px 20px; }
    .cp-empty-icon { width: 52px; height: 52px; border-radius: 14px; background: #18181b; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
    .cp-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: #3a3a42; margin-bottom: 6px; }
    .cp-empty-sub { font-size: 13px; color: #3a3a42; }

    /* Modal */
    .cp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .cp-modal { background: #111113; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 420px; overflow: hidden; }
    .cp-modal-hdr { padding: 20px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
    .cp-modal-title-row { display: flex; align-items: center; gap: 12px; }
    .cp-modal-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); display: flex; align-items: center; justify-content: center; }
    .cp-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.04em; color: #f0f0ee; }
    .cp-modal-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; margin-top: 2px; }
    .cp-close-btn { width: 30px; height: 30px; border-radius: 8px; background: #18181b; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b6b72; transition: all 0.15s; }
    .cp-close-btn:hover { color: #f0f0ee; }

    .cp-modal-body { padding: 20px 24px; }
    .cp-input-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; margin-bottom: 8px; display: block; }
    .cp-input { width: 100%; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #f0f0ee; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.18s; box-sizing: border-box; }
    .cp-input::placeholder { color: #2e2e35; }
    .cp-input:focus { border-color: rgba(232,255,71,0.4); }

    .cp-modal-footer { padding: 16px 24px 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; justify-content: flex-end; }
    .cp-btn-cancel { padding: 9px 18px; border-radius: 9px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #6b6b72; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; }
    .cp-btn-cancel:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
    .cp-btn-submit { padding: 9px 20px; border-radius: 9px; background: #e8ff47; border: none; color: #0a0a0b; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif; }
    .cp-btn-submit:hover:not(:disabled) { background: #f5ff6e; transform: translateY(-1px); }
    .cp-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  `}</style>
);

const CategoriesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const r = await apiService.getCategories();
      setCategories(r); setError(null);
    } catch { setError("Failed to load categories."); }
    finally { setLoading(false); }
  };

  const handleAddEdit = async () => {
    if (!nameInput.trim()) return;
    try {
      setIsSubmitting(true);
      if (editingCat) await apiService.updateCategory(editingCat.id, nameInput.trim());
      else await apiService.createCategory(nameInput.trim());
      await fetchCategories();
      closeModal();
    } catch { setError(`Failed to ${editingCat ? "update" : "create"} category.`); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      setLoading(true);
      await apiService.deleteCategory(cat.id);
      await fetchCategories();
    } catch { setError("Failed to delete category."); }
    finally { setLoading(false); }
  };

  const closeModal = () => { setEditingCat(null); setNameInput(""); setModalOpen(false); };
  const openEdit = (c: Category) => { setEditingCat(c); setNameInput(c.name); setModalOpen(true); };
  const openAdd = () => { setEditingCat(null); setNameInput(""); setModalOpen(true); };

  const withPosts = categories.filter(c => (c.postCount ?? 0) > 0).length;

  return (
    <>
      <CatStyles />
      <div className="cp-root">
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <div className="cp-hero-left">
              <div className="cp-icon-wrap"><Folder size={22} color="#e8ff47" /></div>
              <div>
                <div className="cp-label">Admin Panel</div>
                <div className="cp-title">Categories</div>
                <div className="cp-count">{categories.length} {categories.length === 1 ? "category" : "categories"} total</div>
              </div>
            </div>
            <button className="cp-add-btn" onClick={openAdd}>
              <Plus size={15} strokeWidth={2.5} /> Add Category
            </button>
          </div>
        </div>

        <div className="cp-body">
          {error && <div className="cp-error"><div style={{ width:6, height:6, borderRadius:'50%', background:'#ff4444', flexShrink:0 }} />{error}</div>}

          <div className="cp-stats">
            <div className="cp-stat">
              <div className="cp-stat-val" style={{ color: "#e8ff47" }}>{categories.length}</div>
              <div className="cp-stat-lbl">Total</div>
            </div>
            <div className="cp-stat">
              <div className="cp-stat-val" style={{ color: "#22c55e" }}>{withPosts}</div>
              <div className="cp-stat-lbl">With Posts</div>
            </div>
            <div className="cp-stat">
              <div className="cp-stat-val" style={{ color: "#f59e0b" }}>{categories.length - withPosts}</div>
              <div className="cp-stat-lbl">Empty</div>
            </div>
          </div>

          <div className="cp-table-card">
            <div className="cp-table-hdr">
              <Hash size={14} color="#4a4a52" />
              <span className="cp-table-hdr-lbl">All Categories</span>
            </div>

            {loading ? (
              <div style={{ padding: "60px 20px" }}><div className="cp-spinner" /></div>
            ) : categories.length === 0 ? (
              <div className="cp-empty">
                <div className="cp-empty-icon"><Folder size={22} color="#3a3a42" /></div>
                <div className="cp-empty-title">No Categories Yet</div>
                <p className="cp-empty-sub">Click "Add Category" to get started</p>
              </div>
            ) : (
              <table className="cp-table">
                <thead>
                  <tr>
                    <th className="cp-th">Category Name</th>
                    <th className="cp-th">Posts</th>
                    <th className="cp-th cp-th-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="cp-tr">
                      <td className="cp-td">
                        <span className="cp-cat-icon"><Tag size={12} color="#e8ff47" /></span>
                        <span className="cp-cat-name">{cat.name}</span>
                      </td>
                      <td className="cp-td">
                        <span className={`cp-post-count ${(cat.postCount ?? 0) > 0 ? "cp-post-count-active" : "cp-post-count-empty"}`}>
                          {cat.postCount || 0} {cat.postCount === 1 ? "post" : "posts"}
                        </span>
                      </td>
                      <td className="cp-td cp-td-right">
                        <div className="cp-action-btns">
                          <button className="cp-edit-btn" onClick={() => openEdit(cat)} title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="cp-del-btn"
                            disabled={(cat.postCount ?? 0) > 0}
                            onClick={() => handleDelete(cat)}
                            title={(cat.postCount ?? 0) > 0 ? "Has posts — cannot delete" : "Delete"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
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
        <div className="cp-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="cp-modal">
            <div className="cp-modal-hdr">
              <div className="cp-modal-title-row">
                <div className="cp-modal-icon">
                  {editingCat ? <Edit2 size={16} color="#e8ff47" /> : <Plus size={16} color="#e8ff47" />}
                </div>
                <div>
                  <div className="cp-modal-title">{editingCat ? "Edit Category" : "New Category"}</div>
                  <div className="cp-modal-sub">{editingCat ? "Update the name below" : "Give your category a clear name"}</div>
                </div>
              </div>
              <button className="cp-close-btn" onClick={closeModal}><X size={13} /></button>
            </div>

            <div className="cp-modal-body">
              <label className="cp-input-label">Category Name</label>
              <input
                className="cp-input"
                placeholder="e.g. Backend, Frontend, DevOps"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddEdit(); }}
                autoFocus
              />
            </div>

            <div className="cp-modal-footer">
              <button className="cp-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="cp-btn-submit" disabled={!nameInput.trim() || isSubmitting} onClick={handleAddEdit}>
                {isSubmitting ? "Saving..." : editingCat ? "Update" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesPage;