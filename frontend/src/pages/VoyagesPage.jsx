import { useState } from "react";
import Layout from "../components/Layout";
import VoyageTable from "../components/VoyageTable";
import VoyageForm from "../components/VoyageForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getVoyages,
  createVoyage,
  updateVoyage,
  deleteVoyage,
  restoreVoyage,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const VoyagesPage = () => {
  const [editingVoyage, setEditingVoyage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
  // FETCH VOYAGES
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
  // OPEN CREATE MODAL
  // =========================
  const handleCreateClick = () => {
    setEditingVoyage(null);
    setModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEditClick = (voyage) => {
    setEditingVoyage(voyage);
    setModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setEditingVoyage(null);
    setModalOpen(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createVoyage(data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error(
        "CREATE VOYAGE FAILED:",
        error
      );
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data) => {
    try {
      await updateVoyage(
        editingVoyage._id,
        data
      );

      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error(
        "UPDATE VOYAGE FAILED:",
        error
      );
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteRecord = async (id) => {
    try {
      if (
        !window.confirm(
          "Deactivate this voyage?"
        )
      ) {
        return;
      }

      await deleteVoyage(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(
        "DELETE VOYAGE FAILED:",
        error
      );
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestoreRecord = async (id) => {
    try {
      await restoreVoyage(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(
        "RESTORE VOYAGE FAILED:",
        error
      );
    }
  };

  return (
    <Layout>
      <h1>Voyages</h1>

      {/* CREATE BUTTON */}
      <button
        className="btn btn-primary"
        onClick={handleCreateClick}
      >
        + Add Voyage
      </button>

      {/* LOADING / ERROR */}
      {loading && (
        <p>Loading voyages...</p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* TABLE */}
      <VoyageTable
        voyages={voyages}
        onEdit={handleEditClick}
        onDelete={handleDeleteRecord}
        onRestore={handleRestoreRecord}
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />

      {/* MODAL FORM */}
      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingVoyage
            ? "Edit Voyage"
            : "Create Voyage"
        }
        onSubmit={() => {}}
        size="lg"
      >
        <VoyageForm
          initialData={editingVoyage}
          onSubmit={
            editingVoyage
              ? handleUpdate
              : handleCreate
          }
          onCancel={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default VoyagesPage;