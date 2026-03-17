const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },

  contactPerson: String,
  email: String,
  phone: String,

  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);