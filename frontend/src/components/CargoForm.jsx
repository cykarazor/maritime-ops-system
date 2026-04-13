import React, { useMemo } from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";

const CargoForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {

  const {
    voyages: refVoyages,
    customers: refCustomers,
    loading,
  } = useReferenceData();

  const {
    formData,
    handleChange,
    handleSubmit,
    isEdit,
  } = useFormEngine({
    initialState: {
      voyage: "",
      customer: "",
      cargoType: "Cement",
      quantity: 0,
      unit: "MT",
      rate: 0,
      totalRevenue: 0,
      notes: "",
    },
    initialData,
    onSubmit,
    transformSubmit: (data) => ({
      ...data,
      quantity: Number(data.quantity || 0),
      rate: Number(data.rate || 0),
      totalRevenue:
        Number(data.quantity || 0) *
        Number(data.rate || 0),
    }),
  });

  // =========================
  // SAFE COMPUTED VALUE
  // =========================
  const computedTotal = useMemo(() => {
    return Number(formData.quantity || 0) *
           Number(formData.rate || 0);
  }, [formData.quantity, formData.rate]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return <p>Loading reference data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">

      <h3>{isEdit ? "Edit Cargo" : "Create Cargo"}</h3>

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage</label>
        <select
          name="voyage"
          value={String(formData.voyage || "")}
          onChange={handleChange}
          required
        >
          <option value="">Select Voyage</option>
          {refVoyages.active.map((v) => (
            <option
              key={v._id}
              value={String(v._id)}
            >
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
          value={String(formData.customer || "")}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>
          {refCustomers.active.map((c) => (
            <option
              key={c._id}
              value={String(c._id)}
            >
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
          value={formData.cargoType || ""}
          onChange={handleChange}
        />
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity || 0}
          onChange={handleChange}
        />
      </div>

      {/* Unit */}
      <div className="form-group">
        <label>Unit</label>
        <select
          name="unit"
          value={formData.unit || "MT"}
          onChange={handleChange}
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
          value={formData.rate || 0}
          onChange={handleChange}
        />
      </div>

      {/* Total */}
      <div className="form-group">
        <label>Total Revenue</label>
        <input
          type="number"
          value={computedTotal}
          readOnly
        />
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

      {/* ACTIONS */}
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
          >
            {isEdit ? "Update Cargo" : "Save Cargo"}
          </button>
        </div>
    </form>
  );
};

export default CargoForm;