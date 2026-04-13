import { useEffect, useState } from "react";
import {
  getCustomers,
  getSuppliers,
  getVoyages,
  getAgents,
} from "../utils/api";

import { useUIState } from "../context/UIStateContext";

export const useReferenceData = () => {
  const { runAsync } = useUIState();

  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [agents, setAgents] = useState([]);

  // optional local error (ONLY if you still want component-level fallback)
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // =========================
        // SINGLE CONTROLLED LOAD
        // =========================
        const [customersRes, suppliersRes, voyagesRes, agentsRes] =
          await runAsync(() =>
            Promise.all([
              getCustomers(),
              getSuppliers(),
              getVoyages({ page: 1, limit: 1000 }),
              getAgents(),
            ])
          );

        setCustomers(customersRes?.data || []);
        setSuppliers(suppliersRes?.data || []);
        setVoyages(voyagesRes?.data || []);
        setAgents(agentsRes?.data || []);

      } catch (err) {
        // fallback error (optional)
        setError(err?.message || "Failed to load reference data");
      }
    };

    loadReferenceData();
  }, [runAsync]);

  return {
    customers,
    suppliers,
    voyages,
    agents,
    error,
  };
};