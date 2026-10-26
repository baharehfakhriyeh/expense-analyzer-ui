import { LoaderCircle, Pencil, Tag, Trash2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import ErrorBanner from "../../shared/components/feedback/ErrorBanner";
import { CategoryForm } from "../../features/categories/components/CategoryForm";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../../features/categories/api/categoriesApi";
import type { Category, CategoryDraft } from "../../features/categories/types/category";
import Toast from "../../shared/components/feedback/Toast";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<CategoryDraft>({ name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<CategoryDraft>({ name: "" });
  const [savingCategoryId, setSavingCategoryId] = useState<number | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setError("");
        const result = await listCategories();
        setCategories(result);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load categories");
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();
  }, []);

  async function handleCreate(nextDraft: CategoryDraft) {
    if (!nextDraft.name) {
      setError("Enter a category name.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const createdCategory = await createCategory(nextDraft);
      setCategories((current) => [...current, createdCategory]);
      setDraft({ name: "" });
      setNotice("Category added");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create category");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(category: Category) {
    setError("");
    setEditingCategoryId(category.id);
    setEditDraft({ name: category.name });
  }

  function cancelEditing() {
    setEditingCategoryId(null);
    setEditDraft({ name: "" });
  }

  async function handleUpdate(id: number, nextDraft: CategoryDraft) {
    if (!nextDraft.name) {
      setError("Enter a category name.");
      return;
    }

    setSavingCategoryId(id);
    setError("");
    try {
      const updatedCategory = await updateCategory(id, nextDraft);
      setCategories((current) =>
        current.map((category) => category.id === id ? updatedCategory : category),
      );
      cancelEditing();
      setNotice("Category updated");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update category");
    } finally {
      setSavingCategoryId(null);
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Delete “${category.name}”? Categories assigned to expenses cannot be deleted.`,
    );
    if (!confirmed) return;

    setDeletingCategoryId(category.id);
    setError("");
    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingCategoryId === category.id) cancelEditing();
      setNotice("Category deleted");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete category");
    } finally {
      setDeletingCategoryId(null);
    }
  }

  return (
    <DashboardLayout transactionCount={0}>
      <div className="page-wrap" id="categories">
        <div className="welcome-row">
          <div>
            <div className="eyebrow"><Tag size={14} /> ORGANIZE YOUR SPENDING</div>
            <h1>Categories</h1>
            <p className="page-subtitle">Manage the labels you use to organize expenses.</p>
          </div>
        </div>
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}
        <section className="panel category-create-panel" aria-label="Add category">
          <CategoryForm
            mode="create"
            draft={draft}
            saving={saving}
            onChange={setDraft}
            onSubmit={handleCreate}
          />
        </section>
        <section className="panel category-list-panel" aria-labelledby="category-list-title">
          <div className="category-list-heading">
            <div>
              <div className="section-title-line">
                <h2 id="category-list-title">Your categories</h2>
                <span className="result-badge">{categories.length}</span>
              </div>
              <p>Categories available when recording an expense.</p>
            </div>
          </div>
          {loading ? (
            <p className="category-list-message" role="status">Loading categories…</p>
          ) : categories.length === 0 ? (
            <p className="category-list-message">No categories yet. Add one above to get started.</p>
          ) : (
            <ul className="category-list">
              {categories.map((category) => (
                editingCategoryId === category.id ? (
                  <li className="category-list-edit-item" key={category.id}>
                    <CategoryForm
                      mode="edit"
                      draft={editDraft}
                      saving={savingCategoryId === category.id}
                      onChange={setEditDraft}
                      onSubmit={(nextDraft) => handleUpdate(category.id, nextDraft)}
                      onCancel={cancelEditing}
                    />
                  </li>
                ) : (
                  <li className="category-list-item" key={category.id}>
                    <span className="category-list-icon"><Tag size={16} /></span>
                    <span className="category-list-name">{category.name}</span>
                    <div className="category-list-actions">
                      <button
                        type="button"
                        className="icon-button category-action-button"
                        aria-label={`Edit ${category.name}`}
                        title="Edit category"
                        disabled={savingCategoryId !== null || deletingCategoryId !== null}
                        onClick={() => startEditing(category)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-button category-action-button category-delete-button"
                        aria-label={`Delete ${category.name}`}
                        title="Delete category"
                        disabled={savingCategoryId !== null || deletingCategoryId !== null}
                        onClick={() => void handleDelete(category)}
                      >
                        {deletingCategoryId === category.id ? (
                          <LoaderCircle className="spin" size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </li>
                )
              ))}
            </ul>
          )}
        </section>
      </div>
      {notice && <Toast message={notice} onDismiss={() => setNotice("")} />}
    </DashboardLayout>
  );
};
