const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Contact Details
    contactPerson: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // 🔹 Financial / Accounting
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    paymentTerms: {
      type: Number,
      default: 30, // days
      min: 0,
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },

    // 🔹 Status Control
    isActive: {
      type: Boolean,
      default: true,
      index: true, // ⭐ added for filtering performance
    },

    // 🔹 Notes
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Indexes (optimized for real usage)
supplierSchema.index({ name: 1 });
supplierSchema.index({ country: 1 });
supplierSchema.index({ name: "text", country: "text" }); // ⭐ enables text search later

module.exports = mongoose.model("Supplier", supplierSchema);