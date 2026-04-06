import React from "react";

const SupplierTable = ({ suppliers, onEdit, onDelete, onRestore }) => {
  const safeSuppliers = Array.isArray(suppliers)
    ? suppliers
    : suppliers?.suppliers || [];

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Country</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Currency</th>
            <th>Terms</th>
            <th>Credit</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeSuppliers.length === 0 ? (
            <tr>
              <td colSpan="12">No suppliers found</td>
            </tr>
          ) : (
            safeSuppliers.map((s) => (
              <tr key={s._id}>
                <td>{s.companyName}</td>
                <td>{s.country}</td>
                <td>{s.contactPerson || "-"}</td>
                <td>{s.email || "-"}</td>
                <td>{s.phone || "-"}</td>

                <td>{s.currency}</td>
                <td>{s.paymentTerms} days</td>
                <td>{Number(s.creditLimit ?? 0).toFixed(2)}</td>
                <td>{Number(s.openingBalance ?? 0).toFixed(2)}</td>

                <td>
                  {s.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                <td>{s.notes || "-"}</td>

                {/* ACTIONS */}
                <td className="actions">
                  <button 
                    className="btn btn-edit"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>

                  {s.isActive ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(s._id)}
                      
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => onRestore(s._id)}
                      
                    >
                      Restore
                    </button>
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

export default SupplierTable;