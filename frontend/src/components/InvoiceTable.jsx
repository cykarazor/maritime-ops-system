import React from "react";
import Table from "./Table";

const InvoiceTable = ({ invoices, onEdit, onDelete, onRestore }) => {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const columns = [
    { header: "Invoice #", accessor: "invoiceNumber" },
    { header: "Type", accessor: "type" },

    {
      header: "Voyage",
      render: (inv) =>
        inv.voyage
          ? `${inv.voyage.vesselName || ""} ${inv.voyage.voyageNumber || ""}`
          : "-",
    },

    {
      header: "Customer",
      render: (inv) =>
        inv.customer?.name || inv.customer?.companyName || "-",
    },

    {
      header: "Supplier",
      render: (inv) =>
        inv.supplier?.name || inv.supplier?.companyName || "-",
    },

    { header: "Amount", accessor: "amount" },
    { header: "Paid", accessor: "amountPaid" },

    {
      header: "Balance",
      render: (inv) => {
        const amount = Number(inv.amount) || 0;
        const paid = Number(inv.amountPaid) || 0;
        return amount - paid;
      },
    },

    { header: "Payment Status", accessor: "paymentStatus" },

    {
      header: "Record Status",
      render: (inv) =>
        inv.isActive ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },

    {
      header: "Invoice Date",
      render: (inv) =>
        inv.invoiceDate
          ? new Date(inv.invoiceDate).toLocaleDateString()
          : "-",
    },

    {
      header: "Due Date",
      render: (inv) =>
        inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-",
    },

    { header: "Notes", accessor: "notes" },
  ];

  return (
    <Table
      columns={columns}
      data={safeInvoices}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // 🔥 SESSION 36 RULE SYSTEM
        showEdit: (inv) => inv.isActive === true,
        showDelete: (inv) => inv.isActive === true,
        showRestore: (inv) => inv.isActive === false,
      }}
      emptyMessage="No invoices found"
    />
  );
};

export default InvoiceTable;