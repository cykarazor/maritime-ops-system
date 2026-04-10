import React, { useState } from "react";
import Layout from "../components/Layout";
import SupplierTable from "../components/SupplierTable";
import SupplierForm from "../components/SupplierForm";
import Pagination from "../components/Pagination";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const SupplierPage = () => {
  const [editingSupplier, setEditingSupplier] = useState(null);
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
  // FETCH SUPPLIERS (HOOK)
  // =========================
  const {
    data: suppliers,
    pages,
    loading,
    error
  } = usePaginatedFetch(getSuppliers, {
    page,
    limit,
    refreshTrigger
  });

  // =========================
  // HANDLERS
  // =========================
  const handleCreateClick = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createSupplier(data);
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
      await updateSupplier(id, data);
      setEditingSupplier(null);
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
      if (!window.confirm("Deactivate this supplier?")) return;
      await deleteSupplier(id);
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
      await restoreSupplier(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE ERROR:", error);
    }
  };

  return (
    <Layout>
      <h1>Suppliers</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Supplier
      </button>

      {/* LOADING / ERROR */}
      {loading && <p>Loading suppliers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      {showForm && (
        <SupplierForm
          initialData={editingSupplier}
          onSubmit={
            editingSupplier
              ? (data) => handleUpdate(editingSupplier._id, data)
              : handleCreate
          }
          onCancel={handleCancel}
        />
      )}

      {/* TABLE */}
      <SupplierTable
        suppliers={suppliers}
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

export default SupplierPage;