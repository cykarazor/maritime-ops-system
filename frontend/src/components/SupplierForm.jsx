import React, { useState, useEffect } from "react";

const SupplierForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [supplier, setSupplier] = useState({
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
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setSupplier({
        companyName: initialData.companyName || "",
        country: initialData.country || "",
        contactPerson: initialData.contactPerson || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",

        currency: initialData.currency || "USD",
        paymentTerms: initialData.paymentTerms || 30,
        creditLimit: initialData.creditLimit || 0,
        openingBalance: initialData.openingBalance || 0,

        notes: initialData.notes || "",
      });
    } else {
      setSupplier({
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
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...supplier,
      paymentTerms: Number(supplier.paymentTerms),
      creditLimit: Number(supplier.creditLimit),
      openingBalance: Number(supplier.openingBalance),
    });
  };

  const isInactive = initialData?.isActive === false;

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData?._id ? "Edit Supplier" : "Add Supplier"}</h3>

      {isInactive && (
        <p style={{ color: "red" }}>
          This supplier is inactive. Restore it before editing.
        </p>
      )}

      {/*COMPANY NAME*/}
      <div className="form-group">
        <label>Company Name</label>
          <input
          name="companyName" 
          placeholder="Company Name" 
          value={supplier.companyName} 
          onChange={handleChange} 
          required 
          disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Country</label>
          <input 
            name="country" 
            placeholder="Country" 
            value={supplier.country} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Contact Person</label>
          <input 
            name="contactPerson" 
            placeholder="Contact Person" 
            value={supplier.contactPerson} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Email</label>
          <input 
            name="email" 
            placeholder="Email" 
            value={supplier.email} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Phone</label>
          <input 
            name="phone" 
            placeholder="Phone" 
            value={supplier.phone} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Address</label>
          <textarea 
            name="address" 
            placeholder="Address" 
            value={supplier.address} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Currency</label>
          <select 
            name="currency" 
            value={supplier.currency} 
            onChange={handleChange} 
            disabled={isInactive}
          >
            <option value="USD">USD</option>
            <option value="TTD">TTD</option>
            <option value="EUR">EUR</option>
          </select>
      </div>

      <div className="form-group">
        <label>Payment Terms (days)</label>
        <input 
          name="paymentTerms" 
          type="number" 
          value={supplier.paymentTerms} 
          onChange={handleChange} 
          disabled={isInactive} 
        />
      </div>

      <div className="form-group">
        <label>Credit Limit</label>
          <input 
            name="creditLimit" 
            type="number" 
            value={supplier.creditLimit} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Opening Balance</label>
          <input 
            name="openingBalance" 
            type="number" 
            value={supplier.openingBalance} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-group">
        <label>Notes</label>
          <textarea 
            name="notes"
            placeholder="Notes" 
            value={supplier.notes} 
            onChange={handleChange} 
            disabled={isInactive} 
          />
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary"
          type="submit" 
          disabled={isInactive}
        >
          {initialData?._id ? "Update" : "Create"}
        </button>

        <button 
          className="btn btn-secondary"
          type="button" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;