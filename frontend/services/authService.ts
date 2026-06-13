import type { AuthResult, User } from "@/types";
import { api } from "./apiClient";

export const authService = {
  login(email: string, password: string): Promise<AuthResult> {
    return api.post<AuthResult>("/auth/login", { email, password }, { auth: false });
  },

  me(): Promise<User> {
    return api.get<User>("/auth/me");
  },
};
