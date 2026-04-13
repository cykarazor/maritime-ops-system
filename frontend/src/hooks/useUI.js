import { useUIState } from "../context/UIStateContext";

export const useUI = () => {
  const { isLoading, globalError, runAsync, clearError, setError } =
    useUIState();

  return {
    isLoading,
    globalError,
    runAsync,
    clearError,
    setError,
  };
};