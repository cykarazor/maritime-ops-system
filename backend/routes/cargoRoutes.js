const express = require("express");
const router = express.Router();

const {
  createCargo,
  getCargo,
  getCargoById,
  updateCargo,
  deleteCargo,
  restoreCargo
} = require("../controllers/cargoController");


// 🔹 CREATE
router.post("/", createCargo);

// 🔹 READ ALL (with population handled in controller)
router.get("/", getCargo);

// 🔹 READ SINGLE
router.get("/:id", getCargoById);

// 🔹 UPDATE
router.put("/:id", updateCargo);

// 🔹 SOFT DELETE (Deactivate)
router.delete("/:id", deleteCargo);

// 🔹 RESTORE
router.patch("/:id/restore", restoreCargo);


module.exports = router;