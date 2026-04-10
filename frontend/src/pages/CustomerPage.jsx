import React, { useState } from "react";
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

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const CustomerPage = () => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH CUSTOMERS (HOOK)
  // =========================
  const {
    data: customers,
    pages,
    loading,
    error
  } = usePaginatedFetch(getCustomers, {
    page,
    limit,
    refreshTrigger
  });

  // =========================
  // HANDLERS
  // =========================
  const handleCreateClick = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCustomer(data);
      setRefreshTrigger((prev) => prev + 1);
      setShowForm(false);
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
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("UPDATE ERROR:", error);
    }
  };

  // =========================
  // DELETE
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

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Customer
      </button>

      {/* LOADING / ERROR */}
      {loading && <p>Loading customers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      {showForm && (
        <CustomerForm
          onSubmit={
            editingCustomer
              ? (data) => handleUpdate(editingCustomer._id, data)
              : handleCreate
          }
          initialData={editingCustomer}
          onCancel={handleCancel}
        />
      )}

      {/* TABLE */}
      <CustomerTable
        customers={customers}
        onEdit={handleEditClick}
        onDelete={handleDeactivate}
        onRestore={handleRestore}
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default CustomerPage;