import React, { useRef } from 'react';
import './DocumentModal.css';

export default function DocumentModal({ onClose, onFilesSelected }) {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (onFilesSelected) onFilesSelected(files);
  };

  const openFileExplorer = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  return (
    <div className="document-modal-overlay">
      <div className="document-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Include Documents to the prompt</h2>
        <div className="dropzone" onClick={openFileExplorer}>
          <p>drop your files here</p>
        </div>
        <button className="btn btn-primary" onClick={openFileExplorer}>Open File explorer</button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
}