import { httpRequest } from "../../../shared/api/httpRequest";
import type {
  Expense,
  ExpenseDraft,
  ExpenseFilters,
  ExpensePage,
  ExpenseSummary,
  ExpenseSort,
} from "../types/expense";
export async function listExpenses(
  filters: ExpenseFilters,
  page: number,
  sort: ExpenseSort = "expenseDate,desc",
) {
  const params = new URLSearchParams({ page: String(page), size: "20" });
  params.append("sort", sort);
  params.append("sort", "createdAt,desc");
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.paidBy) params.set("paidBy", filters.paidBy);
  return httpRequest<ExpensePage>("/api/v1/expenses?" + params);
}
export async function getExpenseSummary(from: string, to: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.size ? "?" + params.toString() : "";
  return httpRequest<ExpenseSummary>("/api/v1/expenses/summary" + query);
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
