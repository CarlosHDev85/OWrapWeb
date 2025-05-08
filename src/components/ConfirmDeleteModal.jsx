import React from 'react';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, conversation }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal confirm-delete-modal">
        <h3>Delete Conversation</h3>
        <p>Are you sure you want to delete this conversation?</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={() => onConfirm(conversation)}>Delete</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
