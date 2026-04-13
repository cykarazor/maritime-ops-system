import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const UIStateContext = createContext();

export const UIStateProvider = ({ children }) => {

  // =========================
  // STATE
  // =========================
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // =========================
  // CORE ACTIONS (NO DEPENDENCIES)
  // =========================
  const startLoading = useCallback(() => {
    setGlobalLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

  const setError = useCallback((message) => {
    setGlobalError(message);
  }, []);

  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);

  // =========================
  // SAFE WRAPPER (NO DEP ARRAY CHAINS)
  // =========================
  const runAsync = useCallback(async (asyncFn) => {
    try {
      setGlobalLoading(true);
      setGlobalError(null);

      return await asyncFn();

    } catch (err) {
      console.error("Global Error:", err);
      setGlobalError(err?.message || "Something went wrong");
      throw err;

    } finally {
      setGlobalLoading(false);
    }
  }, []);

  // =========================
  // MEMOIZED CONTEXT VALUE
  // =========================
  const value = useMemo(() => ({
    globalLoading,
    globalError,
    startLoading,
    stopLoading,
    setError,
    clearError,
    runAsync,
  }), [
    globalLoading,
    globalError,
    startLoading,
    stopLoading,
    setError,
    clearError,
    runAsync
  ]);

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useUIState = () => {
  const context = useContext(UIStateContext);

  if (!context) {
    throw new Error("useUIState must be used within UIStateProvider");
  }

  return context;
};