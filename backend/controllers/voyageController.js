const Voyage = require("../models/Voyage");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// =========================
// CREATE VOYAGE
// =========================
const createVoyage = async (req, res) => {
  try {
    const voyage = new Voyage(req.body);
    const saved = await voyage.save();

    return successResponse(res, saved, "Voyage created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL VOYAGES
// =========================
const getVoyages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      vesselName,
      departurePort,
      status,
    } = req.query;

    const query = {};

    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.$or = [
        { vesselName: { $regex: search, $options: "i" } },
        { voyageNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (vesselName) {
      query.vesselName = { $regex: vesselName, $options: "i" };
    }

    if (departurePort) {
      query.loadPort = { $regex: departurePort, $options: "i" };
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const voyages = await Voyage.find(query)
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName")
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const total = await Voyage.countDocuments(query);

    return successResponse(res, {
      voyages: voyages || [], // 🔒 always array
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Voyages fetched successfully");

  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE VOYAGE
// =========================
const getVoyageById = async (req, res) => {
  try {
    const voyage = await Voyage.findOne({
      _id: req.params.id,
      isActive: true, // ✅ FIXED
    })
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName");

    if (!voyage) {
      return errorResponse(res, "Voyage not found", 404);
    }

    return successResponse(res, voyage, "Voyage fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE VOYAGE
// =========================
const updateVoyage = async (req, res) => {
  try {
    const updated = await Voyage.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true,
      },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName");

    if (!updated) {
      return errorResponse(res, "Voyage not found", 404);
    }

    return successResponse(res, updated, "Voyage updated successfully");
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE VOYAGE (SOFT DELETE)
// =========================
const deleteVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);

    if (!voyage || !voyage.isActive) {
      return errorResponse(res, "Voyage not found", 404);
    }

    voyage.isActive = false;
    voyage.deletedAt = new Date();

    await voyage.save();

    return successResponse(res, voyage, "Voyage deactivated successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE VOYAGE
// =========================
const restoreVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);

    if (!voyage || voyage.isActive) {
      return errorResponse(res, "Voyage not found or already active", 404);
    }

    voyage.isActive = false;
    voyage.deletedAt = null;

    await voyage.save();

    return successResponse(res, voyage, "Voyage restored successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createVoyage,
  getVoyages,
  getVoyageById,
  updateVoyage,
  deleteVoyage,
  restoreVoyage,
};