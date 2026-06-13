import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/services/apiClient";
import { productService } from "@/services/productService";
import type { ProductPage, ProductQuery } from "@/types";

interface UseProductsResult {
  data: ProductPage | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProducts(query: ProductQuery): UseProductsResult {
  const [data, setData] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { search, category, status, page, pageSize } = query;

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    productService
      .list({ search, category, status, page, pageSize }, controller.signal)
      .then(setData)
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to load products. Check your connection and try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [search, category, status, page, pageSize, reloadKey]);

  return { data, loading, error, refresh };
}
