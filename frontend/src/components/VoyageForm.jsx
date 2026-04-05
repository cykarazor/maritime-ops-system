import React, { useState, useEffect } from "react";
import { getCustomers, getAgents } from "../utils/api";

const VoyageForm = ({ onSubmit, initialData, onCancel }) => {

  const [formData, setFormData] = useState({
    vesselName: "",
    voyageNumber: "",
    loadPort: "",
    dischargePort: "",
    status: "Scheduled",
    assignedCustomer: "",
    assignedAgent: "",
  });

  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);

  // Detect Edit Mode
  const isEdit = !!initialData;

  // =========================
  // LOAD DROPDOWNS
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await getCustomers();
        const agentRes = await getAgents();

        setCustomers(custRes.customers || []);
        setAgents(agentRes.agents || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, []);

  // =========================
  // LOAD EDIT DATA
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        vesselName: initialData.vesselName || "",
        voyageNumber: initialData.voyageNumber || "",
        loadPort: initialData.loadPort || "",
        dischargePort: initialData.dischargePort || "",
        status: initialData.status || "Scheduled",
        assignedCustomer: initialData.assignedCustomer?._id || "",
        assignedAgent: initialData.assignedAgent?._id || "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // reset ONLY on create mode (Agent-style simplicity)
    if (!isEdit) {
      setFormData({
        vesselName: "",
        voyageNumber: "",
        loadPort: "",
        dischargePort: "",
        status: "Scheduled",
        assignedCustomer: "",
        assignedAgent: "",
      });
    }
  };

  const isInactive = initialData?.isDeleted;

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* TITLE */}
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
          value={formData.assignedCustomer}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Agent */}
      <div className="form-group">
        <label>Agent</label>
        <select
          name="assignedAgent"
          value={formData.assignedAgent}
          onChange={handleChange}
          required
          disabled={isInactive}
        >
          <option value="">Select Agent</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTONS (AGENT STYLE STANDARD) */}
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