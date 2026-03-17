const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");


// CREATE Agent
router.post("/", async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, assignedIsland, notes } = req.body;

    // Basic validation (extra safety)
    if (!companyName || !contactPerson || !assignedIsland) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const agent = new Agent({
      companyName,
      contactPerson,
      email,
      phone,
      assignedIsland,
      notes
    });

    const saved = await agent.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// READ ALL Agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ SINGLE Agent
router.get("/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(agent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE Agent
router.put("/:id", async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE Agent
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Agent.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json({ message: "Agent deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;