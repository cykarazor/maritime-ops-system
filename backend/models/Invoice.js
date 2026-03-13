const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  currency: { type: String, default: "USD" },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["Unpaid", "Partial", "Paid"], default: "Unpaid" },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);