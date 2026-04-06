import React from "react";

const Table = ({
  columns = [],
  data = [],
  actions = {},
  emptyMessage = "No data found",
}) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1}>{emptyMessage}</td>
            </tr>
          ) : (
            safeData.map((row) => (
              <tr key={row._id}>
                {columns.map((col, index) => (
                  <td key={index}>
                    {col.render
                      ? col.render(row)
                      : row[col.accessor] ?? "-"}
                  </td>
                ))}

                {/* ACTIONS CELL */}
                {actions && (
                  <td className="actions">

                    {/* EDIT */}
                    {actions.onEdit &&
                      (!actions.showEdit || actions.showEdit(row)) && (
                        <button
                          className="btn btn-edit"
                          onClick={() => actions.onEdit(row)}
                        >
                          Edit
                        </button>
                      )}

                    {/* DELETE */}
                    {actions.onDelete &&
                      (!actions.showDelete || actions.showDelete(row)) && (
                        <button
                          className="btn btn-danger"
                          onClick={() => actions.onDelete(row._id)}
                        >
                          Delete
                        </button>
                      )}

                      {/* RESTORE */}
                      {actions.onRestore &&
                        (!actions.showRestore || actions.showRestore(row)) && (
                          <button
                            className="btn btn-success"
                            onClick={() => actions.onRestore(row._id)}
                          >
                            Restore
                          </button>
                        )}

                    </td>
                  )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;