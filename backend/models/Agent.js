const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: String,
  phone: String,
  assignedIsland: { type: String, required: true },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Agent", agentSchema);