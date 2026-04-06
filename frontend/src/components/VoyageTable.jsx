import React from "react";

const VoyageTable = ({ voyages, onEdit, onDelete, onRestore }) => {
  const safeVoyages = Array.isArray(voyages)
    ? voyages
    : voyages?.voyages || [];

  return (
    <div
        className="table-container"
    >
      <table
        className="data-table"
      >
        <thead>
          <tr>
            <th>Vessel</th>
            <th>Voyage Number</th>
            <th>Load Port</th>
            <th>Discharge Port</th>
            <th>Voyage Status</th>
            <th>Record Status</th>
            <th>Customer</th>
            <th>Agent</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeVoyages.length === 0 ? (
            <tr>
              <td colSpan="9">No voyages found</td>
            </tr>
          ) : (
            safeVoyages.map((v) => (
              <tr key={v._id}>
                <td>{v.vesselName || "-"}</td>
                <td>{v.voyageNumber || "-"}</td>
                <td>{v.loadPort || "-"}</td>
                <td>{v.dischargePort || "-"}</td>

                {/* BUSINESS STATUS */}
                <td>{v.status || "-"}</td>

                {/* RECORD STATUS */}
                <td>
                  {v.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                {/* RELATIONS */}
                <td>{v.assignedCustomer?.name || "-"}</td>
                <td>{v.assignedAgent?.companyName || "-"}</td>

                {/* ACTIONS */}
                <td
                  className="actions"
                >
                  {/* ✅ NEW STANDARD BUTTON */}
                  <button
                    className="btn btn-edit"
                    onClick={() => onEdit(v)}
                  >
                    Edit
                  </button>

                  {v.isActive ? (
                    <>
                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(v._id)}
                      >
                        Deactivate
                      </button>
                    </>
                  ) : (
                    <>
                      
                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-success"
                        onClick={() => onRestore(v._id)}
                      >
                        Restore
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoyageTable;