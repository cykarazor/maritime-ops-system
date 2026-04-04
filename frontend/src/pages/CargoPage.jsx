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

  const [customers, setCustomers] = useState([]);
  const [voyages, setVoyages] = useState([]);

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
  // FETCH DATA (STANDARDIZED)
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cargoRes, customerRes, voyageRes] = await Promise.all([
          getCargo({ page, limit }),
          getCustomers(),
          getVoyages()
        ]);

        setCargo(cargoRes.cargo || []);
        setPages(cargoRes.pages || 1);

        setCustomers(customerRes.customers || []);
        setVoyages(voyageRes.voyages || []);

      } catch (err) {
        console.error("Error fetching cargo data:", err);
      }
    };

    fetchData();
  }, [page, limit, refreshTrigger]);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createCargo(data);
      setRefreshTrigger((prev) => prev + 1);
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

      <CargoForm
        onSubmit={
          editing
            ? (data) => handleUpdate(editing._id, data)
            : handleCreate
        }
        initialData={editing}
        customers={customers}
        voyages={voyages}
      />

      <CargoTable
        cargo={cargo}
        onEdit={setEditing}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {/* ========================= */}
      {/* PAGINATION (STANDARDIZED) */}
      {/* ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default CargoPage;