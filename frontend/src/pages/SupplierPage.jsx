import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import SupplierTable from "../components/SupplierTable";
import SupplierForm from "../components/SupplierForm";
import Pagination from "../components/Pagination";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
} from "../utils/api";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editing, setEditing] = useState(null);

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
  // FETCH SUPPLIERS (STANDARDIZED)
  // =========================
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await getSuppliers({ page, limit });

        setSuppliers(res.suppliers || []);
        setPages(res.pages || 1);

      } catch (err) {
        console.error("Failed to load suppliers:", err);
      }
    };

    fetchSuppliers();
  }, [page, limit, refreshTrigger]);

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateSupplier(editing._id, data);
        setEditing(null);
      } else {
        await createSupplier(data);
      }

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Supplier save error:", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Deactivate this supplier?")) return;

      await deleteSupplier(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Delete supplier error:", err);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreSupplier(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Restore supplier error:", err);
    }
  };

  return (
    <Layout>
      <h1>Suppliers</h1>

      <SupplierForm
        onSubmit={handleSubmit}
        initialData={editing}
        onCancel={() => setEditing(null)}
      />

      <SupplierTable
        suppliers={suppliers}
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

export default SupplierPage;