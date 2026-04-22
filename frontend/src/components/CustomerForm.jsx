import React from "react";
import { useFormEngine } from "../hooks/useFormEngine";
import { customerRules } from "../validators/customerRules";

const ErrorText = ({ error }) => {
  if (!error) return null;

  return (
    <div className="form-error">
      {error}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="form-group">
    <label>
      {label}
    </label>
    {children}
  </div>
);

const CustomerForm = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
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
    rules: customerRules,
    onSubmit,
  });

  const isInactive = initialData?.isDeleted;

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container"
    >
      {/* INACTIVE WARNING */}
      {isInactive && (
        <p className="inactive-warning">
          This customer is inactive.
          Restore it before editing.
        </p>
      )}

      {/* COMPANY NAME */}
      <Field label="Company Name">
        <input
          name="companyName"
          value={formData.companyName || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.companyName} />
      </Field>

      {/* COUNTRY */}
      <Field label="Country">
        <input
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.country} />
      </Field>

      {/* CONTACT PERSON */}
      <Field label="Contact Person">
        <input
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.contactPerson} />
      </Field>

      {/* EMAIL */}
      <Field label="Email">
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.email} />
      </Field>

      {/* PHONE */}
      <Field label="Phone">
        <input
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.phone} />
      </Field>

      {/* NOTES */}
      <Field label="Notes">
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.notes} />
      </Field>

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
          {isEdit
            ? "Update Customer"
            : "Save Customer"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;