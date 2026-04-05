import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import Pagination from "../components/Pagination";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer
} from "../utils/api";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // ✅ STANDARDIZED FORM STATE
  const [showForm, setShowForm] = useState(false);

  // =========================
  // PAGINATION STATE
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH CUSTOMERS
  // =========================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers({ page, limit });

        setCustomers(response.customers || []);
        setPages(response.pages || 1);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [page, limit, refreshTrigger]);

  // =========================
  // HANDLERS (STANDARDIZED)
  // =========================
  const handleCreateClick = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCustomer(data);
      setRefreshTrigger((prev) => prev + 1);
      setShowForm(false);
    } catch (error) {
      console.error("CREATE ERROR:", error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, data) => {
    try {
      await updateCustomer(id, data);
      setEditingCustomer(null);
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("UPDATE ERROR:", error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeactivate = async (id) => {
    try {
      if (!window.confirm("Deactivate this customer?")) return;

      await deleteCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreCustomer(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE ERROR:", error);
    }
  };

  return (
    <Layout>
      <h1>Customers</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Customer
      </button>

      {/* FORM (CONTROLLED VISIBILITY) */}
      {showForm && (
        <CustomerForm
          onSubmit={
            editingCustomer
              ? (data) => handleUpdate(editingCustomer._id, data)
              : handleCreate
          }
          initialData={editingCustomer}
          onCancel={handleCancel}
        />
      )}

      {/* TABLE */}
      <CustomerTable
        customers={customers}
        onEdit={handleEditClick}
        onDelete={handleDeactivate}
        onRestore={handleRestore}
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default CustomerPage;