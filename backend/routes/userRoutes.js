const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");

// =========================
// ROUTES
// =========================

// CREATE USER
router.post("/", createUser);

// GET ALL USERS (with pagination + search)
router.get("/", getUsers);

// GET SINGLE USER
router.get("/:id", getUserById);

// UPDATE USER
router.put("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

// CHANGE PASSWORD
router.put("/:id/password", changePassword);

module.exports = router;