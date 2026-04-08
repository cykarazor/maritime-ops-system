import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceForm from "../components/InvoiceForm";
import Pagination from "../components/Pagination";

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
} from "../utils/api";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [editing, setEditing] = useState(null);

  // ✅ STANDARD UI STATE
  const [showForm, setShowForm] = useState(false);

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH INVOICES
  // =========================
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices({ page, limit });

        setInvoices(response.data || []);
        setPages(response.pages || 1);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    };

    fetchInvoices();
  }, [page, limit, refreshTrigger]);

  // =========================
  // HANDLERS (STANDARDIZED)
  // =========================
  const handleCreateClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEditClick = (invoice) => {
    setEditing({
      ...invoice,
      voyage: invoice.voyage?._id || "",
      customer: invoice.customer?._id || "",
      supplier: invoice.supplier?._id || "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (invoice) => {
    try {
      await createInvoice(invoice);
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, invoice) => {
    try {
      await updateInvoice(id, invoice);
      setEditing(null);
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreInvoice(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  return (
    <Layout>
      <h1>Invoices</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Invoice
      </button>

      {/* FORM */}
      {showForm && (
        <InvoiceForm
          initialData={editing}
          onSubmit={
            editing
              ? (data) => handleUpdate(editing._id, data)
              : handleCreate
          }
          onCancel={handleCancel}
        />
      )}

      {/* TABLE */}
      <InvoiceTable
        invoices={invoices}
        onEdit={handleEditClick}
        onDelete={handleDelete}
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

export default InvoicePage;