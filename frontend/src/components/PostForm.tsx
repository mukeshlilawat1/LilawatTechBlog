import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  Undo,
  Redo,
  List,
  ListOrdered,
  ChevronDown,
  X,
  Type,
  FileText,
  Tag as TagIcon,
  Layers,
  Info,
} from "lucide-react";
import { Post, Category, Tag, PostStatus } from "../services/apiService";

interface PostFormProps {
  initialPost?: Post | null;
  onSubmit: (postData: {
    title: string;
    content: string;
    categoryId: string;
    tagIds: string[];
    status: PostStatus;
  }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  availableTags: Tag[];
  isSubmitting?: boolean;
}

const PostFormStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --pf-bg: #0a0a0b;
      --pf-surface: #111113;
      --pf-surface2: #18181b;
      --pf-border: rgba(255,255,255,0.07);
      --pf-border-focus: rgba(232,255,71,0.35);
      --pf-accent: #e8ff47;
      --pf-danger: #ff4444;
      --pf-violet: #a78bfa;
      --pf-text: #f0f0ee;
      --pf-muted: #6b6b72;
    }

    .pf-wrap { font-family: 'DM Sans', sans-serif; }

    .pf-page-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(36px, 5vw, 52px);
      letter-spacing: 0.02em;
      color: var(--pf-text); line-height: 1;
      margin-bottom: 4px;
    }
    .pf-page-sub { font-size: 13px; color: var(--pf-muted); margin-bottom: 28px; }

    /* Card */
    .pf-card {
      background: var(--pf-surface);
      border: 1px solid var(--pf-border);
      border-radius: 18px;
      padding: 28px;
    }
    @media (min-width: 640px) { .pf-card { padding: 36px; } }

    /* Section header */
    .pf-section-label {
      display: flex; align-items: center; gap: 8px;
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--pf-muted); margin-bottom: 12px;
    }
    .pf-section-label svg { color: var(--pf-accent); }

    /* Input */
    .pf-input-wrap { margin-bottom: 28px; }
    .pf-input {
      width: 100%;
      padding: 14px 16px;
      background: var(--pf-surface2);
      border: 1.5px solid var(--pf-border);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 17px; font-weight: 600;
      color: var(--pf-text);
      outline: none;
      transition: border-color 0.18s;
    }
    .pf-input::placeholder { color: var(--pf-muted); font-weight: 400; }
    .pf-input:focus { border-color: var(--pf-border-focus); }
    .pf-input.error { border-color: rgba(255,68,68,0.5); }
    .pf-error-msg {
      display: flex; align-items: center; gap: 6px;
      color: var(--pf-danger); font-size: 12px; margin-top: 6px;
    }

    /* Editor toolbar */
    .pf-toolbar {
      position: sticky; top: 60px; z-index: 20;
      background: rgba(17,17,19,0.95);
      backdrop-filter: blur(16px);
      border: 1px solid var(--pf-border);
      border-radius: 10px;
      padding: 8px 10px;
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
      margin-bottom: 2px;
    }
    .pf-toolbar-sep { width: 1px; height: 20px; background: var(--pf-border); margin: 0 4px; }

    .pf-tb-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: none; background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--pf-muted);
      transition: all 0.15s;
    }
    .pf-tb-btn:hover { color: var(--pf-text); background: rgba(255,255,255,0.06); }
    .pf-tb-btn.active { color: var(--pf-accent); background: rgba(232,255,71,0.1); }
    .pf-tb-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .pf-tb-heading-btn {
      padding: 0 12px; height: 32px; border-radius: 8px;
      border: 1px solid var(--pf-border); background: transparent;
      color: var(--pf-muted); font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      display: flex; align-items: center; gap: 5px;
      cursor: pointer; transition: all 0.15s; position: relative;
    }
    .pf-tb-heading-btn:hover { color: var(--pf-text); border-color: rgba(255,255,255,0.15); }

    .pf-heading-dd {
      position: absolute; top: calc(100% + 6px); left: 0;
      min-width: 140px;
      background: var(--pf-surface);
      border: 1px solid var(--pf-border);
      border-radius: 10px; padding: 6px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      z-index: 50;
      animation: pf-pop 0.16s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes pf-pop {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }
    .pf-heading-dd-item {
      width: 100%; padding: 8px 10px; border-radius: 7px;
      border: none; background: none; cursor: pointer;
      color: var(--pf-muted); font-family: 'DM Sans', sans-serif;
      text-align: left; transition: all 0.15s;
    }
    .pf-heading-dd-item:hover { color: var(--pf-text); background: rgba(255,255,255,0.05); }

    /* Editor content area */
    .pf-editor-wrap {
      border: 1.5px solid var(--pf-border);
      border-radius: 12px;
      background: var(--pf-surface2);
      overflow: hidden;
      transition: border-color 0.18s;
      margin-bottom: 4px;
    }
    .pf-editor-wrap:focus-within { border-color: var(--pf-border-focus); }
    .pf-editor-wrap .ProseMirror {
      outline: none; min-height: 320px;
      padding: 20px 22px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px; line-height: 1.75;
      color: var(--pf-text);
    }
    .pf-editor-wrap .ProseMirror p { margin-bottom: 12px; color: #b0b0b8; }
    .pf-editor-wrap .ProseMirror h1 { font-family: 'Bebas Neue',sans-serif; font-size: 38px; letter-spacing: 0.02em; color: var(--pf-text); margin: 20px 0 8px; }
    .pf-editor-wrap .ProseMirror h2 { font-size: 22px; font-weight: 700; color: var(--pf-text); margin: 18px 0 6px; }
    .pf-editor-wrap .ProseMirror h3 { font-size: 17px; font-weight: 600; color: var(--pf-text); margin: 14px 0 4px; }
    .pf-editor-wrap .ProseMirror ul,
    .pf-editor-wrap .ProseMirror ol { padding-left: 22px; color: #b0b0b8; }
    .pf-editor-wrap .ProseMirror li { margin-bottom: 4px; }
    .pf-editor-wrap .ProseMirror strong { color: var(--pf-text); font-weight: 700; }
    .pf-editor-wrap .ProseMirror em { color: #a0a0a8; }
    .pf-editor-wrap .ProseMirror.ProseMirror-focused p.is-editor-empty:first-child::before {
      color: var(--pf-muted); content: attr(data-placeholder); pointer-events: none; float: left; height: 0;
    }

    /* Settings grid */
    .pf-settings-grid {
      display: grid; grid-template-columns: 1fr; gap: 16px;
    }
    @media (min-width: 540px) { .pf-settings-grid { grid-template-columns: 1fr 1fr; } }

    /* Select */
    .pf-select-wrap { display: flex; flex-direction: column; gap: 6px; }
    .pf-select-label {
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--pf-muted);
    }
    .pf-select {
      width: 100%; padding: 11px 14px;
      background: var(--pf-surface2);
      border: 1.5px solid var(--pf-border);
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 500;
      color: var(--pf-text);
      outline: none; cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 34px;
      transition: border-color 0.18s;
    }
    .pf-select:focus { border-color: var(--pf-border-focus); }
    .pf-select option { background: #18181b; }

    /* Status locked */
    .pf-status-locked {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 14px; border-radius: 10px;
      background: var(--pf-surface2);
      border: 1.5px solid var(--pf-border);
    }
    .pf-status-dot { width: 7px; height: 7px; border-radius: 50%; }
    .pf-status-name { font-size: 13px; font-weight: 600; color: var(--pf-text); }
    .pf-status-locked-txt { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--pf-muted); margin-left: auto; }

    /* Info banner */
    .pf-info-banner {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; border-radius: 10px;
      background: rgba(232,255,71,0.04);
      border: 1px solid rgba(232,255,71,0.12);
      margin-top: 12px;
    }
    .pf-info-banner p { font-size: 12px; color: #b8c476; line-height: 1.6; }
    .pf-info-banner strong { color: var(--pf-accent); }

    /* Tags section */
    .pf-tag-select-wrap { position: relative; }
    .pf-tag-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .pf-tag-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 6px;
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      color: var(--pf-accent);
      background: rgba(232,255,71,0.08);
      border: 1px solid rgba(232,255,71,0.2);
    }
    .pf-tag-chip-remove {
      background: none; border: none; cursor: pointer;
      color: rgba(232,255,71,0.5); padding: 0; display: flex;
      transition: color 0.15s;
    }
    .pf-tag-chip-remove:hover { color: var(--pf-accent); }

    /* Divider */
    .pf-divider { height: 1px; background: var(--pf-border); margin: 28px 0; }

    /* Actions */
    .pf-actions {
      display: flex; flex-direction: column-reverse; gap: 10px;
      align-items: stretch;
    }
    @media (min-width: 540px) {
      .pf-actions { flex-direction: row; align-items: center; justify-content: space-between; }
    }
    .pf-action-hint { font-size: 12px; color: var(--pf-muted); }
    .pf-action-btns { display: flex; gap: 10px; flex-direction: column; }
    @media (min-width: 540px) { .pf-action-btns { flex-direction: row; } }

    .pf-btn-cancel {
      padding: 11px 22px; border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 600;
      color: var(--pf-danger);
      background: rgba(255,68,68,0.06);
      border: 1px solid rgba(255,68,68,0.2);
      cursor: pointer; transition: all 0.18s;
    }
    .pf-btn-cancel:hover { background: rgba(255,68,68,0.12); }
    .pf-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

    .pf-btn-submit {
      padding: 11px 24px; border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 700;
      color: #0a0a0b; background: var(--pf-accent);
      border: none; cursor: pointer; transition: all 0.18s;
      display: flex; align-items: center; gap: 8px;
    }
    .pf-btn-submit:hover { background: #f5ff6e; transform: translateY(-1px); }
    .pf-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* Spinner */
    @keyframes pf-spin { to { transform: rotate(360deg); } }
    .pf-spinner {
      width: 14px; height: 14px; border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: #0a0a0b;
      animation: pf-spin 0.7s linear infinite;
    }
  `}</style>
);

const PostForm: React.FC<PostFormProps> = ({
  initialPost,
  onSubmit,
  onCancel,
  categories,
  availableTags,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialPost?.tags || [],
  );
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status === PostStatus.DRAFT ||
      initialPost?.status === PostStatus.REJECTED
      ? PostStatus.DRAFT
      : initialPost?.status || PostStatus.DRAFT,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [headingOpen, setHeadingOpen] = React.useState(false);
  const headingRef = React.useRef<HTMLDivElement>(null);

  const isStatusLocked =
    initialPost?.status === PostStatus.PENDING ||
    initialPost?.status === PostStatus.PUBLISHED;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList.configure({ keepMarks: true }),
      OrderedList.configure({ keepMarks: true }),
      ListItem,
    ],
    content: initialPost?.content || "",
    editorProps: { attributes: { class: "" } },
  });

  useEffect(() => {
    if (initialPost && editor) {
      setTitle(initialPost.title);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags);
    }
  }, [initialPost, editor]);

  // Close heading dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node))
        setHeadingOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!editor?.getHTML() || editor.getHTML() === "<p></p>")
      e.content = "Content is required";
    if (!categoryId) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({
      title: title.trim(),
      content: editor?.getHTML() || "",
      categoryId,
      tagIds: selectedTags.map((t) => t.id),
      status,
    });
  };

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id) && selectedTags.length < 10)
      setSelectedTags([...selectedTags, tag]);
  };
  const removeTag = (tag: Tag) =>
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));

  const suggestedTags = availableTags
    .filter((t) => !selectedTags.find((s) => s.id === t.id))
    .slice(0, 8);

  return (
    <div className="pf-wrap">
      <PostFormStyles />
      <form onSubmit={handleSubmit}>
        <div className="pf-page-title">
          {initialPost ? "Edit Post" : "Create Post"}
        </div>
        <p className="pf-page-sub">
          {initialPost
            ? "Update your post content and settings"
            : "Write and publish your thoughts"}
        </p>

        <div className="pf-card">
          {/* ── Title ── */}
          <div className="pf-input-wrap">
            <div className="pf-section-label">
              <Type size={13} /> Post Title
            </div>
            <input
              className={`pf-input ${errors.title ? "error" : ""}`}
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <div className="pf-error-msg">
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--pf-danger)",
                    display: "inline-block",
                  }}
                />
                {errors.title}
              </div>
            )}
          </div>

          {/* ── Editor ── */}
          <div style={{ marginBottom: 28 }}>
            <div className="pf-section-label">
              <FileText size={13} /> Content
            </div>

            <div className="pf-toolbar">
              {/* Heading dropdown */}
              <div style={{ position: "relative" }} ref={headingRef}>
                <button
                  type="button"
                  className="pf-tb-heading-btn"
                  onClick={() => setHeadingOpen(!headingOpen)}
                >
                  H{" "}
                  <ChevronDown
                    size={11}
                    style={{
                      transform: headingOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {headingOpen && (
                  <div className="pf-heading-dd">
                    {([1, 2, 3] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        className="pf-heading-dd-item"
                        style={{
                          fontSize: [22, 18, 15][lvl - 1],
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: lvl })
                            .run();
                          setHeadingOpen(false);
                        }}
                      >
                        H{lvl} — Heading {lvl}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pf-toolbar-sep" />

              <button
                type="button"
                className={`pf-tb-btn ${editor?.isActive("bold") ? "active" : ""}`}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                className={`pf-tb-btn ${editor?.isActive("italic") ? "active" : ""}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic size={15} />
              </button>

              <div className="pf-toolbar-sep" />

              <button
                type="button"
                className={`pf-tb-btn ${editor?.isActive("bulletList") ? "active" : ""}`}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List size={15} />
              </button>
              <button
                type="button"
                className={`pf-tb-btn ${editor?.isActive("orderedList") ? "active" : ""}`}
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
              >
                <ListOrdered size={15} />
              </button>

              <div className="pf-toolbar-sep" />

              <button
                type="button"
                className="pf-tb-btn"
                disabled={!editor?.can().undo()}
                onClick={() => editor?.chain().focus().undo().run()}
              >
                <Undo size={15} />
              </button>
              <button
                type="button"
                className="pf-tb-btn"
                disabled={!editor?.can().redo()}
                onClick={() => editor?.chain().focus().redo().run()}
              >
                <Redo size={15} />
              </button>
            </div>

            <div className="pf-editor-wrap">
              <EditorContent editor={editor} />
            </div>
            {errors.content && (
              <div className="pf-error-msg">
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--pf-danger)",
                    display: "inline-block",
                  }}
                />
                {errors.content}
              </div>
            )}
          </div>

          {/* ── Settings ── */}
          <div style={{ marginBottom: 28 }}>
            <div className="pf-section-label">
              <Layers size={13} /> Post Settings
            </div>
            <div className="pf-settings-grid">
              {/* Category */}
              <div className="pf-select-wrap">
                <label className="pf-select-label">Category *</label>
                <select
                  className={`pf-select ${errors.category ? "error" : ""}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="pf-error-msg" style={{ marginTop: 4 }}>
                    {errors.category}
                  </div>
                )}
              </div>

              {/* Status */}
              {isStatusLocked ? (
                <div className="pf-select-wrap">
                  <label className="pf-select-label">Status</label>
                  <div className="pf-status-locked">
                    <span
                      className="pf-status-dot"
                      style={{
                        background:
                          initialPost?.status === PostStatus.PENDING
                            ? "#f59e0b"
                            : "#22c55e",
                      }}
                    />
                    <span className="pf-status-name">
                      {initialPost?.status === PostStatus.PENDING
                        ? "Under Review"
                        : "Published"}
                    </span>
                    <span className="pf-status-locked-txt">locked</span>
                  </div>
                </div>
              ) : (
                <div className="pf-select-wrap">
                  <label className="pf-select-label">Status</label>
                  <select
                    className="pf-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                  >
                    <option value={PostStatus.DRAFT}>Draft</option>
                  </select>
                </div>
              )}
            </div>

            {!isStatusLocked && (
              <div className="pf-info-banner">
                <Info
                  size={14}
                  style={{
                    color: "var(--pf-accent)",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                />
                <p>
                  Save as <strong>Draft</strong> first, then go to{" "}
                  <strong>My Posts</strong> and click{" "}
                  <strong>"Submit for Review"</strong> — admin will approve
                  before it goes live.
                </p>
              </div>
            )}
          </div>

          {/* ── Tags ── */}
          <div style={{ marginBottom: 8 }}>
            <div className="pf-section-label">
              <TagIcon size={13} /> Tags
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 10,
                  color: "var(--pf-muted)",
                  marginLeft: 4,
                }}
              >
                ({selectedTags.length}/10)
              </span>
            </div>
            <div className="pf-select-wrap pf-tag-select-wrap">
              <label className="pf-select-label">Add Tags</label>
              <select
                className="pf-select"
                value=""
                onChange={(e) => {
                  const tag = availableTags.find(
                    (t) => t.id === e.target.value,
                  );
                  if (tag) addTag(tag);
                }}
              >
                <option value="">Select a tag to add...</option>
                {suggestedTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    #{tag.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTags.length > 0 && (
              <div className="pf-tag-chips">
                {selectedTags.map((tag) => (
                  <span key={tag.id} className="pf-tag-chip">
                    #{tag.name}
                    <button
                      type="button"
                      className="pf-tag-chip-remove"
                      onClick={() => removeTag(tag)}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pf-divider" />

          {/* ── Actions ── */}
          <div className="pf-actions">
            <p className="pf-action-hint">
              {initialPost
                ? "Update to save changes"
                : "Post will be saved as draft"}
            </p>
            <div className="pf-action-btns">
              <button
                type="button"
                className="pf-btn-cancel"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pf-btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <span className="pf-spinner" />}
                {initialPost ? "Update Post" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
