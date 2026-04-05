import React, { useState, useEffect } from "react";

const AgentForm = ({ onSubmit, initialData, onCancel }) => {
  
  const [formData, setFormData] = useState({
    companyName: "",
    assignedIsland: "",
    contactPerson: "",
    email: "",
    phone: "",
    notes: ""
  });

  //Detect Edit Mode and Populate Form
  const isEdit = !!initialData;
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        assignedIsland: initialData.assignedIsland || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
   
      setFormData({
        companyName: "",
        assignedIsland: "",
        contactPerson: "",
        email: "",
        phone: "",
        notes: ""
      });
    
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="form-container"
    >
      {/* ✅ NEW: FORM TITLE */}
      <h3>{initialData ? "Edit Agent" : "Create Agent"}</h3>
      {/* ✅ NEW STRUCTURED FORM */}

      <div className="form-group">
        <label>Company Name</label>
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Assigned Island</label>
        <input
          name="assignedIsland"
          value={formData.assignedIsland}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Contact Person</label>
        <input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      {/* ✅ NEW STANDARD BUTTON */}
      <div className="form-actions">

        {/* Cancel Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        {/* Submit Button (Dynamic Save/Update) */}
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update Agent" : "Save Agent"}
        </button>

      </div>
    </form>
  );
};

export default AgentForm;