import React from "react";
import { useFormEngine } from "../hooks/useFormEngine";
import { supplierRules } from "../validators/supplierRules";

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

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {
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
      address: "",
      currency: "USD",
      paymentTerms: 30,
      creditLimit: 0,
      openingBalance: 0,
      notes: "",
    },

    initialData,
    rules: supplierRules,

    // ✅ FULL BACKEND SAFE PAYLOAD (NO MISSING FIELDS)
    mapToPayload: (data) => ({
      companyName: data.companyName?.trim() || "",
      country: data.country?.trim() || "",
      contactPerson: data.contactPerson?.trim() || "",
      email: data.email?.trim() || "",
      phone: data.phone?.trim() || "",
      address: data.address?.trim() || "",

      currency: data.currency || "USD",

      paymentTerms: Number(data.paymentTerms) || 0,
      creditLimit: Number(data.creditLimit) || 0,
      openingBalance: Number(data.openingBalance) || 0,

      notes: data.notes?.trim() || "",
    }),

    onSubmit,
  });

  const isInactive = initialData?.isDeleted;

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{isEdit ? "Edit Supplier" : "Create Supplier"}</h3>

      {isInactive && (
        <p className="inactive-warning">
          This supplier is inactive. Restore it before editing.
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

      {/* ADDRESS */}
      <Field label="Address">
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.address} />
      </Field>

      {/* CURRENCY */}
      <Field label="Currency">
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
        <ErrorText error={errors.currency} />
      </Field>

      {/* PAYMENT TERMS */}
      <Field label="Payment Terms (days)">
        <input
          type="number"
          name="paymentTerms"
          value={formData.paymentTerms || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.paymentTerms} />
      </Field>

      {/* CREDIT LIMIT */}
      <Field label="Credit Limit">
        <input
          type="number"
          name="creditLimit"
          value={formData.creditLimit || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.creditLimit} />
      </Field>

      {/* OPENING BALANCE */}
      <Field label="Opening Balance">
        <input
          type="number"
          name="openingBalance"
          value={formData.openingBalance || 0}
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText error={errors.openingBalance} />
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
          {isEdit ? "Update Supplier" : "Save Supplier"}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;