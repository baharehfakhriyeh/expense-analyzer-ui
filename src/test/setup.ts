import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  const interceptedFetch = globalThis.fetch;
  vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) => {
    const target =
      typeof input === "string" ? new URL(input, "http://localhost") : input;
    return interceptedFetch(target, init);
  });
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
