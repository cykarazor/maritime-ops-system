import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AgentTable from "../components/AgentTable";
import AgentForm from "../components/AgentForm";
import Pagination from "../components/Pagination";

import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  restoreAgent
} from "../utils/api";

const AgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);

  // ✅ STANDARDIZED UI STATE
  const [showForm, setShowForm] = useState(false);

  // =========================
  // PAGINATION STATE
  // =========================
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH AGENTS
  // =========================
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgents({ page, limit });

        setAgents(response.data || []);
        setPages(response.pages || 1);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, [page, limit, refreshTrigger]);

  // =========================
  // HANDLERS (STANDARDIZED)
  // =========================
  const handleCreateClick = () => {
    setEditingAgent(null);
    setShowForm(true);
  };

  const handleEditClick = (agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingAgent(null);
    setShowForm(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createAgent(data);
      setRefreshTrigger((prev) => prev + 1);
      setShowForm(false);
    } catch (error) {
      console.error("CREATE ERROR:", error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (id, data) => {
    try {
      await updateAgent(id, data);
      setEditingAgent(null);
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("UPDATE ERROR:", error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDeactivate = async (id) => {
    try {
      if (!window.confirm("Deactivate this agent?")) return;

      await deleteAgent(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // =========================
  // RESTORE
  // =========================
  const handleRestore = async (id) => {
    try {
      await restoreAgent(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("RESTORE ERROR:", error);
    }
  };

  return (
    <Layout>
      <h1>Agents</h1>

      {/* CREATE BUTTON */}
      <button className="btn btn-primary" onClick={handleCreateClick}>
        + Add Agent
      </button>

      {/* =========================
          FORM (CONTROLLED VISIBILITY)
      ========================= */}
      {showForm && (
        <AgentForm
          onSubmit={
            editingAgent
              ? (data) => handleUpdate(editingAgent._id, data)
              : handleCreate
          }
          initialData={editingAgent}
          onCancel={handleCancel}
        />
      )}

      {/* =========================
          TABLE
      ========================= */}
      <AgentTable
        agents={agents}
        onEdit={handleEditClick}
        onDelete={handleDeactivate}
        onRestore={handleRestore}
      />

      {/* =========================
          PAGINATION
      ========================= */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />
    </Layout>
  );
};

export default AgentPage;