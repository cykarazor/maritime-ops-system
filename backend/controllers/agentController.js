const Agent = require("../models/Agent");
const { successResponse, errorResponse } = require("../utils/apiResponse");

//testing tracking

// =========================
// CREATE AGENT
// =========================
const createAgent = async (req, res) => {
  try {
    const agent = new Agent(req.body);
    const saved = await agent.save();

    return successResponse(res, saved, "Agent created successfully", 201);
  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// GET ALL AGENTS
// =========================
const getAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const agents = await Agent.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .sort({ createdAt: -1 });

    const total = await Agent.countDocuments(query);

    return successResponse(res, {
      agents: agents || [],
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
    }, "Agents fetched successfully");

  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// GET SINGLE AGENT
// =========================
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      isActive: true, // ✅ FIXED
    });

    if (!agent) {
      return errorResponse(res, "Agent not found", 404);
    }

    return successResponse(res, agent, "Agent fetched successfully");
  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// UPDATE AGENT
// =========================
const updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findOneAndUpdate(
      { _id: req.params.id, isActive: true }, // ✅ FIXED
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return errorResponse(res, "Agent not found", 404);
    }

    return successResponse(res, updated, "Agent updated successfully");
  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 400);
  }
};

// =========================
// DELETE AGENT (SOFT DELETE)
// =========================
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent || !agent.isActive) {
      return errorResponse(res, "Agent not found", 404);
    }

    agent.isActive = false;
    agent.deletedAt = new Date();

    await agent.save();

    return successResponse(res, agent, "Agent deactivated successfully");
  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 500);
  }
};

// =========================
// RESTORE AGENT
// =========================
const restoreAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent || agent.isActive) {
      return errorResponse(res, "Agent not found or already active", 404);
    }

    agent.isActive = true;
    agent.deletedAt = null;

    await agent.save();

    return successResponse(res, agent, "Agent restored successfully");
  } catch (err) {
    console.error("AgentControllerError:", err);
    return errorResponse(res, err.message, 500);
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