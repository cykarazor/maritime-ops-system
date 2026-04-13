import { createContext, useContext } from "react";

// Create context
const ReferenceDataContext = createContext();

// Custom hook to use the context
export const useReferenceData = () => {
  const context = useContext(ReferenceDataContext);

  if (!context) {
    throw new Error(
      "useReferenceData must be used within a ReferenceDataProvider"
    );
  }

  return context;
};

export default ReferenceDataContext;