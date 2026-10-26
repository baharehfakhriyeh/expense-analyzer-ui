import { afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CategoriesPage } from "./CategoriesPage";
import { server } from "../../test/server";
import type { Category } from "../../features/categories/types/category";

const endpoint = "http://localhost/api/v1/categories";
const initialCategories: Category[] = [
  { id: 1, name: "food" },
  { id: 2, name: "travel" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <CategoriesPage />
    </MemoryRouter>,
  );
}

function mockCategoriesApi(seed: Category[] = initialCategories) {
  let categories = [...seed];
  let nextId = Math.max(0, ...categories.map(({ id }) => id)) + 1;

  server.use(
    http.get(endpoint, () => HttpResponse.json(categories)),
    http.post(endpoint, async ({ request }) => {
      const draft = (await request.json()) as { name: string };
      const created = { id: nextId++, name: draft.name };
      categories = [...categories, created];
      return HttpResponse.json(created, { status: 201 });
    }),
    http.put(endpoint + "/:id", async ({ request, params }) => {
      const id = Number(params.id);
      const draft = (await request.json()) as { name: string };
      const updated = { id, name: draft.name };
      categories = categories.map((category) =>
        category.id === id ? updated : category,
      );
      return HttpResponse.json(updated);
    }),
    http.delete(endpoint + "/:id", ({ params }) => {
      const id = Number(params.id);
      categories = categories.filter((category) => category.id !== id);
      return new HttpResponse(null, { status: 204 });
    }),
  );
}

describe("CategoriesPage", () => {
  afterEach(() => vi.restoreAllMocks());

  it("loads and displays categories, or shows an empty state", async () => {
    mockCategoriesApi();
    renderPage();

    expect(screen.getByRole("status")).toHaveTextContent("Loading categories");
    expect(await screen.findByText("food")).toBeInTheDocument();
    expect(screen.getByText("travel")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows a useful error when categories cannot be loaded", async () => {
    server.use(
      http.get(endpoint, () =>
        HttpResponse.json({ message: "Categories unavailable" }, { status: 500 }),
      ),
    );
    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Categories unavailable",
    );
  });

  it("creates a category, adds it to the list, and clears the form", async () => {
    mockCategoriesApi();
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("food");

    await user.type(screen.getByPlaceholderText("Groceries"), "  utilities  ");
    await user.click(screen.getByRole("button", { name: "Add category" }));

    expect(await screen.findByText("utilities")).toBeInTheDocument();
    expect(await screen.findByText("Category added")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Groceries")).toHaveValue("");
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("updates a category and cancels edit mode when requested", async () => {
    mockCategoriesApi();
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("food");

    await user.click(screen.getByRole("button", { name: "Edit food" }));
    const editInput = screen.getByDisplayValue("food");
    await user.clear(editInput);
    await user.type(editInput, "meals");
    await user.click(screen.getByRole("button", { name: "Save category" }));

    expect(await screen.findByText("meals")).toBeInTheDocument();
    expect(screen.queryByText("food")).not.toBeInTheDocument();
    expect(await screen.findByText("Category updated")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit meals" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("meals")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save category" })).not.toBeInTheDocument();
  });

  it("deletes a category only after confirmation", async () => {
    mockCategoriesApi();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("food");

    await user.click(screen.getByRole("button", { name: "Delete food" }));
    expect(window.confirm).toHaveBeenCalledWith(
      "Delete “food”? Categories assigned to expenses cannot be deleted.",
    );
    expect(screen.getByText("food")).toBeInTheDocument();

    vi.mocked(window.confirm).mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: "Delete food" }));
    await waitFor(() => expect(screen.queryByText("food")).not.toBeInTheDocument());
    expect(await screen.findByText("Category deleted")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("keeps the category and shows the backend error when deletion fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    server.use(
      http.get(endpoint, () => HttpResponse.json(initialCategories)),
      http.delete(endpoint + "/:id", () =>
        HttpResponse.json(
          { message: "Categories assigned to expenses cannot be deleted." },
          { status: 409 },
        ),
      ),
    );
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("food");

    await user.click(screen.getByRole("button", { name: "Delete food" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Categories assigned to expenses cannot be deleted.",
    );
    expect(screen.getByText("food")).toBeInTheDocument();
  });
});
