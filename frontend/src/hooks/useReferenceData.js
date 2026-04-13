import { useEffect, useState } from "react";

import {
  getCustomers,
  getSuppliers,
  getVoyages,
  getAgents,
} from "../utils/api";

export const useReferenceData = () => {
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadReferenceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [customersRes, suppliersRes, voyagesRes, agentsRes] =
          await Promise.all([
            getCustomers(),
            getSuppliers(),
            getVoyages({ page: 1, limit: 1000 }),
            getAgents(),
          ]);

        if (!isMounted) return;

        setCustomers(customersRes?.data || []);
        setSuppliers(suppliersRes?.data || []);
        setVoyages(voyagesRes?.data || []);
        setAgents(agentsRes?.data || []);

      } catch (err) {
        if (!isMounted) return;

        console.error("Reference data load failed:", err);
        setError(err?.message || "Failed to load reference data");

      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadReferenceData();

    return () => {
      isMounted = false;
    };
  }, []); // 🔥 IMPORTANT: EMPTY DEP ARRAY ONLY

  return {
    customers,
    suppliers,
    voyages,
    agents,
    loading,
    error,
  };
};