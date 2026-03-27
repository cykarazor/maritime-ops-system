const Invoice = require("../models/Invoice");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// =========================
// CREATE INVOICE
// =========================
const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const saved = await invoice.save();
    return successResponse(res, saved, "Invoice created successfully", 201);
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL INVOICES
// =========================
const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    let invoices = await Invoice.find(query)
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("agent", "companyName")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo", "description");

    invoices = invoices
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit);

    // Compute balance and color tag
    invoices = invoices.map(inv => {
      const balance = inv.amount - (inv.amountPaid || 0);
      let colorTag = "green"; // paid

      if (balance > 0) {
        const today = new Date();
        const due = new Date(inv.dueDate);
        colorTag = due < today ? "red" : "yellow";
      }

      return { ...inv.toObject(), balance, colorTag };
    });

    const total = await Invoice.countDocuments(query);

    return successResponse(res, {
      invoices,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Invoices fetched successfully");
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE INVOICE
// =========================
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      isActive: true, // ✅ FIXED
    })
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("agent", "companyName")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo", "description");

    if (!invoice) {
      return errorResponse(res, "Invoice not found", 404);
    }

    const balance = invoice.amount - (invoice.amountPaid || 0);
    let colorTag = "green";
    const today = new Date();
    const due = new Date(invoice.dueDate);
    if (balance > 0) colorTag = due < today ? "red" : "yellow";

    return successResponse(res, { ...invoice.toObject(), balance, colorTag }, "Invoice fetched successfully");
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE INVOICE
// =========================
const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("customer", "name")
      .populate("supplier", "name")
      .populate("agent", "companyName")
      .populate("voyage", "vesselName voyageNumber")
      .populate("cargo", "description");

    if (!updated) {
      return errorResponse(res, "Invoice not found", 404);
    }

    const balance = updated.amount - (updated.amountPaid || 0);
    let colorTag = "green";
    const today = new Date();
    const due = new Date(updated.dueDate);
    if (balance > 0) colorTag = due < today ? "red" : "yellow";

    return successResponse(res, { ...updated.toObject(), balance, colorTag }, "Invoice updated successfully");
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE INVOICE (SOFT DELETE)
// =========================
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice || !invoice.isActive) {
      return errorResponse(res, "Invoice not found", 404);
    }

    invoice.isActive = false;
    invoice.deletedAt = new Date();

    await invoice.save();

    return successResponse(res, invoice, "Invoice deactivated successfully");
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE INVOICE
// =========================
const restoreInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice || !invoice.isActive) {
      return errorResponse(res, "Invoice not found or already active", 404);
    }

    invoice.isActive = true;
    invoice.deletedAt = null;

    await invoice.save();

    return successResponse(res, invoice, "Invoice restored successfully");
  } catch (err) {
    console.error("InvoiceControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
};