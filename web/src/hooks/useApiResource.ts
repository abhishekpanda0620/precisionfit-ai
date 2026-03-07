"use client";

import { useState, useEffect, useCallback } from "react";

type UseApiResourceOptions<T> = {
  /** API endpoint URL (without query params) */
  endpoint: string;
  /** Query params appended to GET requests */
  queryParams?: Record<string, string>;
  /** Skip auto-fetch on mount */
  skipInitialFetch?: boolean;
};

/**
 * Shared hook for CRUD operations against the API proxy.
 * Eliminates duplicated fetch/submit/delete logic across dashboard pages.
 */
export function useApiResource<T extends { id: string }>({
  endpoint,
  queryParams = {},
  skipInitialFetch = false,
}: UseApiResourceOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams(queryParams);
    const qs = params.toString();
    return qs ? `${endpoint}?${qs}` : endpoint;
  }, [endpoint, queryParams]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl());
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  const create = useCallback(async (body: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchAll();
        return { success: true };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || "Failed to save data" };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    } finally {
      setSubmitting(false);
    }
  }, [endpoint, fetchAll]);

  const remove = useCallback(async (id: string) => {
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    await fetchAll();
  }, [endpoint, fetchAll]);

  useEffect(() => {
    if (!skipInitialFetch && queryParams.userId) {
      fetchAll();
    }
  }, [queryParams.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, submitting, fetchAll, create, remove };
}
