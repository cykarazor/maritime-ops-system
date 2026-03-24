const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema({
  voyage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Voyage", 
    required: true 
  },

  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },

  cargoType: { 
    type: String, 
    required: true, 
    default: "Cement" 
  },

  quantity: { 
    type: Number, 
    required: true 
  },

  unit: { 
    type: String, 
    enum: ["MT", "KG"], 
    default: "MT" 
  },

  rate: { 
    type: Number, 
    required: true 
  },

  totalRevenue: { 
    type: Number, 
    default: 0 
  },

  notes: String,

  // ✅ ADD THIS (CRITICAL - same as Customers/Agents)
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });


// ✅ AUTO CALCULATE (CREATE)
cargoSchema.pre("save", function(next) {
  this.totalRevenue = this.quantity * this.rate;
  next();
});


// ✅ AUTO CALCULATE (UPDATE) 🔥 IMPORTANT
cargoSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();

  const quantity = update.quantity;
  const rate = update.rate;

  if (quantity !== undefined && rate !== undefined) {
    update.totalRevenue = quantity * rate;
  }

  next();
});


module.exports = mongoose.model("Cargo", cargoSchema);