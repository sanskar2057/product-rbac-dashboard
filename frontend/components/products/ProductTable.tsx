"use client";

import { Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";
import { formatDate, formatPrice } from "@/utils/format";

/** Status reflects the merchant's choice; "out of stock" is derived from quantity. */
function StatusCell({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusBadge status={product.status} />
      {product.stock === 0 && <Badge tone="amber">Out of stock</Badge>}
    </div>
  );
}

interface ProductTableProps {
  products: Product[];
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const showActions = canUpdate || canDelete;

  const RowActions = ({ product }: { product: Product }) => (
    <div className="flex items-center justify-end gap-2">
      {canUpdate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.name}`}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden lg:inline">Edit</span>
        </Button>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          aria-label={`Delete ${product.name}`}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden lg:inline">Delete</span>
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              {showActions && (
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </p>
                  {product.description && (
                    <p className="mt-0.5 max-w-xs truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {product.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock === 0
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-zinc-600 dark:text-zinc-300"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusCell product={product} />
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {formatDate(product.updated_at)}
                </td>
                {showActions && (
                  <td className="px-4 py-3">
                    <RowActions product={product} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-zinc-100 md:hidden dark:divide-zinc-800">
        {products.map((product) => (
          <li key={product.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {product.name}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {product.category}
                </p>
              </div>
              <div className="shrink-0">
                <StatusCell product={product} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(product.price)}
                </span>
                <span
                  className={
                    product.stock === 0
                      ? "text-xs font-medium text-red-600 dark:text-red-400"
                      : "text-xs text-zinc-500 dark:text-zinc-400"
                  }
                >
                  {product.stock} in stock
                </span>
              </div>
              {showActions && <RowActions product={product} />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
