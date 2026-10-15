import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "./expensesApi";
import {
  sampleDraft,
  sampleExpense,
  expensePage,
} from "../../../test/fixtures";
import { server } from "../../../test/server";

const endpoint = "http://localhost/api/v1/expenses";

describe("expense API client", () => {
  it("sends list filters, zero-based pagination, and sort to the API", async () => {
    let requestedUrl = "";
    server.use(
      http.get(endpoint, ({ request }) => {
        requestedUrl = request.url;
        return HttpResponse.json(expensePage());
      }),
    );

    await listExpenses(
      { from: "2026-10-01", to: "2026-10-31", category: " Food ", paidBy: "2" },
      3,
      "amount,desc",
    );

    const params = new URL(requestedUrl).searchParams;
    expect(params.get("from")).toBe("2026-10-01");
    expect(params.get("to")).toBe("2026-10-31");
    expect(params.get("category")).toBe("Food");
    expect(params.get("paidBy")).toBe("2");
    expect(params.get("page")).toBe("3");
    expect(params.get("size")).toBe("20");
    expect(params.get("sort")).toBe("amount,desc");
  });

  it("posts an expense and returns the created record", async () => {
    let receivedBody: unknown;
    server.use(
      http.post(endpoint, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json(sampleExpense, { status: 201 });
      }),
    );

    await expect(createExpense(sampleDraft)).resolves.toEqual(sampleExpense);
    expect(receivedBody).toEqual(sampleDraft);
  });

  it("replaces an expense using its id and the full draft", async () => {
    let receivedBody: unknown;
    server.use(
      http.put(endpoint + "/7", async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json(sampleExpense);
      }),
    );

    await expect(updateExpense(7, sampleDraft)).resolves.toEqual(sampleExpense);
    expect(receivedBody).toEqual(sampleDraft);
  });

  it("handles a no-content delete response", async () => {
    let requestedUrl = "";
    server.use(
      http.delete(endpoint + "/7", ({ request }) => {
        requestedUrl = request.url;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await expect(deleteExpense(7)).resolves.toBeUndefined();
    expect(requestedUrl).toBe(endpoint + "/7");
  });

  it("surfaces field validation messages from the API error shape", async () => {
    server.use(
      http.post(endpoint, () =>
        HttpResponse.json(
          {
            timestamp: "2026-10-15T10:00:00Z",
            status: 400,
            error: "Bad Request",
            message: "Request validation failed",
            details: { amount: "must be greater than 0" },
          },
          { status: 400 },
        ),
      ),
    );

    await expect(createExpense({ ...sampleDraft, amount: 0 })).rejects.toThrow(
      "must be greater than 0",
    );
  });
});
