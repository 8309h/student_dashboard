export default function Pagination({ page, totalPages, setPage }) {
      return (
            <div className="d-flex justify-content-center mt-3">
                  <button
                        className="btn btn-secondary me-2"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                  >
                        Prev
                  </button>

                  <span className="align-self-center">
                        Page {page} of {totalPages}
                  </span>

                  <button
                        className="btn btn-secondary ms-2"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                  >
                        Next
                  </button>
            </div>
      )
}