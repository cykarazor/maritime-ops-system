const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
} = require("../controllers/customerController");

// CREATE
router.post("/", createCustomer);

// GET ALL (with pagination + search)
router.get("/", getCustomers);

// GET ONE
router.get("/:id", getCustomerById);

// UPDATE
router.put("/:id", updateCustomer);

// DELETE (soft delete)
router.delete("/:id", deleteCustomer);

// RESTORE
router.put("/:id/restore", restoreCustomer);

module.exports = router;