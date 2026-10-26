import type { FormEvent } from "react";
import type { CategoryDraft } from "../types/category";
import { Check, LoaderCircle, Plus, X } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  draft: CategoryDraft;
  saving: boolean;
  onChange: (draft: CategoryDraft) => void;
  onSubmit: (draft: CategoryDraft) => void | Promise<void>;
  onCancel?: () => void;
}

export const CategoryForm = ({ mode, draft, saving, onChange, onSubmit, onCancel }: Props) => {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit({ name: draft.name.trim() });
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form-heading">
        <div>
          <h2>{mode === "create" ? "Add a category" : "Edit category"}</h2>
          <p>Use a name that makes your spending easy to recognize.</p>
        </div>
      </div>
      <div className="category-form-fields">
        <label className="form-field">
          <span>Name</span>
          <input
            maxLength={80}
            required
            placeholder="Groceries"
            value={draft.name}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
          />
        </label>
        <div className="category-form-actions">
          {mode === "edit" && onCancel && (
            <button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>
              <X size={15} /> Cancel
            </button>
          )}
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? (
              <LoaderCircle className="spin" size={16} />
            ) : mode === "create" ? (
              <Plus size={16} />
            ) : (
              <Check size={16} />
            )}
            {saving ? "Saving…" : mode === "create" ? "Add category" : "Save category"}
          </button>
        </div>
      </div>
    </form>
  );
};
