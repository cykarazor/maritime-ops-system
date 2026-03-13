const express = require("express");
const router = express.Router();
const Voyage = require("../models/Voyage");


// Create Voyage
router.post("/", async (req, res) => {
  try {
    const voyage = new Voyage(req.body);
    await voyage.save();
    res.status(201).json(voyage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Voyages
router.get("/", async (req, res) => {
  try {
    const voyages = await Voyage.find()
      .populate("assignedCustomer", "name") // populate only the name field
      .populate("assignedAgent", "name");   // optional: populate agent name if needed
    res.json(voyages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Voyage by ID
router.get("/:id", async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);
    if (!voyage) return res.status(404).json({ error: "Voyage not found" });
    res.json(voyage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Voyage
router.put("/:id", async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voyage) return res.status(404).json({ error: "Voyage not found" });
    res.json(voyage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Voyage
router.delete("/:id", async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndDelete(req.params.id);
    if (!voyage) return res.status(404).json({ error: "Voyage not found" });
    res.json({ message: "Voyage deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;