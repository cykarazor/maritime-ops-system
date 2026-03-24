const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },

    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    assignedIsland: { type: String, required: true },

    notes: { type: String },

    // ✅ Soft delete system
    isActive: { type: Boolean, default: true },

    // optional but VERY useful for audits
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);