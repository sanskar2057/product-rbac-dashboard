"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Can } from "@/components/Can";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Pagination } from "@/components/products/Pagination";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { PAGE_SIZE } from "@/lib/constants";
import { ApiError } from "@/services/apiClient";
import { productService } from "@/services/productService";
import type { Product, ProductInput, ProductStatus } from "@/types";

export default function ProductsPage() {
  const { hasPermission } = useAuth();
  const { notify } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refresh } = useProducts({
    search,
    category,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  // Any change to the filters should send us back to the first page.
  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  const canUpdate = hasPermission("product:update");
  const canDelete = hasPermission("product:delete");
  const hasFilters = Boolean(search || category || status);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function handleSubmit(values: ProductInput) {
    setSubmitting(true);
    try {
      if (editing) {
        await productService.update(editing.id, values);
        notify("Product updated", "success");
      } else {
        await productService.create(values);
        notify("Product created", "success");
      }
      setFormOpen(false);
      setEditing(null);
      refresh();
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Could not save the product.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.remove(deleteTarget.id);
      notify("Product deleted", "success");

      // If we just removed the only row on a later page, step back one.
      if (data && data.items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        refresh();
      }
      setDeleteTarget(null);
    } catch (err) {
      notify(
        err instanceof ApiError ? err.message : "Could not delete the product.",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  }

  const products = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your product catalogue and inventory.
          </p>
        </div>
        <Can permission="product:create">
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Can>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <ProductFilters
            search={searchInput}
            category={category}
            status={status}
            onSearchChange={setSearchInput}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-7 w-7 text-indigo-500" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : products.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No matching products" : "No products yet"}
            message={
              hasFilters
                ? "Try adjusting your search or filters."
                : "Get started by adding your first product."
            }
            action={
              !hasFilters && (
                <Can permission="product:create">
                  <Button onClick={openCreate} size="sm">
                    <Plus className="h-4 w-4" />
                    Add product
                  </Button>
                </Can>
              )
            }
          />
        ) : (
          <>
            <ProductTable
              products={products}
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
            {data && (
              <Pagination
                page={data.page}
                pageSize={data.page_size}
                total={data.total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        product={editing}
        submitting={submitting}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Are you sure you want to delete “${deleteTarget?.name}”? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
