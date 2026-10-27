import React, { useState } from 'react';
import {
  ShieldCheck, Users, MessageSquare, Camera, CreditCard,
  Ban, CheckCircle, Trash2, ArrowLeft, RefreshCw, BarChart3
} from 'lucide-react';

export default function AdminDashboard({
  isOpen,
  onClose,
  metrics,
  onToggleUserStatus,
  onDeleteMoment
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'moments' | 'transactions'

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: 820,
        maxWidth: '96vw',
        height: 640,
        maxHeight: '94vh',
        background: '#191919',
        color: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        border: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #282828',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#07c160',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800 }}>OmniChat SuperApp Admin Console</div>
              <div style={{ fontSize: '11.5px', color: '#9ca3af' }}>Moderation, Financial Audits & Metrics</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#282828',
              border: 'none',
              color: '#ffffff',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 24px', background: '#202020' }}>
          {[
            { id: 'overview', label: 'Metrics Overview', icon: BarChart3 },
            { id: 'users', label: 'User Directory & Bans', icon: Users },
            { id: 'moments', label: 'Moments Moderation', icon: Camera },
            { id: 'transactions', label: 'Payment Logs', icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab.id ? '#07c160' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                <div style={{ background: '#242424', borderRadius: 14, padding: 16, border: '1px solid #333' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Total Registered</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#07c160', marginTop: 4 }}>
                    {metrics?.stats?.totalUsers || 6}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: 4 }}>● Active & Verified</div>
                </div>

                <div style={{ background: '#242424', borderRadius: 14, padding: 16, border: '1px solid #333' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Total Chats</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#3b82f6', marginTop: 4 }}>
                    {metrics?.stats?.totalChats || 5}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 4 }}>1-on-1 & Groups</div>
                </div>

                <div style={{ background: '#242424', borderRadius: 14, padding: 16, border: '1px solid #333' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Moments Shared</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b', marginTop: 4 }}>
                    {metrics?.stats?.totalMoments || 3}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 4 }}>Active Social Posts</div>
                </div>

                <div style={{ background: '#242424', borderRadius: 14, padding: 16, border: '1px solid #333' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Wallet Volume</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#e04a3f', marginTop: 4 }}>
                    {metrics?.stats?.walletVolume || '¥6,888'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 4 }}>WeChat Pay Circulation</div>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{
                background: '#1f2937',
                borderRadius: 14,
                padding: '16px 20px',
                marginTop: 20,
                border: '1px solid #374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>System Integrity: 100% Operational</div>
                  <div style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: 2 }}>
                    Socket.IO Signaling • QR Scanner Subsystem • Red Packet Engine • Mini Apps Sandbox
                  </div>
                </div>
                <span style={{ background: '#059669', color: '#fff', fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
                  HEALTHY
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {metrics?.users?.map(u => (
                <div
                  key={u.id}
                  style={{
                    background: '#242424',
                    borderRadius: 12,
                    padding: '12px 16px',
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={u.avatar}
                      alt=""
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        ID: {u.wechatId} • {u.region} • Balance: ¥{u.wallet?.balance?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: u.status === 'banned' ? '#7f1d1d' : '#065f46',
                      color: u.status === 'banned' ? '#fca5a5' : '#a7f3d0'
                    }}>
                      {u.status?.toUpperCase()}
                    </span>

                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      style={{
                        background: u.status === 'banned' ? '#07c160' : '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {u.status === 'banned' ? 'Unban User' : 'Ban User'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MOMENTS MODERATION */}
          {activeTab === 'moments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metrics?.moments?.map(m => (
                <div
                  key={m.id}
                  style={{
                    background: '#242424',
                    borderRadius: 12,
                    padding: '14px 16px',
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={m.author?.avatar}
                      alt=""
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{m.author?.name}</div>
                      <div style={{ fontSize: '12.5px', color: '#bbb', marginTop: 2, maxWidth: 450 }}>
                        {m.content}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: 4 }}>
                        {m.timestamp} • {m.likes?.length || 0} Likes • {m.comments?.length || 0} Comments
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMoment(m.id)}
                    style={{
                      background: '#7f1d1d',
                      color: '#fca5a5',
                      border: '1px solid #991b1b',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} /> Remove Post
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TRANSACTIONS LOGS */}
          {activeTab === 'transactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {metrics?.transactions?.map((tx, idx) => (
                <div
                  key={tx.id || idx}
                  style={{
                    background: '#242424',
                    borderRadius: 10,
                    padding: '10px 14px',
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '20px' }}>{tx.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{tx.title}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{tx.timestamp} • Status: {tx.status}</div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: tx.amount > 0 ? '#10b981' : '#f87171'
                  }}>
                    {tx.amount > 0 ? `+¥${tx.amount.toFixed(2)}` : `-¥${Math.abs(tx.amount).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
