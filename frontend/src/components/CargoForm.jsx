import React, { useState, useEffect } from "react";

const CargoForm = ({
  initialData,
  onSubmit,
  onCancel,
  voyages = [],
  customers = [],
}) => {
  const [formData, setFormData] = useState({
    voyage: "",
    customer: "",
    cargoType: "Cement",
    quantity: 0,
    unit: "MT",
    rate: 0,
    totalRevenue: 0,
    notes: "",
  });

  // Detect edit mode
  const isEdit = !!initialData;
  const isInactive = initialData?.isDeleted;

  // =========================
  // LOAD EDIT DATA
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        voyage: initialData.voyage?._id || "",
        customer: initialData.customer?._id || "",
        cargoType: initialData.cargoType || "Cement",
        quantity: initialData.quantity || 0,
        unit: initialData.unit || "MT",
        rate: initialData.rate || 0,
        totalRevenue: initialData.totalRevenue || 0,
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
      ...formData,
      [name]: value,
    };

    // auto calculate revenue
    if (name === "quantity" || name === "rate") {
      const quantity =
        name === "quantity" ? Number(value) : Number(updated.quantity);
      const rate =
        name === "rate" ? Number(value) : Number(updated.rate);

      updated.totalRevenue = quantity * rate;
    }

    setFormData(updated);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
    });

    // reset only on create
    if (!isEdit) {
      setFormData({
        voyage: "",
        customer: "",
        cargoType: "Cement",
        quantity: 0,
        unit: "MT",
        rate: 0,
        totalRevenue: 0,
        notes: "",
      });
    }
  };

  // safety guards
  const safeVoyages = Array.isArray(voyages) ? voyages : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <form onSubmit={handleSubmit} className="form-container">

      <h3>{isEdit ? "Edit Cargo" : "Create Cargo"}</h3>

      {isInactive && (
        <p style={{ color: "red" }}>
          This cargo is inactive. Restore it before editing.
        </p>
      )}

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage</label>
        <select
          name="voyage"
          value={formData.voyage}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Voyage</option>
          {safeVoyages.map((v) => (
            <option key={v._id} value={v._id}>
              {v.vesselName} - {v.voyageNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Customer */}
      <div className="form-group">
        <label>Customer</label>
        <select
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Customer</option>
          {safeCustomers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cargo Type */}
      <div className="form-group">
        <label>Cargo Type</label>
        <input
          name="cargoType"
          value={formData.cargoType}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Unit */}
      <div className="form-group">
        <label>Unit</label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="MT">MT</option>
          <option value="KG">KG</option>
        </select>
      </div>

      {/* Rate */}
      <div className="form-group">
        <label>Rate</label>
        <input
          type="number"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Total */}
      <div className="form-group">
        <label>Total Revenue</label>
        <input
          type="number"
          value={formData.totalRevenue}
          readOnly
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          disabled={isInactive}
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

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isInactive}
        >
          {isEdit ? "Update Cargo" : "Save Cargo"}
        </button>
      </div>

    </form>
  );
};

export default CargoForm;