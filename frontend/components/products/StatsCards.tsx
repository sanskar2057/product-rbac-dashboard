"use client";

import {
  CheckCircle2,
  Package,
  PackageX,
  PauseCircle,
  TrendingDown,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { ProductStats, Role } from "@/types";
import { formatPrice } from "@/utils/format";
import { StatCard, StatCardSkeleton, type StatTone } from "./StatCard";

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: StatTone;
}

// Each role sees four cards tuned to what they care about: admins get the
// financial overview, editors focus on status, viewers on availability.
function cardsForRole(role: Role, stats: ProductStats): StatItem[] {
  const total: StatItem = {
    label: "Total products",
    value: stats.total,
    icon: Package,
    tone: "indigo",
  };
  const active: StatItem = {
    label: "Active",
    value: stats.active,
    icon: CheckCircle2,
    tone: "green",
  };
  const inactive: StatItem = {
    label: "Inactive",
    value: stats.inactive,
    icon: PauseCircle,
    tone: "gray",
  };
  const outOfStock: StatItem = {
    label: "Out of stock",
    value: stats.out_of_stock,
    icon: PackageX,
    tone: "amber",
  };
  const lowStock: StatItem = {
    label: "Low stock",
    value: stats.low_stock,
    icon: TrendingDown,
    tone: "amber",
  };
  const inventoryValue: StatItem = {
    label: "Inventory value",
    value: formatPrice(stats.inventory_value),
    icon: Wallet,
    tone: "blue",
  };

  switch (role) {
    case "admin":
      return [total, active, outOfStock, inventoryValue];
    case "editor":
      return [total, active, inactive, outOfStock];
    default:
      return [total, active, outOfStock, lowStock];
  }
}

interface StatsCardsProps {
  role: Role;
  stats: ProductStats | null;
  loading: boolean;
}

export function StatsCards({ role, stats, loading }: StatsCardsProps) {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardsForRole(role, stats).map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
