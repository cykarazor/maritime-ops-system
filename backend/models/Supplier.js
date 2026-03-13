const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  contact: String,
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);