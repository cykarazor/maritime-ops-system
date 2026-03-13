const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");

// CREATE Agent
router.post("/", async (req, res) => {
  try {
    const agent = new Agent(req.body);
    const savedAgent = await agent.save();
    res.status(201).json(savedAgent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all Agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single Agent
router.get("/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Agent
router.put("/:id", async (req, res) => {
  try {
    const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAgent) return res.status(404).json({ error: "Agent not found" });
    res.json(updatedAgent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Agent
router.delete("/:id", async (req, res) => {
  try {
    const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
    if (!deletedAgent) return res.status(404).json({ error: "Agent not found" });
    res.json({ message: "Agent deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;