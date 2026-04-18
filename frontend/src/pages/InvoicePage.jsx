import { useState } from "react";
import Layout from "../components/Layout";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceForm from "../components/InvoiceForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { useReferenceData } from "../context/ReferenceDataContext";

const InvoicePage = () => {
  const { voyages, customers, suppliers, loading: refLoading } =
    useReferenceData();

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    data: invoices,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getInvoices, {
    page,
    limit,
    refreshTrigger,
  });

  const handleCreateClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (invoice) => {
    setEditing({
      ...invoice,
      voyage: invoice.voyage?._id || "",
      customer: invoice.customer?._id || "",
      supplier: invoice.supplier?._id || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  const handleCreate = async (data) => {
  try {
    await createInvoice(data);
    setRefreshTrigger((p) => p + 1);
    closeModal();
  } catch (err) {
    console.error("CREATE INVOICE FAILED:", err);
  }
};

  const handleUpdate = async (data) => {
  try {
    await updateInvoice(editing._id, data);
    setRefreshTrigger((p) => p + 1);
    closeModal();
  } catch (err) {
    console.error("UPDATE INVOICE FAILED:", err);
  }
};

const handleDeleteRecord = async (id) => {
    try {
      await deleteInvoice(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("DELETE FAILED:", err);
    }
  };

const handleRestoreRecord = async (id) => {
    try {
      await restoreInvoice(id);
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      console.error("RESTORE FAILED:", err);
    }
  };  

  return (
    <Layout>
      <h1>Invoices</h1>

      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Invoice
      </button>

      {loading && <p>Loading invoices...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {refLoading && <p>Loading reference data...</p>}

      <InvoiceTable
        invoices={invoices}
        onEdit={handleEditClick}
        onDelete={handleDeleteRecord}
        onRestore={handleRestoreRecord}
      />

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Invoice" : "Create Invoice"}
        //onSubmit={() => {}}
        submitText={editing ? "Update Invoice" : "Save Invoice"}
        size="lg"
      >
        <InvoiceForm
          initialData={editing}
          voyages={voyages?.active || []}
          customers={customers?.active || []}
          suppliers={suppliers?.active || []}
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default InvoicePage;