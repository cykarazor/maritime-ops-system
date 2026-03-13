const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema({
  voyage: { type: mongoose.Schema.Types.ObjectId, ref: "Voyage", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  cargoType: { type: String, required: true, default: "Cement" },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ["MT", "KG"], default: "MT" },
  rate: { type: Number, required: true },
  totalRevenue: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });

// Auto-calculate totalRevenue before saving
cargoSchema.pre("save", function(next) {
  this.totalRevenue = this.quantity * this.rate;
  next();
});

module.exports = mongoose.model("Cargo", cargoSchema);