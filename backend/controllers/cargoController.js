const Cargo = require("../models/Cargo");

// CREATE
const createCargo = async (req, res) => {
  try {
    const cargo = await Cargo.create(req.body);
    res.status(201).json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL (WITH POPULATION 🔥)
const getCargo = async (req, res) => {
  try {
    const cargo = await Cargo.find()
      .populate("customer", "name companyName")
      .populate("voyage", "voyageNumber vesselName")
      .sort({ createdAt: -1 });

    res.json({ data: cargo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE (WITH POPULATION)
const getCargoById = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id)
      .populate("customer", "name companyName")
      .populate("voyage", "voyageNumber vesselName");

    if (!cargo) {
      return res.status(404).json({ error: "Cargo not found" });
    }

    res.json(cargo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(cargo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// SOFT DELETE
const deleteCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo) {
      return res.status(404).json({ error: "Cargo not found" });
    }

    cargo.isActive = false;
    await cargo.save();

    res.json({ message: "Cargo deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESTORE
const restoreCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id);

    if (!cargo) {
      return res.status(404).json({ error: "Cargo not found" });
    }

    cargo.isActive = true;
    await cargo.save();

    res.json({ message: "Cargo restored" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCargo,
  getCargo,
  getCargoById,
  updateCargo,
  deleteCargo,
  restoreCargo
};