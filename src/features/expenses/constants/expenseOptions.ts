import type { Currency, ExpenseDraft } from "../types/expense";
export const currencies: Currency[] = ["AMD", "USD", "EUR", "IRR"];
export const payers = [
  { id: 1, text: "User1" },
  { id: 2, text: "User2" },
];
export function emptyExpenseDraft(): ExpenseDraft {
  return {
    description: "",
    amount: 0,
    currency: "AMD",
    expenseDate: new Date().toISOString().slice(0, 10),
    category: "",
    notes: "",
    paidBy: 1,
  };
}
