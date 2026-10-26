import { httpRequest } from "../../../shared/api/httpRequest";
import type { Category, CategoryDraft } from "../types/category";

const categoriesUri = "/api/v1/categories";

export async function listCategories() {
  return httpRequest<Category[]>(categoriesUri);
}

export const createCategory = (draft: CategoryDraft) =>
  httpRequest<Category>(categoriesUri, {
    method: "POST",
    body: JSON.stringify(draft),
  });

export const updateCategory = (id: number, draft: CategoryDraft) =>
  httpRequest<Category>( `${categoriesUri}/${id}`, {
    method: "PUT",
    body: JSON.stringify(draft),
  });

export const deleteCategory = (id: number) =>
  httpRequest<void>(`${categoriesUri}/${id}`, { method: "DELETE" });
