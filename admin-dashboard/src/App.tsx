import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  AlertTriangle,
  BarChart2,
  CreditCard,
  CheckSquare,
  MessageSquare,
  Grid,
  Headphones,
  Settings,
  Search,
  Smartphone,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Calendar,
  Bell,
  ChevronDown,
  ArrowRight,
  Zap,
  Clock,
  Globe,
  Star,
  Send,
  UserPlus,
  Video,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Login } from './components/Login';
import { ChatIndiaLogo } from './components/ChatIndiaLogo';

export default function App() {
  // Theme state - LIGHT THEME IS DEFAULT
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('chatindia_admin_theme');
      return stored === 'dark'; // Light by default
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try {
        localStorage.setItem('chatindia_admin_theme', next ? 'dark' : 'light');
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Sync document body styling
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#0b0f19' : '#f4f6f8';
    document.body.style.color = isDark ? '#f8fafc' : '#0f172a';
  }, [isDark]);

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Admin Authentication & Session State
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('chatindia_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('chatindia_admin_token') || null;
  });

  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHash = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLoginSuccess = (user: any, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
    try {
      localStorage.setItem('chatindia_admin_user', JSON.stringify(user));
      localStorage.setItem('chatindia_admin_token', token);
    } catch (e) {
      console.warn(e);
    }
    window.location.hash = '#dashboard';
  };

  const handleLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    try {
      localStorage.removeItem('chatindia_admin_user');
      localStorage.removeItem('chatindia_admin_token');
    } catch (e) {
      console.warn(e);
    }
    window.location.hash = '#login';
  };

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'users'
    | 'moderation'
    | 'analytics'
    | 'financials'
    | 'subscriptions'
    | 'messages'
    | 'groups'
    | 'services'
    | 'support'
    | 'settings'
  >('overview');

  // Chart range filter
  const [growthRange, setGrowthRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');
  const [analyticsRange, setAnalyticsRange] = useState<'7D' | '30D' | '90D'>('7D');
  const [reportsFilter, setReportsFilter] = useState<'all' | 'posts' | 'comments' | 'users'>('all');
  const [searchUser, setSearchUser] = useState('');

  // Modals & Popovers
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // User Management State
  const [usersList, setUsersList] = useState([
    {
      id: 'u_1',
      name: 'Priya Verma',
      username: 'priya',
      email: 'priya@gmail.com',
      avatar: 'PV',
      avatarBg: '#f3e8ff',
      avatarColor: '#7e22ce',
      status: 'Active',
      time: '2m ago',
      joined: '12 Oct 2024'
    },
    {
      id: 'u_2',
      name: 'Amit Kumar',
      username: 'amit123',
      email: 'amit123@gmail.com',
      avatar: 'AK',
      avatarBg: '#ffe4e6',
      avatarColor: '#be123c',
      status: 'Active',
      time: '8m ago',
      joined: '11 Oct 2024'
    },
    {
      id: 'u_3',
      name: 'Sneha Patel',
      username: 'sneha',
      email: 'sneha@chatindia.com',
      avatar: 'SP',
      avatarBg: '#e0e7ff',
      avatarColor: '#4338ca',
      status: 'Active',
      time: '12m ago',
      joined: '10 Oct 2024'
    },
    {
      id: 'u_4',
      name: 'Rahul Singh',
      username: 'rahul',
      email: 'rahul@gmail.com',
      avatar: 'RS',
      avatarBg: '#d1fae5',
      avatarColor: '#065f46',
      status: 'Active',
      time: '18m ago',
      joined: '9 Oct 2024'
    },
    {
      id: 'u_5',
      name: 'Neha Sharma',
      username: 'neha',
      email: 'neha@chatindia.com',
      avatar: 'NS',
      avatarBg: '#ccfbf1',
      avatarColor: '#0f766e',
      status: 'Active',
      time: '24m ago',
      joined: '8 Oct 2024'
    }
  ]);

  // Reports State
  const [reportsList, setReportsList] = useState([
    {
      id: 'rep_1',
      type: 'users',
      title: 'Spammer',
      subtitle: '@user123',
      date: 'Posted on 12 Oct 2024',
      status: 'Pending'
    },
    {
      id: 'rep_2',
      type: 'comments',
      title: 'Inappropriate content',
      subtitle: 'Comment on post #24',
      date: 'Posted on 11 Oct 2024',
      status: 'Pending'
    },
    {
      id: 'rep_3',
      type: 'users',
      title: 'Fake account',
      subtitle: '@fakeuser',
      date: 'Posted on 10 Oct 2024',
      status: 'Pending'
    },
    {
      id: 'rep_4',
      type: 'posts',
      title: 'Harassment',
      subtitle: '@user456',
      date: 'Posted on 9 Oct 2024',
      status: 'Pending'
    }
  ]);

  const toggleUserStatus = (id: string) => {
    setUsersList(prev =>
      prev.map(u =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
  };

  const handleReviewReport = (id: string) => {
    setReportsList(prev => prev.filter(r => r.id !== id));
    alert('Report reviewed and action enforced.');
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const initials = newUserName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: `u_${Date.now()}`,
      name: newUserName.trim(),
      username: newUserEmail.split('@')[0],
      email: newUserEmail.trim(),
      avatar: initials,
      avatarBg: '#d1fae5',
      avatarColor: '#047857',
      status: 'Active',
      time: 'Just now',
      joined: 'Today'
    };

    setUsersList(prev => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    alert(`User "${newUser.name}" added successfully.`);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    alert(`Broadcast announcement sent to 12,548 users: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowSendMessageModal(false);
  };

  // Protected Route: Show Login if unauthenticated or visiting #login
  if (!adminUser || !adminToken || currentHash === '#login') {
    return <Login onLoginSuccess={handleLoginSuccess} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  // Exact UI Colors matching the reference design
  const colors = isDark
    ? {
        isDark: true,
        canvasBg: '#0b0f19',
        headerBg: 'rgba(17, 24, 39, 0.95)',
        headerBorder: '#1e293b',
        cardBg: '#131c2e',
        cardBorder: '#1e293b',
        cardShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        pillBg: '#1e293b',
        pillBorder: '#334155',
        pillText: '#cbd5e1',
        gridLines: '#1e293b',
        chartFill: 'rgba(7, 193, 96, 0.15)',
        quickActionBg: '#182338',
        quickActionBorder: '#1e293b',
        tableHeaderBg: '#1e293b',
        tableRowBorder: '#1e293b',
        inputBg: '#182338',
        inputBorder: '#334155'
      }
    : {
        isDark: false,
        canvasBg: '#f4f6f8',
        headerBg: '#ffffff',
        headerBorder: '#e2e8f0',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        cardShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 10px rgba(0, 0, 0, 0.02)',
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
        textMuted: '#94a3b8',
        pillBg: '#f8fafc',
        pillBorder: '#e2e8f0',
        pillText: '#334155',
        gridLines: '#f1f5f9',
        chartFill: 'rgba(7, 193, 96, 0.12)',
        quickActionBg: '#f8fafc',
        quickActionBorder: '#e2e8f0',
        tableHeaderBg: '#f8fafc',
        tableRowBorder: '#f1f5f9',
        inputBg: '#ffffff',
        inputBorder: '#cbd5e1'
      };

  // Nav menu items
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users, badge: 5, badgeColor: '#10b981' },
    { id: 'reports', label: 'Reports', icon: AlertTriangle, badge: 4, badgeColor: '#ef4444' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'financials', label: 'Payments', icon: CreditCard },
    { id: 'subscriptions', label: 'Subscriptions', icon: CheckSquare },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'services', label: 'Services', icon: Grid },
    { id: 'support', label: 'Support Tickets', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: colors.canvasBg,
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: colors.textPrimary,
        transition: 'background 0.2s ease, color 0.2s ease'
      }}
    >
      {/* 1. LEFT SIDEBAR (Dark Emerald Forest Green #053723) */}
      <div
        style={{
          width: sidebarCollapsed ? 76 : 240,
          background: 'linear-gradient(180deg, #053723 0%, #032b1c 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: sidebarCollapsed ? '24px 10px' : '22px 14px',
          color: '#ffffff',
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxSizing: 'border-box',
          transition: 'width 0.25s ease',
          zIndex: 40,
          flexShrink: 0
        }}
      >
        {/* Brand Header with Official ChatIndia Dual-Bubble Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingBottom: 20,
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('overview')}
        >
          <ChatIndiaLogo size={sidebarCollapsed ? 36 : 38} />
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', color: '#ffffff', lineHeight: 1.1 }}>
                ChatIndia
              </div>
              <div style={{ fontSize: '11px', color: '#86efac', fontWeight: 600, marginTop: 2 }}>
                Admin Panel
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginTop: 8,
            overflowY: 'auto',
            paddingRight: 4
          }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'reports' && activeTab === 'moderation') ||
              (item.id === 'overview' && activeTab === 'overview');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'reports') setActiveTab('moderation');
                  else setActiveTab(item.id as any);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '10px' : '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? '#07c160' : 'transparent',
                  color: isActive ? '#ffffff' : '#a7f3d0',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#a7f3d0';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge ? (
                  <span
                    style={{
                      background: item.badgeColor,
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '1px 6.5px',
                      borderRadius: 999
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Bottom Operator & Theme Switcher Card */}
        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          {!sidebarCollapsed ? (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: 14,
                padding: '12px'
              }}
            >
              {/* Operator info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Super Admin</span>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '1px 5px',
                        borderRadius: 4
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#86efac', marginTop: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {adminUser?.email || 'admin@chatindia.app'}
                  </div>
                </div>
              </div>

              {/* Segmented Light / Dark theme selector */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 999,
                  padding: 3,
                  marginTop: 10,
                  gap: 3
                }}
              >
                <button
                  onClick={() => {
                    if (isDark) toggleTheme();
                  }}
                  title="Switch to Light Mode"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    padding: '5px 0',
                    borderRadius: 999,
                    border: 'none',
                    background: !isDark ? '#fef08a' : 'transparent',
                    color: !isDark ? '#713f12' : '#a7f3d0',
                    fontSize: '11px',
                    fontWeight: !isDark ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sun size={12} color={!isDark ? '#ca8a04' : '#a7f3d0'} />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => {
                    if (!isDark) toggleTheme();
                  }}
                  title="Switch to Dark Mode"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    padding: '5px 0',
                    borderRadius: 999,
                    border: 'none',
                    background: isDark ? '#07c160' : 'transparent',
                    color: isDark ? '#ffffff' : '#a7f3d0',
                    fontSize: '11px',
                    fontWeight: isDark ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Moon size={12} color={isDark ? '#ffffff' : '#a7f3d0'} />
                  <span>Dark</span>
                </button>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 8,
                  padding: '7px 0',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light' : 'Switch to Dark'}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isDark ? <Sun size={16} color="#fef08a" /> : <Moon size={16} color="#86efac" />}
              </button>
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN BODY CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <div
          style={{
            height: 70,
            background: colors.headerBg,
            borderBottom: `1px solid ${colors.headerBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s ease, border-color 0.2s ease'
          }}
        >
          {/* Left Greeting & Collapse Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              title="Toggle Sidebar"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: colors.pillBg,
                border: `1px solid ${colors.pillBorder}`,
                color: colors.textPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Menu size={18} />
            </button>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                Good Morning, Super Admin 👋
              </div>
              <div style={{ fontSize: '12.5px', color: colors.textSecondary, marginTop: 2 }}>
                Here's what's happening with ChatIndia today.
              </div>
            </div>
          </div>

          {/* Right Controls: Date Pill, Theme Pill, Notification Bell, Admin Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Date Selector Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 12px',
                background: colors.pillBg,
                border: `1px solid ${colors.pillBorder}`,
                borderRadius: 10,
                fontSize: '12.5px',
                fontWeight: 600,
                color: colors.textPrimary,
                cursor: 'pointer'
              }}
            >
              <Calendar size={14} color="#64748b" />
              <span>Today, 12 Oct 2024</span>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                border: `1px solid ${isDark ? '#3730a3' : '#fef08a'}`,
                background: isDark ? 'rgba(79, 70, 229, 0.15)' : '#fef9c3',
                color: isDark ? '#a5b4fc' : '#a16207',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isDark ? <Moon size={14} color="#818cf8" /> : <Sun size={14} color="#ca8a04" />}
              <span>{isDark ? 'Dark' : 'Light'}</span>
            </button>

            {/* Notification Bell with Badge */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                title="Notifications"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: colors.pillBg,
                  border: `1px solid ${colors.pillBorder}`,
                  color: colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Bell size={16} />
              </button>
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  width: 17,
                  height: 17,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff'
                }}
              >
                4
              </span>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: 44,
                    right: 0,
                    width: 300,
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 14,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    padding: '14px',
                    zIndex: 100
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '13px', fontWeight: 800 }}>Notifications (4)</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px' }}>
                    <div style={{ padding: '6px 8px', borderRadius: 8, background: colors.pillBg }}>
                      <div style={{ fontWeight: 700, color: '#07c160' }}>New Registration</div>
                      <div style={{ color: colors.textSecondary, fontSize: '11px' }}>Rohan Sharma joined ChatIndia</div>
                    </div>
                    <div style={{ padding: '6px 8px', borderRadius: 8, background: colors.pillBg }}>
                      <div style={{ fontWeight: 700, color: '#0284c7' }}>UPI Payment Verified</div>
                      <div style={{ color: colors.textSecondary, fontSize: '11px' }}>₹500 Shagun envelope received</div>
                    </div>
                    <div style={{ padding: '6px 8px', borderRadius: 8, background: colors.pillBg }}>
                      <div style={{ fontWeight: 700, color: '#ef4444' }}>New Content Report</div>
                      <div style={{ color: colors.textSecondary, fontSize: '11px' }}>Spam reported in group chat</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  background: '#07c160',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '12px',
                  boxShadow: '0 2px 6px rgba(7, 193, 96, 0.3)'
                }}
              >
                SA
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary }}>
                  {adminUser?.name || 'SuperAdmin Operator'}
                </span>
                <span style={{ fontSize: '10px', color: '#07c160', fontWeight: 800, letterSpacing: '0.3px' }}>
                  {adminUser?.role || 'SUPERADMIN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DASHBOARD MAIN CANVAS (Matching the Uploaded Image) */}
        {activeTab === 'overview' && (
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ROW 1: 4 TOP KPI STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {/* Card 1: Total Users */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#07c160',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(7, 193, 96, 0.25)'
                    }}
                  >
                    <Users size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', color: colors.textSecondary, fontWeight: 600 }}>Total Users</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: colors.textPrimary, letterSpacing: '-0.5px', marginTop: 2 }}>
                      12,548
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#07c160' }}>
                    ↑ 12% <span style={{ color: colors.textMuted, fontWeight: 500 }}>vs last month</span>
                  </span>
                  <div
                    onClick={() => setActiveTab('users')}
                    style={{ color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>

              {/* Card 2: Active Users */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#f59e0b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(245, 158, 11, 0.25)'
                    }}
                  >
                    <Zap size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', color: colors.textSecondary, fontWeight: 600 }}>Active Users</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: colors.textPrimary, letterSpacing: '-0.5px', marginTop: 2 }}>
                      8,942
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#07c160' }}>
                    ↑ 8% <span style={{ color: colors.textMuted, fontWeight: 500 }}>vs last month</span>
                  </span>
                  <div
                    onClick={() => setActiveTab('users')}
                    style={{ color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>

              {/* Card 3: Total Messages */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#3b82f6',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)'
                    }}
                  >
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', color: colors.textSecondary, fontWeight: 600 }}>Total Messages</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: colors.textPrimary, letterSpacing: '-0.5px', marginTop: 2 }}>
                      245,682
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#07c160' }}>
                    ↑ 16% <span style={{ color: colors.textMuted, fontWeight: 500 }}>vs last month</span>
                  </span>
                  <div
                    onClick={() => setActiveTab('messages')}
                    style={{ color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>

              {/* Card 4: Revenue (This Month) */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#f43f5e',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(244, 63, 94, 0.25)',
                      fontSize: '22px',
                      fontWeight: 800
                    }}
                  >
                    ₹
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', color: colors.textSecondary, fontWeight: 600 }}>Revenue (This Month)</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: colors.textPrimary, letterSpacing: '-0.5px', marginTop: 2 }}>
                      ₹2,48,500
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#07c160' }}>
                    ↑ 18% <span style={{ color: colors.textMuted, fontWeight: 500 }}>vs last month</span>
                  </span>
                  <div
                    onClick={() => setActiveTab('financials')}
                    style={{ color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: USER GROWTH CHART, MESSAGE ACTIVITY & RECENT ACTIVITY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 18 }}>
              {/* User Growth Chart Card */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(7, 193, 96, 0.12)',
                        color: '#07c160',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <UserPlus size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>User Growth</div>
                      <div style={{ fontSize: '11px', color: colors.textSecondary }}>Total registered users over time</div>
                    </div>
                  </div>

                  {/* Range pills */}
                  <div style={{ display: 'flex', gap: 4, background: colors.pillBg, padding: 3, borderRadius: 8 }}>
                    {(['7D', '30D', '3M', '6M', '1Y'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => setGrowthRange(r)}
                        style={{
                          background: growthRange === r ? '#07c160' : 'transparent',
                          color: growthRange === r ? '#ffffff' : colors.textSecondary,
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div style={{ flex: 1, height: 180, position: 'relative', marginTop: 10 }}>
                  <svg width="100%" height="100%" viewBox="0 0 520 180" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="userGrowthAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#07c160" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#07c160" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Dotted Gridlines */}
                    <line x1="30" y1="20" x2="510" y2="20" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="65" x2="510" y2="65" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="110" x2="510" y2="110" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="155" x2="510" y2="155" stroke={colors.gridLines} />

                    {/* Y Axis text */}
                    <text x="5" y="24" fontSize="10" fill={colors.textMuted} fontWeight="600">15K</text>
                    <text x="5" y="69" fontSize="10" fill={colors.textMuted} fontWeight="600">10K</text>
                    <text x="5" y="114" fontSize="10" fill={colors.textMuted} fontWeight="600">5K</text>
                    <text x="12" y="159" fontSize="10" fill={colors.textMuted} fontWeight="600">0</text>

                    {/* Area fill */}
                    <path
                      d="M 40 148 Q 110 135 170 120 T 300 90 T 420 52 T 485 30 L 485 155 L 40 155 Z"
                      fill="url(#userGrowthAreaGrad)"
                    />

                    {/* Main Curve */}
                    <path
                      d="M 40 148 Q 110 135 170 120 T 300 90 T 420 52 T 485 30"
                      stroke="#07c160"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Endpoint dot */}
                    <circle cx="485" cy="30" r="4.5" fill="#07c160" stroke="#ffffff" strokeWidth="2" />

                    {/* Active tooltip badge on Oct 12 matching the image */}
                    <rect x="445" y="4" width="70" height="24" rx="6" fill="#053723" />
                    <text x="480" y="15" fill="#ffffff" fontSize="9.5" fontWeight="800" textAnchor="middle">12,548</text>
                    <text x="480" y="23" fill="#86efac" fontSize="7" fontWeight="600" textAnchor="middle">Total Users</text>
                  </svg>
                </div>

                {/* X Axis Dates */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: colors.textSecondary,
                    marginTop: 6,
                    paddingLeft: 35,
                    paddingRight: 10
                  }}
                >
                  <span>Oct 1</span>
                  <span>Oct 3</span>
                  <span>Oct 5</span>
                  <span>Oct 7</span>
                  <span>Oct 9</span>
                  <span>Oct 11</span>
                  <span>Oct 12</span>
                </div>
              </div>

              {/* Message Activity Bar Chart Card */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(7, 193, 96, 0.12)',
                      color: '#07c160',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Message Activity</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Messages sent in last 24 hours</div>
                  </div>
                </div>

                {/* Bars Chart */}
                <div style={{ flex: 1, height: 180, position: 'relative', marginTop: 10 }}>
                  <svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" preserveAspectRatio="none">
                    {/* Horizontal Gridlines */}
                    <line x1="30" y1="20" x2="315" y2="20" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="55" x2="315" y2="55" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="90" x2="315" y2="90" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="125" x2="315" y2="125" stroke={colors.gridLines} strokeDasharray="3 3" />
                    <line x1="30" y1="155" x2="315" y2="155" stroke={colors.gridLines} />

                    {/* Y Axis */}
                    <text x="5" y="24" fontSize="9.5" fill={colors.textMuted} fontWeight="600">25K</text>
                    <text x="5" y="59" fontSize="9.5" fill={colors.textMuted} fontWeight="600">20K</text>
                    <text x="5" y="94" fontSize="9.5" fill={colors.textMuted} fontWeight="600">15K</text>
                    <text x="5" y="129" fontSize="9.5" fill={colors.textMuted} fontWeight="600">10K</text>
                    <text x="12" y="159" fontSize="9.5" fill={colors.textMuted} fontWeight="600">0</text>

                    {/* Bar columns */}
                    {[
                      { x: 42, h: 65 },
                      { x: 58, h: 80 },
                      { x: 74, h: 55 },
                      { x: 90, h: 95 },
                      { x: 106, h: 110 },
                      { x: 122, h: 85 },
                      { x: 138, h: 125 },
                      { x: 154, h: 140 },
                      { x: 170, h: 105 },
                      { x: 186, h: 130 },
                      { x: 202, h: 155 },
                      { x: 218, h: 120 },
                      { x: 234, h: 90 },
                      { x: 250, h: 135 },
                      { x: 266, h: 115 },
                      { x: 282, h: 75 },
                      { x: 298, h: 50 }
                    ].map((b, idx) => (
                      <rect
                        key={idx}
                        x={b.x}
                        y={155 - b.h}
                        width="8.5"
                        height={b.h}
                        rx="4"
                        fill={idx % 2 === 0 ? '#07c160' : '#10b981'}
                      />
                    ))}
                  </svg>
                </div>

                {/* X Axis Timestamps */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: colors.textSecondary,
                    marginTop: 6,
                    paddingLeft: 35,
                    paddingRight: 10
                  }}
                >
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Clock size={16} color="#eab308" />
                    <span style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Recent Activity</span>
                  </div>
                  <span
                    onClick={() => setActiveTab('moderation')}
                    style={{ fontSize: '11.5px', fontWeight: 700, color: '#07c160', cursor: 'pointer' }}
                  >
                    View all →
                  </span>
                </div>

                {/* Activity List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {[
                    {
                      icon: UserCheck,
                      color: '#07c160',
                      bg: 'rgba(7, 193, 96, 0.1)',
                      title: 'New user registered',
                      desc: 'Rohan Sharma joined ChatIndia',
                      time: '5m ago'
                    },
                    {
                      icon: CreditCard,
                      color: '#0284c7',
                      bg: 'rgba(2, 132, 199, 0.1)',
                      title: 'Payment received',
                      desc: '₹500 UPI transfer verified',
                      time: '12m ago'
                    },
                    {
                      icon: AlertTriangle,
                      color: '#ef4444',
                      bg: 'rgba(239, 68, 68, 0.1)',
                      title: 'Report received',
                      desc: 'User report filed for spam',
                      time: '25m ago'
                    },
                    {
                      icon: Users,
                      color: '#8b5cf6',
                      bg: 'rgba(139, 92, 246, 0.1)',
                      title: 'New group created',
                      desc: 'Travel Buddies group started',
                      time: '40m ago'
                    },
                    {
                      icon: MessageSquare,
                      color: '#07c160',
                      bg: 'rgba(7, 193, 96, 0.1)',
                      title: 'New message',
                      desc: '12 new messages in General Chat',
                      time: '1h ago'
                    }
                  ].map((act, i) => {
                    const ActIcon = act.icon;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: act.bg,
                            color: act.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1
                          }}
                        >
                          <ActIcon size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
                            {act.title}
                          </div>
                          <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {act.desc}
                          </div>
                        </div>
                        <span style={{ fontSize: '10.5px', color: colors.textMuted, whiteSpace: 'nowrap' }}>
                          {act.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROW 3: 4 METRIC & ACTION CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.1fr 1.1fr 1fr', gap: 18 }}>
              {/* Card 1: Language Distribution (Donut Chart) */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <Globe size={16} color="#07c160" />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Language Distribution</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Users by selected language</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                  {/* SVG Donut */}
                  <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                    <svg width="140" height="140" viewBox="0 0 160 160">
                      <g transform="rotate(-90 80 80)">
                        {/* Donut segments (radius 55, circ = 345.57) */}
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#f59e0b" strokeWidth="22" strokeDasharray="117.5 345.6" strokeDashoffset="0" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#0284c7" strokeWidth="22" strokeDasharray="76 345.6" strokeDashoffset="-117.5" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#a855f7" strokeWidth="22" strokeDasharray="41.5 345.6" strokeDashoffset="-193.5" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#ec4899" strokeWidth="22" strokeDasharray="27.6 345.6" strokeDashoffset="-235" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#3b82f6" strokeWidth="22" strokeDasharray="24.2 345.6" strokeDashoffset="-262.6" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#10b981" strokeWidth="22" strokeDasharray="20.7 345.6" strokeDashoffset="-286.8" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#f97316" strokeWidth="22" strokeDasharray="20.7 345.6" strokeDashoffset="-307.5" />
                        <circle cx="80" cy="80" r="55" fill="none" stroke="#6366f1" strokeWidth="22" strokeDasharray="17.4 345.6" strokeDashoffset="-328.2" />
                      </g>
                      {/* Center labels */}
                      <text x="80" y="76" textAnchor="middle" fontSize="17" fontWeight="900" fill={colors.textPrimary}>
                        12,548
                      </text>
                      <text x="80" y="92" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={colors.textSecondary}>
                        Total Users
                      </text>
                    </svg>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', fontSize: '11px', width: '100%' }}>
                    {[
                      { lang: 'Hindi', pct: '34%', color: '#f59e0b' },
                      { lang: 'English', pct: '22%', color: '#0284c7' },
                      { lang: 'Marathi', pct: '12%', color: '#a855f7' },
                      { lang: 'Bengali', pct: '8%', color: '#ec4899' },
                      { lang: 'Tamil', pct: '7%', color: '#3b82f6' },
                      { lang: 'Telugu', pct: '6%', color: '#10b981' },
                      { lang: 'Gujarati', pct: '6%', color: '#f97316' },
                      { lang: 'Punjabi', pct: '5%', color: '#6366f1' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 3.5, background: item.color }} />
                          <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{item.lang}</span>
                        </div>
                        <span style={{ color: colors.textSecondary, fontWeight: 700 }}>{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Top Features */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <Star size={16} color="#eab308" />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Top Features</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Usage in last 30 days</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {[
                    { name: 'Messaging', icon: MessageSquare, iconColor: '#07c160', count: '68,542', pct: '78%', growth: '↑ 15%' },
                    { name: 'Groups', icon: Users, iconColor: '#0284c7', count: '32,156', pct: '52%', growth: '↑ 12%' },
                    { name: 'Voice/Video Calls', icon: Video, iconColor: '#8b5cf6', count: '24,987', pct: '42%', growth: '↑ 10%' },
                    { name: 'File Sharing', icon: FileText, iconColor: '#f59e0b', count: '18,432', pct: '32%', growth: '↑ 8%' },
                    { name: 'Payments', icon: CreditCard, iconColor: '#10b981', count: '12,345', pct: '22%', growth: '↑ 6%' }
                  ].map((feat, idx) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FIcon size={13} color={feat.iconColor} />
                            <span style={{ fontWeight: 700, color: colors.textPrimary }}>{feat.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, color: colors.textPrimary }}>{feat.count}</span>
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#07c160' }}>{feat.growth}</span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: 5, borderRadius: 3, background: colors.pillBg, overflow: 'hidden' }}>
                          <div style={{ width: feat.pct, height: '100%', background: feat.iconColor, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Recent Users */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Users size={16} color="#07c160" />
                    <span style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Recent Users</span>
                  </div>
                  <span
                    onClick={() => setActiveTab('users')}
                    style={{ fontSize: '11.5px', fontWeight: 700, color: '#07c160', cursor: 'pointer' }}
                  >
                    View all →
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {usersList.slice(0, 5).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            background: u.avatarBg,
                            color: u.avatarColor,
                            fontWeight: 800,
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {u.avatar}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '10.5px', color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.email}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#07c160',
                            background: 'rgba(7, 193, 96, 0.1)',
                            padding: '2px 6px',
                            borderRadius: 4
                          }}
                        >
                          {u.status}
                        </span>
                        <span style={{ fontSize: '10px', color: colors.textMuted }}>{u.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Quick Actions */}
              <div
                style={{
                  background: colors.cardBg,
                  borderRadius: 16,
                  border: `1px solid ${colors.cardBorder}`,
                  boxShadow: colors.cardShadow,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <Zap size={16} color="#eab308" />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>Quick Actions</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {/* Action 1: Add User */}
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    style={{
                      background: colors.quickActionBg,
                      border: `1px solid ${colors.quickActionBorder}`,
                      borderRadius: 12,
                      padding: '16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#07c160';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = colors.quickActionBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <UserPlus size={22} color="#07c160" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>Add User</span>
                  </button>

                  {/* Action 2: View Reports */}
                  <button
                    onClick={() => setActiveTab('moderation')}
                    style={{
                      background: colors.quickActionBg,
                      border: `1px solid ${colors.quickActionBorder}`,
                      borderRadius: 12,
                      padding: '16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#eab308';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = colors.quickActionBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <AlertTriangle size={22} color="#eab308" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>View Reports</span>
                  </button>

                  {/* Action 3: Manage Payments */}
                  <button
                    onClick={() => setActiveTab('financials')}
                    style={{
                      background: colors.quickActionBg,
                      border: `1px solid ${colors.quickActionBorder}`,
                      borderRadius: 12,
                      padding: '16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = colors.quickActionBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <CreditCard size={22} color="#3b82f6" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>Manage Payments</span>
                  </button>

                  {/* Action 4: Send Message */}
                  <button
                    onClick={() => setShowSendMessageModal(true)}
                    style={{
                      background: colors.quickActionBg,
                      border: `1px solid ${colors.quickActionBorder}`,
                      borderRadius: 12,
                      padding: '16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#a855f7';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = colors.quickActionBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Send size={22} color="#a855f7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: colors.textPrimary }}>Users Management</div>
                <div style={{ fontSize: '12.5px', color: colors.textSecondary }}>Monitor active subscribers, status, and permissions.</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 10,
                    padding: '0 14px',
                    width: 280,
                    gap: 8
                  }}
                >
                  <Search size={15} color={colors.textSecondary} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: colors.textPrimary,
                      fontSize: '13px',
                      padding: '9px 0',
                      width: '100%'
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  style={{
                    background: '#07c160',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '0 16px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <UserPlus size={16} />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                borderRadius: 16,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
                overflow: 'hidden'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: colors.tableHeaderBg, color: colors.textSecondary, fontSize: '11.5px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>User</th>
                    <th style={{ padding: '14px 20px' }}>Email</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Joined</th>
                    <th style={{ padding: '14px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList
                    .filter(
                      u =>
                        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchUser.toLowerCase())
                    )
                    .map(u => (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 17,
                              background: u.avatarBg,
                              color: u.avatarColor,
                              fontWeight: 800,
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {u.avatar}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            <div style={{ fontSize: '11px', color: '#07c160', fontWeight: 600 }}>@{u.username}</div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{u.email}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: 14,
                              background: u.status === 'Suspended' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(7, 193, 96, 0.12)',
                              color: u.status === 'Suspended' ? '#ef4444' : '#07c160',
                              fontSize: '11.5px',
                              fontWeight: 700
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{u.joined}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => alert(`Viewing details for ${u.name}`)}
                              style={{
                                background: colors.pillBg,
                                color: colors.textPrimary,
                                border: `1px solid ${colors.pillBorder}`,
                                borderRadius: 6,
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              style={{
                                background: u.status === 'Suspended' ? '#07c160' : 'rgba(239, 68, 68, 0.12)',
                                color: u.status === 'Suspended' ? '#ffffff' : '#ef4444',
                                border: 'none',
                                borderRadius: 6,
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {u.status === 'Suspended' ? 'Restore' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTHER TABS: REPORTS & MODERATION */}
        {activeTab === 'moderation' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: colors.textPrimary, marginBottom: 14 }}>
              Reports & Community Moderation
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {[
                { key: 'all', label: 'All (24)' },
                { key: 'posts', label: 'Posts (12)' },
                { key: 'comments', label: 'Comments (8)' },
                { key: 'users', label: 'Users (4)' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setReportsFilter(tab.key as any)}
                  style={{
                    background: reportsFilter === tab.key ? '#07c160' : colors.cardBg,
                    color: reportsFilter === tab.key ? '#ffffff' : colors.textSecondary,
                    border: `1px solid ${reportsFilter === tab.key ? '#07c160' : colors.cardBorder}`,
                    borderRadius: 18,
                    padding: '7px 18px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reportsList
                .filter(r => reportsFilter === 'all' || r.type === reportsFilter)
                .map(r => (
                  <div
                    key={r.id}
                    style={{
                      background: colors.cardBg,
                      borderRadius: 14,
                      padding: 18,
                      border: `1px solid ${colors.cardBorder}`,
                      boxShadow: colors.cardShadow,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: colors.textPrimary }}>
                        {r.title} : <span style={{ color: '#07c160' }}>{r.subtitle}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: 4 }}>{r.date}</div>
                    </div>

                    <button
                      onClick={() => handleReviewReport(r.id)}
                      style={{
                        background: '#07c160',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 18px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Review
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* OTHER TABS: PAYMENTS (UPI LEDGER) */}
        {activeTab === 'financials' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: colors.textPrimary, marginBottom: 14 }}>
              ChatIndia Pay UPI Ledger
            </div>
            <div
              style={{
                background: colors.cardBg,
                borderRadius: 16,
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: colors.cardShadow,
                overflow: 'hidden'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: colors.tableHeaderBg, color: colors.textSecondary, fontSize: '11.5px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>Tx ID</th>
                    <th style={{ padding: '14px 20px' }}>Type</th>
                    <th style={{ padding: '14px 20px' }}>Description</th>
                    <th style={{ padding: '14px 20px' }}>Amount (INR)</th>
                    <th style={{ padding: '14px 20px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'tx_1', type: 'SHAGUN', description: '🎁 Shagun Gift Envelope (Rohan → Riya)', amount: '+₹500.00', isPos: true, time: 'Today 10:15 AM' },
                    { id: 'tx_2', type: 'TOP_UP', description: '💳 UPI Top-Up from HDFC Bank', amount: '+₹2,000.00', isPos: true, time: '10 Oct 2024' },
                    { id: 'tx_3', type: 'RECHARGE', description: '⚡ Mobile Prepaid Recharge via BBPS', amount: '-₹199.00', isPos: false, time: 'Yesterday 8:20 PM' },
                    { id: 'tx_4', type: 'FOOD', description: '🍛 Food Order via Mini Program', amount: '-₹320.00', isPos: false, time: '12 Oct 2024' }
                  ].map(t => (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${colors.tableRowBorder}` }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#0284c7', fontWeight: 600 }}>{t.id}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: colors.textPrimary }}>{t.type}</td>
                      <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{t.description}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 800, color: t.isPos ? '#07c160' : '#ef4444' }}>
                        {t.amount}
                      </td>
                      <td style={{ padding: '14px 20px', color: colors.textSecondary }}>{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. FOOTER BAR MATCHING IMAGE */}
        <div
          style={{
            marginTop: 'auto',
            padding: '16px 28px',
            borderTop: `1px solid ${colors.headerBorder}`,
            background: colors.headerBg,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: colors.textSecondary
          }}
        >
          <div>
            ChatIndia Admin Panel &nbsp;•&nbsp; Product by Deific Digital (Deific Enterprises)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#07c160' }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: '#07c160' }} />
              System Healthy
            </span>
            <span>•</span>
            <span style={{ color: colors.textMuted }}>Last updated: 12 Oct 2024, 11:45 AM</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODAL 1: ADD USER */}
      {showAddUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              background: colors.cardBg,
              borderRadius: 20,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: 28
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(7, 193, 96, 0.15)', color: '#07c160', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>Add New User</div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: 5, display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Sen"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: 5, display: 'block' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. vikram@chatindia.app"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: `1px solid ${colors.pillBorder}`,
                    background: colors.pillBg,
                    color: colors.textPrimary,
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#07c160',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ACTION MODAL 2: SEND MESSAGE */}
      {showSendMessageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: colors.cardBg,
              borderRadius: 20,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: 28
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} />
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>Broadcast Message</div>
              </div>
              <button
                onClick={() => setShowSendMessageModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: 5, display: 'block' }}>
                  Target Audience
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="all">All Registered Users (12,548)</option>
                  <option value="active">Active Users Only (8,942)</option>
                  <option value="group_admins">Community Group Admins (420)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, marginBottom: 5, display: 'block' }}>
                  Announcement Text
                </label>
                <textarea
                  placeholder="Type broadcast announcement message..."
                  rows={4}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${colors.inputBorder}`,
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowSendMessageModal(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: `1px solid ${colors.pillBorder}`,
                    background: colors.pillBg,
                    color: colors.textPrimary,
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#a855f7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
