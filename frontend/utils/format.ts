import type { ProductStatus } from "@/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  out_of_stock: "Out of stock",
};

export function statusLabel(status: ProductStatus): string {
  return STATUS_LABELS[status] ?? status;
}
