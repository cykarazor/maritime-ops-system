import { useEffect, useMemo, useRef } from "react";
import ReferenceDataContext from "./ReferenceDataContext";
import { useFetch } from "../hooks/useFetch";

import {
  getCustomers,
  getSuppliers,
  getVoyages,
  getAgents,
} from "../utils/api";

export const ReferenceDataProvider = ({ children }) => {

  //console.log("REFERENCE PROVIDER MOUNT");

  // =========================
  // STABLE FETCH FUNCTIONS
  // =========================

  const customersFetch = useFetch(getCustomers);
  const suppliersFetch = useFetch(getSuppliers);
  const agentsFetch = useFetch(getAgents);

  // IMPORTANT: stable function (prevents loop)
  const voyagesFetch = useFetch(
    useMemo(
      () => () => getVoyages({ page: 1, limit: 1000 }),
      []
    )
  );

  // =========================
  // INITIAL LOAD LOCK
  // =========================
  const hasLoadedRef = useRef(false);

  const allLoading =
    customersFetch.loading ||
    suppliersFetch.loading ||
    agentsFetch.loading ||
    voyagesFetch.loading;

  useEffect(() => {
    if (!allLoading) {
      hasLoadedRef.current = true;
    }
  }, [allLoading]);

  const loading = !hasLoadedRef.current && allLoading;

  // =========================
  // ERROR HANDLING
  // =========================
  const error =
    customersFetch.error ||
    suppliersFetch.error ||
    agentsFetch.error ||
    voyagesFetch.error;

  // =========================
  // NORMALIZED DATA
  // =========================
  const customers = useMemo(() => {
    const data = customersFetch.data?.data || [];
    return {
      all: data,
      active: data.filter((c) => c.isActive !== false),
    };
  }, [customersFetch.data]);

  const suppliers = useMemo(() => {
    const data = suppliersFetch.data?.data || [];
    return {
      all: data,
      active: data.filter((s) => s.isActive !== false),
    };
  }, [suppliersFetch.data]);

  const agents = useMemo(() => {
    const data = agentsFetch.data?.data || [];
    return {
      all: data,
      active: data.filter((a) => a.isActive !== false),
    };
  }, [agentsFetch.data]);

  const voyages = useMemo(() => {
    const data = voyagesFetch.data?.data || [];
    return {
      all: data,
      active: data,
    };
  }, [voyagesFetch.data]);

  // =========================
  // REFRESH ALL DATA
  // =========================
  const refresh = () => {
    customersFetch.refetch();
    suppliersFetch.refetch();
    agentsFetch.refetch();
    voyagesFetch.refetch();
  };

  // =========================
  // PROVIDER VALUE
  // =========================
  return (
    <ReferenceDataContext.Provider
      value={{
        customers,
        suppliers,
        agents,
        voyages,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </ReferenceDataContext.Provider>
  );
};