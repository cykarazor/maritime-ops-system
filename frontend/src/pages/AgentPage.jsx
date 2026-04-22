import React, { useState } from "react";
import Layout from "../components/Layout";
import AgentsTable from "../components/AgentTable";
import AgentForm from "../components/AgentForm";
import ModalForm from "../components/ui/ModalForm";
import Pagination from "../components/Pagination";

import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  restoreAgent,
} from "../utils/api";

import { usePaginatedFetch } from "../hooks/usePaginatedFetch";

const AgentsPage = () => {
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // =========================
  // REFRESH TRIGGER
  // =========================
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // =========================
  // FETCH AGENTS
  // =========================
  const {
    data: agents,
    pages,
    loading,
    error,
  } = usePaginatedFetch(getAgents, {
    page,
    limit,
    refreshTrigger,
  });

  // =========================
  // OPEN CREATE
  // =========================
  const handleCreateClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // =========================
  // OPEN EDIT
  // =========================
  const handleEditClick = (agent) => {
    setEditing(agent);
    setModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  // =========================
  // CREATE
  // =========================
  const handleCreate = async (data) => {
    try {
      await createAgent(data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error("CREATE AGENT FAILED:", error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async (data) => {
    try {
      await updateAgent(editing._id, data);
      setRefreshTrigger((prev) => prev + 1);
      closeModal();
    } catch (error) {
      console.error("UPDATE AGENT FAILED:", error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Deactivate this agent?")) return;

      await deleteAgent(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("DELETE AGENT FAILED:", error);
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
      console.error("RESTORE AGENT FAILED:", error);
    }
  };

  return (
    <Layout>
      <h1>Agents</h1>

      {/* ADD BUTTON */}
      <button
        className="btn btn-primary"
        onClick={handleCreateClick}
      >
        + Add Agent
      </button>

      {/* LOADING / ERROR */}
      {loading && <p>Loading agents...</p>}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {/* TABLE */}
      <AgentsTable
        agents={agents}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        pages={pages}
        onPageChange={setPage}
      />

      {/* MODAL */}
      <ModalForm
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editing
            ? "Edit Agent"
            : "Create Agent"
        }
        onSubmit={() => {}}
        submitText={
          editing
            ? "Update Agent"
            : "Save Agent"
        }
        size="lg"
      >
        <AgentForm
          initialData={editing}
          onSubmit={
            editing
              ? handleUpdate
              : handleCreate
          }
          onCancel={closeModal}
        />
      </ModalForm>
    </Layout>
  );
};

export default AgentsPage;