export type Role = "admin" | "editor" | "viewer";

export type Permission =
  | "product:read"
  | "product:create"
  | "product:update"
  | "product:delete";

export type ProductStatus = "active" | "inactive";

export interface User {
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  status?: ProductStatus | "";
  page?: number;
  pageSize?: number;
}

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}
