import React, { useMemo } from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";
import { cargoRules } from "../validators/cargoRules";
import { NumericInput } from "./NumericInput";

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

const CargoForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    voyages,
    customers,
    loading,
  } = useReferenceData();

  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isEdit,
  } = useFormEngine({
    initialState: {
      voyage: "",
      customer: "",
      cargoType: "Cement",
      quantity: 0,
      unit: "MT",
      rate: 0,
      totalRevenue: 0,
      notes: "",
    },

    initialData,

    rules: cargoRules,

    // EDIT MODE SAFE MAPPING
    mapToForm: (data) => ({
      voyage: data?.voyage?._id || data?.voyage || "",
      customer: data?.customer?._id || data?.customer || "",
      cargoType: data?.cargoType || "Cement",
      quantity: data.quantity ?? null,
      unit: data?.unit || "MT",
      rate: data.rate ?? null,
      totalRevenue:
        Number(data.quantity ?? null) *
        Number(data.rate ?? null),
      notes: data?.notes || "",
    }),

    // SUBMIT SAFE PAYLOAD
    mapToPayload: (data) => ({
      ...data,
      quantity: Number(data.quantity || 0),
      rate: Number(data.rate || 0),
      totalRevenue:
        Number(data.quantity || 0) *
        Number(data.rate || 0),
    }),

    onSubmit,
  });

  const isInactive = initialData?.isDeleted;

  const computedTotal = useMemo(() => {
    return (
      Number(formData.quantity || 0) *
      Number(formData.rate || 0)
    );
  }, [
    formData.quantity,
    formData.rate,
  ]);

  if (loading) {
    return <p>Loading reference data...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container"
    >
      <h3>
        {isEdit
          ? "Edit Cargo"
          : "Create Cargo"}
      </h3>

      {/* INACTIVE WARNING */}
      {isInactive && (
        <p className="inactive-warning">
          This cargo record is inactive.
          Restore it before editing.
        </p>
      )}

      {/* VOYAGE */}
      <Field label="Voyage">
        <select
          name="voyage"
          value={formData.voyage || ""}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="">
            Select Voyage
          </option>

          {(voyages?.active || []).map((v) => (
            <option
              key={v._id}
              value={v._id}
            >
              {v.vesselName} - {v.voyageNumber}
            </option>
          ))}
        </select>

        <ErrorText error={errors.voyage} />
      </Field>

      {/* CUSTOMER */}
      <Field label="Customer">
        <select
          name="customer"
          value={formData.customer || ""}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="">
            Select Customer
          </option>

          {(customers?.active || []).map((c) => (
            <option
              key={c._id}
              value={c._id}
            >
              {c.companyName || c.name}
            </option>
          ))}
        </select>

        <ErrorText error={errors.customer} />
      </Field>

      {/* CARGO TYPE */}
      <Field label="Cargo Type">
        <input
          name="cargoType"
          value={formData.cargoType || ""}
          onChange={handleChange}
          disabled={isInactive}
        />

        <ErrorText error={errors.cargoType} />
      </Field>

      {/* QUANTITY */}
      <Field label="Quantity">
        <NumericInput
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          onBlur={() => {}}
          //label="Quantity"
          decimals={0}
          nullable={false}
        />
        <ErrorText error={errors.quantity} />
      </Field>

      {/* UNIT */}
      <Field label="Unit">
        <select
          name="unit"
          value={formData.unit || "MT"}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="MT">MT</option>
          <option value="KG">KG</option>
        </select>

        <ErrorText error={errors.unit} />
      </Field>

      {/* RATE */}
      <Field label="Rate">
        <NumericInput
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          onBlur={() => {}}
          //label="Rate"
          decimals={0}
          nullable={false}
        />
        <ErrorText error={errors.rate} />
      </Field>

      {/* TOTAL REVENUE */}
      <Field label="Total Revenue">
        <input
          value={computedTotal}
          readOnly
          disabled
        />
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
            ? "Update Cargo"
            : "Save Cargo"}
        </button>
      </div>
    </form>
  );
};

export default CargoForm;