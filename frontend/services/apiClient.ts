import { tokenStore } from "./tokenStore";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// AuthProvider registers a handler so a failed refresh can drop the session
// from one place instead of every call site dealing with it.
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg;
    }
  } catch {
    /* body wasn't JSON */
  }
  return res.statusText || "Request failed";
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { access_token: string };
  tokenStore.setAccess(data.access_token);
  return true;
}

async function send<T>(
  path: string,
  options: RequestOptions,
  allowRetry: boolean,
): Promise<T> {
  const { method = "GET", body, auth = true, signal } = options;
  const headers: Record<string, string> = {};

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.getAccess();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // Access token expired — refresh once and replay the original request.
  if (res.status === 401 && auth && allowRetry) {
    const refreshed = await tryRefresh();
    if (refreshed) return send<T>(path, options, false);
    onSessionExpired?.();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    send<T>(path, { ...opts, method: "GET" }, true),
  post: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    send<T>(path, { ...opts, method: "POST", body }, true),
  put: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    send<T>(path, { ...opts, method: "PUT", body }, true),
  del: <T>(path: string, opts: RequestOptions = {}) =>
    send<T>(path, { ...opts, method: "DELETE" }, true),
};
