import { useState, useEffect, useCallback } from "react";

export const usePaginatedFetch = (fetchFn, params = {}) => {
  const {
    page,
    limit,
    refreshTrigger,
    paginated = true
  } = params;

  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CORE FIX: clean separation of concerns
      const res = paginated
        ? await fetchFn({ page, limit })
        : await fetchFn();

      setData(res?.data || []);

      // only set pagination if enabled
      if (paginated) {
        setPages(res?.pages || 1);
        setTotal(res?.total || 0);
      } else {
        setPages(1);
        setTotal(res?.data?.length || 0);
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, paginated]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  return {
    data,
    pages,
    total,
    loading,
    error,
    refetch: fetchData
  };
};