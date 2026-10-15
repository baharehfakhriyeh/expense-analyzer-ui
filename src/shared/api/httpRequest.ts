export async function httpRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.details
      ? Object.values(body.details).join(" ")
      : body?.message;
    throw new Error(detail || "Request failed (" + response.status + ")");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
