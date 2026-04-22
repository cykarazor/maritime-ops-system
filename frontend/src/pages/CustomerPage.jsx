import { useState } from "react";
import Layout from "../components/Layout";
import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const CustomerPage = () => {
  const [editingCustomer, setEditingCustomer] = useState(null);
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
  // FETCH CUSTOMERS
  // =========================
  const {
    data: customers,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getCustomers, {
    page,
    limit,
    refreshTrigger,
  });

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const handleCreateClick = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setEditingCustomer(null);
    setModalOpen(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCustomer(data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error("CREATE CUSTOMER FAILED:", error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data) => {
    try {
      await updateCustomer(editingCustomer._id, data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error("UPDATE CUSTOMER FAILED:", error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteRecord = async (id) => {
    try {
      if (!window.confirm("Deactivate this customer?")) return;

      await deleteCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("DELETE CUSTOMER FAILED:", error);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestoreRecord = async (id) => {
    try {
      await restoreCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE CUSTOMER FAILED:", error);
    }
  };

  return (
    <Layout>
      <h1>Customers</h1>

      {/* CREATE BUTTON */}
      <button
        className="btn btn-primary"
        onClick={handleCreateClick}
      >
        + Add Customer
      </button>

      {/* LOADING / ERROR */}
      {loading && <p>Loading customers...</p>}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* TABLE */}
      <CustomerTable
        customers={customers}
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
          editingCustomer
            ? "Edit Customer"
            : "Create Customer"
        }
        onSubmit={() => {}}
        size="lg"
      >
        <CustomerForm
          initialData={editingCustomer}
          onSubmit={
            editingCustomer
              ? handleUpdate
              : handleCreate
          }
          onCancel={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default CustomerPage;