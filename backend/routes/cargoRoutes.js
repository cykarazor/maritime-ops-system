const express = require("express");
const router = express.Router();
const Cargo = require("../models/Cargo");

// CREATE Cargo
router.post("/", async (req, res) => {
  try {
    const cargo = new Cargo(req.body);
    const saved = await cargo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL Cargo
router.get("/", async (req, res) => {
  try {
    const cargoList = await Cargo.find()
      .populate("voyage")
      .populate("customer");
    res.json(cargoList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ SINGLE Cargo
router.get("/:id", async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id)
      .populate("voyage")
      .populate("customer");
    if (!cargo) return res.status(404).json({ error: "Cargo not found" });
    res.json(cargo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Cargo
router.put("/:id", async (req, res) => {
  try {
    const updated = await Cargo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Cargo not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Cargo
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Cargo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Cargo not found" });
    res.json({ message: "Cargo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;