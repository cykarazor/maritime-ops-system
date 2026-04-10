import React, { useState, useEffect } from "react";

const CustomerForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
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
        name: initialData.name || "",
        companyName: initialData.companyName || "",
        country: initialData.country || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    // reset ONLY on create mode
    if (!isEdit) {
      setFormData({
        name: "",
        companyName: "",
        country: "",
        contactPerson: "",
        email: "",
        phone: "",
        notes: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* TITLE */}
      <h3>{isEdit ? "Edit Customer" : "Create Customer"}</h3>

      {/* Inactive warning (STANDARD) */}
      {isInactive && (
        <p style={{ color: "red" }}>
          This customer is inactive. Restore it before editing.
        </p>
      )}

      {/* Company Name */}
      <div className="form-group">
        <label>Company Name</label>
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Customer Name */}
      <div className="form-group">
        <label>Customer Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      {/* Country */}
      <div className="form-group">
        <label>Country</label>
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      {/* Contact Person */}
      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isInactive}
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
          {isEdit ? "Update Customer" : "Save Customer"}
        </button>

      </div>

    </form>
  );
};

export default CustomerForm;