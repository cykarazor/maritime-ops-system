const Supplier = require("../models/Supplier");
const Invoice = require("../models/Invoice");


// 🔹 CREATE Supplier
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 GET ALL Suppliers (search + pagination + filters)
const getSuppliers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;

    const query = {};

    // 🔍 Search (name or country)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    // 🔘 Active filter
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const suppliers = await Supplier.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Supplier.countDocuments(query);

    res.json({
      data: suppliers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET SINGLE Supplier
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 UPDATE Supplier
const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 SOFT DELETE Supplier (IMPORTANT for accounting)
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    supplier.isActive = false;
    await supplier.save();

    res.json({ message: "Supplier deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET SUPPLIER BALANCE WITH AGING
const getSupplierBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const invoices = await Invoice.find({
      supplier: id,
      type: "AP",
    });

    const today = new Date();

    let totalAP = 0;

    const aging = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };

    invoices.forEach((inv) => {
      const amount = inv.amount || 0;
      totalAP += amount;

      // If no dueDate, treat as 90+
      const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;

      let daysOverdue = 0;

      if (dueDate) {
        const diffTime = today - dueDate;
        daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      } else {
        daysOverdue = 999; // force into 90+
      }

      if (daysOverdue <= 30) {
        aging["0-30"] += amount;
      } else if (daysOverdue <= 60) {
        aging["31-60"] += amount;
      } else if (daysOverdue <= 90) {
        aging["61-90"] += amount;
      } else {
        aging["90+"] += amount;
      }
    });

    res.json({
      supplierId: id,
      supplierName: supplier.name,
      currency: supplier.currency || "USD",
      totalInvoices: invoices.length,
      totalAP,
      aging,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 EXPORTS
module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierBalance,
};