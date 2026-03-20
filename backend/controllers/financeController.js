const Invoice = require("../models/Invoice");
const Supplier = require("../models/Supplier");

// 🔹 GLOBAL AP DASHBOARD
const getAPDashboard = async (req, res) => {
  try {
    const invoices = await Invoice.find({ type: "AP" }).populate("supplier");

    const today = new Date();

    let totalAP = 0;
    let overdueCount = 0;

    const aging = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };

    const supplierMap = {};

    invoices.forEach((inv) => {
      const amount = inv.amount || 0;
      totalAP += amount;

      // Supplier aggregation
      const supplierId = inv.supplier?._id?.toString();

      if (supplierId) {
        if (!supplierMap[supplierId]) {
          supplierMap[supplierId] = {
            supplierId,
            supplierName: inv.supplier.name,
            total: 0,
          };
        }

        supplierMap[supplierId].total += amount;
      }

      // Overdue logic
      const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;

      let daysOverdue = 0;

      if (dueDate) {
        daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      } else {
        daysOverdue = 999;
      }

      if (daysOverdue > 0) overdueCount++;

      // Aging buckets
      if (daysOverdue <= 30) aging["0-30"] += amount;
      else if (daysOverdue <= 60) aging["31-60"] += amount;
      else if (daysOverdue <= 90) aging["61-90"] += amount;
      else aging["90+"] += amount;
    });

    // Top suppliers
    const topSuppliers = Object.values(supplierMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    res.json({
      totalAP,
      totalInvoices: invoices.length,
      overdueCount,
      aging,
      topSuppliers,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAPDashboard,
};