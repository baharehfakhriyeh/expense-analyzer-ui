export type Currency = 'AMD' | 'USD' | 'EUR' | 'IRR'
export interface Expense { id: number; description: string; amount: number; currency: Currency; expenseDate: string; category: string; notes: string | null; paidBy: number; createdAt: string; updatedAt: string }
export interface ExpensePage { content: Expense[]; totalElements: number; totalPages: number; size: number; number: number; numberOfElements: number; first: boolean; last: boolean; empty: boolean }
export interface ExpenseFilters { from: string; to: string; category: string; paidBy: string }
export type ExpenseDraft = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
export type ExpenseSort = 'expenseDate,desc' | 'amount,desc'
export type ExpenseFilterField = keyof ExpenseFilters