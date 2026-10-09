function CrudModal({
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
  saving = false,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="crud-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="crud-modal-header">
          <div>
            <h2>{title}</h2>
            <p>Enter the required information below.</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="crud-modal-body">
            {children}
          </div>

          <div className="crud-modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrudModal;