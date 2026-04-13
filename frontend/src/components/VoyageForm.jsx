import React from "react";
import { useReferenceData } from "../context/ReferenceDataContext";
import { useFormEngine } from "../hooks/useFormEngine";

const VoyageForm = ({ onSubmit, initialData, onCancel }) => {

  // =========================
  // GLOBAL REFERENCE DATA
  // =========================
  const {
    customers,
    agents,
    loading,
  } = useReferenceData();

  // =========================
  // FORM ENGINE
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
    transformSubmit: (data) => ({
      ...data,
      assignedCustomer: String(data.assignedCustomer || ""),
      assignedAgent: String(data.assignedAgent || ""),
    }),
  });

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return <p>Loading reference data...</p>;
  }

  const isInactive = initialData?.isDeleted;

  // =========================
  // RENDER
  // =========================
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
          value={formData.vesselName || ""}
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
          value={formData.voyageNumber || ""}
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
          value={formData.loadPort || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Discharge Port */}
      <div className="form-group">
        <label>Discharge Port</label>
        <input
          name="dischargePort"
          value={formData.dischargePort || ""}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      {/* Status */}
      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status || "Scheduled"}
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
          {customers?.active?.map((c) => (
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
          {agents?.active?.map((a) => (
            <option key={a._id} value={String(a._id)}>
              {a.companyName}
            </option>
          ))}
        </select>
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
          {isEdit ? "Update Voyage" : "Save Voyage"}
        </button>

      </div>

    </form>
  );
};

export default VoyageForm;