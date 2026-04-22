import { useState } from "react";
import Layout from "../components/Layout";
import SupplierTable from "../components/SupplierTable";
import SupplierForm from "../components/SupplierForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const SupplierPage = () => {
  const [editingSupplier, setEditingSupplier] = useState(null);
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
  // FETCH SUPPLIERS
  // =========================
  const {
    data: suppliers,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getSuppliers, {
    page,
    limit,
    refreshTrigger,
  });

  // =========================
  // OPEN CREATE
  // =========================
  const handleCreateClick = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  // =========================
  // OPEN EDIT
  // =========================
  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setEditingSupplier(null);
    setModalOpen(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createSupplier(data);
      setRefreshTrigger((p) => p + 1);
      closeModal();
    } catch (err) {
      console.error("CREATE SUPPLIER FAILED:", err);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data) => {
    try {
      await updateSupplier(editingSupplier._id, data);
      setRefreshTrigger((p) => p + 1);
      closeModal();
    } catch (err) {
      console.error("UPDATE SUPPLIER FAILED:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteRecord = async (id) => {
    try {
      if (!window.confirm("Deactivate this supplier?")) return;

      await deleteSupplier(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("DELETE SUPPLIER FAILED:", err);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestoreRecord = async (id) => {
    try {
      await restoreSupplier(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("RESTORE SUPPLIER FAILED:", err);
    }
  };

  return (
    <Layout>
      <h1>Suppliers</h1>

      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Supplier
      </button>

      {loading && <p>Loading suppliers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEditClick}
        onDelete={handleDeleteRecord}
        onRestore={handleRestoreRecord}
      />

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingSupplier ? "Edit Supplier" : "Create Supplier"}
        onSubmit={() => {}}
        size="lg"
      >
        <SupplierForm
          initialData={editingSupplier}
          onSubmit={editingSupplier ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default SupplierPage;