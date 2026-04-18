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

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const {
    customers,
    suppliers,
    voyages: voyageOptions,
    loading: refLoading,
    error: refError,
  } = useReferenceData();

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

  const handleCreate = async (data) => {
    try {
      await createVoyage(data);
      setRefreshTrigger((p) => p + 1);
      setShowForm(false);
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateVoyage(id, data);
      setEditingVoyage(null);
      setShowForm(false);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Deactivate this voyage?")) return;
      await deleteVoyage(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreVoyage(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("RESTORE ERROR:", err);
    }
  };

  return (
    <Layout>
      <h1>Voyages</h1>

      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Voyage
      </button>

      {loading && <p>Loading voyages...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {refLoading && <p>Loading form data...</p>}
      {refError && <p style={{ color: "red" }}>{refError}</p>}

      {showForm && (
        <VoyageForm
          customers={customers}
          suppliers={suppliers}
          voyages={voyageOptions}
          initialData={editingVoyage}
          onSubmit={(data) => {
            if (editingVoyage && editingVoyage._id) {
              return handleUpdate(editingVoyage._id, data);
            }
            return handleCreate(data);
          }}
          onCancel={handleCancel}
        />
      )}

      <VoyageTable
        voyages={voyages}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default VoyagesPage;