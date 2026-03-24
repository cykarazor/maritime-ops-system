const Agent = require("../models/Agent");

// 🔹 CREATE Agent (duplicate protection like Customers)
const createAgent = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (companyName) {
      const existing = await Agent.findOne({
        companyName: { $regex: `^${companyName}$`, $options: "i" },
      });

      if (existing) {
        return res.status(400).json({ error: "Agent company already exists" });
      }
    }

    const agent = new Agent(req.body);
    const saved = await agent.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 GET ALL Agents (MATCH CUSTOMERS — NO FILTERING)
const getAgents = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;

    const query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { assignedIsland: { $regex: search, $options: "i" } },
      ];
    }

    // 🔘 Active filter (OPTIONAL — same as Customers)
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const agents = await Agent.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Agent.countDocuments(query);

    res.json({
      data: agents,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET SINGLE
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 UPDATE
const updateAgent = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (companyName) {
      const existing = await Agent.findOne({
        companyName: { $regex: `^${companyName}$`, $options: "i" },
        _id: { $ne: req.params.id },
      });

      if (existing) {
        return res.status(400).json({ error: "Agent company already exists" });
      }
    }

    const updated = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 🔹 SOFT DELETE (Deactivate)
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    agent.isActive = false;
    await agent.save();

    res.json({ message: "Agent deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 RESTORE (Activate) — MATCH CUSTOMERS ROUTE STYLE
const restoreAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    agent.isActive = true;
    await agent.save();

    res.json({ message: "Agent restored successfully", agent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  restoreAgent,
};