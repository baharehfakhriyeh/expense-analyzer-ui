import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, initials, payerName } from "./formatters";

describe("expense display formatters", () => {
  it("formats an ISO date as a readable calendar date", () => {
    expect(formatDate("2026-10-15")).toBe("Oct 15, 2026");
  });

  it("formats an amount using its currency code", () => {
    expect(formatMoney(42.75, "USD")).toContain("42.75");
    expect(formatMoney(42.75, "USD")).toContain("$");
  });

  it("uses initials from the first two words", () => {
    expect(initials("Weekly groceries")).toBe("WG");
  });

  it("shows known payers and a fallback for other ids", () => {
    expect(payerName(1)).toBe("User1");
    expect(payerName(99)).toBe("User 99");
  });
});
