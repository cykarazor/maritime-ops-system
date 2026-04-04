import React, { useEffect, useState } from "react";
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

const VoyagesPage = () => {
  const [voyages, setVoyages] = useState([]);
  const [editingVoyage, setEditingVoyage] = useState(null);

  // =========================
  // PAGINATION STATE (STANDARDIZED)
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER (STANDARD)
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH VOYAGES (SESSION 27 STANDARD)
  // =========================
  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const response = await getVoyages({ page, limit });

        setVoyages(response.voyages || []);
        setPages(response.pages || 1);
      } catch (error) {
        console.error(
          "FETCH VOYAGES ERROR:",
          error.response?.data || error.message
        );
      }
    };

    fetchVoyages();
  }, [page, limit, refreshTrigger]);

  // =========================
  // REFRESH TRIGGER FUNCTION
  // =========================
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createVoyage(data);
      triggerRefresh();
    } catch (error) {
      console.error("CREATE ERROR:", error.response?.data || error.message);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, data) => {
    try {
      if (!id) return;

      await updateVoyage(id, data);

      setEditingVoyage(null);
      triggerRefresh();
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Deactivate this voyage?")) return;

      await deleteVoyage(id);
      triggerRefresh();
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreVoyage(id);
      triggerRefresh();
    } catch (error) {
      console.error("RESTORE ERROR:", error.response?.data || error.message);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <Layout>
      <h1>Voyages</h1>

      <VoyageForm
        onSubmit={
          editingVoyage
            ? (data) => handleUpdate(editingVoyage?._id, data)
            : handleCreate
        }
        initialData={editingVoyage}
      />

      <VoyageTable
        voyages={voyages}
        onEdit={(v) => setEditingVoyage(v)}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {/* ========================= */}
      {/* PAGINATION (STANDARDIZED - SAME AS INVOICE) */}
      {/* ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default VoyagesPage;