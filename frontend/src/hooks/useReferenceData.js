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
    const loadReferenceData = async () => {
      try {
        setLoading(true);

        const [customersRes, suppliersRes, voyagesRes, agentsRes] =
          await Promise.all([
            getCustomers(),
            getSuppliers(),
            getVoyages({ page: 1, limit: 1000 }),
            getAgents(),
          ]);

        setCustomers(customersRes?.data || []);
        setSuppliers(suppliersRes?.data || []);
        setVoyages(voyagesRes?.data || []);
        setAgents(agentsRes?.data || []);

      } catch (err) {
        console.error("Reference data load failed:", err);
        setError(err.message || "Failed to load reference data");
      } finally {
        setLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  return {
    customers,
    suppliers,
    voyages,
    agents,
    loading,
    error,
  };
};