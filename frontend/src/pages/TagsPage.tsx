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
import { Plus, Trash2, X } from "lucide-react";
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
    } catch (err) {
      setError("Failed to load tags. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async () => {
    if (newTags.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.createTags(newTags);
      await fetchTags();
      handleModalClose();
    } catch (err) {
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
    } catch (err) {
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
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tags</h1>
          {isAuthenticated && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onClick={onOpen}
            >
              Add Tags
            </Button>
          )}
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <Table
            aria-label="Tags table"
            isHeaderSticky
            classNames={{
              wrapper: "max-h-[600px]",
            }}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>POST COUNT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              loadingContent={<div>Loading tags...</div>}
            >
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.postCount || 0}</TableCell>
                  <TableCell>
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
                      <span>-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>Add Tags</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Enter tags"
                placeholder="Type and press Enter or comma to add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <div className="flex flex-wrap gap-2">
                {newTags.map((tag) => (
                  <Chip
                    key={tag}
                    onClose={() => handleRemoveNewTag(tag)}
                    variant="flat"
                    endContent={<X size={14} />}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
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
    </div>
  );
};

export default TagsPage;
