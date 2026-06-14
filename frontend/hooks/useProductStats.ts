import { useCallback, useEffect, useState } from "react";

import { productService } from "@/services/productService";
import type { ProductStats } from "@/types";

interface UseProductStatsResult {
  stats: ProductStats | null;
  loading: boolean;
  refresh: () => void;
}

export function useProductStats(): UseProductStatsResult {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    productService
      .stats(controller.signal)
      .then(setStats)
      .catch(() => {
        // Stats are non-critical; a failure just hides the cards.
        if (!controller.signal.aborted) setStats(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return { stats, loading, refresh };
}
