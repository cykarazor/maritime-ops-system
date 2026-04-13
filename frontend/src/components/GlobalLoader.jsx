import React from "react";
import { useUIState } from "../context/UIStateContext";

const GlobalLoader = () => {
  const { globalLoading } = useUIState();

  if (!globalLoading) return null;

  return (
    <div className="global-loader">
      <div className="spinner">Loading...</div>
    </div>
  );
};

export default GlobalLoader;