import { Badge } from "@/components/ui/Badge";
import type { ProductStatus } from "@/types";
import { statusLabel } from "@/utils/format";

const TONE: Record<ProductStatus, "green" | "gray" | "amber"> = {
  active: "green",
  inactive: "gray",
  out_of_stock: "amber",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return <Badge tone={TONE[status]}>{statusLabel(status)}</Badge>;
}
