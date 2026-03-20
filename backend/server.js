const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// --- Import Routes ---
const invoiceRoutes = require("./routes/invoiceRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const cargoRoutes = require("./routes/cargoRoutes");
const voyageRoutes = require("./routes/voyageRoutes");
const userRoutes = require("./routes/userRoutes");
const agentRoutes = require("./routes/agentRoutes");
const financeRoutes = require("./routes/financeRoutes");

// --- Mount Routes ---
app.use("/api/invoices", invoiceRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/cargo", cargoRoutes);
app.use("/api/voyages", voyageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/finance", financeRoutes);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("Maritime Operations API Running");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));