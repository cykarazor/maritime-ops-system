import React from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";

const InvoiceForm = ({ initialData, onSubmit, onCancel }) => {

  // =========================
  // GLOBAL REFERENCE DATA
  // =========================
  const {
    voyages,
    customers,
    suppliers,
    loading,
  } = useReferenceData();

  // =========================
  // FORM ENGINE
  // =========================
  const {
    formData,
    handleChange,
    handleSubmit,
    isEdit,
  } = useFormEngine({
    initialState: {
      invoiceNumber: "",
      type: "AR",
      voyage: "",
      customer: "",
      supplier: "",
      invoiceDate: "",
      dueDate: "",
      amount: 0,
      amountPaid: 0,
      paymentStatus: "Unpaid",
      notes: "",
    },
    initialData,
    onSubmit,
    transformSubmit: (data) => ({
      ...data,

      // numeric safety
      amount: Number(data.amount || 0),
      amountPaid: Number(data.amountPaid || 0),

      // conditional ownership logic
      customer:
        data.type === "AR"
          ? String(data.customer || "")
          : null,

      supplier:
        data.type === "AP"
          ? String(data.supplier || "")
          : null,
    }),
  });

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return <p>Loading reference data...</p>;
  }

  // =========================
  // RENDER
  // =========================
  return (
    <form onSubmit={handleSubmit} className="form-container">

      <h3>{isEdit ? "Edit Invoice" : "Create Invoice"}</h3>

      {/* Invoice Number */}
      <div className="form-group">
        <label>Invoice Number</label>
        <input
          name="invoiceNumber"
          value={formData.invoiceNumber || ""}
          onChange={handleChange}
          required
        />
      </div>

      {/* Type */}
      <div className="form-group">
        <label>Type</label>
        <select
          name="type"
          value={formData.type || "AR"}
          onChange={handleChange}
        >
          <option value="AR">AR (Customer)</option>
          <option value="AP">AP (Supplier)</option>
        </select>
      </div>

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage</label>
        <select
          name="voyage"
          value={String(formData.voyage || "")}
          onChange={handleChange}
        >
          <option value="">Select Voyage</option>
          {voyages?.active?.map((v) => (
            <option key={v._id} value={String(v._id)}>
              {v.vesselName} - {v.voyageNumber}
            </option>
          ))}
        </select>
      </div>

      {/* CUSTOMER (AR ONLY) */}
      {formData.type === "AR" && (
        <div className="form-group">
          <label>Customer</label>
          <select
            name="customer"
            value={String(formData.customer || "")}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers?.active?.map((c) => (
              <option key={c._id} value={String(c._id)}>
                {c.companyName || c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SUPPLIER (AP ONLY) */}
      {formData.type === "AP" && (
        <div className="form-group">
          <label>Supplier</label>
          <select
            name="supplier"
            value={String(formData.supplier || "")}
            onChange={handleChange}
          >
            <option value="">Select Supplier</option>
            {suppliers?.active?.map((s) => (
              <option key={s._id} value={String(s._id)}>
                {s.companyName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dates */}
      <div className="form-group">
        <label>Invoice Date</label>
        <input
          type="date"
          name="invoiceDate"
          value={formData.invoiceDate?.slice(0, 10) || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate?.slice(0, 10) || ""}
          onChange={handleChange}
        />
      </div>

      {/* Amount */}
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount || 0}
          onChange={handleChange}
        />
      </div>

      {/* Paid */}
      <div className="form-group">
        <label>Amount Paid</label>
        <input
          type="number"
          name="amountPaid"
          value={formData.amountPaid || 0}
          onChange={handleChange}
        />
      </div>

      {/* Status */}
      <div className="form-group">
        <label>Payment Status</label>
        <select
          name="paymentStatus"
          value={formData.paymentStatus || "Unpaid"}
          onChange={handleChange}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
        />
      </div>

      {/* BUTTONS */}
      <div className="form-actions">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Invoice" : "Save Invoice"}
        </button>

      </div>

    </form>
  );
};

export default InvoiceForm;