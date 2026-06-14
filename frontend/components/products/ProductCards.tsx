import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";

/** Read-only gallery used for the viewer role, who has no row actions. */
export function ProductCards({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h3>
            <StatusBadge status={product.status} />
          </div>

          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {product.category}
          </p>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.stock === 0 ? (
              <Badge tone="amber">Out of stock</Badge>
            ) : (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {product.stock} in stock
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
