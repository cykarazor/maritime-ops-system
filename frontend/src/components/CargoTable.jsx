import React from "react";

const CargoTable = ({ cargo, onEdit, onDelete, onRestore }) => {
  const safeCargo = Array.isArray(cargo) ? cargo : [];

  return (
    <div
      style={{
        overflowX: "auto",
        marginTop: "20px",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          minWidth: "1100px",
          borderCollapse: "collapse",
          fontSize: "14px", // ✅ ADDED: better readability
        }}
      >
        {/* ================= HEADER STYLING ADDED ================= */}
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th>Voyage</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Total Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeCargo.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No cargo found
              </td>
            </tr>
          ) : (
            safeCargo.map((c) => (
              <tr key={c._id}>
                
                {/* Voyage */}
                <td>
                  {c.voyage
                    ? `${
                        c.voyage.vesselName ||
                        c.voyage.vessel?.name ||
                        "Unknown Vessel"
                      } - ${c.voyage.voyageNumber || ""}`
                    : "-"}
                </td>

                {/* Customer */}
                <td>
                  {c.customer?.companyName || c.customer?.name || "-"}
                </td>

                <td>{c.cargoType || "-"}</td>
                <td>{c.quantity ?? "-"}</td>
                <td>{c.unit || "-"}</td>

                <td>${Number(c.rate ?? 0).toFixed(2)}</td>
                <td>${Number(c.totalRevenue ?? 0).toFixed(2)}</td>

                {/* Status */}
                <td>
                  {c.isActive ? (
                    <span style={{ color: "green", fontWeight: "500" }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "500" }}>
                      Inactive
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="actions">
                  <> 
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(c)}
                    >
                      Edit
                    </button>
                  </>
                  {c.isActive ? (
                    <>  
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(c._id)}
                      >
                        Deactivate
                      </button>
                    </>
                  ) : (
                    <>  
                      <button
                        className="btn btn-success"
                        onClick={() => onRestore(c._id)}
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

export default CargoTable;