import React from "react";

const InvoiceTable = ({ invoices = [], onEdit, onDelete, onRestore }) => {
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const getVoyageLabel = (inv) => {
    if (!inv.voyage) return "-";
    return `${inv.voyage.vesselName || ""} ${inv.voyage.voyageNumber || ""}`;
  };

  const getBalance = (inv) => {
    const amount = Number(inv.amount) || 0;
    const paid = Number(inv.amountPaid) || 0;
    return amount - paid;
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Type</th>
            <th>Voyage</th>
            <th>Customer</th>
            <th>Supplier</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Payment Status</th>
            <th>Record Status</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeInvoices.length === 0 ? (
            <tr>
              <td colSpan="14">No invoices found</td>
            </tr>
          ) : (
            safeInvoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.type}</td>
                <td>{getVoyageLabel(inv)}</td>
                <td>{inv.customer?.name || inv.customer?.companyName || "-"}</td>
                <td>{inv.supplier?.name || inv.supplier?.companyName || "-"}</td>
                <td>{inv.amount ?? 0}</td>
                <td>{inv.amountPaid ?? 0}</td>
                <td>{getBalance(inv)}</td>
                <td>{inv.paymentStatus}</td>

                <td>
                  {inv.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                <td>
                  {inv.invoiceDate
                    ? new Date(inv.invoiceDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>{inv.notes || "-"}</td>

                <td className="actions">
                  {inv.isActive ? (
                    <>
                      <button
                        className="btn btn-edit"
                        onClick={() => onEdit(inv)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(inv._id)}
                      >
                        Deactivate
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => onRestore(inv._id)}
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

export default InvoiceTable;