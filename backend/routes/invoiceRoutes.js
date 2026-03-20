const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

// =========================
// CREATE Invoice
// =========================
router.post("/", async (req, res) => {
  try {
    // 🔥 Validation for AR/AP
    if (req.body.type === "AR" && !req.body.customer) {
      return res.status(400).json({ error: "Customer is required for AR invoice" });
    }

    if (req.body.type === "AP" && !req.body.supplier) {
      return res.status(400).json({ error: "Supplier is required for AP invoice" });
    }

    const invoice = new Invoice(req.body);
    const saved = await invoice.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =========================
// GET ALL Invoices
// =========================
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo");

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET SINGLE Invoice
// =========================
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo");

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// UPDATE Invoice
// =========================
router.put("/:id", async (req, res) => {
  try {
    // 🔥 Validation again on update
    if (req.body.type === "AR" && !req.body.customer) {
      return res.status(400).json({ error: "Customer is required for AR invoice" });
    }

    if (req.body.type === "AP" && !req.body.supplier) {
      return res.status(400).json({ error: "Supplier is required for AP invoice" });
    }

    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo");

    if (!updated) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =========================
// DELETE Invoice
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;