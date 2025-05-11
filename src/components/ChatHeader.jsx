import React from 'react';
import { LuBrainCircuit } from "react-icons/lu";

export default function ChatHeader({
  modelDropdownOpen,
  modelRef,
  modelsList,
  selectedModel,
  handleToggleSidebar,
  handleToggleModelDropdown,
  handleSelectModel,
  userEmail,
  profileDropdownOpen,
  profileRef,
  handleToggleProfile,
  handleOpenApiKeyModal,
  handleOpenAuthModal
}) {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button className="sidebar-toggle" onClick={handleToggleSidebar}>☰</button>
        <div className="header-title-container">
          <h2>OWrapWeb</h2>
          <div className="model-dropdown-container" ref={modelRef}>
            <button className="btn btn-secondary model-dropdown-button" onClick={handleToggleModelDropdown}>
              Model: {modelsList.find(m => m.id === selectedModel)?.name || 'Select Model'} ▼
            </button>
            {modelDropdownOpen && (
              <ul className="model-dropdown">
                {modelsList.map(model => (
                  <li key={model.id} onClick={() => handleSelectModel(model.id)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {model.name}
                      {model.reasoning && (
                        <LuBrainCircuit size={16} color="purple" style={{ marginLeft: 4 }} />
                      )}
                    </div>
                    {(model.inputPrice || model.outputPrice) && (
                      <div style={{ fontSize: '0.8em', color: '#888' }}>
                        {model.inputPrice && (
                          <span>↓ ${(+model.inputPrice / 10000).toFixed(2)} / 1M&nbsp;</span>
                        )}
                        {model.outputPrice && (
                          <span>↑ ${(+model.outputPrice / 10000).toFixed(2)} / 1M</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="profile-container" ref={profileRef}>
        <button className="btn btn-secondary profile-button" onClick={handleToggleProfile}>
          {userEmail ? userEmail.slice(0, 2).toUpperCase() : <span role="img" aria-label="profile">👤</span>}
        </button>
        {profileDropdownOpen && (
          <ul className="profile-dropdown">
            <li onClick={handleOpenApiKeyModal}>Set API Keys</li>
            {userEmail ? (
              <li>Logged in as {userEmail}</li>
            ) : (
              <li onClick={handleOpenAuthModal}>Sign In / Sign Up</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
