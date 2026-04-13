import React from "react";
import { useUIState } from "../context/UIStateContext";
import "../styles/global.css";

const GlobalLoader = () => {
  const { isLoading } = useUIState();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-box">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;