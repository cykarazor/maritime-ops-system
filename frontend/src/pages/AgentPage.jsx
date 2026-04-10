import React, { useState } from "react";
import Layout from "../components/Layout";
import AgentsTable from "../components/AgentTable";
import AgentForm from "../components/AgentForm";
import Pagination from "../components/Pagination";

import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  restoreAgent
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const AgentsPage = () => {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: agents, pages, loading, error } =
    usePaginatedFetch(getAgents, {
      page,
      limit,
      refreshTrigger
    });

  const handleCreate = async (data) => {
    await createAgent(data);
    setRefreshTrigger((p) => p + 1);
    setShowForm(false);
  };

  const handleUpdate = async (id, data) => {
    await updateAgent(id, data);
    setRefreshTrigger((p) => p + 1);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate agent?")) return;
    await deleteAgent(id);
    setRefreshTrigger((p) => p + 1);
  };

  const handleRestore = async (id) => {
    await restoreAgent(id);
    setRefreshTrigger((p) => p + 1);
  };

  return (
    <Layout>
      <h1>Agents</h1>

      <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
        + Add Agent
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showForm && (
        <AgentForm
          onSubmit={
            editing
              ? (data) => handleUpdate(editing._id, data)
              : handleCreate
          }
          initialData={editing}
          onCancel={() => setShowForm(false)}
        />
      )}

      <AgentsTable
        agents={agents}
        onEdit={(item) => { setEditing(item); setShowForm(true); }}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </Layout>
  );
};

export default AgentsPage;