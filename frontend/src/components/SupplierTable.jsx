import React from "react";
import Table from "./Table";

const SupplierTable = ({ suppliers, onEdit, onDelete, onRestore }) => {
  const safeSuppliers = Array.isArray(suppliers)
    ? suppliers
    : suppliers?.suppliers || [];

  const columns = [
    { header: "Company", accessor: "companyName" },
    { header: "Country", accessor: "country" },
    { header: "Contact", accessor: "contactPerson" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },

    { header: "Currency", accessor: "currency" },

    {
      header: "Terms",
      render: (s) => `${s.paymentTerms} days`,
    },

    {
      header: "Credit",
      render: (s) => Number(s.creditLimit ?? 0).toFixed(2),
    },

    {
      header: "Balance",
      render: (s) => Number(s.openingBalance ?? 0).toFixed(2),
    },

    {
      header: "Status",
      render: (s) =>
        s.isActive ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },

    { header: "Notes", accessor: "notes" },
  ];

  return (
    <Table
      columns={columns}
      data={safeSuppliers}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // SESSION 36 STANDARD RULE
        showEdit: (s) => s.isActive === true,
        showDelete: (s) => s.isActive === true,
        showRestore: (s) => s.isActive === false,
      }}
      emptyMessage="No suppliers found"
    />
  );
};

export default SupplierTable;