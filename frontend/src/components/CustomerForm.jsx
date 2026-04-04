import React, { useState, useEffect } from "react";

const CustomerForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
    notes: ""
  });

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

    setFormData({
      name: "",
      companyName: "",
      country: "",
      contactPerson: "",
      email: "",
      phone: "",
      notes: ""
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      // ✅ NEW: standardized form container
      className="form-container"
    >
      {/* ✅ NEW: FORM TITLE */}
      <h3>{initialData ? "Edit Customer" : "Create Customer"}</h3>

      {/* ✅ NEW: FORM GROUP STRUCTURE */}
      <div className="form-group">
        <label>Company Name</label>
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Customer Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* ✅ NEW: STANDARD BUTTON SYSTEM */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Customer" : "Create Customer"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;