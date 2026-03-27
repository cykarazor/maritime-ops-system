const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["AR", "AP"], // AR = Customer Invoice, AP = Supplier Invoice
    required: true
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
    // required if type = AR
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier"
    // required if type = AP
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent"  // NEW field added for optional agent assignment
  },

  invoiceNumber: { 
    type: String, 
    required: true 
  },

  invoiceDate: { 
    type: Date, 
    required: true 
  },

  dueDate: { 
    type: Date, 
    required: true 
  },

  currency: { 
    type: String, 
    default: "USD" 
  },

  amount: { 
    type: Number, 
    required: true 
  },

  amountPaid: { 
    type: Number, 
    default: 0 
  },

  paymentStatus: { 
    type: String, 
    enum: ["Unpaid", "Partial", "Paid"], 
    default: "Unpaid" 
  },

  // Optional links for operations tracking
  voyage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voyage"
  },

  cargo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cargo"
  },

  notes: String,

  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },

}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);