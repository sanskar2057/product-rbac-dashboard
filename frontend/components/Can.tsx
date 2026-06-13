"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import type { Permission } from "@/types";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/** Renders children only when the current user holds the given permission. */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();
  return <>{hasPermission(permission) ? children : fallback}</>;
}
