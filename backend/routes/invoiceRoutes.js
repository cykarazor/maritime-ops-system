const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
} = require("../controllers/invoiceController");

// =========================
// ROUTES
// =========================

// CREATE
router.post("/", createInvoice);

// GET ALL (with pagination + search)
router.get("/", getInvoices);

// GET ONE
router.get("/:id", getInvoiceById);

// UPDATE
router.put("/:id", updateInvoice);

// DELETE (soft delete)
router.delete("/:id", deleteInvoice);

// RESTORE
router.put("/:id/restore", restoreInvoice);

module.exports = router;