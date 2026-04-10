import React, { useState, useEffect } from "react";

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",

    currency: "USD",
    paymentTerms: 30,
    creditLimit: 0,
    openingBalance: 0,

    notes: "",
  });

  // =========================
  // STANDARD EDIT MODE FLAG
  // =========================
  const isEdit = !!initialData;

  // same pattern as VoyageForm
  const isInactive = initialData?.isDeleted;

  // =========================
  // HYDRATE FORM (EDIT MODE)
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        country: initialData.country || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",

        currency: initialData.currency || "USD",
        paymentTerms: initialData.paymentTerms || 30,
        creditLimit: initialData.creditLimit || 0,
        openingBalance: initialData.openingBalance || 0,

        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT (STANDARD RULE)
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      paymentTerms: Number(formData.paymentTerms),
      creditLimit: Number(formData.creditLimit),
      openingBalance: Number(formData.openingBalance),
    });

    // reset ONLY in create mode (standard rule)
    if (!isEdit) {
      setFormData({
        companyName: "",
        country: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        currency: "USD",
        paymentTerms: 30,
        creditLimit: 0,
        openingBalance: 0,
        notes: "",
      });
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>

      {/* STANDARD TITLE */}
      <h3>{isEdit ? "Edit Supplier" : "Create Supplier"}</h3>

      {isInactive && (
        <p style={{ color: "red" }}>
          This supplier is inactive. Restore it before editing.
        </p>
      )}

      {/* Company Name */}
      <div className="form-group">
        <label>Company Name</label>
        <input
          name="companyName"
          value={formData.companyName}
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

      {/* Address */}
      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Currency */}
      <div className="form-group">
        <label>Currency</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="USD">USD</option>
          <option value="TTD">TTD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Payment Terms */}
      <div className="form-group">
        <label>Payment Terms (days)</label>
        <input
          name="paymentTerms"
          type="number"
          value={formData.paymentTerms}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Credit Limit */}
      <div className="form-group">
        <label>Credit Limit</label>
        <input
          name="creditLimit"
          type="number"
          value={formData.creditLimit}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Opening Balance */}
      <div className="form-group">
        <label>Opening Balance</label>
        <input
          name="openingBalance"
          type="number"
          value={formData.openingBalance}
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

      {/* STANDARD BUTTON BLOCK */}
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
          {isEdit ? "Update Supplier" : "Save Supplier"}
        </button>

      </div>
    </form>
  );
};

export default SupplierForm;