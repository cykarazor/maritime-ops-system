import React from "react";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const visiblePages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(pages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="pagination">
      {/* Prev */}
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>

      {/* First + dots */}
      {page > 3 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          <span className="dots">...</span>
        </>
      )}

      {/* Middle Pages */}
      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={p === page ? "active" : ""}
        >
          {p}
        </button>
      ))}

      {/* Last + dots */}
      {page < pages - 2 && (
        <>
          <span className="dots">...</span>
          <button onClick={() => onPageChange(pages)}>{pages}</button>
        </>
      )}

      {/* Next */}
      <button disabled={page === pages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;