import React, { useState, useEffect } from 'react';
import './AuthModal.css'; // reuse modal styles

export default function ApiKeyModal({ onClose }) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [xaiKey, setXaiKey] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showXai, setShowXai] = useState(false);

  useEffect(() => {
    const savedOpenai = sessionStorage.getItem('openaiApiKey') || '';
    const savedXai = sessionStorage.getItem('xaiApiKey') || '';
    setOpenaiKey(savedOpenai);
    setXaiKey(savedXai);
  }, []);

  const handleSave = () => {
    sessionStorage.setItem('openaiApiKey', openaiKey.trim());
    sessionStorage.setItem('xaiApiKey', xaiKey.trim());
    onClose();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Set API Keys</h2>
        <div className="input-wrapper">
          <input
            type={showOpenai ? 'text' : 'password'}
            placeholder="OpenAI API Key"
            value={openaiKey}
            onChange={e => setOpenaiKey(e.target.value)}
          />
          <span className="toggle-visibility-icon" onClick={() => setShowOpenai(prev => !prev)}>
            {showOpenai ? '🙈' : '👁️'}
          </span>
        </div>
        <div className="input-wrapper">
          <input
            type={showXai ? 'text' : 'password'}
            placeholder="XAI API Key"
            value={xaiKey}
            onChange={e => setXaiKey(e.target.value)}
          />
          <span className="toggle-visibility-icon" onClick={() => setShowXai(prev => !prev)}>
            {showXai ? '🙈' : '👁️'}
          </span>
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}