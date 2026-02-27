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
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { Plus, Edit2, Trash2, Folder, Hash, Tag } from "lucide-react";
import { apiService, Category } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const CategoriesPage: React.FC = () => {
  const { isAdmin } = useAuth(); // ✅ AdminRoute guard kar raha hai, but hook se bhi check
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
    } catch {
      setError("Failed to load categories.");
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
    } catch {
      setError(`Failed to ${editingCategory ? "update" : "create"} category.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      setLoading(true);
      await apiService.deleteCategory(category.id);
      await fetchCategories();
    } catch {
      setError("Failed to delete category.");
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-default-100/30">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden border-b border-default-200/40 pb-10 pt-12">
        <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-secondary/15 to-transparent blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-[8px] opacity-40" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Folder size={26} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs font-black tracking-[0.25em] uppercase text-primary mb-1">
                  Admin Panel
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  Categories
                </h1>
                <p className="text-sm text-default-500 mt-1">
                  {categories.length}{" "}
                  {categories.length === 1 ? "category" : "categories"} total
                </p>
              </div>
            </div>

            <Button
              size="lg"
              startContent={<Plus size={18} strokeWidth={2.5} />}
              onPress={openAddModal}
              className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all sm:w-auto w-full"
            >
              Add Category
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
              label: "Total",
              value: categories.length,
              color: "text-primary",
              bg: "bg-primary/10",
              border: "border-primary/20",
            },
            {
              label: "With Posts",
              value: categories.filter((c) => (c.postCount ?? 0) > 0).length,
              color: "text-success",
              bg: "bg-success/10",
              border: "border-success/20",
            },
            {
              label: "Empty",
              value: categories.filter((c) => !c.postCount || c.postCount === 0)
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
            <Hash size={17} className="text-primary" />
            <span className="font-black text-foreground text-sm">
              All Categories
            </span>
          </div>

          <Table
            aria-label="Categories table"
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
              <TableColumn>Category Name</TableColumn>
              <TableColumn>Posts</TableColumn>
              <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>

            <TableBody
              isLoading={loading}
              loadingContent={
                <div className="py-16 text-center">
                  <div className="inline-flex items-center gap-3 text-default-400">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold">
                      Loading categories...
                    </span>
                  </div>
                </div>
              }
              emptyContent={
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-default-100 flex items-center justify-center mb-4">
                    <Folder size={28} className="text-default-400" />
                  </div>
                  <p className="font-black text-foreground">
                    No categories yet
                  </p>
                  <p className="text-sm text-default-400 mt-1">
                    Click "Add Category" to get started
                  </p>
                </div>
              }
            >
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center border border-primary/15 flex-shrink-0">
                        <Tag size={14} className="text-primary" />
                      </div>
                      <span className="font-bold text-foreground">
                        {category.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        (category.postCount ?? 0) > 0 ? "primary" : "default"
                      }
                      className="font-bold"
                    >
                      {category.postCount || 0}{" "}
                      {category.postCount === 1 ? "post" : "posts"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip content="Edit" placement="top">
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onPress={() => openEditModal(category)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Edit2 size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content={
                          (category.postCount ?? 0) > 0
                            ? "Has posts — cannot delete"
                            : "Delete"
                        }
                        placement="top"
                        color={
                          (category.postCount ?? 0) > 0 ? "warning" : "danger"
                        }
                      >
                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          size="sm"
                          onPress={() => handleDelete(category)}
                          isDisabled={(category.postCount ?? 0) > 0}
                          className="hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Modal ── */}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                {editingCategory ? (
                  <Edit2 size={17} className="text-white" />
                ) : (
                  <Plus size={17} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h3>
                <p className="text-xs text-default-400 font-normal mt-0.5">
                  {editingCategory
                    ? "Update the name below"
                    : "Give your category a clear name"}
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="py-6">
            <Input
              label="Category Name"
              placeholder="e.g. Backend, Frontend, DevOps"
              value={newCategoryName}
              onValueChange={setNewCategoryName}
              isRequired
              size="lg"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "border-default-300 hover:border-primary focus-within:border-primary rounded-xl",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddEdit();
              }}
            />
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
              onPress={handleAddEdit}
              isLoading={isSubmitting}
              isDisabled={!newCategoryName.trim()}
              className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30"
            >
              {editingCategory ? "Update" : "Create Category"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
