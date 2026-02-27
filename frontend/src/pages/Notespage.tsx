import React, { useEffect, useState } from "react";
import { apiService, Note, NoteRequest } from "../services/apiService";
import {
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Divider,
  Spinner,
} from "@nextui-org/react";
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

const FOLDER_COLORS: Record<
  string,
  { chip: "primary" | "secondary" | "warning" | "success" | "default" }
> = {
  Work: { chip: "primary" },
  Personal: { chip: "secondary" },
  Ideas: { chip: "warning" },
  Research: { chip: "success" },
  Other: { chip: "default" },
};

const FOLDERS = ["Work", "Personal", "Ideas", "Research", "Other"];

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar

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

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  // Sidebar content — reuse in both desktop and mobile drawer
  const SidebarContent = () => (
    <div className="flex flex-col gap-1 h-full">
      <p className="text-default-400 text-xs font-mono uppercase tracking-widest px-3 mb-3 mt-2">
        Folders
      </p>

      <button
        onClick={() => {
          setActiveFolder(null);
          setSidebarOpen(false);
        }}
        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
          !activeFolder
            ? "bg-primary/10 text-primary"
            : "text-default-600 hover:bg-default-100 hover:text-foreground"
        }`}
      >
        <span className="flex items-center gap-2">
          <FolderOpen size={14} />
          All Notes
        </span>
        <span className="text-xs text-default-400">{notes.length}</span>
      </button>

      {FOLDERS.map((f) => {
        const count = notes.filter((n) => n.folder === f).length;
        return (
          <button
            key={f}
            onClick={() => {
              setActiveFolder(f);
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
              activeFolder === f
                ? "bg-primary/10 text-primary"
                : "text-default-600 hover:bg-default-100 hover:text-foreground"
            }`}
          >
            <span>{f}</span>
            {count > 0 && (
              <span className="text-xs text-default-400">{count}</span>
            )}
          </button>
        );
      })}

      <div className="flex-1" />
      <Button
        onPress={() => {
          openNewNote();
          setSidebarOpen(false);
        }}
        startContent={<Plus size={16} />}
        className="w-full font-black text-white bg-gradient-to-r from-primary to-secondary mt-4"
        size="sm"
      >
        New Note
      </Button>
    </div>
  );

  // ─── EDITOR VIEW ─────────────────────────────────────────────────────────────
  if (view === "editor") {
    return (
      <div className="min-h-screen bg-background">
        {/* Editor Header */}
        <div className="border-b border-default-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-10">
          <Button
            variant="light"
            size="sm"
            startContent={<ArrowLeft size={15} />}
            onPress={() => setView("list")}
            className="font-semibold text-default-500"
          >
            <span className="hidden sm:inline">Back to Notes</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-default-400 font-mono hidden sm:block">
              {editingNote ? "Editing note" : "New note"}
            </span>
            <Button
              size="sm"
              isDisabled={!title.trim() || !content.trim()}
              isLoading={saving}
              onPress={handleSave}
              startContent={!saving ? <Save size={14} /> : undefined}
              className="font-black text-white bg-gradient-to-r from-primary to-secondary"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-transparent text-2xl sm:text-4xl font-black text-foreground placeholder:text-default-300 focus:outline-none mb-4 sm:mb-6"
          />

          {/* Folder + Tags */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6 flex-wrap">
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="bg-default-100 border border-default-200 rounded-xl px-3 py-1.5 text-sm text-default-600 focus:outline-none w-full sm:w-auto"
            >
              <option value="">No folder</option>
              {FOLDERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <input
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
                className="bg-default-100 border border-default-200 rounded-xl px-3 py-1.5 text-sm text-default-600 placeholder:text-default-300 focus:outline-none flex-1 sm:w-28"
              />
              {tagInput && (
                <Button
                  size="sm"
                  variant="flat"
                  onPress={addTag}
                  className="h-8 text-xs font-semibold"
                >
                  + Add
                </Button>
              )}
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClose={() => removeTag(tag)}
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>

          <Divider className="mb-4 sm:mb-6" />

          {/* Note: Plain text editor — formatting via markdown shorthand */}

          {/* ✅ textarea — RTL issue permanently fixed */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full min-h-[300px] sm:min-h-[400px] text-foreground text-base leading-relaxed focus:outline-none bg-transparent resize-none placeholder:text-default-300"
            style={{ direction: "ltr", textAlign: "left" }}
          />
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-default-200 min-h-screen p-4 flex-col gap-1 bg-default-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-default-50 border-r border-default-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-foreground">Folders</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-default-400 hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-default-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-default-500 hover:text-foreground"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-foreground">
                {activeFolder || "All Notes"}
              </h1>
              <p className="text-default-400 text-xs sm:text-sm mt-0.5">
                {filtered.length} note{filtered.length !== 1 ? "s" : ""} ·
                private to you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search..."
              size="sm"
              startContent={<Search size={14} className="text-default-400" />}
              classNames={{
                base: "w-32 sm:w-52",
                inputWrapper: "bg-default-100",
              }}
            />
            {/* Mobile new note button */}
            <Button
              onPress={openNewNote}
              isIconOnly
              size="sm"
              className="md:hidden font-black text-white bg-gradient-to-r from-primary to-secondary"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 p-4 sm:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-default-500 text-lg font-semibold">
                No notes yet.
              </p>
              <p className="text-default-400 text-sm mb-6">
                Start writing something private just for you.
              </p>
              <Button
                onPress={openNewNote}
                startContent={<Plus size={16} />}
                className="font-black text-white bg-gradient-to-r from-primary to-secondary"
              >
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((note) => {
                const folderCfg = note.folder
                  ? FOLDER_COLORS[note.folder]
                  : null;
                return (
                  <Card
                    key={note.id}
                    isPressable
                    onPress={() => openEditNote(note)}
                    className="group border border-default-200 hover:border-primary/40 transition-all duration-200 hover:shadow-md"
                    shadow="none"
                  >
                    <CardBody className="p-4 sm:p-5">
                      {note.folder && folderCfg && (
                        <Chip
                          size="sm"
                          variant="flat"
                          color={folderCfg.chip}
                          className="mb-3"
                          startContent={<FolderOpen size={11} />}
                        >
                          {note.folder}
                        </Chip>
                      )}
                      <h3 className="font-bold text-foreground truncate mb-2 text-base">
                        {note.title}
                      </h3>
                      <p
                        className="text-default-400 text-sm line-clamp-3 leading-relaxed mb-3"
                        dangerouslySetInnerHTML={{
                          __html: note.content
                            .replace(/<[^>]+>/g, " ")
                            .substring(0, 150),
                        }}
                      />
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              size="sm"
                              variant="flat"
                              startContent={<Tag size={9} />}
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-default-100">
                        <p className="text-default-300 text-xs">
                          {new Date(note.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          isLoading={deleting === note.id}
                          onPress={(e) => handleDelete(note.id, e as any)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
