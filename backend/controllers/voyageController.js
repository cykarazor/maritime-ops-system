const Voyage = require("../models/Voyage");

// =========================
// CREATE VOYAGE
// =========================
const createVoyage = async (req, res) => {
  try {
    const voyage = new Voyage(req.body);
    const saved = await voyage.save();

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =========================
// GET ALL VOYAGES (FIXED + POPULATE + SAFE)
// =========================
const getVoyages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      vesselName,
      departurePort,
    } = req.query;

    const query = {};

    if (req.query.status === "active") {
      query.isDeleted = false;
    }

    if (req.query.status === "inactive") {
      query.isDeleted = true;
    }

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

    const voyages = await Voyage.find(query)
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Voyage.countDocuments(query);

    res.json({
      success: true,
      data: voyages,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// GET SINGLE VOYAGE
// =========================
const getVoyageById = async (req, res) => {
  try {
    const voyage = await Voyage.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    })
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName");

    if (!voyage) {
      return res.status(404).json({ error: "Voyage not found" });
    }

    res.json({
      success: true,
      data: voyage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        isDeleted: { $ne: true },
      },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assignedCustomer", "name")
      .populate("assignedAgent", "companyName");

    if (!updated) {
      return res.status(404).json({ error: "Voyage not found" });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =========================
// DELETE VOYAGE (SOFT DELETE)
// =========================
const deleteVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);

    if (!voyage || voyage.isDeleted) {
      return res.status(404).json({ error: "Voyage not found" });
    }

    voyage.isDeleted = true;
    voyage.deletedAt = new Date();

    await voyage.save();

    res.json({
      success: true,
      message: "Voyage deactivated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// RESTORE VOYAGE
// =========================

const restoreVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);

    if (!voyage || !voyage.isDeleted) {
      return res.status(404).json({ error: "Voyage not found or already active" });
    }

    voyage.isDeleted = false;
    voyage.deletedAt = null;

    await voyage.save();

    res.json({
      success: true,
      message: "Voyage restored successfully",
      data: voyage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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