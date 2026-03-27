const express = require("express");
const router = express.Router();

const {
  createCargo,
  getCargo,
  getCargoById,
  updateCargo,
  deleteCargo,
  restoreCargo,
} = require("../controllers/cargoController");

// =========================
// ROUTES
// =========================

// CREATE
router.post("/", createCargo);

// GET ALL (with pagination + search)
router.get("/", getCargo);

// GET ONE
router.get("/:id", getCargoById);

// UPDATE
router.put("/:id", updateCargo);

// DELETE (soft delete)
router.delete("/:id", deleteCargo);

// RESTORE
router.put("/:id/restore", restoreCargo);

module.exports = router;