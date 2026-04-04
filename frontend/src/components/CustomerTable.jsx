// src/components/CustomerTable.jsx
import React from "react";

const CustomerTable = ({ customers, onEdit, onDelete, onRestore }) => {
  const safeCustomers = Array.isArray(customers)
    ? customers
    : customers?.customers || [];

  return (
    <div
      // ✅ NEW STANDARD CLASS
      className="table-container"
    >
      <table
        
        // ✅ NEW STANDARD CLASS
        className="data-table"
      >
        <thead>
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Country</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>AR Balance</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeCustomers.length === 0 ? (
            <tr>
              <td colSpan="10">No customers found</td>
            </tr>
          ) : (
            safeCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.companyName || "-"}</td>
                <td>{customer.name || "-"}</td>
                <td>{customer.country || "-"}</td>
                <td>{customer.contactPerson || "-"}</td>
                <td>{customer.email || "-"}</td>
                <td>{customer.phone || "-"}</td>
                <td>${Number(customer.balance ?? 0).toFixed(2)}</td>

                <td>
                  {customer.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                <td>{customer.notes || "-"}</td>

                {/* ACTIONS */}
                <td
                  // ✅ NEW: standardized spacing/alignment
                  className="actions"
                >
                  
                  {/* ✅ NEW STANDARD BUTTON */}
                  <button
                    className="btn btn-edit"
                    onClick={() => onEdit(customer)}
                  >
                    Edit
                  </button>

                  {customer.isActive ? (
                    <>
                      
                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(customer._id)}
                      >
                        Deactivate
                      </button>
                    </>
                  ) : (
                    <>
                      

                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-success"
                        onClick={() => onRestore(customer._id)}
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

export default CustomerTable;