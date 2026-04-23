import React from "react";
import { useFormEngine } from "../hooks/useFormEngine";
import {invoiceRules } from "../validators/invoiceRules";
import { NumericInput } from "./NumericInput";

const Field = ({ label, children }) => (
  <div className="form-group">
    <label>
      {label}
    </label>
    {children}
  </div>
);

const ErrorText = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="form-error"
    >
      {error}
    </div>
  );
};

const InvoiceForm = ({
  initialData,
  voyages = [],
  customers = [],
  suppliers = [],
  onSubmit,
  onClose, // ✅ IMPORTANT
}) => {
  const { formData, handleChange, handleSubmit, isEdit, errors, } = useFormEngine({
    initialState: {
      invoiceNumber: "",
      type: "AR",
      voyage: "",
      customer: "",
      supplier: "",
      invoiceDate:"",
      dueDate:"",
      amount: "",
      amountPaid: "",
      paymentStatus: "Unpaid",
      notes: "",
    },

    initialData,

    rules: invoiceRules,

    onSubmit: onSubmit, // ✅ PASSING ON SUBMIT FROM PARENT

    mapToForm: (data) => ({
      ...data,
      invoiceDate: data.invoiceDate ? data.invoiceDate.split("T")[0] : "",
      dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
    }),

    mapToPayload: (data) => ({
      ...data,
      amount: data.amount ?? null,
      amountPaid: data.amountPaid ?? null,
      voyage: data.voyage ? String(data.voyage) : null,
      customer: data.type === "AR" ? String(data.customer || "") : null,
      supplier: data.type === "AP" ? String(data.supplier || "") : null,
      invoiceDate: data.invoiceDate || null,
      dueDate: data.dueDate || null,
    }),
  });

  return (
    <form onSubmit={handleSubmit} className="form-container">

      <Field label="Invoice Number">
        <input
          name="invoiceNumber"
          value={formData.invoiceNumber || ""}
          onChange={handleChange}
        />
        <ErrorText error={errors.invoiceNumber} />
      </Field>

      <Field label="Type">
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="AR">AR</option>
          <option value="AP">AP</option>
        </select>
      </Field>

      <Field label="Voyage">
        <select name="voyage" value={formData.voyage || ""} onChange={handleChange}>
          <option value="">Select Voyage</option>
          {voyages.map((v) => (
            <option key={v._id} value={v._id}>
              {v.vesselName} - {v.voyageNumber}
            </option>
          ))}
        </select>
        <ErrorText error={errors.voyage} />
      </Field>

      {formData.type === "AR" && (
        <Field label="Customer">
          <select
            name="customer"
            value={formData.customer || ""}
            onChange={handleChange}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
            
          </select>
          <ErrorText error={errors.customer} />
        </Field>
      )}

      {formData.type === "AP" && (
        <Field label="Supplier">
          <select
            name="supplier"
            value={formData.supplier || ""}
            onChange={handleChange}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.companyName}
              </option>
            ))}
          </select>
          <ErrorText error={errors.supplier} />
        </Field>
      )}

      <Field label="Invoice Date">
        <input
          type="date"
          name="invoiceDate"
          value={formData.invoiceDate || ""}
          onChange={handleChange}
        />
        <ErrorText error={errors.invoiceDate} />
      </Field>

      <Field label="Due Date">
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate || ""}
          onChange={handleChange}
        />
        <ErrorText error={errors.dueDate} />
      </Field>

      <Field label="Amount">
        <NumericInput
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          onBlur={() => {}}
          //label="amount"
          decimals={0}
          nullable={false}
        />
        <ErrorText error={errors.amount} />
      </Field>

      <Field label="Amount Paid">
        <NumericInput
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
          onBlur={() => {}}
          //label="Amount Paid"
          decimals={0}
          nullable={false}
        />
      </Field>

      <Field label="Status">
        <select
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
        </select>
      </Field>

      <Field label="Notes">
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
        />
      </Field>

      {/* ✅ ACTION BUTTONS INSIDE FORM */}
      <div
        className="form-actions"
      >
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Invoice" : "Save Invoice"}
        </button>
      </div>

    </form>
  );
};

export default InvoiceForm;