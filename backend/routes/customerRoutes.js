const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  getCustomerBalance,
} = require("../controllers/customerController");

const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");


// 🔹 CREATE
router.post("/", createCustomer);

// 🔹 READ ALL (search + pagination + filters)
router.get("/", getCustomers);

// 🔹 CUSTOMER BALANCE (AR) ⚠️ MUST COME BEFORE :id
router.get("/:id/balance", getCustomerBalance);

// 🔹 READ SINGLE
router.get("/:id", getCustomerById);

// 🔹 UPDATE
router.put("/:id", updateCustomer);

// 🔹 SOFT DELETE (Deactivate)
router.delete("/:id", deleteCustomer);   // soft delete

// 🔹 RESTORE (Activate)
router.patch("/:id/restore", restoreCustomer);

module.exports = router;