import { httpRequest } from "../../../shared/api/httpRequest";
import type {
  Expense,
  ExpenseDraft,
  ExpenseFilters,
  ExpensePage,
  ExpenseSort,
} from "../types/expense";
export async function listExpenses(
  filters: ExpenseFilters,
  page: number,
  sort: ExpenseSort = "expenseDate,desc",
) {
  const params = new URLSearchParams({ page: String(page), size: "20", sort });
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.category.trim()) params.set("category", filters.category.trim());
  if (filters.paidBy) params.set("paidBy", filters.paidBy);
  return httpRequest<ExpensePage>("/api/v1/expenses?" + params);
}
export const createExpense = (draft: ExpenseDraft) =>
  httpRequest<Expense>("/api/v1/expenses", {
    method: "POST",
    body: JSON.stringify(draft),
  });
export const updateExpense = (id: number, draft: ExpenseDraft) =>
  httpRequest<Expense>("/api/v1/expenses/" + id, {
    method: "PUT",
    body: JSON.stringify(draft),
  });
export const deleteExpense = (id: number) =>
  httpRequest<void>("/api/v1/expenses/" + id, { method: "DELETE" });
