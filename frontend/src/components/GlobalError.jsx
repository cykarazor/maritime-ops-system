import React, { useEffect } from "react";
import { useUI } from "../hooks/useUI";

const GlobalError = () => {
  const { globalError, clearError } = useUI();

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => {
        clearError();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [globalError, clearError]);

  if (!globalError) return null;

  return (
    <div className="global-error-container">
      <span>{globalError}</span>

      <button
        className="global-error-button"
        onClick={clearError}
      >
        ✕
      </button>
    </div>
  );
};

export default GlobalError;