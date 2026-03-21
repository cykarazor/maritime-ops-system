const express = require("express");
const router = express.Router();

const {
  createVoyage,
  getVoyages,
  getVoyageById,
  updateVoyage,
  deleteVoyage,
  restoreVoyage,
} = require("../controllers/voyageController");


// =========================
// ROUTES
// =========================

// CREATE
router.post("/", createVoyage);

// GET ALL (with pagination + search)
router.get("/", getVoyages);

// GET ONE
router.get("/:id", getVoyageById);

// UPDATE
router.put("/:id", updateVoyage);

// DELETE
router.delete("/:id", deleteVoyage);

//RESTORE
router.patch("/restore/:id", restoreVoyage);

module.exports = router;