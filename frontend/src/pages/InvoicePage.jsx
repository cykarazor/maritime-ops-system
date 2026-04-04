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

  const [formKey, setFormKey] = useState(0);

  // =========================
  // ✅ PAGINATION STATE
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // ✅ ADDED: refresh trigger (for CRUD re-fetch)
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // ✅ FIXED: fetch INSIDE useEffect (NO ESLINT ISSUE)
  // =========================
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices({ page, limit });

        console.log("Invoices response:", response);

        setInvoices(response.invoices || []);
        setPages(response.pages || 1);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    };

    fetchInvoices();
  }, [page, limit, refreshTrigger]); // ✅ SAFE dependencies

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = (invoice) => {
    if (editing) {
      updateInvoice(editing._id, invoice).then(() => {
        setEditing(null);
        setFormKey((prev) => prev + 1);

        // ✅ trigger refresh instead of calling fetch directly
        setRefreshTrigger((prev) => prev + 1);
      });
    } else {
      createInvoice(invoice).then(() => {
        setFormKey((prev) => prev + 1);

        // ✅ trigger refresh
        setRefreshTrigger((prev) => prev + 1);
      });
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (invoice) => {
    setEditing({
      ...invoice,
      voyage: invoice.voyage?._id || "",
      customer: invoice.customer?._id || "",
      supplier: invoice.supplier?._id || "",
    });

    setFormKey((prev) => prev + 1);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);

      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id ? { ...inv, isActive: false } : inv
        )
      );

      // ✅ trigger refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to deactivate invoice");
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreInvoice(id);

      // ✅ trigger refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {
    setEditing(null);
    setFormKey((prev) => prev + 1);
  };

  return (
    <Layout>
      <h1>Invoices</h1>

      <InvoiceForm
        key={formKey}
        initialData={editing}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <InvoiceTable
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {/* ========================= */}
      {/* ✅ PAGINATION */}
      {/* ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default InvoicePage;