import React, { useState, useEffect } from "react";
import { getVoyages, getCustomers } from "../utils/api";

const CargoForm = ({ initialData, onSubmit, onCancel }) => {
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

  const [voyages, setVoyages] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Detect edit mode (STANDARD like AgentForm)
  const isEdit = !!initialData;

  // Load dropdown data
  useEffect(() => {
    fetchVoyages();
    fetchCustomers();
  }, []);

  // Populate form in edit mode (STANDARD pattern)
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

  const fetchVoyages = async () => {
    try {
      const { voyages } = await getVoyages();
      setVoyages(voyages || []);
    } catch (err) {
      console.error("Error fetching voyages:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { customers } = await getCustomers();
      setCustomers(customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "quantity" || name === "rate") {
      const quantity =
        name === "quantity" ? Number(value) : Number(updatedData.quantity);
      const rate =
        name === "rate" ? Number(value) : Number(updatedData.rate);

      updatedData.totalRevenue = quantity * rate;
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
    });

    // ONLY reset in CREATE mode (STANDARD FIX)
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

  const safeVoyages = Array.isArray(voyages) ? voyages : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* STANDARD TITLE (same as AgentForm) */}
      <h3>{isEdit ? "Edit Cargo" : "Create Cargo"}</h3>

      {/* Voyage */}
      <div className="form-group">
        <label>Voyage</label>
        <select
          name="voyage"
          value={formData.voyage}
          onChange={handleChange}
          required
        >
          <option value="">Select Voyage</option>
          {safeVoyages.map((v) => (
            <option key={v._id} value={v._id}>
              {v.vesselName || ""} - {v.voyageNumber}
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
          required
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
          required
        />
      </div>

      {/* Unit */}
      <div className="form-group">
        <label>Unit</label>
        <select name="unit" value={formData.unit} onChange={handleChange}>
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
          required
        />
      </div>

      {/* Total */}
      <div className="form-group">
        <label>Total Revenue</label>
        <input
          type="number"
          name="totalRevenue"
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
        />
      </div>

      {/* STANDARD BUTTON BLOCK (MATCHES AGENT FORM) */}
      <div className="form-actions">

        {/* Cancel FIRST (STANDARD) */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        {/* Submit SECOND */}
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Cargo" : "Save Cargo"}
        </button>

      </div>
    </form>
  );
};

export default CargoForm;