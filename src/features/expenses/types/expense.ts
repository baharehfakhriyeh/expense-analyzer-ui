export type Currency = "AMD" | "USD" | "EUR" | "IRR";
export interface Expense {
  id: number;
  description: string | null;
  amount: number;
  currency: Currency;
  expenseDate: string;
  categoryId: number;
  categoryName: string;
  notes: string | null;
  paidBy: number;
  isPersonal: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ExpensePage {
  content: Expense[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface CurrencyExpenseTotal {
  currency: Currency;
  amount: number;
  expenseCount: number;
}
export interface PayerExpenseSummary {
  paidBy: number;
  totals: CurrencyExpenseTotal[];
  sharedTotals: CurrencyExpenseTotal[];
  personalTotals: CurrencyExpenseTotal[];
}
export interface ExpenseSummary {
  totals: CurrencyExpenseTotal[];
  sharedTotals: CurrencyExpenseTotal[];
  personalTotals: CurrencyExpenseTotal[];
  payers: PayerExpenseSummary[];
}
export interface ExpenseFilters {
  from: string;
  to: string;
  categoryId: string;
  paidBy: string;
}
export type ExpenseDraft = Omit<
  Expense,
  "id" | "createdAt" | "updatedAt" | "categoryName" | "description"
> & {
  description?: string | null;
};
export type ExpenseSort = "expenseDate,desc" | "amount,desc";
export type ExpenseFilterField = keyof ExpenseFilters;
