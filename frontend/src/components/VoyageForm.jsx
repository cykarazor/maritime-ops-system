import React, { useMemo } from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";

const VoyageForm = ({ onSubmit, initialData, onCancel }) => {

  const { customers, agents, loading } = useReferenceData();

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
  // FORM ENGINE (FIXED HYDRATION)
  // =========================
  const {
    formData,
    handleChange,
    handleSubmit,
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

    onSubmit,

    // 🔥 CRITICAL FIX: normalize ALL select fields to STRING
    mapToForm: (data) => ({
      vesselName: data.vesselName || "",
      voyageNumber: data.voyageNumber || "",
      loadPort: data.loadPort || "",
      dischargePort: data.dischargePort || "",
      status: data.status || "Scheduled",

      assignedCustomer: data.assignedCustomer
        ? String(data.assignedCustomer._id || data.assignedCustomer)
        : "",

      assignedAgent: data.assignedAgent
        ? String(data.assignedAgent._id || data.assignedAgent)
        : "",
    }),

    mapToPayload: (data) => ({
      ...data,
      assignedCustomer: data.assignedCustomer || null,
      assignedAgent: data.assignedAgent || null,
    }),
  });

  if (loading) {
    return <p>Loading reference data...</p>;
  }

  const isInactive = initialData?.isDeleted;

  return (
    <form onSubmit={handleSubmit} className="form-container">

      <h3>{isEdit ? "Edit Voyage" : "Create Voyage"}</h3>

      {isInactive && (
        <p style={{ color: "red" }}>
          This voyage is inactive. Restore it before editing.
        </p>
      )}

      {/* Vessel Name */}
      <div className="form-group">
        <label>Vessel Name</label>
        <input
          name="vesselName"
          value={formData.vesselName}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      {/* Voyage Number */}
      <div className="form-group">
        <label>Voyage Number</label>
        <input
          name="voyageNumber"
          value={formData.voyageNumber}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      {/* Load Port */}
      <div className="form-group">
        <label>Load Port</label>
        <input
          name="loadPort"
          value={formData.loadPort}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Discharge Port */}
      <div className="form-group">
        <label>Discharge Port</label>
        <input
          name="dischargePort"
          value={formData.dischargePort}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Status */}
      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isInactive}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Loading">Loading</option>
          <option value="In Transit">In Transit</option>
          <option value="Discharged">Discharged</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Customer */}
      <div className="form-group">
        <label>Customer</label>
        <select
          name="assignedCustomer"
          value={String(formData.assignedCustomer || "")}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Customer</option>
          {customerList.map((c) => (
            <option key={c._id} value={String(c._id)}>
              {c.companyName || c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Agent */}
      <div className="form-group">
        <label>Agent</label>
        <select
          name="assignedAgent"
          value={String(formData.assignedAgent || "")}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Agent</option>
          {agentList.map((a) => (
            <option key={a._id} value={String(a._id)}>
              {a.companyName}
            </option>
          ))}
        </select>
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
          {isEdit ? "Update Voyage" : "Save Voyage"}
        </button>
      </div>

    </form>
  );
};

export default VoyageForm;