import React from 'react';

export default function Sidebar({ showSidebar, conversations, fetchConversationDetail, truncate, handleOpenDeleteModal, handleNewConversation }) {
  const now = Date.now();
  const convs = conversations || [];
  const today = new Date(now);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastHourConvs = convs.filter(c => now - Number(c.lastUpdated) <= 3600000);
  const todayConvs = convs.filter(c => {
    const updated = Number(c.lastUpdated);
    const d = new Date(updated);
    return updated < now - 3600000 && d >= todayStart;
  });
  const weekConvs = convs.filter(c => {
    const d = new Date(Number(c.lastUpdated));
    return d < todayStart && d >= weekStart;
  });
  const monthConvs = convs.filter(c => {
    const d = new Date(Number(c.lastUpdated));
    return d < weekStart && d >= monthStart;
  });
  const allTimeConvs = convs.filter(c => new Date(Number(c.lastUpdated)) < monthStart);

  return (
    <aside className={`chat-sidebar ${showSidebar ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>Conversations</h3>
      </div>
      <ul className="conversation-list">
        {/* Last Hour */}
        {lastHourConvs.length > 0 && (
          <li className="separator">
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid black', margin: 0 }} />
              <span style={{ position: 'absolute', top: '-0.6em', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '0 4px', color: 'grey', fontSize: '0.85em' }}>Last Hour</span>
            </div>
          </li>
        )}
        {lastHourConvs.map(conv => (
          <li key={conv.ConversationId} title={conv.lastMessage} className="conversation-list-item">
            <span className="conversation-title" onClick={() => fetchConversationDetail(conv.ConversationId)}>
              {truncate(conv.lastMessage)}
            </span>
            <button className="delete-conversation-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}>×</button>
          </li>
        ))}
        {/* Today */}
        {todayConvs.length > 0 && (
          <li className="separator">
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid black', margin: 0 }} />
              <span style={{ position: 'absolute', top: '-0.6em', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '0 4px', color: 'grey', fontSize: '0.85em' }}>Today</span>
            </div>
          </li>
        )}
        {todayConvs.map(conv => (
          <li key={conv.ConversationId} title={conv.lastMessage} className="conversation-list-item">
            <span className="conversation-title" onClick={() => fetchConversationDetail(conv.ConversationId)}>
              {truncate(conv.lastMessage)}
            </span>
            <button className="delete-conversation-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}>×</button>
          </li>
        ))}
        {/* This Week */}
        {weekConvs.length > 0 && (
          <li className="separator">
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid black', margin: 0 }} />
              <span style={{ position: 'absolute', top: '-0.6em', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '0 4px', color: 'grey', fontSize: '0.85em' }}>This Week</span>
            </div>
          </li>
        )}
        {weekConvs.map(conv => (
          <li key={conv.ConversationId} title={conv.lastMessage} className="conversation-list-item">
            <span className="conversation-title" onClick={() => fetchConversationDetail(conv.ConversationId)}>
              {truncate(conv.lastMessage)}
            </span>
            <button className="delete-conversation-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}>×</button>
          </li>
        ))}
        {/* This Month */}
        {monthConvs.length > 0 && (
          <li className="separator">
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid black', margin: 0 }} />
              <span style={{ position: 'absolute', top: '-0.6em', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '0 4px', color: 'grey', fontSize: '0.85em' }}>This Month</span>
            </div>
          </li>
        )}
        {monthConvs.map(conv => (
          <li key={conv.ConversationId} title={conv.lastMessage} className="conversation-list-item">
            <span className="conversation-title" onClick={() => fetchConversationDetail(conv.ConversationId)}>
              {truncate(conv.lastMessage)}
            </span>
            <button className="delete-conversation-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}>×</button>
          </li>
        ))}
        {/* All Time */}
        {allTimeConvs.length > 0 && (
          <li className="separator">
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid black', margin: 0 }} />
              <span style={{ position: 'absolute', top: '-0.6em', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '0 4px', color: 'grey', fontSize: '0.85em' }}>All Time</span>
            </div>
          </li>
        )}
        {allTimeConvs.map(conv => (
          <li key={conv.ConversationId} title={conv.lastMessage} className="conversation-list-item">
            <span className="conversation-title" onClick={() => fetchConversationDetail(conv.ConversationId)}>
              {truncate(conv.lastMessage)}
            </span>
            <button className="delete-conversation-btn" title="Delete conversation" onClick={e => { e.stopPropagation(); handleOpenDeleteModal(conv); }}>×</button>
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
