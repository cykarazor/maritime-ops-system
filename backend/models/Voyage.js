// models/Voyage.js
const mongoose = require("mongoose");

const voyageSchema = new mongoose.Schema({
  vesselName: { type: String, required: true },
  voyageNumber: { type: String, required: true },
  loadPort: String,
  dischargePort: String,
  etd: Date,
  eta: Date,
  actualArrival: Date,
  status: {
    type: String,
    enum: ["Scheduled", "Loading", "In Transit", "Discharged", "Completed"],
    default: "Scheduled",
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  assignedCustomer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // <-- change here
}, { timestamps: true });

module.exports = mongoose.model("Voyage", voyageSchema);