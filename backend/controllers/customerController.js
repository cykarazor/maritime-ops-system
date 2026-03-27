const Customer = require("../models/Customer");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// =========================
// CREATE CUSTOMER
// =========================
const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();

    return successResponse(res, saved, "Customer created successfully", 201);
  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL CUSTOMERS
// =========================
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const customers = await Customer.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    return successResponse(res, {
      customers: customers || [], // always array
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Customers fetched successfully");

  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE CUSTOMER
// =========================
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      isActive: true, // ✅ FIXED
    });

    if (!customer) {
      return errorResponse(res, "Customer not found", 404);
    }

    return successResponse(res, customer, "Customer fetched successfully");
  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE CUSTOMER
// =========================
const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, isActive: true }, // ✅ FIXED
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return errorResponse(res, "Customer not found", 404);
    }

    return successResponse(res, updated, "Customer updated successfully");
  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE CUSTOMER (SOFT DELETE)
// =========================
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer || !customer.isActive) {
      return errorResponse(res, "Customer not found or already inactive", 404);
    }

    customer.isActive = false;
    customer.deletedAt = new Date();

    await customer.save();

    return successResponse(res, customer, "Customer deactivated successfully");
  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE CUSTOMER
// =========================
const restoreCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer || customer.isActive) {
      return errorResponse(res, "Customer not found or already active", 404);
    }

    customer.isActive = true;
    customer.deletedAt = null;

    await customer.save();

    return successResponse(res, customer, "Customer restored successfully");
  } catch (err) {
    console.error("CustomerControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
};