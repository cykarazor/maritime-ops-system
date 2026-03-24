const express = require("express");
const router = express.Router();

const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  restoreAgent,
} = require("../controllers/agentController");

// CREATE
router.post("/", createAgent);

// GET ALL
router.get("/", getAgents);

// GET ONE
router.get("/:id", getAgentById);

// UPDATE
router.put("/:id", updateAgent);

// DELETE (soft)
router.delete("/:id", deleteAgent);

// RESTORE ✅ FIXED ROUTE
router.patch("/:id/restore", restoreAgent);

module.exports = router;