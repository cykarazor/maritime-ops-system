const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerBalance,
} = require("../controllers/customerController");


// 🔹 CREATE
router.post("/", createCustomer);

// 🔹 READ ALL (with search/pagination support)
router.get("/", getCustomers);

// 🔹 READ SINGLE
router.get("/:id", getCustomerById);

// 🔹 UPDATE
router.put("/:id", updateCustomer);

// 🔹 SOFT DELETE (IMPORTANT)
router.delete("/:id", deleteCustomer);

// 🔹 CUSTOMER BALANCE (AR)
router.get("/:id/balance", getCustomerBalance);


module.exports = router;