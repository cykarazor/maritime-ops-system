const Supplier = require("../models/Supplier");
const Invoice = require("../models/Invoice");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// =========================
// CREATE SUPPLIER
// =========================
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    return successResponse(res, saved, "Supplier created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL SUPPLIERS (search + pagination + filter)
// =========================
const getSuppliers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) query.isActive = isActive === "true";

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const suppliers = await Supplier.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const total = await Supplier.countDocuments(query);

    return successResponse(res, {
      suppliers: suppliers || [],
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Suppliers fetched successfully");

  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE SUPPLIER
// =========================
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return errorResponse(res, "Supplier not found", 404);

    return successResponse(res, supplier, "Supplier fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE SUPPLIER
// =========================
const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return errorResponse(res, "Supplier not found", 404);

    return successResponse(res, updated, "Supplier updated successfully");
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// SOFT DELETE SUPPLIER
// =========================
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return errorResponse(res, "Supplier not found", 404);

    supplier.isActive = false;
    await supplier.save();

    return successResponse(res, null, "Supplier deactivated successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE SUPPLIER
// =========================
const restoreSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier || supplier.isActive) {
      return errorResponse(res, "Supplier not found or already active", 404);
    }

    supplier.isActive = true;
    await supplier.save();

    return successResponse(res, supplier, "Supplier restored successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SUPPLIER BALANCE + AGING
// =========================
const getSupplierBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) return errorResponse(res, "Supplier not found", 404);

    const invoices = await Invoice.find({ supplier: id, type: "AP" });

    const today = new Date();
    let totalAP = 0, totalPaid = 0, outstanding = 0;
    const aging = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };

    invoices.forEach(inv => {
      const amount = inv.amount || 0;
      const paid = inv.amountPaid || 0;
      const balance = amount - paid;

      totalAP += amount;
      totalPaid += paid;
      outstanding += balance;

      if (balance <= 0) return;

      const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
      const daysOverdue = dueDate ? Math.floor((today - dueDate) / (1000*60*60*24)) : 999;

      if (daysOverdue <= 30) aging["0-30"] += balance;
      else if (daysOverdue <= 60) aging["31-60"] += balance;
      else if (daysOverdue <= 90) aging["61-90"] += balance;
      else aging["90+"] += balance;
    });

    return successResponse(res, {
      supplierId: id,
      supplierName: supplier.name,
      currency: supplier.currency || "USD",
      totalInvoices: invoices.length,
      totalAP,
      totalPaid,
      outstanding,
      aging,
    }, "Supplier balance fetched successfully");

  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
  getSupplierBalance,
};