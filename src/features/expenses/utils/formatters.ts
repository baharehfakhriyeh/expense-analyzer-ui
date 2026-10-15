import type { Currency } from "../types/expense";
import { payers } from "../constants/expenseOptions";
export function payerName(id: number) {
  return payers.find((person) => person.id === id)?.text ?? "User " + id;
}
export function initials(text: string) {
  return text
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date + "T12:00:00"));
}
export function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
