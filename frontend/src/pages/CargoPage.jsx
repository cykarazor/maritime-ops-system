// src/pages/CargoPage.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CargoTable from "../components/CargoTable";
import CargoForm from "../components/CargoForm";
import Pagination from "../components/Pagination";

import {
  getCargo,
  createCargo,
  updateCargo,
  deleteCargo,
  restoreCargo,
  getCustomers,
  getVoyages
} from "../utils/api";

const CargoPage = () => {
  const [cargo, setCargo] = useState([]);
  const [editing, setEditing] = useState(null);

  // ✅ STANDARDIZED UI STATE
  const [showForm, setShowForm] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [voyages, setVoyages] = useState([]);

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
// FETCH CARGO
// =========================
useEffect(() => {
  const fetchCargo = async () => {
    try {
      const response = await getCargo({ page, limit });

      setCargo(response.data || []);
      setPages(response.pages || 1);
    } catch (error) {
      console.error("Error fetching cargo:", error);
    }
  };

  fetchCargo();
}, [page, limit, refreshTrigger]);

// =========================
// FETCH CUSTOMERS
// =========================
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  fetchCustomers();
}, []);

// =========================
// FETCH VOYAGES
// =========================
useEffect(() => {
  const fetchVoyages = async () => {
    try {
      const response = await getVoyages();
      setVoyages(response.data || []);
    } catch (error) {
      console.error("Error fetching voyages:", error);
    }
  };

  fetchVoyages();
}, []);

  // =========================
  // HANDLERS (STANDARDIZED)
  // =========================
  const handleCreateClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCargo(data);
      setRefreshTrigger((prev) => prev + 1);
      setShowForm(false);
    } catch (err) {
      console.error("Create cargo failed:", err);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, data) => {
    try {
      await updateCargo(id, data);
      setEditing(null);
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Update cargo failed:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Deactivate this cargo?")) return;
      await deleteCargo(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Delete cargo failed:", err);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreCargo(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Restore cargo failed:", err);
    }
  };

  return (
    <Layout>
      <h1>Cargo (Revenue)</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Cargo
      </button>

      {/* FORM (CONTROLLED) */}
      {showForm && (
        <CargoForm
          onSubmit={
            editing
              ? (data) => handleUpdate(editing._id, data)
              : handleCreate
          }
          initialData={editing}
          onCancel={handleCancel}
          customers={customers}
          voyages={voyages}
        />
      )}

      {/* TABLE */}
      <CargoTable
        cargo={cargo}
        onEdit={handleEditClick}
        onDelete={handleDelete}
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

export default CargoPage;