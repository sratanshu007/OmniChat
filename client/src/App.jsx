import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import TabBar from './components/TabBar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ContactsView from './components/ContactsView';
import DiscoverView from './components/DiscoverView';
import MomentsFeed from './components/MomentsFeed';
import MiniProgramsHub from './components/MiniProgramsHub';
import WalletModal from './components/WalletModal';
import QrScannerModal from './components/QrScannerModal';
import CallOverlay from './components/CallOverlay';
import MeView from './components/MeView';
import ChannelsView from './components/ChannelsView';
import OfficialAccountsView from './components/OfficialAccountsView';
import AdminDashboard from './components/AdminDashboard';
import { sounds } from './utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  MessageSquare, Users, Compass, User, Monitor, Smartphone,
  Moon, Sun, ShieldCheck, QrCode, CreditCard, Sparkles
} from 'lucide-react';

const socket = io();

export default function App() {
  // Global App States
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [moments, setMoments] = useState([]);
  const [channels, setChannels] = useState([]);
  const [miniApps, setMiniApps] = useState([]);
  const [officialAccounts, setOfficialAccounts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'contacts' | 'discover' | 'me'
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  // Modals & Subscreens
  const [qrModalConfig, setQrModalConfig] = useState({ isOpen: false, tab: 'scan' });
  const [showWallet, setShowWallet] = useState(false);
  const [showMoments, setShowMoments] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [showMiniPrograms, setShowMiniPrograms] = useState(false);
  const [showOfficialAccounts, setShowOfficialAccounts] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [callData, setCallData] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [meRes, chatsRes, contactsRes, momentsRes, walletRes, miniRes, oaRes, chRes, metricsRes] = await Promise.all([
        fetch('/api/me').then(r => r.json()),
        fetch('/api/chats').then(r => r.json()),
        fetch('/api/contacts').then(r => r.json()),
        fetch('/api/moments').then(r => r.json()),
        fetch('/api/wallet').then(r => r.json()),
        fetch('/api/mini-apps').then(r => r.json()),
        fetch('/api/official-accounts').then(r => r.json()),
        fetch('/api/channels').then(r => r.json()),
        fetch('/api/admin/metrics').then(r => r.json())
      ]);

      if (meRes.user) setCurrentUser(meRes.user);
      if (chatsRes.chats) setChats(chatsRes.chats);
      if (contactsRes.contacts) setAllUsers(contactsRes.contacts);
      if (contactsRes.friendRequests) setFriendRequests(contactsRes.friendRequests);
      if (momentsRes.moments) setMoments(momentsRes.moments);
      if (walletRes.wallet) setWallet(walletRes.wallet);
      if (walletRes.transactions) setTransactions(walletRes.transactions);
      if (miniRes.miniApps) setMiniApps(miniRes.miniApps);
      if (oaRes.officialAccounts) setOfficialAccounts(oaRes.officialAccounts);
      if (chRes.channels) setChannels(chRes.channels);
      if (metricsRes.stats) setAdminMetrics(metricsRes);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  // Socket.IO Realtime Listeners
  useEffect(() => {
    if (!currentUser) return;

    socket.emit('join_user', currentUser.id);

    // Incoming messages
    socket.on('new_message', ({ chatId, message }) => {
      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chatId) {
            const exists = c.messages?.some(m => m.id === message.id);
            if (exists) return c;
            return {
              ...c,
              lastMessage: message.content || `[${message.type}]`,
              lastTime: message.timestamp,
              unreadCount: activeChat?.id === chatId ? 0 : (c.unreadCount || 0) + 1,
              messages: [...(c.messages || []), message]
            };
          }
          return c;
        })
      );

      // Also update currently open active chat
      setActiveChat(curr => {
        if (curr && curr.id === chatId) {
          const exists = curr.messages?.some(m => m.id === message.id);
          if (exists) return curr;
          return {
            ...curr,
            messages: [...(curr.messages || []), message]
          };
        }
        return curr;
      });

      if (message.senderId !== currentUser.id) {
        sounds.playMessage();
      }
    });

    // Incoming call signaling
    socket.on('incoming_call', (data) => {
      if (data.receiverId === currentUser.id) {
        setCallData({
          partner: data.caller,
          caller: data.caller,
          callType: data.callType,
          status: 'incoming'
        });
      }
    });

    socket.on('call_answered', () => {
      setCallData(prev => (prev ? { ...prev, status: 'active' } : null));
    });

    socket.on('call_rejected', () => {
      setCallData(null);
      sounds.stopRingtone();
    });

    socket.on('call_ended', () => {
      setCallData(null);
      sounds.stopRingtone();
    });

    // Red packet claimed
    socket.on('red_packet_claimed', ({ chatId, messageId, claimedBy, amount }) => {
      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: c.messages?.map(m =>
                m.id === messageId ? { ...m, isClaimed: true, claimedBy } : m
              )
            };
          }
          return c;
        })
      );
      setActiveChat(curr => {
        if (curr && curr.id === chatId) {
          return {
            ...curr,
            messages: curr.messages?.map(m =>
              m.id === messageId ? { ...m, isClaimed: true, claimedBy } : m
            )
          };
        }
        return curr;
      });
    });

    // Wallet balance updated
    socket.on('wallet_updated', ({ userId, wallet }) => {
      if (userId === currentUser.id) {
        setWallet(wallet);
      }
    });

    // Moments updated
    socket.on('new_moment', ({ moment }) => {
      setMoments(prev => [moment, ...prev]);
    });

    socket.on('moment_updated', ({ moment }) => {
      setMoments(prev => prev.map(m => (m.id === moment.id ? moment : m)));
    });

    return () => {
      socket.off('new_message');
      socket.off('incoming_call');
      socket.off('call_answered');
      socket.off('call_rejected');
      socket.off('call_ended');
      socket.off('red_packet_claimed');
      socket.off('wallet_updated');
      socket.off('new_moment');
      socket.off('moment_updated');
    };
  }, [currentUser, activeChat]);

  // Sync theme to root html
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Actions
  const handleSendMessage = async (msgPayload) => {
    if (!activeChat) return;
    try {
      const res = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload)
      }).then(r => r.json());

      if (res.message) {
        // Message will be handled via socket.io
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSendRedPacket = async ({ chatId, amount, greeting }) => {
    try {
      const res = await fetch('/api/redpacket/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, amount, greeting })
      }).then(r => r.json());

      if (res.balance !== undefined) {
        setWallet(prev => ({ ...prev, balance: res.balance }));
      }
    } catch (err) {
      console.error("Failed to send red packet:", err);
    }
  };

  const handleClaimRedPacket = async (messageId, chatId) => {
    try {
      const res = await fetch('/api/redpacket/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, chatId })
      }).then(r => r.json());

      if (res.newBalance !== undefined) {
        setWallet(prev => ({ ...prev, balance: res.newBalance }));
        fetchInitialData();
      }
    } catch (err) {
      console.error("Failed to claim red packet:", err);
    }
  };

  // Add friend via QR Code Scan (Highlighted User Requirement)
  const handleAddFriendByQr = async (qrString) => {
    try {
      const res = await fetch('/api/contacts/add-by-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrString })
      }).then(r => r.json());

      if (res.success) {
        // Refresh contacts and chats
        fetchInitialData();
        return res;
      }
    } catch (err) {
      console.error("QR Add Friend failed:", err);
    }
  };

  // Call Signaling
  const handleInitiateCall = (targetUser, callType) => {
    setCallData({
      partner: targetUser,
      caller: currentUser,
      callType,
      status: 'active'
    });
    socket.emit('initiate_call', {
      caller: currentUser,
      receiverId: targetUser.id,
      callType
    });
  };

  const handleAcceptCall = () => {
    setCallData(prev => ({ ...prev, status: 'active' }));
    socket.emit('answer_call', { callerId: callData?.caller?.id });
  };

  const handleDeclineCall = () => {
    setCallData(null);
    sounds.stopRingtone();
    socket.emit('reject_call', { callerId: callData?.caller?.id });
  };

  const handleEndCall = () => {
    setCallData(null);
    sounds.stopRingtone();
    socket.emit('end_call', { callerId: callData?.caller?.id });
  };

  // Switch Active User (Testing Peer-to-Peer Simulator)
  const handleSwitchUser = async (userId) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }).then(r => r.json());

      if (res.user) {
        setCurrentUser(res.user);
        setActiveChat(null);
        fetchInitialData();
        sounds.playMessage();
      }
    } catch (err) {
      console.error("Failed to switch user:", err);
    }
  };

  // Wallet Top-up
  const handleTopupWallet = async (amount) => {
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      }).then(r => r.json());

      if (res.balance !== undefined) {
        setWallet(prev => ({ ...prev, balance: res.balance }));
        fetchInitialData();
      }
    } catch (err) {
      console.error("Failed to top-up wallet:", err);
    }
  };

  // Moments actions
  const handlePostMoment = async (payload) => {
    try {
      const res = await fetch('/api/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.moment) {
        setMoments(prev => [res.moment, ...prev]);
        sounds.playMessage();
      }
    } catch (err) {
      console.error("Failed to post moment:", err);
    }
  };

  const handleLikeMoment = async (momentId) => {
    try {
      const res = await fetch(`/api/moments/${momentId}/like`, { method: 'POST' }).then(r => r.json());
      if (res.likes) {
        setMoments(prev => prev.map(m => m.id === momentId ? { ...m, likes: res.likes } : m));
      }
    } catch (err) {
      console.error("Failed to like moment:", err);
    }
  };

  const handleCommentMoment = async (momentId, text) => {
    try {
      const res = await fetch(`/api/moments/${momentId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }).then(r => r.json());

      if (res.moment) {
        setMoments(prev => prev.map(m => m.id === momentId ? res.moment : m));
      }
    } catch (err) {
      console.error("Failed to comment on moment:", err);
    }
  };

  // Admin Actions
  const handleToggleUserStatus = async (targetId) => {
    await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_user_status', targetId })
    });
    fetchInitialData();
  };

  const handleDeleteMoment = async (targetId) => {
    await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_moment', targetId })
    });
    fetchInitialData();
  };

  // Calculate unread badge count
  const totalUnreadMessages = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="app-viewport-wrapper">
      {/* Top Floating Utility Bar (Quick Toggles) */}
      <div className="floating-top-bar">
        <button
          onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
          title="Toggle Screen View"
        >
          {viewMode === 'mobile' ? <Monitor size={15} /> : <Smartphone size={15} />}
          <span>{viewMode === 'mobile' ? 'Desktop View' : 'Mobile Frame'}</span>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <button
          onClick={() => setQrModalConfig({ isOpen: true, tab: 'scan' })}
          className="active"
          title="Scan QR to Add Friend"
        >
          <QrCode size={15} />
          <span>Scan QR</span>
        </button>

        <button
          onClick={() => setShowWallet(true)}
          title="WeChat Pay Wallet"
        >
          <CreditCard size={15} />
          <span>Pay ¥{wallet?.balance?.toFixed(0) || '0'}</span>
        </button>

        <button
          onClick={() => setShowAdmin(true)}
          title="Admin Control"
          style={{ color: '#07c160' }}
        >
          <ShieldCheck size={15} />
          <span>Admin</span>
        </button>
      </div>

      {/* VIEW MODE 1: MOBILE IPHONE FRAME */}
      {viewMode === 'mobile' ? (
        <div className="mobile-frame">
          {/* Dynamic Island */}
          <div className="dynamic-island">
            <div className="camera-lens" />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', opacity: 0.8 }} />
          </div>

          <div className="phone-inner-screen">
            {/* Phone Status Bar */}
            <div className="phone-status-bar">
              <span>9:41</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: '11px' }}>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Active Chat Window OR Main Tabs */}
            {activeChat ? (
              <ChatWindow
                chat={activeChat}
                onBack={() => setActiveChat(null)}
                currentUserId={currentUser?.id}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onInitiateCall={handleInitiateCall}
                onClaimRedPacket={handleClaimRedPacket}
                onSendRedPacket={handleSendRedPacket}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Header */}
                <Header
                  activeTab={activeTab}
                  onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                  onOpenWallet={() => setShowWallet(true)}
                  onOpenNewChat={() => alert("Select a friend from Contacts tab to start a new chat!")}
                  onOpenAdmin={() => setShowAdmin(true)}
                  isAdmin={currentUser?.role === 'admin'}
                />

                {/* Tab Screens */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                  {activeTab === 'chats' && (
                    <ChatList
                      chats={chats}
                      onSelectChat={(chat) => {
                        setActiveChat(chat);
                        chat.unreadCount = 0;
                      }}
                      currentUserId={currentUser?.id}
                    />
                  )}

                  {activeTab === 'contacts' && (
                    <ContactsView
                      contacts={allUsers.filter(u => u.id !== currentUser?.id)}
                      friendRequests={friendRequests}
                      onSelectContact={(user) => {
                        let direct = chats.find(c => c.type === 'direct' && c.targetUser?.id === user.id);
                        if (!direct) {
                          direct = {
                            id: `chat-${Date.now()}`,
                            type: 'direct',
                            targetUser: user,
                            lastMessage: 'Say hello!',
                            lastTime: 'Now',
                            unreadCount: 0,
                            messages: []
                          };
                          setChats(prev => [direct, ...prev]);
                        }
                        setActiveChat(direct);
                      }}
                      onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                      onInitiateCall={handleInitiateCall}
                      onOpenOfficialAccounts={() => setShowOfficialAccounts(true)}
                    />
                  )}

                  {activeTab === 'discover' && (
                    <DiscoverView
                      onOpenMoments={() => setShowMoments(true)}
                      onOpenChannels={() => setShowChannels(true)}
                      onOpenMiniPrograms={() => setShowMiniPrograms(true)}
                      onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                      hasMomentUpdates={true}
                      latestMomentAvatar={moments[0]?.author?.avatar}
                    />
                  )}

                  {activeTab === 'me' && (
                    <MeView
                      currentUser={currentUser}
                      allUsers={[currentUser, ...allUsers]}
                      onOpenWallet={() => setShowWallet(true)}
                      onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                      onSwitchUser={handleSwitchUser}
                      viewMode={viewMode}
                      onToggleViewMode={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
                      theme={theme}
                      onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      onOpenAdmin={() => setShowAdmin(true)}
                    />
                  )}
                </div>

                {/* Tab Bar */}
                <TabBar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  unreadMessages={totalUnreadMessages}
                  hasMomentUpdates={true}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: DESKTOP WIDE SUPERAPP */
        <div className="desktop-frame">
          {/* Left Rail Sidebar */}
          <div style={{
            width: 70,
            background: '#1e1e1e',
            borderRight: '1px solid #2d2d2d',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <img
                src={currentUser?.avatar}
                alt=""
                style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', cursor: 'pointer', border: '2px solid #07c160' }}
                onClick={() => setActiveTab('me')}
                title={currentUser?.name}
              />

              <button
                onClick={() => setActiveTab('chats')}
                style={{
                  background: activeTab === 'chats' ? 'rgba(7, 193, 96, 0.2)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'chats' ? '#07c160' : '#888',
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                title="Chats"
              >
                <MessageSquare size={22} />
                {totalUnreadMessages > 0 && <span className="tab-badge" style={{ top: 4, right: 4 }}>{totalUnreadMessages}</span>}
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                style={{
                  background: activeTab === 'contacts' ? 'rgba(7, 193, 96, 0.2)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'contacts' ? '#07c160' : '#888',
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Contacts"
              >
                <Users size={22} />
              </button>

              <button
                onClick={() => setActiveTab('discover')}
                style={{
                  background: activeTab === 'discover' ? 'rgba(7, 193, 96, 0.2)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'discover' ? '#07c160' : '#888',
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Discover"
              >
                <Compass size={22} />
              </button>

              <button
                onClick={() => setShowMiniPrograms(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Mini Programs (小程序)"
              >
                <Sparkles size={22} color="#a855f7" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => setQrModalConfig({ isOpen: true, tab: 'my-qr' })}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                title="My Personal QR Code"
              >
                <QrCode size={20} />
              </button>
              <button
                onClick={() => setShowWallet(true)}
                style={{ background: 'none', border: 'none', color: '#07c160', cursor: 'pointer' }}
                title="WeChat Pay Wallet"
              >
                <CreditCard size={20} />
              </button>
              <button
                onClick={() => setShowAdmin(true)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                title="Admin Console"
              >
                <ShieldCheck size={20} />
              </button>
            </div>
          </div>

          {/* Middle Pane: Chat List or Contacts List */}
          <div style={{ width: 320, borderRight: '1px solid var(--wechat-border)', background: 'var(--wechat-bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--wechat-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '17px', fontWeight: 800 }}>OmniChat Desktop</span>
              <button
                onClick={() => setQrModalConfig({ isOpen: true, tab: 'scan' })}
                style={{ background: '#e8f8f0', color: '#07c160', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add Friend QR
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 'contacts' ? (
                <ContactsView
                  contacts={allUsers.filter(u => u.id !== currentUser?.id)}
                  friendRequests={friendRequests}
                  onSelectContact={(user) => {
                    let direct = chats.find(c => c.type === 'direct' && c.targetUser?.id === user.id);
                    if (!direct) {
                      direct = {
                        id: `chat-${Date.now()}`,
                        type: 'direct',
                        targetUser: user,
                        lastMessage: 'Say hello!',
                        lastTime: 'Now',
                        unreadCount: 0,
                        messages: []
                      };
                      setChats(prev => [direct, ...prev]);
                    }
                    setActiveChat(direct);
                  }}
                  onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                  onInitiateCall={handleInitiateCall}
                  onOpenOfficialAccounts={() => setShowOfficialAccounts(true)}
                />
              ) : activeTab === 'discover' ? (
                <DiscoverView
                  onOpenMoments={() => setShowMoments(true)}
                  onOpenChannels={() => setShowChannels(true)}
                  onOpenMiniPrograms={() => setShowMiniPrograms(true)}
                  onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                  hasMomentUpdates={true}
                  latestMomentAvatar={moments[0]?.author?.avatar}
                />
              ) : activeTab === 'me' ? (
                <MeView
                  currentUser={currentUser}
                  allUsers={[currentUser, ...allUsers]}
                  onOpenWallet={() => setShowWallet(true)}
                  onOpenQrScanner={(tab) => setQrModalConfig({ isOpen: true, tab })}
                  onSwitchUser={handleSwitchUser}
                  viewMode={viewMode}
                  onToggleViewMode={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
                  theme={theme}
                  onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  onOpenAdmin={() => setShowAdmin(true)}
                />
              ) : (
                <ChatList
                  chats={chats}
                  onSelectChat={(chat) => {
                    setActiveChat(chat);
                    chat.unreadCount = 0;
                  }}
                  currentUserId={currentUser?.id}
                />
              )}
            </div>
          </div>

          {/* Right Wide Pane: Active Chat Window or Empty State */}
          <div style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden' }}>
            {activeChat ? (
              <ChatWindow
                chat={activeChat}
                onBack={() => setActiveChat(null)}
                currentUserId={currentUser?.id}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onInitiateCall={handleInitiateCall}
                onClaimRedPacket={handleClaimRedPacket}
                onSendRedPacket={handleSendRedPacket}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--wechat-bg)',
                color: 'var(--wechat-text-muted)'
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: '#e8f8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <MessageSquare size={40} color="#07c160" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--wechat-text-primary)' }}>
                  OmniChat — WeChat SuperApp Clone
                </div>
                <div style={{ fontSize: '13.5px', marginTop: 6, maxWidth: 340, textAlign: 'center' }}>
                  Select a chat on the left, scan a friend's QR code, or explore Moments and Mini Programs.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. QR Code Scanner / Add Friend */}
      <QrScannerModal
        isOpen={qrModalConfig.isOpen}
        initialTab={qrModalConfig.tab}
        onClose={() => setQrModalConfig({ isOpen: false, tab: 'scan' })}
        currentUser={currentUser}
        allContacts={allUsers}
        onAddFriendByQr={handleAddFriendByQr}
      />

      {/* 2. WeChat Pay Wallet */}
      <WalletModal
        isOpen={showWallet}
        onClose={() => setShowWallet(false)}
        wallet={wallet}
        transactions={transactions}
        currentUser={currentUser}
        onTopupWallet={handleTopupWallet}
      />

      {/* 3. Moments Feed */}
      {showMoments && (
        <MomentsFeed
          moments={moments}
          currentUser={currentUser}
          onBack={() => setShowMoments(false)}
          onPostMoment={handlePostMoment}
          onLikeMoment={handleLikeMoment}
          onCommentMoment={handleCommentMoment}
        />
      )}

      {/* 4. Channels Video Reels */}
      {showChannels && (
        <ChannelsView
          channels={channels}
          onBack={() => setShowChannels(false)}
        />
      )}

      {/* 5. Mini Programs Hub */}
      {showMiniPrograms && (
        <MiniProgramsHub
          miniApps={miniApps}
          onBack={() => setShowMiniPrograms(false)}
          currentUser={currentUser}
          onWeChatPayTransfer={(recipient, amount, note) => {
            fetch('/api/wallet/pay-transfer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ recipient, amount, note, type: 'qr_payment' })
            }).then(() => fetchInitialData());
          }}
        />
      )}

      {/* 6. Official Accounts View */}
      {showOfficialAccounts && (
        <OfficialAccountsView
          officialAccounts={officialAccounts}
          onBack={() => setShowOfficialAccounts(false)}
          onSelectOfficialChat={(oa) => {
            let chat = chats.find(c => c.type === 'official' && c.targetUser?.id === oa.id);
            if (!chat) {
              chat = {
                id: `chat-${Date.now()}`,
                type: 'official',
                targetUser: { id: oa.id, name: oa.name, avatar: oa.avatar, verified: true },
                lastMessage: 'Welcome to our Official Account!',
                lastTime: 'Now',
                unreadCount: 0,
                messages: []
              };
              setChats(prev => [chat, ...prev]);
            }
            setActiveChat(chat);
            setShowOfficialAccounts(false);
          }}
        />
      )}

      {/* 7. Voice & Video Call Overlay */}
      {callData && (
        <CallOverlay
          callData={callData}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
          onEndCall={handleEndCall}
        />
      )}

      {/* 8. Admin Moderation & Metrics Dashboard */}
      <AdminDashboard
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        metrics={adminMetrics}
        onToggleUserStatus={handleToggleUserStatus}
        onDeleteMoment={handleDeleteMoment}
      />
    </div>
  );
}
