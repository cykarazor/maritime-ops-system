import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import Pagination from "../components/Pagination";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer
} from "../utils/api";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // =========================
  // PAGINATION STATE
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER (STANDARDIZED)
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH CUSTOMERS (SERVER PAGINATION)
  // =========================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers({ page, limit });

        setCustomers(response.customers || []);
        setPages(response.pages || 1);

      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [page, limit, refreshTrigger]);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCustomer(data);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("CREATE ERROR:", error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, data) => {
    try {
      await updateCustomer(id, data);
      setEditingCustomer(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("UPDATE ERROR:", error);
    }
  };

  // =========================
  // DELETE (DEACTIVATE)
  // =========================
  const handleDeactivate = async (id) => {
    try {
      if (!window.confirm("Deactivate this customer?")) return;

      await deleteCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE ERROR:", error);
    }
  };

  return (
    <Layout>
      <h1>Customers</h1>

      <CustomerForm
        onSubmit={
          editingCustomer
            ? (data) => handleUpdate(editingCustomer._id, data)
            : handleCreate
        }
        initialData={editingCustomer}
      />

      <CustomerTable
        customers={customers}
        onEdit={setEditingCustomer}
        onDelete={handleDeactivate}
        onRestore={handleRestore}
      />

      {/* ========================= */}
      {/* PAGINATION (STANDARDIZED) */}
      {/* ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default CustomerPage;