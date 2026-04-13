const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  // Display / short name (can be person or alias)
  name: { 
    type: String, 
    required: false 
  },

  // Company (main entity for AR)
  companyName: { 
    type: String, 
    default: ""   // TEMP: avoid breaking existing records
  },

  country: { 
    type: String, 
    required: true 
  },

  contactPerson: String,
  email: String,
  phone: String,

  notes: String,

  // Financial (AR summary)
  balance: {
    type: Number,
    default: 0
  },

  // Soft control (like Voyage system)
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);