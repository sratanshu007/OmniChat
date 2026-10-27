import React, { useState } from 'react';
import { Search, Plus, MessageSquarePlus, UserPlus, QrCode, CreditCard, ShieldCheck } from 'lucide-react';

export default function Header({
  activeTab,
  onOpenQrScanner,
  onOpenWallet,
  onOpenNewChat,
  onOpenAdmin,
  isAdmin
}) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'chats': return 'OmniChat (微信)';
      case 'contacts': return 'Contacts (通讯录)';
      case 'discover': return 'Discover (发现)';
      case 'me': return 'Me (我)';
      default: return 'OmniChat';
    }
  };

  return (
    <header className="wechat-header">
      <div className="wechat-header-title">
        {getTitle()}
      </div>

      <div className="wechat-header-actions">
        {isAdmin && (
          <button
            className="header-icon-btn"
            title="Admin Console"
            onClick={onOpenAdmin}
            style={{ color: '#07c160' }}
          >
            <ShieldCheck size={20} />
          </button>
        )}

        <button
          className="header-icon-btn"
          title="Search"
          onClick={() => {
            const input = document.getElementById('search-chats-input');
            if (input) input.focus();
          }}
        >
          <Search size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            title="Plus Menu"
            onClick={() => setShowPlusMenu(!showPlusMenu)}
          >
            <Plus size={22} />
          </button>

          {showPlusMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                onClick={() => setShowPlusMenu(false)}
              />
              <div className="plus-dropdown-menu">
                <div
                  className="plus-dropdown-item"
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenNewChat();
                  }}
                >
                  <MessageSquarePlus size={18} />
                  <span>New Chat</span>
                </div>
                <div
                  className="plus-dropdown-item"
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenQrScanner('scan');
                  }}
                >
                  <UserPlus size={18} />
                  <span>Add Contacts</span>
                </div>
                <div
                  className="plus-dropdown-item"
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenQrScanner('scan');
                  }}
                >
                  <QrCode size={18} />
                  <span>Scan QR Code</span>
                </div>
                <div
                  className="plus-dropdown-item"
                  onClick={() => {
                    setShowPlusMenu(false);
                    onOpenWallet();
                  }}
                >
                  <CreditCard size={18} />
                  <span>Money (收付款)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
