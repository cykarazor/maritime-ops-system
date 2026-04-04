import React, { useState, useEffect } from "react";
import { getCustomers, getAgents } from "../utils/api";

const VoyageForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
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

  // =========================
  // LOAD DROPDOWNS ONLY ONCE
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
  // LOAD FORM WHEN EDITING
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        vesselName: initialData.vesselName || "",
        voyageNumber: initialData.voyageNumber || "",
        loadPort: initialData.loadPort || "",
        dischargePort: initialData.dischargePort || "",
        status: initialData.status || "Scheduled",
        assignedCustomer: initialData.assignedCustomer?._id || "",
        assignedAgent: initialData.assignedAgent?._id || "",
      });
    } else {
      setForm({
        vesselName: "",
        voyageNumber: "",
        loadPort: "",
        dischargePort: "",
        status: "Scheduled",
        assignedCustomer: "",
        assignedAgent: "",
      });
    }
  }, [initialData]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);

    if (!initialData) {
      setForm({
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
    <form
      onSubmit={handleSubmit}    
      className="form-container"
    >
      {/* ✅ NEW: FORM TITLE (UI CONSISTENCY) */}
      <h3>{initialData ? "Edit Voyage" : "Create Voyage"}</h3>

      {isInactive && (
        <p style={{ color: "red" }}>
          This voyage is inactive. Restore it before editing.
        </p>
      )}

      {/* ========================= */}
      {/* INPUT FIELDS */}
      {/* ========================= */}

      
      {/* ✅ NEW: WRAPPED WITH form-group */}
      <div className="form-group">
        <label>Vessel Name</label>
        <input
          type="text"
          name="vesselName"
          value={form.vesselName}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      <div className="form-group">
        <label>Voyage Number</label>
        <input
          type="text"
          name="voyageNumber"
          value={form.voyageNumber}
          onChange={handleChange}
          required
          disabled={isInactive}
        />
      </div>

      <div className="form-group">
        <label>Load Port</label>
        <input
          type="text"
          name="loadPort"
          value={form.loadPort}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      <div className="form-group">
        <label>Discharge Port</label>
        <input
          type="text"
          name="dischargePort"
          value={form.dischargePort}
          onChange={handleChange}
          disabled={isInactive}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={form.status}
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

      <div className="form-group">
        <label>Customer</label>
        <select
          name="assignedCustomer"
          value={form.assignedCustomer}
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

      <div className="form-group">
        <label>Agent</label>
        <select
          name="assignedAgent"
          value={form.assignedAgent}
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

      
      {/* ✅ NEW: STANDARD BUTTON SYSTEM */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isInactive}
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default VoyageForm;