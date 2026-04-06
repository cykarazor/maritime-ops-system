import React from "react";
import Table from "./Table";

const CargoTable = ({ cargo, onEdit, onDelete, onRestore }) => {
  const columns = [
  {
    header: "Voyage",
    render: (c) =>
      c.voyage
        ? `${c.voyage.vesselName || c.voyage.vessel?.name || "Unknown"} - ${
            c.voyage.voyageNumber || ""
          }`
        : "-",
  },
  {
    header: "Customer",
    render: (c) => c.customer?.companyName || c.customer?.name || "-",
  },
  { header: "Type", accessor: "cargoType" },
  { header: "Qty", accessor: "quantity" },
  { header: "Unit", accessor: "unit" },
  {
    header: "Rate",
    render: (c) => `$${Number(c.rate ?? 0).toFixed(2)}`,
  },
  {
    header: "Total Revenue",
    render: (c) => `$${Number(c.totalRevenue ?? 0).toFixed(2)}`,
  },
  {
    header: "Notes",
    accessor: "notes",
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
];

  return (
    <Table
      columns={columns}
      data={cargo}
      actions={{
        onEdit,
        onDelete,
        onRestore,

        // 🔥 RULE SYSTEM (SESSION 36 STANDARD)
        showEdit: (c) => c.isActive === true,
        showDelete: (c) => c.isActive === true,
        showRestore: (c) => c.isActive === false,
      }}
      emptyMessage="No cargo found"
    />
  );
};

export default CargoTable;