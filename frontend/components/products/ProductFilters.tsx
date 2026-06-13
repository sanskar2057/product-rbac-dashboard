"use client";

import { Search } from "lucide-react";

import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "@/lib/constants";
import type { ProductStatus } from "@/types";

interface ProductFiltersProps {
  search: string;
  category: string;
  status: ProductStatus | "";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ProductStatus | "") => void;
}

const selectClasses =
  "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200";

export function ProductFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or description…"
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClasses}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {PRODUCT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ProductStatus | "")}
        className={selectClasses}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {PRODUCT_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
