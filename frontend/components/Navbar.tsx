"use client";

import { LogOut, Package } from "lucide-react";

import { RoleBadge } from "@/components/RoleBadge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold text-zinc-900 dark:text-white">
            Product Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </p>
                <p className="text-xs leading-tight text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>
              <RoleBadge role={user.role} />
            </div>
          )}
          <ThemeToggle />
          <Button variant="secondary" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
