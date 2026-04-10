import React, { useState, useEffect } from "react";
import { getVoyages, getCustomers, getSuppliers } from "../utils/api";

const InvoiceForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
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
  });

  const [voyages, setVoyages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // =========================
  // EDIT MODE
  // =========================
  const isEdit = !!initialData;

  // =========================
  // LOAD DROPDOWNS (STANDARDISED LIKE VOYAGE FORM)
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [voy, cust, sup] = await Promise.all([
          getVoyages({ page: 1, limit: 1000 }),
          getCustomers(),
          getSuppliers(),
        ]);

        setVoyages(voy.data || []);
        setCustomers(cust.data || []);
        setSuppliers(sup.data || []);
      } catch (err) {
        console.error("Invoice dropdown load error:", err);
      }
    };

    fetchData();
  }, []);

  // =========================
  // EDIT HYDRATION (STANDARD STYLE)
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        invoiceNumber: initialData.invoiceNumber || "",
        type: initialData.type || "AR",
        voyage: initialData.voyage?._id || initialData.voyage || "",
        customer: initialData.customer?._id || initialData.customer || "",
        supplier: initialData.supplier?._id || initialData.supplier || "",
        invoiceDate: initialData.invoiceDate || "",
        dueDate: initialData.dueDate || "",
        amount: initialData.amount || 0,
        amountPaid: initialData.amountPaid || 0,
        paymentStatus: initialData.paymentStatus || "Unpaid",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // AR/AP RULE (same logic as before, preserved)
      if (name === "type") {
        if (value === "AR") updated.supplier = "";
        if (value === "AP") updated.customer = "";
      }

      return updated;
    });
  };

  // =========================
  // SUBMIT (STANDARD STYLE)
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      invoiceNumber: formData.invoiceNumber,
      type: formData.type,
      voyage: formData.voyage || null,

      customer: formData.type === "AR" ? formData.customer || null : null,
      supplier: formData.type === "AP" ? formData.supplier || null : null,

      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,

      amount: Number(formData.amount),
      amountPaid: Number(formData.amountPaid || 0),

      paymentStatus: formData.paymentStatus,
      notes: formData.notes,
    };

    onSubmit(payload);

    // RESET ONLY IN CREATE MODE (STANDARD RULE)
    if (!isEdit) {
      setFormData({
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
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* TITLE (STANDARD) */}
      <h3>{isEdit ? "Edit Invoice" : "Create Invoice"}</h3>

      {/* Invoice Number */}
      <div className="form-group">
        <label>Invoice Number</label>
        <input
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          required
        />
      </div>

      {/* Type */}
      <div className="form-group">
        <label>Type</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="AR">AR (Customer)</option>
          <option value="AP">AP (Supplier)</option>
        </select>
      </div>

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage</label>
        <select name="voyage" value={formData.voyage} onChange={handleChange}>
          <option value="">Select Voyage</option>
          {voyages.map((v) => (
            <option key={v._id} value={v._id}>
              {v.vesselName} - {v.voyageNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Customer */}
      {formData.type === "AR" && (
        <div className="form-group">
          <label>Customer</label>
          <select
            name="customer"
            value={formData.customer}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName || c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Supplier */}
      {formData.type === "AP" && (
        <div className="form-group">
          <label>Supplier</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
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
          value={formData.amount}
          onChange={handleChange}
        />
      </div>

      {/* Paid */}
      <div className="form-group">
        <label>Amount Paid</label>
        <input
          type="number"
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
        />
      </div>

      {/* Status */}
      <div className="form-group">
        <label>Payment Status</label>
        <select
          name="paymentStatus"
          value={formData.paymentStatus}
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
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* BUTTONS (STANDARD LIKE VOYAGE) */}
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