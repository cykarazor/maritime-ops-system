import React from "react";
import Table from "./Table";

const AgentTable = ({ agents, onEdit, onDelete, onRestore }) => {
  const columns = [
    { header: "Company Name", accessor: "companyName" },
    { header: "Assigned Island", accessor: "assignedIsland" },
    { header: "Contact Person", accessor: "contactPerson" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Status",
      render: (row) =>
        row.isActive ? (
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
      data={agents}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // 🔥 BUSINESS RULES (IMPORTANT PART)
        showEdit: (row) => row.isActive === true,
        showDelete: (row) => row.isActive === true,
        showRestore: (row) => row.isActive === false,
      }}
    />
  );
};

export default AgentTable;