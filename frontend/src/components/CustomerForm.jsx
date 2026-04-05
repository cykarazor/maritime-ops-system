import React, { useState, useEffect } from "react";

const CustomerForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
    notes: ""
  });

  // STANDARD: detect edit mode
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        companyName: initialData.companyName || "",
        country: initialData.country || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    // STANDARD FIX: only reset in CREATE mode
    if (!isEdit) {
      setFormData({
        name: "",
        companyName: "",
        country: "",
        contactPerson: "",
        email: "",
        phone: "",
        notes: ""
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* STANDARD TITLE */}
      <h3>{isEdit ? "Edit Customer" : "Create Customer"}</h3>

      {/* Company Name */}
      <div className="form-group">
        <label>Company Name</label>
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
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
        />
      </div>

      {/* Contact Person */}
      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
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

      {/* STANDARD BUTTON BLOCK */}
      <div className="form-actions">

        {/* Cancel FIRST */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        {/* Submit SECOND */}
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Customer" : "Save Customer"}
        </button>

      </div>
    </form>
  );
};

export default CustomerForm;