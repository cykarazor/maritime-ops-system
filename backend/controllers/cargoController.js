const Cargo = require("../models/Cargo");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// =========================
// CREATE CARGO
// =========================
const createCargo = async (req, res) => {
  try {
    const cargo = new Cargo(req.body);
    const saved = await cargo.save();

    return successResponse(res, saved, "Cargo created successfully", 201);
  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL CARGO ITEMS
// =========================
const getCargo = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.$or = [
        { type: { $regex: search, $options: "i" } },
        { remarks: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const cargoItems = await Cargo.find(query)
      .populate("voyage", "vesselName voyageNumber")
      .populate("customer", "companyName name")    
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const total = await Cargo.countDocuments(query);

    return successResponse(res, {
      cargo: cargoItems || [],
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Cargo fetched successfully");

  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE CARGO ITEM
// =========================
const getCargoById = async (req, res) => {
  try {
    const cargo = await Cargo.findOne({
      _id: req.params.id,
      isActive: true, // ✅ FIXED
    }).populate("voyage", "vesselName voyageNumber");

    if (!cargo) {
      return errorResponse(res, "Cargo not found", 404);
    }

    return successResponse(res, cargo, "Cargo fetched successfully");
  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE CARGO ITEM
// =========================
const updateCargo = async (req, res) => {
  try {
    const updated = await Cargo.findOneAndUpdate(
      { _id: req.params.id, isActive: true }, // ✅ FIXED
      req.body,
      { new: true, runValidators: true }
    ).populate("voyage", "vesselName voyageNumber");

    if (!updated) {
      return errorResponse(res, "Cargo not found or inactive", 404);
    }

    return successResponse(res, updated, "Cargo updated successfully");
  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE CARGO ITEM (SOFT DELETE)
// =========================
const deleteCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo || !cargo.isActive) {
      return errorResponse(res, "Cargo not found", 404);
    }

    cargo.isActive = false;
    cargo.deletedAt = new Date();

    await cargo.save();

    return successResponse(res, cargo, "Cargo deactivated successfully");
  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE CARGO ITEM
// =========================
const restoreCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo || cargo.isActive) {
      return errorResponse(res, "Cargo not found or already active", 404);
    }

    cargo.isActive = true;
    cargo.deletedAt = null;

    await cargo.save();

    return successResponse(res, cargo, "Cargo restored successfully");
  } catch (err) {
    console.error("CargoControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createCargo,
  getCargo,
  getCargoById,
  updateCargo,
  deleteCargo,
  restoreCargo,
};