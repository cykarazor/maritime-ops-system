const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
  getSupplierBalance,
} = require("../controllers/supplierController");

// =========================
// ROUTES
// =========================

// CREATE Supplier
router.post("/", createSupplier);

// GET ALL Suppliers (with search, pagination, filters)
router.get("/", getSuppliers);

// GET SINGLE Supplier
router.get("/:id", getSupplierById);

// UPDATE Supplier
router.put("/:id", updateSupplier);

// SOFT DELETE Supplier
router.delete("/:id", deleteSupplier);

// RESTORE Supplier
router.put("/:id/restore", restoreSupplier);

// GET Supplier Balance + Aging
router.get("/:id/balance", getSupplierBalance);

module.exports = router;