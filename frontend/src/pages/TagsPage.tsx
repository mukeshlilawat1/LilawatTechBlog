import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { Plus, Trash2, X, Tag as TagIcon } from "lucide-react";
import { apiService, Tag } from "../services/apiService";

interface TagsPageProps {
  isAuthenticated: boolean;
}

const TagsPage: React.FC<TagsPageProps> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      setError("Failed to load tags. Please try again later.");
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
      handleModalClose();
    } catch {
      setError("Failed to create tags. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteTag(tag.id);
      await fetchTags();
    } catch {
      setError("Failed to delete tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setNewTags([]);
    setTagInput("");
    onClose();
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().toLowerCase();
      if (value && !newTags.includes(value)) {
        setNewTags([...newTags, value]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && newTags.length > 0) {
      setNewTags(newTags.slice(0, -1));
    }
  };

  const handleRemoveNewTag = (tagToRemove: string) => {
    setNewTags(newTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-default-100/40">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* ===== Page Card ===== */}
        <Card className="bg-background/80 backdrop-blur-xl border border-default-200/60 shadow-xl rounded-3xl">
          {/* Header */}
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 py-6 border-b border-default-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
                <TagIcon size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
                <p className="text-sm text-default-500">
                  Manage and organize post tags
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Button
                color="primary"
                startContent={<Plus size={16} />}
                className="font-semibold"
                onClick={onOpen}
              >
                Add Tags
              </Button>
            )}
          </CardHeader>

          {/* Body */}
          <CardBody className="px-6 sm:px-8 py-6">
            {error && (
              <div className="mb-6 rounded-xl border border-danger-200 bg-danger-50/80 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <Table
              aria-label="Tags table"
              isHeaderSticky
              classNames={{
                wrapper: "max-h-[520px] rounded-xl border border-default-200",
                th: "bg-default-100 text-default-600 text-xs font-semibold",
                td: "text-sm",
              }}
            >
              <TableHeader>
                <TableColumn>TAG</TableColumn>
                <TableColumn>POSTS</TableColumn>
                <TableColumn className="text-right">ACTIONS</TableColumn>
              </TableHeader>

              <TableBody
                isLoading={loading}
                loadingContent={<div className="py-6">Loading tags...</div>}
              >
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Chip
                        variant="flat"
                        color="primary"
                        size="sm"
                        className="font-medium"
                      >
                        #{tag.name}
                      </Chip>
                    </TableCell>

                    <TableCell className="text-default-600">
                      {tag.postCount || 0}
                    </TableCell>

                    <TableCell className="text-right">
                      {isAuthenticated ? (
                        <Tooltip
                          content={
                            tag.postCount
                              ? "Cannot delete tag with existing posts"
                              : "Delete tag"
                          }
                        >
                          <Button
                            isIconOnly
                            variant="flat"
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(tag)}
                            isDisabled={
                              tag?.postCount ? tag.postCount > 0 : false
                            }
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      ) : (
                        <span className="text-default-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* ===== Add Tags Modal ===== */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent className="rounded-2xl">
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">Add Tags</h3>
            <p className="text-sm text-default-500">
              Type multiple tags and press Enter or comma
            </p>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <Input
              label="Tag names"
              placeholder="e.g. react, spring, backend"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />

            <div className="flex flex-wrap gap-2">
              {newTags.map((tag) => (
                <Chip
                  key={tag}
                  variant="flat"
                  color="primary"
                  onClose={() => handleRemoveNewTag(tag)}
                  endContent={<X size={14} />}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddTags}
              isLoading={isSubmitting}
              isDisabled={newTags.length === 0}
            >
              Add Tags
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
};

export default TagsPage;
