import type {
  Expense,
  ExpenseDraft,
  ExpensePage,
} from "../features/expenses/types/expense";

export const sampleExpense: Expense = {
  id: 7,
  description: "Weekly groceries",
  amount: 42.75,
  currency: "USD",
  expenseDate: "2026-10-04",
  categoryId: 1,
  categoryName: "food",
  notes: "Weekly shop",
  paidBy: 1,
  createdAt: "2026-10-04T12:30:45Z",
  updatedAt: "2026-10-04T12:30:45Z",
};

export const sampleDraft: ExpenseDraft = {
  description: "Weekly groceries",
  amount: 42.75,
  currency: "USD",
  expenseDate: "2026-10-04",
  categoryId: 1,
  notes: "Weekly shop",
  paidBy: 1,
};

export function expensePage(content: Expense[] = [sampleExpense]): ExpensePage {
  return {
    content,
    totalElements: content.length,
    totalPages: content.length ? 1 : 0,
    size: 20,
    number: 0,
    numberOfElements: content.length,
    first: true,
    last: true,
    empty: content.length === 0,
  };
}
