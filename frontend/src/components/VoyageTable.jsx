import React from "react";
import Table from "./Table";

const VoyageTable = ({ voyages, onEdit, onDelete, onRestore }) => {
  const safeVoyages = Array.isArray(voyages)
    ? voyages
    : voyages?.voyages || [];

  const columns = [
    { header: "Vessel Name", accessor: "vesselName" },
    { header: "Voyage Number", accessor: "voyageNumber" },
    { header: "Load Port", accessor: "loadPort" },
    { header: "Discharge Port", accessor: "dischargePort" },

    { header: "Voyage Status", accessor: "status" },

    {
      header: "Record Status",
      render: (v) =>
        v.isActive ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },

    {
      header: "Customer",
      render: (v) => v.assignedCustomer?.name || "-",
    },

    {
      header: "Agent",
      render: (v) => v.assignedAgent?.companyName || "-",
    },
  ];

  return (
    <Table
      columns={columns}
      data={safeVoyages}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // SESSION 36 RULE SET
        showEdit: (v) => v.isActive === true,
        showDelete: (v) => v.isActive === true,
        showRestore: (v) => v.isActive === false,
      }}
      emptyMessage="No voyages found"
    />
  );
};

export default VoyageTable;