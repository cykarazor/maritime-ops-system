import React from "react";

const AgentTable = ({ agents, onEdit, onDelete, onRestore }) => {
  const safeAgents = Array.isArray(agents) ? agents : [];

  return (
    <div
      // ✅ NEW: standardized container
      className="table-container"
    >
      <table
        
        // ✅ NEW STANDARD CLASS
        className="data-table"
      >
        <thead>
          <tr>
            <th>Company</th>
            <th>Assigned Island</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {safeAgents.length === 0 ? (
            <tr>
              <td colSpan="8">No agents found</td>
            </tr>
          ) : (
            safeAgents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent.companyName || "-"}</td>
                <td>{agent.assignedIsland || "-"}</td>
                <td>{agent.contactPerson || "-"}</td>
                <td>{agent.email || "-"}</td>
                <td>{agent.phone || "-"}</td>

                <td
                  
                >
                  {/* ✅ SAME LOGIC, CLEANER STRUCTURE */}
                  {agent.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>

                <td>{agent.notes || "-"}</td>

                {/* ACTIONS */}
                <td
                  
                  // ✅ NEW STANDARD CLASS
                  className="actions"
                >
                  {/* ✅ NEW STANDARD BUTTON */}
                  <button
                    className="btn btn-edit"
                    onClick={() => onEdit(agent)}
                  >
                    Edit
                  </button>

                  {agent.isActive ? (
                    <>
                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(agent._id)}
                      >
                        Deactivate
                      </button>
                    </>
                  ) : (
                    <>
                      
                      {/* ✅ NEW STANDARD BUTTON */}
                      <button
                        className="btn btn-success"
                        onClick={() => onRestore(agent._id)}
                      >
                        Restore
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;