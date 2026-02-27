import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Chip,
  SelectSection,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@nextui-org/react";
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
  // ✅ User sirf DRAFT save kar sakta hai — status always DRAFT on create/edit
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status === PostStatus.DRAFT ||
      initialPost?.status === PostStatus.REJECTED
      ? PostStatus.DRAFT
      : initialPost?.status || PostStatus.DRAFT,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Is post ka status read-only hai? (pending ya published)
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
    editorProps: {
      attributes: {
        class:
          "prose prose-base sm:prose-lg max-w-none focus:outline-none min-h-[320px] px-4 sm:px-6 py-4",
      },
    },
  });

  useEffect(() => {
    if (initialPost && editor) {
      setTitle(initialPost.title);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags);
      setStatus(
        initialPost.status === PostStatus.DRAFT ||
          initialPost.status === PostStatus.REJECTED
          ? PostStatus.DRAFT
          : initialPost.status || PostStatus.DRAFT,
      );
    }
  }, [initialPost, editor]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!editor?.getHTML() || editor?.getHTML() === "<p></p>")
      newErrors.content = "Content is required";
    if (!categoryId) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit({
      title: title.trim(),
      content: editor?.getHTML() || "",
      categoryId,
      tagIds: selectedTags.map((t) => t.id),
      status,
    });
  };

  const handleTagAdd = (tag: Tag) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: Tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const suggestedTags = availableTags
    .filter((t) => !selectedTags.includes(t))
    .slice(0, 5);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          {initialPost ? "Edit Post" : "Create New Post"}
        </h2>
        <p className="text-sm sm:text-base text-default-600">
          {initialPost
            ? "Update your post content and settings"
            : "Write and publish your thoughts"}
        </p>
      </div>

      <Card className="shadow-lg border border-default-200/50 bg-gradient-to-b from-background to-default-50/30">
        <CardBody className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700 mb-2">
              <Type size={16} className="text-primary" />
              <span>Post Title</span>
            </div>
            <Input
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
              size="lg"
              variant="bordered"
              classNames={{
                input: "text-lg font-semibold",
                inputWrapper:
                  "border-default-300 hover:border-primary focus-within:border-primary transition-colors",
              }}
            />
          </div>

          {/* Editor */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700">
              <FileText size={16} className="text-primary" />
              <span>Content</span>
            </div>

            <div className="sticky top-16 sm:top-20 z-20 bg-default-100/90 backdrop-blur-md rounded-lg sm:rounded-xl border border-default-300/50 p-2 sm:p-2.5 shadow-sm">
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      size="sm"
                      variant="flat"
                      endContent={<ChevronDown size={14} />}
                      className="font-medium text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Heading</span>
                      <span className="sm:hidden">H</span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Headings"
                    onAction={(key) =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: Number(key) as 1 | 2 | 3 })
                        .run()
                    }
                  >
                    <DropdownItem key="1" className="text-2xl font-bold">
                      Heading 1
                    </DropdownItem>
                    <DropdownItem key="2" className="text-xl font-bold">
                      Heading 2
                    </DropdownItem>
                    <DropdownItem key="3" className="text-lg font-bold">
                      Heading 3
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Divider
                  orientation="vertical"
                  className="h-6 mx-0.5 sm:mx-1"
                />

                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={
                    editor?.isActive("bold")
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-default-200"
                  }
                >
                  <Bold size={16} />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={
                    editor?.isActive("italic")
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-default-200"
                  }
                >
                  <Italic size={16} />
                </Button>

                <Divider
                  orientation="vertical"
                  className="h-6 mx-0.5 sm:mx-1"
                />

                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={
                    editor?.isActive("bulletList")
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-default-200"
                  }
                >
                  <List size={16} />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  className={
                    editor?.isActive("orderedList")
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-default-200"
                  }
                >
                  <ListOrdered size={16} />
                </Button>

                <Divider
                  orientation="vertical"
                  className="h-6 mx-0.5 sm:mx-1"
                />

                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() => editor?.chain().focus().undo().run()}
                  isDisabled={!editor?.can().undo()}
                  className="hover:bg-default-200"
                >
                  <Undo size={16} />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onClick={() => editor?.chain().focus().redo().run()}
                  isDisabled={!editor?.can().redo()}
                  className="hover:bg-default-200"
                >
                  <Redo size={16} />
                </Button>
              </div>
            </div>

            <div className="rounded-lg sm:rounded-xl border-2 border-default-300 bg-white focus-within:border-primary transition-colors overflow-hidden">
              <EditorContent editor={editor} />
            </div>
            {errors.content && (
              <p className="text-danger text-sm flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-danger" />
                {errors.content}
              </p>
            )}
          </div>

          {/* Category + Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700">
              <Layers size={16} className="text-primary" />
              <span>Post Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                placeholder="Select a category"
                selectedKeys={categoryId ? [categoryId] : []}
                onChange={(e) => setCategoryId(e.target.value)}
                isInvalid={!!errors.category}
                errorMessage={errors.category}
                isRequired
                variant="bordered"
                classNames={{
                  trigger: "border-default-300 hover:border-primary",
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.id}>{cat.name}</SelectItem>
                ))}
              </Select>

              {/* ✅ Status — sirf DRAFT dikhao user ko */}
              {isStatusLocked ? (
                // Pending ya Published post edit nahi honi chahiye normally
                // lekin agar ho bhi to status locked dikhao
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-500 font-medium px-1">
                    Status
                  </span>
                  <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-default-200 bg-default-50">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        initialPost?.status === PostStatus.PENDING
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    />
                    <span className="text-sm font-semibold text-default-700">
                      {initialPost?.status === PostStatus.PENDING
                        ? "Under Review"
                        : "Published"}
                    </span>
                    <span className="text-xs text-default-400 ml-auto">
                      (locked)
                    </span>
                  </div>
                </div>
              ) : (
                <Select
                  label="Status"
                  placeholder="Select status"
                  selectedKeys={[status]}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  variant="bordered"
                  classNames={{
                    trigger: "border-default-300 hover:border-primary",
                  }}
                >
                  {/* ✅ Sirf DRAFT — user khud publish nahi kar sakta */}
                  <SelectItem key={PostStatus.DRAFT}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-default-400" />
                      Draft
                    </div>
                  </SelectItem>
                </Select>
              )}
            </div>

            {/* ✅ Info banner — user ko samjhao workflow */}
            {!isStatusLocked && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100">
                <Info size={15} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-primary-700 leading-relaxed">
                  Save as <strong>Draft</strong> first, then go to{" "}
                  <strong>My Posts</strong> and click{" "}
                  <strong>"Submit for Review"</strong> — admin will approve
                  before it goes live.
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                <TagIcon size={16} className="text-primary" />
                <span>Tags</span>
                <span className="text-xs text-default-500">
                  ({selectedTags.length}/10)
                </span>
              </div>
            </div>

            <Select
              label="Add Tags"
              placeholder="Select tags to add"
              variant="bordered"
              classNames={{
                trigger: "border-default-300 hover:border-primary",
              }}
            >
              <SelectSection title="Suggested Tags">
                {suggestedTags.map((tag) => (
                  <SelectItem key={tag.id} onClick={() => handleTagAdd(tag)}>
                    #{tag.name}
                  </SelectItem>
                ))}
              </SelectSection>
            </Select>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-default-100/50 border border-default-200">
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    variant="flat"
                    color="primary"
                    size="sm"
                    endContent={
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 hover:opacity-70 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    }
                    className="font-medium"
                  >
                    #{tag.name}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <Divider className="my-2" />

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-2">
            <p className="text-xs sm:text-sm text-default-500 text-center sm:text-left">
              {initialPost
                ? "Update your post to save changes"
                : "Post will be saved as draft by default"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="bordered"
                color="danger"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto font-medium border-danger/30 hover:bg-danger/10"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/30"
              >
                {initialPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default PostForm;
