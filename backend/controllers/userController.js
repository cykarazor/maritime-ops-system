const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const bcrypt = require("bcryptjs");

// =========================
// CREATE USER
// =========================
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, "Email already in use", 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    const saved = await user.save();

    const safeUser = { ...saved.toObject(), password: undefined };

    return successResponse(res, safeUser, "User created successfully", 201);
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL USERS
// =========================
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) query.role = role;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const safeUsers = users.map(u => ({ ...u.toObject(), password: undefined }));

    return successResponse(res, {
      users: safeUsers,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Users fetched successfully");
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE USER
// =========================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);

    const safeUser = { ...user.toObject(), password: undefined };
    return successResponse(res, safeUser, "User fetched successfully");
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE USER
// =========================
const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const updateData = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) return errorResponse(res, "User not found", 404);

    const safeUser = { ...updated.toObject(), password: undefined };
    return successResponse(res, safeUser, "User updated successfully");
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE USER (soft delete)
// =========================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isActive === false) {
      return errorResponse(res, "User not found", 404);
    }

    user.isActive = false;
    user.deletedAt = new Date();

    await user.save();

    return successResponse(res, {}, "User deactivated successfully");
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE USER
// =========================
const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isActive === true) {
      return errorResponse(res, "User not found or already active", 404);
    }

    user.isActive = true;
    user.deletedAt = null;

    await user.save();

    return successResponse(res, user, "User restored successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// CHANGE PASSWORD
// =========================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);

    // Verify current password if provided
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return errorResponse(res, "Current password is incorrect", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse(res, {}, "Password updated successfully");
  } catch (err) {
    console.error("UserControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  changePassword,
};