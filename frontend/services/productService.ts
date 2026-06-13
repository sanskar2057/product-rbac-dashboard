import type { Product, ProductInput, ProductPage, ProductQuery } from "@/types";
import { api } from "./apiClient";

function buildQuery(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);
  params.set("page", String(query.page ?? 1));
  params.set("page_size", String(query.pageSize ?? 10));
  return params.toString();
}

export const productService = {
  list(query: ProductQuery, signal?: AbortSignal): Promise<ProductPage> {
    return api.get<ProductPage>(`/products?${buildQuery(query)}`, { signal });
  },

  create(input: ProductInput): Promise<Product> {
    return api.post<Product>("/products", input);
  },

  update(id: string, input: ProductInput): Promise<Product> {
    return api.put<Product>(`/products/${id}`, input);
  },

  remove(id: string): Promise<void> {
    return api.del<void>(`/products/${id}`);
  },
};
