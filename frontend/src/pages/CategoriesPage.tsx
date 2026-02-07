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
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { Plus, Edit2, Trash2, Folder, Hash } from "lucide-react";
import { apiService, Category } from "../services/apiService";

interface CategoriesPageProps {
  isAuthenticated: boolean;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response);
      setError(null);
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await apiService.updateCategory(
          editingCategory.id,
          newCategoryName.trim(),
        );
      } else {
        await apiService.createCategory(newCategoryName.trim());
      }
      await fetchCategories();
      handleModalClose();
    } catch (err) {
      setError(
        `Failed to ${
          editingCategory ? "update" : "create"
        } category. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${category.name}"?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteCategory(category.id);
      await fetchCategories();
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onClose();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    onOpen();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    onOpen();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50/30 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
              <Folder size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-sm sm:text-base text-default-600 mt-1">
                Organize your posts into meaningful collections
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-default-200/50 shadow-xl bg-gradient-to-b from-background to-default-50/30">
          {/* Header */}
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center px-5 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-default-200/50 bg-default-50/50">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center border border-primary/20">
                <Hash size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  All Categories
                </h2>
                <p className="text-xs sm:text-sm text-default-500 mt-0.5">
                  {categories.length}{" "}
                  {categories.length === 1 ? "category" : "categories"} total
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <Button
                color="primary"
                startContent={<Plus size={18} />}
                onClick={openAddModal}
                className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                size="lg"
              >
                Add Category
              </Button>
            )}
          </CardHeader>

          {/* Body */}
          <CardBody className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
            {error && (
              <div className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-danger" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-danger">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-default-200/50 overflow-hidden bg-background">
              <Table
                aria-label="Categories table"
                isHeaderSticky
                removeWrapper
                classNames={{
                  base: "max-h-[520px]",
                  th: "bg-default-100 text-default-700 text-xs sm:text-sm font-bold uppercase tracking-wider first:rounded-none last:rounded-none",
                  td: "text-sm sm:text-base py-4",
                  tr: "hover:bg-default-50 transition-colors",
                }}
              >
                <TableHeader>
                  <TableColumn>CATEGORY NAME</TableColumn>
                  <TableColumn>TOTAL POSTS</TableColumn>
                  <TableColumn className="text-right">ACTIONS</TableColumn>
                </TableHeader>

                <TableBody
                  isLoading={loading}
                  loadingContent={
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center gap-3 text-default-500">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">
                          Loading categories...
                        </span>
                      </div>
                    </div>
                  }
                  emptyContent={
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-default-100 flex items-center justify-center mb-4">
                        <Folder size={32} className="text-default-400" />
                      </div>
                      <p className="text-sm sm:text-base text-default-500 font-medium">
                        No categories yet
                      </p>
                      <p className="text-xs sm:text-sm text-default-400 mt-1">
                        Create your first category to get started
                      </p>
                    </div>
                  }
                >
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                            <Hash size={16} className="text-primary" />
                          </div>
                          <span className="font-semibold text-foreground">
                            {category.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={category.postCount > 0 ? "primary" : "default"}
                          className="font-semibold"
                        >
                          {category.postCount || 0}{" "}
                          {category.postCount === 1 ? "post" : "posts"}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-right">
                        {isAuthenticated ? (
                          <div className="flex justify-end gap-2">
                            <Tooltip content="Edit category" placement="top">
                              <Button
                                isIconOnly
                                variant="flat"
                                size="sm"
                                onClick={() => openEditModal(category)}
                                className="hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Edit2 size={16} />
                              </Button>
                            </Tooltip>
                            <Tooltip
                              content={
                                category.postCount
                                  ? "Cannot delete category with existing posts"
                                  : "Delete category"
                              }
                              placement="top"
                              color={category.postCount ? "warning" : "danger"}
                            >
                              <Button
                                isIconOnly
                                variant="flat"
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(category)}
                                isDisabled={
                                  category?.postCount
                                    ? category.postCount > 0
                                    : false
                                }
                                className="hover:bg-danger/10 transition-colors disabled:opacity-40"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </Tooltip>
                          </div>
                        ) : (
                          <span className="text-default-400 text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="lg"
        classNames={{
          base: "bg-background",
          header: "border-b border-default-200",
          body: "py-6",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {editingCategory ? (
                  <Edit2 size={18} className="text-white" />
                ) : (
                  <Plus size={18} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-sm text-default-500 font-normal">
                  {editingCategory
                    ? "Update the category name"
                    : "Create a new category for your posts"}
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            <Input
              label="Category Name"
              placeholder="e.g. Backend, Frontend, DevOps"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              isRequired
              size="lg"
              variant="bordered"
              classNames={{
                input: "text-base",
                inputWrapper:
                  "border-default-300 hover:border-primary focus-within:border-primary",
              }}
              description="Choose a clear and concise name"
            />
          </ModalBody>

          <ModalFooter className="pt-4">
            <Button
              variant="bordered"
              onClick={handleModalClose}
              className="font-medium border-default-300 hover:bg-default-100"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleAddEdit}
              isLoading={isSubmitting}
              className="font-semibold shadow-lg shadow-primary/30"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
