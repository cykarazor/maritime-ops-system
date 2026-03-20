const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierBalance,
} = require("../controllers/supplierController");

router.post("/", createSupplier);
router.get("/", getSuppliers);
router.get("/:id/balance", getSupplierBalance);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;