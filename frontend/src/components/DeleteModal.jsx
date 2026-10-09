function DeleteModal({
  itemName,
  onCancel,
  onConfirm,
  deleting = false,
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="delete-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-icon">
          !
        </div>

        <h2>Delete Record?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{itemName}</strong>?
        </p>

        <p className="delete-warning">
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;