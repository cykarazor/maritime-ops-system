const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");


// 🔹 CREATE Customer
const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 GET ALL Customers (search + pagination + filters)
const getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;

    const query = {};

    // 🔍 Search
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

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    res.json({
      data: customers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET SINGLE Customer
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 UPDATE Customer
const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 SOFT DELETE Customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    customer.isActive = false;
    await customer.save();

    res.json({ message: "Customer deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET CUSTOMER BALANCE WITH AGING (AR)
const getCustomerBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const invoices = await Invoice.find({
      customer: id,
      type: "AR",
    });

    const today = new Date();

    let totalAR = 0;
    let totalPaid = 0;
    let outstanding = 0;

    const aging = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };

    invoices.forEach((inv) => {
      const amount = inv.amount || 0;
      const paid = inv.amountPaid || 0;

      const balance = amount - paid;

      totalAR += amount;
      totalPaid += paid;
      outstanding += balance;

      // ❗ Skip fully paid invoices
      if (balance <= 0) return;

      const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;

      let daysOverdue = 0;

      if (dueDate) {
        const diffTime = today - dueDate;
        daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      } else {
        daysOverdue = 999;
      }

      if (daysOverdue <= 30) {
        aging["0-30"] += balance;
      } else if (daysOverdue <= 60) {
        aging["31-60"] += balance;
      } else if (daysOverdue <= 90) {
        aging["61-90"] += balance;
      } else {
        aging["90+"] += balance;
      }
    });

    res.json({
      customerId: id,
      customerName: customer.name,
      currency: customer.currency || "USD",

      totalInvoices: invoices.length,

      totalAR,
      totalPaid,
      outstanding,

      aging,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 EXPORTS
module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerBalance,
};