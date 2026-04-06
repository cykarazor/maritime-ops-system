import React from "react";
import Table from "./Table";

const CustomerTable = ({ customers, onEdit, onDelete, onRestore }) => {
  const safeCustomers = Array.isArray(customers)
    ? customers
    : customers?.customers || [];

  const columns = [
    { header: "Company Name", accessor: "companyName" },
    { header: "Name", accessor: "name" },
    { header: "Country", accessor: "country" },
    { header: "Contact Person", accessor: "contactPerson" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },

    {
      header: "AR Balance",
      render: (c) => `$${Number(c.balance ?? 0).toFixed(2)}`,
    },

    {
      header: "Status",
      render: (c) =>
        c.isActive ? (
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
      data={safeCustomers}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // 🔥 SESSION 36 RULE SYSTEM
        showEdit: (c) => c.isActive === true,
        showDelete: (c) => c.isActive === true,
        showRestore: (c) => c.isActive === false,
      }}
      emptyMessage="No customers found"
    />
  );
};

export default CustomerTable;