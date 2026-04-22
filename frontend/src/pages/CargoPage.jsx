import { useState } from "react";
import Layout from "../components/Layout";
import CargoTable from "../components/CargoTable";
import CargoForm from "../components/CargoForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getCargo,
  createCargo,
  updateCargo,
  deleteCargo,
  restoreCargo,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const CargoPage = () => {
  const [editing, setEditing] = useState(null);
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
  // FETCH CARGO
  // =========================
  const {
    data: cargo,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getCargo, {
    page,
    limit,
    refreshTrigger,
  });

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const handleCreateClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEditClick = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCargo(data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error(
        "CREATE CARGO FAILED:",
        error
      );
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data) => {
    try {
      await updateCargo(editing._id, data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error(
        "UPDATE CARGO FAILED:",
        error
      );
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteRecord = async (id) => {
    try {
      if (!window.confirm("Deactivate this cargo?")) return;

      await deleteCargo(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(
        "DELETE CARGO FAILED:",
        error
      );
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestoreRecord = async (id) => {
    try {
      await restoreCargo(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(
        "RESTORE CARGO FAILED:",
        error
      );
    }
  };

  return (
    <Layout>
      <h1>Cargo (Revenue)</h1>

      {/* CREATE BUTTON */}
      <button
        className="btn btn-primary"
        onClick={handleCreateClick}
      >
        + Add Cargo
      </button>

      {/* LOADING / ERROR */}
      {loading && <p>Loading cargo...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* TABLE */}
      <CargoTable
        cargo={cargo}
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
          editing
            ? "Edit Cargo"
            : "Create Cargo"
        }
        onSubmit={() => {}}
        size="lg"
      >
        <CargoForm
          initialData={editing}
          onSubmit={
            editing
              ? handleUpdate
              : handleCreate
          }
          onCancel={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default CargoPage;