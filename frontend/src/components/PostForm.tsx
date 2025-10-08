import React, { useEffect, useState } from 'react';
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
  DropdownItem
} from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { 
  Bold, 
  Italic, 
  Undo, 
  Redo,
  List,
  ListOrdered,
  ChevronDown,
  X
} from 'lucide-react';
import { Post, Category, Tag, PostStatus } from '../services/apiService';

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
  const [title, setTitle] = useState(initialPost?.title || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialPost?.tags || []);
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status || PostStatus.DRAFT
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to use our custom config
        bulletList: false, // Disable default list to use our custom config
        orderedList: false, // Disable default list to use our custom config
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      ListItem,
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] px-4 py-2 border rounded-lg',
      },
    },
  });

  useEffect(() => {
    if (initialPost && editor) {
      setTitle(initialPost.title);
      editor.commands.setContent(initialPost.content);
      setCategoryId(initialPost.category?.id);
      setSelectedTags(initialPost.tags);
      setStatus(initialPost.status || PostStatus.DRAFT);
    }
  }, [initialPost, editor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!editor?.getHTML() || editor?.getHTML() === '<p></p>') {
      newErrors.content = 'Content is required';
    }
    if (!categoryId) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: editor?.getHTML() || '',
      categoryId: categoryId,
      tagIds: selectedTags.map(tag => tag.id),
      status,
    });
  };

  const handleTagAdd = (tag: Tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleHeadingSelect = (level: number) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const suggestedTags = availableTags
    .filter(tag => !selectedTags.includes(tag))
    .slice(0, 5);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
            />
          </div>

          <div className="space-y-2">
            <div className="bg-default-100 p-2 rounded-lg mb-2 flex gap-2 flex-wrap items-center">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<ChevronDown size={16} />}
                  >
                    Heading
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => handleHeadingSelect(Number(key))}
                  aria-label="Heading levels"
                >
                  <DropdownItem key="1" className={editor?.isActive('heading', { level: 1 }) ? 'bg-default-200' : ''}>
                    Heading 1
                  </DropdownItem>
                  <DropdownItem key="2" className={editor?.isActive('heading', { level: 2 }) ? 'bg-default-200' : ''}>
                    Heading 2
                  </DropdownItem>
                  <DropdownItem key="3" className={editor?.isActive('heading', { level: 3 }) ? 'bg-default-200' : ''}>
                    Heading 3
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-default-200' : ''}
              >
                <Bold size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-default-200' : ''}
              >
                <Italic size={16} />
              </Button>

              <div className="h-6 w-px bg-default-300 mx-2" />

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-default-200' : ''}
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-default-200' : ''}
              >
                <ListOrdered size={16} />
              </Button>

              <div className="h-6 w-px bg-default-300 mx-2" />

              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().undo().run()}
                isDisabled={!editor?.can().undo()}
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                onClick={() => editor?.chain().focus().redo().run()}
                isDisabled={!editor?.can().redo()}
              >
                <Redo size={16} />
              </Button>
            </div>
            <EditorContent editor={editor} />
            {errors.content && (
              <div className="text-danger text-sm">{errors.content}</div>
            )}
          </div>

          <div className="space-y-2">
            <Select
              label="Category"
              selectedKeys={categoryId ? [categoryId] : []}
              onChange={(e) => setCategoryId(e.target.value)}
              isInvalid={!!errors.category}
              errorMessage={errors.category}
              isRequired
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Select
              label="Add Tags"
              selectedKeys={selectedTags.map(tag => tag.id)}>
              <SelectSection>
                {suggestedTags.map((tag) => (
                  <SelectItem
                    key={tag.id}
                    value={tag.id}
                    onClick={() => handleTagAdd(tag)}
                  >
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectSection>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Chip
                  key={tag.id}
                  onClose={() => handleTagRemove(tag)}
                  variant="flat"
                  endContent={<X size={14} />}
                >
                  {tag.name}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Select
              label="Status"
              selectedKeys={[status]}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
            >
              <SelectItem key={PostStatus.DRAFT} value={PostStatus.DRAFT}>
                Draft
              </SelectItem>
              <SelectItem key={PostStatus.PUBLISHED} value={PostStatus.PUBLISHED}>
                Published
              </SelectItem>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              color="danger"
              variant="flat"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              {initialPost ? 'Update' : 'Create'} Post
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default PostForm;