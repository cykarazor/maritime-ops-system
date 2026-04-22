// src/components/VoyageForm.jsx

import React, { useMemo } from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";
import { voyageRules } from "../validators/voyageRules";

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

const VoyageForm = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const {
    customers,
    agents,
    loading,
  } = useReferenceData();

  // =========================
  // SAFE LIST NORMALIZATION
  // =========================
  const customerList = useMemo(() => {
    return Array.isArray(customers)
      ? customers
      : customers?.active || [];
  }, [customers]);

  const agentList = useMemo(() => {
    return Array.isArray(agents)
      ? agents
      : agents?.active || [];
  }, [agents]);

  // =========================
  // FORM ENGINE
  // =========================
  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isEdit,
  } = useFormEngine({
    initialState: {
      vesselName: "",
      voyageNumber: "",
      loadPort: "",
      dischargePort: "",
      status: "Scheduled",
      assignedCustomer: "",
      assignedAgent: "",
    },

    initialData,

    rules: voyageRules,

    mapToForm: (data) => ({
      vesselName:
        data.vesselName || "",

      voyageNumber:
        data.voyageNumber || "",

      loadPort:
        data.loadPort || "",

      dischargePort:
        data.dischargePort || "",

      status:
        data.status || "Scheduled",

      assignedCustomer:
        data.assignedCustomer
          ? String(
              data.assignedCustomer._id ||
              data.assignedCustomer
            )
          : "",

      assignedAgent:
        data.assignedAgent
          ? String(
              data.assignedAgent._id ||
              data.assignedAgent
            )
          : "",
    }),

    mapToPayload: (data) => ({
      ...data,
      assignedCustomer:
        data.assignedCustomer || null,

      assignedAgent:
        data.assignedAgent || null,
    }),

    onSubmit,
  });

  const isInactive =
    initialData?.isDeleted;

  if (loading) {
    return (
      <p>
        Loading reference data...
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container"
    >
      <h3>
        {isEdit
          ? "Edit Voyage"
          : "Create Voyage"}
      </h3>

      {/* INACTIVE WARNING */}
      {isInactive && (
        <p className="inactive-warning">
          This voyage is inactive.
          Restore it before editing.
        </p>
      )}

      {/* Vessel Name */}
      <Field label="Vessel Name">
        <input
          name="vesselName"
          value={
            formData.vesselName || ""
          }
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText
          error={errors.vesselName}
        />
      </Field>

      {/* Voyage Number */}
      <Field label="Voyage Number">
        <input
          name="voyageNumber"
          value={
            formData.voyageNumber || ""
          }
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText
          error={errors.voyageNumber}
        />
      </Field>

      {/* Load Port */}
      <Field label="Load Port">
        <input
          name="loadPort"
          value={
            formData.loadPort || ""
          }
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText
          error={errors.loadPort}
        />
      </Field>

      {/* Discharge Port */}
      <Field label="Discharge Port">
        <input
          name="dischargePort"
          value={
            formData.dischargePort || ""
          }
          onChange={handleChange}
          disabled={isInactive}
        />
        <ErrorText
          error={
            errors.dischargePort
          }
        />
      </Field>

      {/* Status */}
      <Field label="Status">
        <select
          name="status"
          value={
            formData.status ||
            "Scheduled"
          }
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="Scheduled">
            Scheduled
          </option>
          <option value="Loading">
            Loading
          </option>
          <option value="In Transit">
            In Transit
          </option>
          <option value="Discharged">
            Discharged
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>
        <ErrorText
          error={errors.status}
        />
      </Field>

      {/* Customer */}
      <Field label="Customer">
        <select
          name="assignedCustomer"
          value={String(
            formData.assignedCustomer ||
              ""
          )}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="">
            Select Customer
          </option>

          {customerList.map((c) => (
            <option
              key={c._id}
              value={String(c._id)}
            >
              {c.companyName ||
                c.name}
            </option>
          ))}
        </select>

        <ErrorText
          error={
            errors.assignedCustomer
          }
        />
      </Field>

      {/* Agent */}
      <Field label="Agent">
        <select
          name="assignedAgent"
          value={String(
            formData.assignedAgent ||
              ""
          )}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="">
            Select Agent
          </option>

          {agentList.map((a) => (
            <option
              key={a._id}
              value={String(a._id)}
            >
              {a.companyName}
            </option>
          ))}
        </select>

        <ErrorText
          error={
            errors.assignedAgent
          }
        />
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
            ? "Update Voyage"
            : "Save Voyage"}
        </button>
      </div>
    </form>
  );
};

export default VoyageForm;