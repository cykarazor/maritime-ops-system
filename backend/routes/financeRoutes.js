const express = require("express");
const router = express.Router();

const { getAPDashboard } = require("../controllers/financeController");

router.get("/ap-dashboard", getAPDashboard);

module.exports = router;