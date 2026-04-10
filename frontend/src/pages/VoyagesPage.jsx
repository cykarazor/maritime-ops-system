// src/pages/VoyagesPage.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import VoyageTable from "../components/VoyageTable";
import VoyageForm from "../components/VoyageForm";
import Pagination from "../components/Pagination";

import {
  getVoyages,
  createVoyage,
  updateVoyage,
  deleteVoyage,
  restoreVoyage,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { useReferenceData } from "../hooks/useReferenceData";

const VoyagesPage = () => {
  const [editingVoyage, setEditingVoyage] = useState(null);
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
  // FETCH VOYAGES (TABLE DATA)
  // =========================
  const {
    data: voyages,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getVoyages, {
    page,
    limit,
    refreshTrigger,
  });

  // =========================
  // FETCH REFERENCE DATA (FORMS)
  // =========================
  const {
    customers,
    suppliers,
    voyages: voyageOptions,
    loading: refLoading,
    error: refError,
  } = useReferenceData();

  // =========================
  // HANDLERS
  // =========================
  const handleCreateClick = () => {
    setEditingVoyage(null);
    setShowForm(true);
  };

  const handleEditClick = (voyage) => {
    setEditingVoyage(voyage);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingVoyage(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createVoyage(data);
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
      await updateVoyage(id, data);
      setEditingVoyage(null);
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
      if (!window.confirm("Deactivate this voyage?")) return;
      await deleteVoyage(id);
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
      await restoreVoyage(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE ERROR:", error);
    }
  };

  return (
    <Layout>
      <h1>Voyages</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Voyage
      </button>

      {/* =========================
          LOADING / ERROR (TABLE)
      ========================= */}
      {loading && <p>Loading voyages...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* =========================
          LOADING / ERROR (FORM DATA)
      ========================= */}
      {refLoading && <p>Loading form data...</p>}
      {refError && <p style={{ color: "red" }}>{refError}</p>}

      {/* =========================
          FORM
      ========================= */}
      {showForm && (
        <VoyageForm
          customers={customers}
          suppliers={suppliers}
          voyages={voyageOptions}
          onSubmit={
            editingVoyage
              ? (data) => handleUpdate(editingVoyage._id, data)
              : handleCreate
          }
          initialData={editingVoyage}
          onCancel={handleCancel}
        />
      )}

      {/* =========================
          TABLE
      ========================= */}
      <VoyageTable
        voyages={voyages}
        onEdit={handleEditClick}
        onDelete={handleDeactivate}
        onRestore={handleRestore}
      />

      {/* =========================
          PAGINATION
      ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default VoyagesPage;