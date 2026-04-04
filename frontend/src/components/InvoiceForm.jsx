import React, { useState, useEffect } from "react";
import { getVoyages, getCustomers, getSuppliers } from "../utils/api";

const InvoiceForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [invoice, setInvoice] = useState({
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
  // LOAD DROPDOWNS (FIXED)
  // =========================
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [voy, cust, sup] = await Promise.all([
        getVoyages(),
        getCustomers(),
        getSuppliers(),
      ]);

      setVoyages(voy.voyages || []);
      setCustomers(cust.customers || []);
      setSuppliers(sup.suppliers || []);

    } catch (err) {
      console.error("Error loading invoice form data:", err);
    }
  };

  fetchData();
}, []);

  // =========================
  // EDIT HYDRATION (FIXED)
  // =========================
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setInvoice({
        invoiceNumber: initialData.invoiceNumber || "",
        type: initialData.type || "AR",

        // FIX: handle object OR id safely
        voyage:
          initialData.voyage?._id ||
          initialData.voyage ||
          "",

        customer:
          initialData.customer?._id ||
          initialData.customer ||
          "",

        supplier:
          initialData.supplier?._id ||
          initialData.supplier ||
          "",

        invoiceDate: initialData.invoiceDate || "",
        dueDate: initialData.dueDate || "",
        amount: initialData.amount || 0,
        amountPaid: initialData.amountPaid || 0,
        paymentStatus: initialData.paymentStatus || "Unpaid",
        notes: initialData.notes || "",
      });
    } else {
      setInvoice({
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
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInvoice((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "type") {
        if (value === "AR") updated.supplier = "";
        if (value === "AP") updated.customer = "";
      }

      return updated;
    });
  };

  // =========================
  // SUBMIT (CLEAN)
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      invoiceNumber: invoice.invoiceNumber,
      type: invoice.type,

      voyage: invoice.voyage || null,

      customer: invoice.type === "AR" ? invoice.customer || null : null,
      supplier: invoice.type === "AP" ? invoice.supplier || null : null,

      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,

      amount: Number(invoice.amount),
      amountPaid: Number(invoice.amountPaid || 0),

      paymentStatus: invoice.paymentStatus,
      notes: invoice.notes,
    };

    onSubmit(payload);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData?._id ? "Edit Invoice" : "Create Invoice"}</h3>

      <div className="form-group">
        <label>Invoice Number:</label>
        <input
          name="invoiceNumber"
          value={invoice.invoiceNumber}
          onChange={handleChange}
          placeholder="Invoice Number"
          required
        />
      </div>

      <div className="form-group">
        <label>Type:</label>
        <select name="type" value={invoice.type} onChange={handleChange}>
          <option value="AR">AR (Customer)</option>
          <option value="AP">AP (Supplier)</option>
        </select>
      </div>

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage:</label>
        <select name="voyage" value={invoice.voyage} onChange={handleChange}>
          <option value="">Select Voyage</option>
          {voyages.map((v) => (
            <option key={v._id} value={v._id}>
              {v.vesselName || v.name} - {v.voyageNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Customer */}
      {invoice.type === "AR" && (
        <div className="form-group">
          <label>Customer:</label>
          <select name="customer" value={invoice.customer} onChange={handleChange}>
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Supplier */}
      {invoice.type === "AP" && (
        <div className="form-group">
          <label>Supplier:</label>
          <select name="supplier" value={invoice.supplier} onChange={handleChange}>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
      </div>
      )}

      <div className="form-group">
        <label>Invoice Date:</label>
        <input
          type="date"
          name="invoiceDate"
          value={invoice.invoiceDate?.slice(0, 10) || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={invoice.dueDate?.slice(0, 10) || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={invoice.amount}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Amount Paid:</label>
        <input
          type="number"
          name="amountPaid"
          value={invoice.amountPaid}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Payment Status:</label>
        <select
          name="paymentStatus"
          value={invoice.paymentStatus}
          onChange={handleChange}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <div className="form-group">
        <label>Notes:</label>
        <textarea
          name="notes"
          value={invoice.notes}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Save
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;