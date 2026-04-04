import React, { useState, useEffect } from "react";
import { getVoyages, getCustomers } from "../utils/api";

const CargoForm = ({ initialData = {}, onSubmit, onCancel }) => {
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

  useEffect(() => {
    fetchVoyages();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        voyage: initialData.voyage?._id || "",
        customer: initialData.customer?._id || "",
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

    let updatedData = { ...formData, [name]: value };

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
    
  };

  const safeVoyages = Array.isArray(voyages) ? voyages : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    /* =========================================================
       🟢 FORM CONTAINER (ADDED - MATCHES AGENT FORM STYLE)
       ========================================================= */
    <form
      onSubmit={handleSubmit}
      className="form-container"   // ✅ ADDED: standard system class
    >
      {/* 🟢 TITLE ADDED FOR CONSISTENCY WITH AGENT FORM */}
      <h3>{initialData ? "Edit Cargo" : "Create Cargo"}</h3>

      {/* =========================================================
         🟢 VOYAGE SELECT
         ========================================================= */}
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

      {/* =========================================================
         🟢 CUSTOMER SELECT
         ========================================================= */}
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

      {/* =========================================================
         🟢 CARGO TYPE
         ========================================================= */}
      <div className="form-group">
        <label>Cargo Type</label>
        <input
          name="cargoType"
          value={formData.cargoType}
          onChange={handleChange}
          required
        />
      </div>

      {/* =========================================================
         🟢 QUANTITY
         ========================================================= */}
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

      {/* =========================================================
         🟢 UNIT
         ========================================================= */}
      <div className="form-group">
        <label>Unit</label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        >
          <option value="MT">MT</option>
          <option value="KG">KG</option>
        </select>
      </div>

      {/* =========================================================
         🟢 RATE
         ========================================================= */}
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

      {/* =========================================================
         🟢 TOTAL (READ ONLY)
         ========================================================= */}
      <div className="form-group">
        <label>Total Revenue</label>
        <input
          type="number"
          name="totalRevenue"
          value={formData.totalRevenue}
          readOnly
        />
      </div>

      {/* =========================================================
         🟢 NOTES
         ========================================================= */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* =========================================================
         🟢 ACTION BUTTONS (STANDARDIZED)
         ========================================================= */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Cargo" : "Create Cargo"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

      </div>
    </form>
  );
};

export default CargoForm;