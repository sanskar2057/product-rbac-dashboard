import type { ProductStatus, Role } from "@/types";

export const PRODUCT_STATUSES: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home & Kitchen",
  "Outdoors",
  "Furniture",
  "Grocery",
  "Stationery",
  "Other",
];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const PAGE_SIZE = 8;

// Shown on the login screen so reviewers can try each role quickly.
export const DEMO_ACCOUNTS: { email: string; role: Role }[] = [
  { email: "admin@example.com", role: "admin" },
  { email: "editor@example.com", role: "editor" },
  { email: "viewer@example.com", role: "viewer" },
];

export const DEMO_PASSWORD = "password123";
