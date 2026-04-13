import { useEffect, useState, useCallback } from "react";

export const useFetch = (fetchFn, options = {}) => {
  const { auto = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (auto) {
      execute();
    }
  }, [auto, execute]); // ✅ CLEAN & VALID

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
  };
};