import React from 'react';

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
                    {model.name}
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
