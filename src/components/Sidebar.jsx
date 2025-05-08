import React from 'react';

export default function Sidebar({ showSidebar, conversations, fetchConversationDetail, truncate, handleOpenDeleteModal, handleNewConversation }) {
  return (
    <aside className={`chat-sidebar ${showSidebar ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Conversations</h3>
      </div>
      <ul className="conversation-list">
        {conversations.slice().reverse().map(conv => (
          <li
            key={conv.ConversationId}
            title={conv.lastMessage}
            className="conversation-list-item"
          >
            <span
              className="conversation-title"
              onClick={() => fetchConversationDetail(conv.ConversationId)}
            >
              {truncate(conv.lastMessage)}
            </span>
            <button
              className="delete-conversation-btn"
              title="Delete conversation"
              onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="btn btn-outline" onClick={handleNewConversation}>
          New Conversation
        </button>
      </div>
    </aside>
  );
}
