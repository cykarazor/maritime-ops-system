import React from "react";
import { useFormEngine } from "../hooks/useFormEngine";

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {

  const {
    formData,
    handleChange,
    handleSubmit,
    isEdit,
  } = useFormEngine({
    initialState: {
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
    },
    initialData,
    onSubmit,
    transformSubmit: (data) => ({
      ...data,

      // numeric safety layer
      paymentTerms: Number(data.paymentTerms || 0),
      creditLimit: Number(data.creditLimit || 0),
      openingBalance: Number(data.openingBalance || 0),
    }),
  });

  const isInactive = initialData?.isDeleted;

  return (
    <form className="form-container" onSubmit={handleSubmit}>

      {/* TITLE */}
      <h3>{isEdit ? "Edit Supplier" : "Create Supplier"}</h3>

      {/* INACTIVE STATE */}
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
          value={formData.companyName || ""}
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
          value={formData.country || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Contact Person */}
      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Currency */}
      <div className="form-group">
        <label>Currency</label>
        <select
          name="currency"
          value={formData.currency || "USD"}
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
          type="number"
          name="paymentTerms"
          value={formData.paymentTerms || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Credit Limit */}
      <div className="form-group">
        <label>Credit Limit</label>
        <input
          type="number"
          name="creditLimit"
          value={formData.creditLimit || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Opening Balance */}
      <div className="form-group">
        <label>Opening Balance</label>
        <input
          type="number"
          name="openingBalance"
          value={formData.openingBalance || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
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
          {isEdit ? "Update Supplier" : "Save Supplier"}
        </button>

      </div>

    </form>
  );
};

export default SupplierForm;