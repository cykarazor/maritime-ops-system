import React, { createContext, useContext, useState, useCallback } from "react";

const UIStateContext = createContext();

export const UIStateProvider = ({ children }) => {

  // =========================
  // GLOBAL STATES
  // =========================
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // =========================
  // LOADING CONTROL
  // =========================
  const startLoading = useCallback(() => {
    setGlobalLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

  // =========================
  // ERROR CONTROL
  // =========================
  const setError = useCallback((message) => {
    setGlobalError(message);
  }, []);

  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);

  // =========================
  // SAFE WRAPPER FOR API CALLS
  // =========================
  const runAsync = useCallback(async (asyncFn) => {
    try {
      startLoading();
      clearError();

      const result = await asyncFn();

      return result;
    } catch (err) {
      console.error("Global Error:", err);
      setError(err?.message || "Something went wrong");
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setError, clearError]);

  return (
    <UIStateContext.Provider
      value={{
        globalLoading,
        globalError,
        startLoading,
        stopLoading,
        setError,
        clearError,
        runAsync,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};

// =========================
// HOOK
// =========================
export const useUIState = () => {
  return useContext(UIStateContext);
};