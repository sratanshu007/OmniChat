import React, { useState } from 'react';
import { Search, Pin, VolumeX, ShieldAlert, Award } from 'lucide-react';

export default function ChatList({ chats, onSelectChat, currentUserId }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => {
    const name = chat.type === 'direct'
      ? (chat.targetUser?.name || '')
      : (chat.groupName || '');
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Search Bar */}
      <div style={{ padding: '8px 12px', background: 'var(--wechat-bg)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--wechat-card-bg)',
          borderRadius: '8px',
          padding: '7px 12px',
          border: '1px solid var(--wechat-border)'
        }}>
          <Search size={16} color="var(--wechat-text-muted)" />
          <input
            id="search-chats-input"
            type="text"
            placeholder="Search contacts, groups & messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13.5px',
              color: 'var(--wechat-text-primary)',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Chat List Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--wechat-text-muted)', fontSize: '14px' }}>
            No chats found matching "{searchQuery}"
          </div>
        ) : (
          filteredChats.map(chat => {
            const isDirect = chat.type === 'direct';
            const isOfficial = chat.type === 'official';
            const title = isDirect
              ? (chat.targetUser?.name || 'Contact')
              : isOfficial
              ? (chat.targetUser?.name || 'Official Account')
              : (chat.groupName || 'Group Chat');

            const avatar = isDirect
              ? (chat.targetUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100')
              : isOfficial
              ? (chat.targetUser?.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100')
              : (chat.groupAvatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100');

            const isOnline = isDirect && chat.targetUser?.status === 'online';

            return (
              <div
                key={chat.id}
                className={`chat-list-item ${chat.isPinned ? 'pinned' : ''}`}
                onClick={() => onSelectChat(chat)}
              >
                {/* Avatar with optional unread indicator badge */}
                <div className="chat-avatar-container">
                  <img src={avatar} alt={title} className="chat-avatar-img" />
                  {isOnline && <span className="online-status-dot" />}
                  {chat.unreadCount > 0 && (
                    <span className="tab-badge" style={{ top: -4, right: -4 }}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="chat-info-content">
                  <div className="chat-info-header">
                    <span className="chat-title" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {title}
                      {isOfficial && <Award size={14} color="#0284c7" />}
                    </span>
                    <span className="chat-timestamp">{chat.lastTime || '12:00'}</span>
                  </div>

                  <div className="chat-subtitle">
                    <span style={{
                      color: chat.lastMessage?.includes('🧧') ? '#e04a3f' : 'inherit',
                      fontWeight: chat.lastMessage?.includes('🧧') ? 600 : 'normal'
                    }}>
                      {chat.lastMessage || 'Start conversation...'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {chat.isMuted && <VolumeX size={14} color="var(--wechat-text-muted)" />}
                      {chat.isPinned && <Pin size={13} color="var(--wechat-text-muted)" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
