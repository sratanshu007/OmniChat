import React, { useState } from 'react';
import { UserPlus, Users, Tag, Award, Search, Phone, Video, MessageSquare, QrCode } from 'lucide-react';

export default function ContactsView({
  contacts,
  friendRequests,
  onSelectContact,
  onOpenQrScanner,
  onInitiateCall,
  onOpenOfficialAccounts
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactModal, setSelectedContactModal] = useState(null);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.wechatId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Search Header */}
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
            type="text"
            placeholder="Search contacts"
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

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top 4 WeChat System Rows */}
        <div style={{ background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
          <div
            className="chat-list-item"
            onClick={() => onOpenQrScanner('scan')}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#fa9d3b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <UserPlus size={20} color="#ffffff" />
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>New Friends (新的朋友)</div>
            {friendRequests?.length > 0 && (
              <span className="tab-badge" style={{ position: 'static' }}>
                {friendRequests.length}
              </span>
            )}
          </div>

          <div
            className="chat-list-item"
            onClick={() => alert("Group Chats list: 2 active group conversations available in Chats tab!")}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#07c160',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Users size={20} color="#ffffff" />
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>Group Chats (群聊)</div>
          </div>

          <div
            className="chat-list-item"
            onClick={() => onOpenOfficialAccounts()}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#2b82ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Award size={20} color="#ffffff" />
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>Official Accounts (公众号)</div>
          </div>
        </div>

        {/* Section divider */}
        <div style={{
          padding: '6px 16px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--wechat-text-muted)',
          background: 'var(--wechat-bg)'
        }}>
          ALL CONTACTS ({filtered.length})
        </div>

        {/* Contact Items */}
        <div style={{ background: 'var(--wechat-card-bg)' }}>
          {filtered.map(contact => (
            <div
              key={contact.id}
              className="chat-list-item"
              onClick={() => setSelectedContactModal(contact)}
            >
              <div className="chat-avatar-container" style={{ width: 42, height: 42 }}>
                <img src={contact.avatar} alt={contact.name} className="chat-avatar-img" />
                {contact.status === 'online' && <span className="online-status-dot" />}
              </div>

              <div className="chat-info-content">
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--wechat-text-primary)' }}>
                  {contact.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', marginTop: 2 }}>
                  WeChat ID: {contact.wechatId}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Contact Profile Modal Sheet */}
      {selectedContactModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--wechat-bg)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            animation: 'scaleFadeIn 0.2s ease'
          }}
        >
          {/* Header */}
          <div className="wechat-header" style={{ justifyContent: 'flex-start', gap: 12 }}>
            <button className="header-icon-btn" onClick={() => setSelectedContactModal(null)}>
              ← Back
            </button>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Profile Details</div>
          </div>

          <div style={{ padding: '24px 20px', flex: 1, overflowY: 'auto' }}>
            {/* User Card */}
            <div style={{
              background: 'var(--wechat-card-bg)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid var(--wechat-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <img
                src={selectedContactModal.avatar}
                alt=""
                style={{ width: 68, height: 68, borderRadius: 10, objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--wechat-text-primary)' }}>
                  {selectedContactModal.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--wechat-text-secondary)', marginTop: 3 }}>
                  WeChat ID: {selectedContactModal.wechatId}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--wechat-text-muted)', marginTop: 2 }}>
                  📍 {selectedContactModal.region || 'Shenzhen, China'}
                </div>
              </div>
            </div>

            {/* Bio info */}
            <div style={{
              background: 'var(--wechat-card-bg)',
              borderRadius: 12,
              padding: '14px 16px',
              marginTop: 14,
              border: '1px solid var(--wechat-border)',
              fontSize: '13.5px',
              color: 'var(--wechat-text-secondary)'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--wechat-text-primary)' }}>What's Up: </span>
              {selectedContactModal.bio || "No status set"}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => {
                  onSelectContact(selectedContactModal);
                  setSelectedContactModal(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#07c160',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(7, 193, 96, 0.3)'
                }}
              >
                <MessageSquare size={18} />
                Send Messages
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    onInitiateCall(selectedContactModal, 'voice');
                    setSelectedContactModal(null);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'var(--wechat-card-bg)',
                    border: '1px solid var(--wechat-border)',
                    borderRadius: 12,
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--wechat-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={17} color="#07c160" />
                  Voice Call
                </button>

                <button
                  onClick={() => {
                    onInitiateCall(selectedContactModal, 'video');
                    setSelectedContactModal(null);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'var(--wechat-card-bg)',
                    border: '1px solid var(--wechat-border)',
                    borderRadius: 12,
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--wechat-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Video size={17} color="#07c160" />
                  Video Call
                </button>
              </div>

              <button
                onClick={() => {
                  onOpenQrScanner('my-qr');
                  setSelectedContactModal(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: '1px solid var(--wechat-border)',
                  borderRadius: 12,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--wechat-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <QrCode size={16} />
                Personal QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
