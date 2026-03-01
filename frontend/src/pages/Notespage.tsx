import React, { useEffect, useState } from "react";
import { apiService, Note, NoteRequest } from "../services/apiService";
import {
  Plus,
  Search,
  Trash2,
  FolderOpen,
  Tag,
  Save,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

type View = "list" | "editor";
const FOLDERS = ["Work", "Personal", "Ideas", "Research", "Other"];
const FOLDER_COLORS: Record<string, string> = {
  Work: "#e8ff47",
  Personal: "#a78bfa",
  Ideas: "#f59e0b",
  Research: "#22c55e",
  Other: "#6b6b72",
};

const PageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

    .np-root { display: flex; min-height: 100vh; background: #0a0a0b; font-family: 'DM Sans', sans-serif; }

    /* ── Sidebar ── */
    .np-sidebar {
      width: 220px; flex-shrink: 0; background: #0d0d0f;
      border-right: 1px solid rgba(255,255,255,0.07);
      display: flex; flex-direction: column; padding: 24px 12px;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
    }
    .np-sidebar::-webkit-scrollbar { display: none; }

    .np-sidebar-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #3a3a42; padding: 0 8px; margin-bottom: 10px; margin-top: 4px; }

    .np-folder-btn {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 9px 10px; border-radius: 9px;
      font-size: 13px; font-weight: 500; color: #6b6b72;
      background: none; border: none; cursor: pointer;
      transition: all 0.15s; text-align: left; font-family: 'DM Sans', sans-serif;
      margin-bottom: 2px;
    }
    .np-folder-btn:hover { color: #f0f0ee; background: rgba(255,255,255,0.04); }
    .np-folder-btn.active { color: #e8ff47; background: rgba(232,255,71,0.07); font-weight: 700; }
    .np-folder-btn .np-folder-left { display: flex; align-items: center; gap: 8px; }
    .np-folder-count { font-family: 'DM Mono', monospace; font-size: 10px; color: #3a3a42; }
    .np-folder-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

    .np-sidebar-new {
      display: flex; align-items: center; justify-content: center; gap: 7px;
      width: 100%; padding: 10px; border-radius: 10px; margin-top: auto; padding-top: 16px;
      font-size: 13px; font-weight: 700; color: #0a0a0b; background: #e8ff47;
      border: none; cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .np-sidebar-new:hover { background: #f5ff6e; }

    /* ── Main ── */
    .np-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    .np-topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky; top: 0; z-index: 10;
      background: rgba(10,10,11,0.95); backdrop-filter: blur(16px);
      gap: 12px;
    }
    .np-topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .np-topbar-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; }
    .np-topbar-meta { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; margin-top: 2px; }
    .np-topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

    .np-search-wrap { position: relative; }
    .np-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #4a4a52; pointer-events: none; }
    .np-search {
      background: #18181b; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px; padding: 7px 12px 7px 32px;
      font-size: 13px; color: #f0f0ee; font-family: 'DM Sans', sans-serif;
      outline: none; width: 180px; transition: border-color 0.18s;
    }
    .np-search::placeholder { color: #3a3a42; }
    .np-search:focus { border-color: rgba(232,255,71,0.3); }

    .np-hamburger {
      width: 36px; height: 36px; border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #6b6b72; transition: all 0.18s;
    }
    .np-hamburger:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.15); }

    .np-topbar-new {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
      color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer;
      transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .np-topbar-new:hover { background: #f5ff6e; }

    /* Grid */
    .np-content { flex: 1; padding: 24px; }
    .np-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

    /* Note card */
    .np-note-card {
      background: #111113; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; padding: 18px; cursor: pointer;
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .np-note-card:hover { border-color: rgba(232,255,71,0.2); transform: translateY(-2px); }
    .np-note-card:hover .np-delete-btn { opacity: 1; }

    .np-folder-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 8px; border-radius: 5px; font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 600; margin-bottom: 10px;
      border: 1px solid;
    }
    .np-note-title { font-size: 14px; font-weight: 700; color: #f0f0ee; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .np-note-preview { font-size: 12px; color: #4a4a52; line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

    .np-note-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
    .np-note-tag { display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 10px; color: #6b6b72; background: #18181b; border: 1px solid rgba(255,255,255,0.06); }

    .np-note-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); }
    .np-note-date { font-family: 'DM Mono', monospace; font-size: 10px; color: #3a3a42; }

    .np-delete-btn {
      width: 28px; height: 28px; border-radius: 7px;
      border: 1px solid rgba(255,68,68,0.2); background: rgba(255,68,68,0.06);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #ff4444; opacity: 0; transition: all 0.18s;
    }
    .np-delete-btn:hover { background: rgba(255,68,68,0.15); }

    /* Empty + Spinner */
    @keyframes np-spin { to { transform: rotate(360deg); } }
    .np-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.07); border-top-color: #e8ff47; animation: np-spin 0.7s linear infinite; margin: 80px auto; }
    .np-empty { text-align: center; padding: 80px 20px; }
    .np-empty-icon { font-size: 52px; margin-bottom: 16px; }
    .np-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #3a3a42; margin-bottom: 8px; }
    .np-empty-sub { font-size: 13px; color: #3a3a42; margin-bottom: 24px; }

    /* ── Mobile overlay sidebar ── */
    .np-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
    .np-drawer {
      position: fixed; left: 0; top: 0; bottom: 0; width: 240px; z-index: 51;
      background: #0d0d0f; border-right: 1px solid rgba(255,255,255,0.07);
      padding: 20px 12px; display: flex; flex-direction: column;
    }
    .np-drawer-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding: 0 4px; }
    .np-drawer-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #f0f0ee; }
    .np-drawer-close { background: none; border: none; cursor: pointer; color: #6b6b72; transition: color 0.15s; }
    .np-drawer-close:hover { color: #f0f0ee; }

    /* ── Editor ── */
    .np-editor-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
    .np-editor-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 24px; border-bottom: 1px solid rgba(255,255,255,0.07);
      position: sticky; top: 0; z-index: 10;
      background: rgba(10,10,11,0.95); backdrop-filter: blur(16px);
    }
    .np-editor-bar-left { display: flex; align-items: center; gap: 12px; }
    .np-editor-back {
      display: flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      color: #6b6b72; font-size: 13px; font-weight: 600;
      font-family: 'DM Sans', sans-serif; transition: color 0.15s;
    }
    .np-editor-back:hover { color: #f0f0ee; }
    .np-editor-mode { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }
    .np-editor-bar-right { display: flex; align-items: center; gap: 8px; }
    .np-save-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
      color: #0a0a0b; background: #e8ff47; border: none; cursor: pointer;
      transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .np-save-btn:hover { background: #f5ff6e; }
    .np-save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .np-editor-body { max-width: 780px; margin: 0 auto; padding: 36px 24px 80px; }
    .np-editor-title {
      width: 100%; background: transparent; border: none; outline: none;
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(32px, 6vw, 52px); letter-spacing: 0.02em;
      color: #f0f0ee; margin-bottom: 20px;
    }
    .np-editor-title::placeholder { color: #2a2a32; }

    .np-editor-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center; }
    .np-folder-select {
      background: #18181b; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px; padding: 7px 12px; font-size: 12px;
      color: #f0f0ee; font-family: 'DM Mono', monospace; outline: none;
      cursor: pointer; transition: border-color 0.18s;
    }
    .np-folder-select:focus { border-color: rgba(232,255,71,0.3); }
    .np-folder-select option { background: #18181b; }

    .np-tag-input-wrap { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .np-tag-input {
      background: #18181b; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px; padding: 7px 12px; font-size: 12px;
      color: #f0f0ee; font-family: 'DM Mono', monospace; outline: none;
      width: 120px; transition: border-color 0.18s;
    }
    .np-tag-input::placeholder { color: #3a3a42; }
    .np-tag-input:focus { border-color: rgba(232,255,71,0.3); }

    .np-tag-add-btn {
      padding: 6px 10px; border-radius: 7px; font-size: 11px; font-weight: 600;
      color: #e8ff47; background: rgba(232,255,71,0.08);
      border: 1px solid rgba(232,255,71,0.2); cursor: pointer;
      transition: all 0.15s; font-family: 'DM Mono', monospace;
    }
    .np-tag-add-btn:hover { background: rgba(232,255,71,0.15); }

    .np-active-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 5px; font-family: 'DM Mono', monospace; font-size: 11px; color: #6b6b72; background: #18181b; border: 1px solid rgba(255,255,255,0.07); }
    .np-active-tag button { background: none; border: none; cursor: pointer; color: #6b6b72; line-height: 1; font-size: 12px; padding: 0 0 0 2px; }
    .np-active-tag button:hover { color: #ff4444; }

    .np-editor-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 0 20px; }

    .np-editor-textarea {
      width: 100%; min-height: 400px; background: transparent; border: none; outline: none; resize: none;
      font-size: 15px; line-height: 1.75; color: #b0b0b8;
      font-family: 'DM Sans', sans-serif; direction: ltr; text-align: left;
    }
    .np-editor-textarea::placeholder { color: #2a2a32; }

    /* Responsive */
    @media (max-width: 767px) {
      .np-sidebar { display: none; }
      .np-search { width: 130px; }
    }
    @media (min-width: 768px) {
      .np-hamburger { display: none; }
    }
  `}</style>
);

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [folder, setFolder] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [activeFolder]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotes(activeFolder || undefined);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNewNote = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setFolder(activeFolder || "");
    setView("editor");
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setTagInput("");
    setFolder(note.folder || "");
    setView("editor");
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      setSaving(true);
      const req: NoteRequest = {
        title,
        content,
        tags,
        folder: folder || undefined,
      };
      if (editingNote) {
        const updated = await apiService.updateNote(editingNote.id, req);
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n)),
        );
      } else {
        const created = await apiService.createNote(req);
        setNotes((prev) => [created, ...prev]);
      }
      setView("list");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeleting(id);
      await apiService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Sidebar folders ──
  const SidebarInner = ({ onClose }: { onClose?: () => void }) => (
    <>
      <p className="np-sidebar-label">Folders</p>
      <button
        className={`np-folder-btn ${!activeFolder ? "active" : ""}`}
        onClick={() => {
          setActiveFolder(null);
          onClose?.();
        }}
      >
        <span className="np-folder-left">
          <FolderOpen size={13} /> All Notes
        </span>
        <span className="np-folder-count">{notes.length}</span>
      </button>
      {FOLDERS.map((f) => {
        const count = notes.filter((n) => n.folder === f).length;
        const color = FOLDER_COLORS[f];
        return (
          <button
            key={f}
            className={`np-folder-btn ${activeFolder === f ? "active" : ""}`}
            onClick={() => {
              setActiveFolder(f);
              onClose?.();
            }}
          >
            <span className="np-folder-left">
              <span className="np-folder-dot" style={{ background: color }} />
              {f}
            </span>
            {count > 0 && <span className="np-folder-count">{count}</span>}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <button
        className="np-sidebar-new"
        onClick={() => {
          openNewNote();
          onClose?.();
        }}
      >
        <Plus size={15} strokeWidth={2.5} /> New Note
      </button>
    </>
  );

  // ── EDITOR ──
  if (view === "editor")
    return (
      <>
        <PageStyles />
        <div className="np-editor-root">
          <div className="np-editor-bar">
            <div className="np-editor-bar-left">
              <button
                className="np-editor-back"
                onClick={() => setView("list")}
              >
                <ArrowLeft size={15} /> Back
              </button>
              <span className="np-editor-mode">
                {editingNote ? "Editing" : "New Note"}
              </span>
            </div>
            <div className="np-editor-bar-right">
              <button
                className="np-save-btn"
                disabled={!title.trim() || !content.trim() || saving}
                onClick={handleSave}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={13} /> Save
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="np-editor-body">
            <input
              className="np-editor-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
            />

            <div className="np-editor-meta">
              <select
                className="np-folder-select"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
              >
                <option value="">No folder</option>
                {FOLDERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <div className="np-tag-input-wrap">
                <input
                  className="np-tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                />
                {tagInput && (
                  <button className="np-tag-add-btn" onClick={addTag}>
                    + Add
                  </button>
                )}
                {tags.map((tag) => (
                  <span key={tag} className="np-active-tag">
                    <Tag size={9} /> #{tag}
                    <button
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="np-editor-divider" />

            <textarea
              className="np-editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
            />
          </div>
        </div>
      </>
    );

  // ── LIST ──
  return (
    <>
      <PageStyles />
      <div className="np-root">
        {/* Desktop sidebar */}
        <aside className="np-sidebar">
          <SidebarInner />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="np-overlay" onClick={() => setSidebarOpen(false)}>
            <div className="np-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="np-drawer-header">
                <span className="np-drawer-title">Folders</span>
                <button
                  className="np-drawer-close"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarInner onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="np-main">
          <div className="np-topbar">
            <div className="np-topbar-left">
              <button
                className="np-hamburger"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <div className="np-topbar-title">
                  {activeFolder || "All Notes"}
                </div>
                <div className="np-topbar-meta">
                  {filtered.length} note{filtered.length !== 1 ? "s" : ""} ·
                  private to you
                </div>
              </div>
            </div>
            <div className="np-topbar-right">
              <div className="np-search-wrap">
                <Search size={13} />
                <input
                  className="np-search"
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="np-topbar-new" onClick={openNewNote}>
                <Plus size={14} strokeWidth={2.5} /> New Note
              </button>
            </div>
          </div>

          <div className="np-content">
            {loading ? (
              <div className="np-spinner" />
            ) : filtered.length === 0 ? (
              <div className="np-empty">
                <div className="np-empty-icon">📝</div>
                <div className="np-empty-title">No notes yet</div>
                <p className="np-empty-sub">
                  Start writing something private just for you.
                </p>
                <button
                  className="np-topbar-new"
                  onClick={openNewNote}
                  style={{ margin: "0 auto" }}
                >
                  <Plus size={14} strokeWidth={2.5} /> Create your first note
                </button>
              </div>
            ) : (
              <div className="np-grid">
                {filtered.map((note) => {
                  const color = note.folder ? FOLDER_COLORS[note.folder] : null;
                  return (
                    <div
                      key={note.id}
                      className="np-note-card"
                      onClick={() => openEditNote(note)}
                    >
                      {note.folder && color && (
                        <span
                          className="np-folder-chip"
                          style={{
                            color,
                            background: `${color}12`,
                            borderColor: `${color}30`,
                          }}
                        >
                          <FolderOpen size={9} /> {note.folder}
                        </span>
                      )}
                      <div className="np-note-title">{note.title}</div>
                      <div
                        className="np-note-preview"
                        dangerouslySetInnerHTML={{
                          __html: note.content
                            .replace(/<[^>]+>/g, " ")
                            .substring(0, 150),
                        }}
                      />
                      {note.tags && note.tags.length > 0 && (
                        <div className="np-note-tags">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="np-note-tag">
                              <Tag size={8} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="np-note-footer">
                        <span className="np-note-date">
                          {new Date(note.updatedAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                        <button
                          className="np-delete-btn"
                          disabled={deleting === note.id}
                          onClick={(e) => handleDelete(note.id, e)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesPage;
