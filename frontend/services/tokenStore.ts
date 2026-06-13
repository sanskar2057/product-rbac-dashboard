import type { User } from "@/types";

const ACCESS_KEY = "pmd.accessToken";
const REFRESH_KEY = "pmd.refreshToken";
const USER_KEY = "pmd.user";

const isBrowser = typeof window !== "undefined";

export const tokenStore = {
  getAccess(): string | null {
    return isBrowser ? localStorage.getItem(ACCESS_KEY) : null;
  },

  getRefresh(): string | null {
    return isBrowser ? localStorage.getItem(REFRESH_KEY) : null;
  },

  getUser(): User | null {
    if (!isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setSession(access: string, refresh: string, user: User): void {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  setAccess(access: string): void {
    if (isBrowser) localStorage.setItem(ACCESS_KEY, access);
  },

  clear(): void {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
