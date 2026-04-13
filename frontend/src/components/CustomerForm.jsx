import React from "react";
import { useFormEngine } from "../hooks/useFormEngine";

const CustomerForm = ({ onSubmit, initialData, onCancel }) => {

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
      notes: "",
    },

    initialData,

    onSubmit,
  });

  const isInactive = initialData?.isDeleted;

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* TITLE */}
      <h3>{isEdit ? "Edit Customer" : "Create Customer"}</h3>

      {/* INACTIVE WARNING */}
      {isInactive && (
        <p style={{ color: "red" }}>
          This customer is inactive. Restore it before editing.
        </p>
      )}

      {/* COMPANY NAME (PRIMARY IDENTITY) */}
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

      {/* COUNTRY */}
      <div className="form-group">
        <label>Country</label>
        <input
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      {/* CONTACT PERSON */}
      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* EMAIL */}
      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* PHONE */}
      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* NOTES */}
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          disabled={isInactive}
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
          disabled={isInactive}
        >
          {isEdit ? "Update Customer" : "Save Customer"}
        </button>

      </div>

    </form>
  );
};

export default CustomerForm;