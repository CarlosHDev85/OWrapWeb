import React from 'react';
import './AuthModal.css';

export default function AssistantsModal({ onClose }) {
  // placeholder assistants list
  const myAssistants = ['Assistant 1', 'Assistant 2'];
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Assistants</h2>
        <div className="assistants-section">
          <h3>Create Assistant</h3>
          <button className="btn btn-primary">Create New Assistant</button>
        </div>
        <div className="assistants-section" style={{ marginTop: '1em' }}>
          <h3>My Assistants</h3>
          <ul>
            {myAssistants.map((assistant, idx) => (
              <li key={idx}>{assistant}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}