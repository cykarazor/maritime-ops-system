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

// =========================
// ROUTES
// =========================

// CREATE
router.post("/", createAgent);

// GET ALL (with pagination + search)
router.get("/", getAgents);

// GET ONE
router.get("/:id", getAgentById);

// UPDATE
router.put("/:id", updateAgent);

// DELETE (soft delete)
router.delete("/:id", deleteAgent);

// RESTORE
router.put("/:id/restore", restoreAgent);

module.exports = router;