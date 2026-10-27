import React from 'react';
import { MessageSquare, Users, Compass, User } from 'lucide-react';

export default function TabBar({ activeTab, setActiveTab, unreadMessages, hasMomentUpdates }) {
  return (
    <nav className="wechat-tab-bar">
      {/* 1. Chats Tab */}
      <div
        className={`tab-item ${activeTab === 'chats' ? 'active' : ''}`}
        onClick={() => setActiveTab('chats')}
      >
        <MessageSquare size={24} strokeWidth={activeTab === 'chats' ? 2.5 : 1.8} />
        {unreadMessages > 0 && <span className="tab-badge">{unreadMessages}</span>}
        <span>Chats</span>
      </div>

      {/* 2. Contacts Tab */}
      <div
        className={`tab-item ${activeTab === 'contacts' ? 'active' : ''}`}
        onClick={() => setActiveTab('contacts')}
      >
        <Users size={24} strokeWidth={activeTab === 'contacts' ? 2.5 : 1.8} />
        <span>Contacts</span>
      </div>

      {/* 3. Discover Tab */}
      <div
        className={`tab-item ${activeTab === 'discover' ? 'active' : ''}`}
        onClick={() => setActiveTab('discover')}
      >
        <Compass size={24} strokeWidth={activeTab === 'discover' ? 2.5 : 1.8} />
        {hasMomentUpdates && <span className="tab-dot" />}
        <span>Discover</span>
      </div>

      {/* 4. Me Tab */}
      <div
        className={`tab-item ${activeTab === 'me' ? 'active' : ''}`}
        onClick={() => setActiveTab('me')}
      >
        <User size={24} strokeWidth={activeTab === 'me' ? 2.5 : 1.8} />
        <span>Me</span>
      </div>
    </nav>
  );
}
