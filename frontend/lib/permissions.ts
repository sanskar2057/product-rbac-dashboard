import type { Permission, Role } from "@/types";

/**
 * Mirrors the backend role map. The server is still the source of truth and
 * re-checks every mutation, but having this on the client lets us hide actions
 * a user can't perform instead of showing buttons that would just 403.
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["product:read", "product:create", "product:update", "product:delete"],
  editor: ["product:read", "product:update"],
  viewer: ["product:read"],
};

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(
  permissions: Permission[] | undefined,
  permission: Permission,
): boolean {
  return !!permissions?.includes(permission);
}
