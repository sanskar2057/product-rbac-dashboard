"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/services/authService";
import { setSessionExpiredHandler } from "@/services/apiClient";
import { tokenStore } from "@/services/tokenStore";
import { can } from "@/lib/permissions";
import type { Permission, User } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Restore a session from localStorage, then confirm it's still valid.
  useEffect(() => {
    const stored = tokenStore.getUser();
    const token = tokenStore.getAccess();

    if (!stored || !token) {
      setStatus("unauthenticated");
      return;
    }

    setUser(stored);
    setStatus("authenticated");

    authService
      .me()
      .then((fresh) => setUser(fresh))
      .catch(() => {
        // The api client already attempted a refresh; if we're here it failed.
        clearSession();
      });
  }, [clearSession]);

  // Let the api client tear down the session when a refresh ultimately fails.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession();
      router.replace("/login");
    });
    return () => setSessionExpiredHandler(() => {});
  }, [clearSession, router]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    tokenStore.setSession(result.access_token, result.refresh_token, result.user);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [clearSession, router]);

  const hasPermission = useCallback(
    (permission: Permission) => can(user?.permissions, permission),
    [user],
  );

  const value = useMemo(
    () => ({ user, status, login, logout, hasPermission }),
    [user, status, login, logout, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
