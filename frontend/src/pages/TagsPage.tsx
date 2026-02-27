import React, { useEffect, useState } from "react";
import {
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
import { Plus, Trash2, X, Tag as TagIcon, Hash } from "lucide-react";
import { apiService, Tag } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const TagsPage: React.FC = () => {
  const { isAdmin } = useAuth(); // ✅ hook se lo, prop se nahi
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
      handleModalClose();
    } catch {
      setError("Failed to create tags.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(`Delete tag "${tag.name}"?`)) return;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-default-100/30">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden border-b border-default-200/40 pb-10 pt-12">
        <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-primary/15 to-transparent blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary rounded-2xl blur-[8px] opacity-40" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg">
                  <TagIcon size={26} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs font-black tracking-[0.25em] uppercase text-secondary mb-1">
                  Admin Panel
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Tags
                </h1>
                <p className="text-sm text-default-500 mt-1">
                  {tags.length} {tags.length === 1 ? "tag" : "tags"} total
                </p>
              </div>
            </div>

            <Button
              size="lg"
              startContent={<Plus size={18} strokeWidth={2.5} />}
              onPress={onOpen}
              className="font-black text-white bg-gradient-to-r from-secondary to-primary shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all sm:w-auto w-full"
            >
              Add Tags
            </Button>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-6 rounded-2xl border border-danger/30 bg-danger/5 px-5 py-4 text-sm text-danger font-semibold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Tags",
              value: tags.length,
              color: "text-secondary",
              bg: "bg-secondary/10",
              border: "border-secondary/20",
            },
            {
              label: "With Posts",
              value: tags.filter((t) => (t.postCount ?? 0) > 0).length,
              color: "text-success",
              bg: "bg-success/10",
              border: "border-success/20",
            },
            {
              label: "Unused",
              value: tags.filter((t) => !t.postCount || t.postCount === 0)
                .length,
              color: "text-warning",
              bg: "bg-warning/10",
              border: "border-warning/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} ${stat.bg} p-4`}
            >
              <div className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-default-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-default-200/60 bg-background/80 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-default-200/50 bg-default-50/50 flex items-center gap-3">
            <Hash size={17} className="text-secondary" />
            <span className="font-black text-foreground text-sm">All Tags</span>
          </div>

          <Table
            aria-label="Tags table"
            isHeaderSticky
            removeWrapper
            classNames={{
              base: "max-h-[520px]",
              th: "bg-default-100/80 text-default-500 text-xs font-black uppercase tracking-wider",
              td: "text-sm py-4 border-b border-default-100/50 last:border-0",
              tr: "hover:bg-default-50/60 transition-colors",
            }}
          >
            <TableHeader>
              <TableColumn>Tag</TableColumn>
              <TableColumn>Posts</TableColumn>
              <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>

            <TableBody
              isLoading={loading}
              loadingContent={
                <div className="py-16 text-center">
                  <div className="inline-flex items-center gap-3 text-default-400">
                    <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold">
                      Loading tags...
                    </span>
                  </div>
                </div>
              }
              emptyContent={
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-default-100 flex items-center justify-center mb-4">
                    <TagIcon size={28} className="text-default-400" />
                  </div>
                  <p className="font-black text-foreground">No tags yet</p>
                  <p className="text-sm text-default-400 mt-1">
                    Click "Add Tags" to get started
                  </p>
                </div>
              }
            >
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary/15 to-primary/10 flex items-center justify-center border border-secondary/15 flex-shrink-0">
                        <Hash size={14} className="text-secondary" />
                      </div>
                      <Chip
                        variant="flat"
                        color="secondary"
                        size="sm"
                        className="font-bold"
                      >
                        #{tag.name}
                      </Chip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={(tag.postCount ?? 0) > 0 ? "secondary" : "default"}
                      className="font-bold"
                    >
                      {tag.postCount || 0}{" "}
                      {tag.postCount === 1 ? "post" : "posts"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <Tooltip
                      content={
                        (tag.postCount ?? 0) > 0
                          ? "Has posts — cannot delete"
                          : "Delete tag"
                      }
                      placement="top"
                      color={(tag.postCount ?? 0) > 0 ? "warning" : "danger"}
                    >
                      <Button
                        isIconOnly
                        variant="flat"
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(tag)}
                        isDisabled={(tag.postCount ?? 0) > 0}
                        className="hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Add Tags Modal ── */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="md"
        classNames={{
          base: "bg-background rounded-3xl",
          header: "border-b border-default-200/60 pb-4",
          footer: "border-t border-default-200/60 pt-4",
        }}
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-md">
                <Plus size={17} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">
                  Add New Tags
                </h3>
                <p className="text-xs text-default-400 font-normal mt-0.5">
                  Type a tag and press Enter or comma to add
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="py-6 space-y-4">
            <Input
              label="Tag Name"
              placeholder="e.g. react, spring-boot, docker"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              size="lg"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "border-default-300 hover:border-secondary focus-within:border-secondary rounded-xl",
              }}
              description="Press Enter or comma (,) to add each tag"
            />

            {/* Tag chips preview */}
            {newTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-default-500 uppercase tracking-wider">
                  Tags to add:
                </p>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-default-50 border border-default-200">
                  {newTags.map((tag) => (
                    <Chip
                      key={tag}
                      variant="flat"
                      color="secondary"
                      onClose={() =>
                        setNewTags(newTags.filter((t) => t !== tag))
                      }
                      classNames={{ base: "font-bold" }}
                    >
                      #{tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={handleModalClose}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddTags}
              isLoading={isSubmitting}
              isDisabled={newTags.length === 0}
              className="font-black text-white bg-gradient-to-r from-secondary to-primary shadow-md shadow-secondary/30"
            >
              Add {newTags.length > 0 ? `${newTags.length} ` : ""}Tags
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TagsPage;
