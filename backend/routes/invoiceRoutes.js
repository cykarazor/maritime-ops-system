const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

// --- Create Invoice ---
router.post("/", async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Get All Invoices ---
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("supplier");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Get Single Invoice ---
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("supplier");
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Update Invoice ---
router.put("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Delete Invoice ---
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;