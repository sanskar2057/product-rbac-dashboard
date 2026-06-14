import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

export type StatTone = "indigo" | "green" | "gray" | "amber" | "blue";

const TONES: Record<StatTone, string> = {
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  gray: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: StatTone;
}

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold text-zinc-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            TONES[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3.5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-7 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
