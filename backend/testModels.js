const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Supplier = require("./models/Supplier");
const Invoice = require("./models/Invoice");
const Voyage = require("./models/Voyage");
const Cargo = require("./models/Cargo");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected for model testing");

    // Create test User
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "1234"
    });
    console.log("Test User created:", testUser);

    // Create test Supplier
    const testSupplier = await Supplier.create({
      name: "Test Supplier",
      country: "Trinidad"
    });
    console.log("Test Supplier created:", testSupplier);

    // Create test Invoice linked to Supplier
    const testInvoice = await Invoice.create({
      supplier: testSupplier._id,
      invoiceNumber: "INV001",
      invoiceDate: new Date(),
      dueDate: new Date(),
      amount: 1000
    });
    console.log("Test Invoice created:", testInvoice);

    // Create test Voyage
    const testVoyage = await Voyage.create({
      vesselName: "Test Vessel",
      voyageNumber: "V001",
      loadPort: "Port of Spain",
      dischargePort: "Kingston",
      etd: new Date(),
      eta: new Date()
    });
    console.log("Test Voyage created:", testVoyage);

    // Create test Cargo linked to Voyage
    const testCargo = await Cargo.create({
      voyage: testVoyage._id,
      cargoType: "Cement",
      quantity: 100,
      rate: 50
    });
    console.log("Test Cargo created:", testCargo);

    // Close connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed after test");
  })
  .catch(err => console.error(err));