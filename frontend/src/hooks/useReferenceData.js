import { useContext } from "react";
import ReferenceDataContext from "../context/ReferenceDataContext";

export const useReferenceData = () => {
  return useContext(ReferenceDataContext);
};