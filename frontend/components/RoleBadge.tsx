import { Badge } from "@/components/ui/Badge";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types";

const TONE: Record<Role, "indigo" | "blue" | "gray"> = {
  admin: "indigo",
  editor: "blue",
  viewer: "gray",
};

export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone={TONE[role]}>{ROLE_LABELS[role]}</Badge>;
}
