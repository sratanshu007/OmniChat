import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, MessageSquare, AlertTriangle, CreditCard,
  CheckCircle, Ban, Search, RefreshCw, Smartphone, Award, ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'financials' | 'services'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ovRes, uRes, modRes, finRes] = await Promise.all([
        fetch('/api/v1/admin/overview').then(r => r.json()),
        fetch('/api/v1/admin/users').then(r => r.json()),
        fetch('/api/v1/admin/moderation').then(r => r.json()),
        fetch('/api/v1/admin/financials').then(r => r.json())
      ]);

      if (ovRes.metrics) setMetrics(ovRes.metrics);
      if (uRes.users) setUsers(uRes.users);
      if (modRes.reports) setReports(modRes.reports);
      if (finRes.transactions) setFinancials(finRes.transactions);
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await fetch(`/api/v1/admin/users/${userId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, reason: `Admin toggled to ${nextStatus}` })
    });
    fetchDashboardData();
  };

  const handleResolveReport = async (reportId: string) => {
    await fetch(`/api/v1/admin/moderation/${reportId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REMOVE_CONTENT' })
    });
    fetchDashboardData();
  };

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.phoneNumber?.includes(searchUser)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', color: '#f1f5f9', background: '#0b0f19' }}>
      {/* Sidebar */}
      <div style={{
        width: 260,
        background: '#111827',
        borderRight: '1px solid #1f2937',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid #1f2937' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #07c160, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>OmniChat</div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>SuperApp Admin Ops</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 24 }}>
          {[
            { id: 'overview', label: 'System Overview', icon: ShieldCheck },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'moderation', label: 'Content Moderation', icon: AlertTriangle, badge: reports.length },
            { id: 'financials', label: 'Financial Ledger', icon: CreditCard },
            { id: 'services', label: 'Mini Apps & Official', icon: Smartphone }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'rgba(7, 193, 96, 0.15)' : 'transparent',
                  color: isActive ? '#07c160' : '#94a3b8',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge ? (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: 999 }}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Operator Badge */}
        <div style={{ marginTop: 'auto', background: '#1e293b', padding: '12px', borderRadius: 12, border: '1px solid #334155' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Logged in Operator:</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>SuperAdmin (Root)</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: 2 }}>● Full RBAC Authority</div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{
          height: 64,
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>
            {activeTab === 'overview' && 'System Health & Metrics'}
            {activeTab === 'users' && 'User Management & Suspension Controls'}
            {activeTab === 'moderation' && 'Moments & Feed Moderation Queue'}
            {activeTab === 'financials' && 'WeChat Pay Ledger & Webhooks'}
            {activeTab === 'services' && 'Mini Programs & Business Directory'}
          </div>

          <button
            onClick={fetchDashboardData}
            style={{
              background: '#1f2937',
              border: '1px solid #374151',
              color: '#f8fafc',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Tab Views */}
        <div style={{ padding: '32px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                <div style={{ background: '#131c2e', padding: 20, borderRadius: 16, border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Registered Users</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#07c160', marginTop: 6 }}>
                    {metrics?.totalUsers || 3}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: 4 }}>● Active Accounts: {metrics?.activeUsers || 3}</div>
                </div>

                <div style={{ background: '#131c2e', padding: 20, borderRadius: 16, border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Active Conversations</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#38bdf8', marginTop: 6 }}>
                    {metrics?.totalConversations || 1}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>Total Messages: {metrics?.totalMessages || 3}</div>
                </div>

                <div style={{ background: '#131c2e', padding: 20, borderRadius: 16, border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Moments Shared</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', marginTop: 6 }}>
                    {metrics?.totalPosts || 2}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>Friends & Public Feeds</div>
                </div>

                <div style={{ background: '#131c2e', padding: 20, borderRadius: 16, border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Wallet Ledger Turnover</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#e04a3f', marginTop: 6 }}>
                    {metrics?.totalWalletTurnover || '¥3,296.50'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: 4 }}>Immutable Minor Units</div>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{
                background: '#111827',
                border: '1px solid #10b981',
                borderRadius: 16,
                padding: '20px 24px',
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>System Integrity: All Nodes Operational</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: 4 }}>
                    Socket.IO Realtime Gateway • Cryptographic QR Verifier • Red Packet Ledger • WebRTC Signaling
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '6px 12px', borderRadius: 8, fontSize: '12px', fontWeight: 700 }}>
                    LATENCY: 12ms
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div>
              {/* Search bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#131c2e', padding: '10px 16px', borderRadius: 12, border: '1px solid #1e293b', marginBottom: 20, maxWidth: 450 }}>
                <Search size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                <input
                  type="text"
                  placeholder="Search by display name, username, phone..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px', width: '100%' }}
                />
              </div>

              <div style={{ background: '#131c2e', borderRadius: 16, border: '1px solid #1e293b', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ background: '#1e293b', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 20px' }}>User</th>
                      <th style={{ padding: '14px 20px' }}>Identifier</th>
                      <th style={{ padding: '14px 20px' }}>Region</th>
                      <th style={{ padding: '14px 20px' }}>Wallet Balance</th>
                      <th style={{ padding: '14px 20px' }}>Status</th>
                      <th style={{ padding: '14px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={u.avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{u.displayName}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>@{u.username}</div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{u.phoneNumber || u.email}</td>
                        <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{u.region || 'Global'}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: '#10b981' }}>¥{u.balanceFormatted}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: u.status === 'SUSPENDED' ? '#7f1d1d' : 'rgba(16, 185, 129, 0.2)',
                            color: u.status === 'SUSPENDED' ? '#fca5a5' : '#10b981'
                          }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            style={{
                              background: u.status === 'SUSPENDED' ? '#07c160' : '#dc2626',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {u.status === 'SUSPENDED' ? 'Restore User' : 'Suspend Account'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MODERATION */}
          {activeTab === 'moderation' && (
            <div>
              {reports.length === 0 ? (
                <div style={{ background: '#131c2e', padding: 40, borderRadius: 16, textAlign: 'center', color: '#94a3b8' }}>
                  <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Moderation Queue Clear</div>
                  <div style={{ fontSize: '13px', marginTop: 4 }}>No unresolved user or post reports at this time.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {reports.map(r => (
                    <div key={r.id} style={{ background: '#131c2e', borderRadius: 14, padding: 18, border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f8fafc' }}>
                          Reported {r.targetType.toUpperCase()}: #{r.targetId}
                        </div>
                        <div style={{ fontSize: '13px', color: '#f87171', marginTop: 4 }}>
                          Reason: {r.reason} ({r.details || 'No additional note'})
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 4 }}>
                          Filed by: @{r.reporterName} on {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          onClick={() => handleResolveReport(r.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Enforce & Remove Content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINANCIALS */}
          {activeTab === 'financials' && (
            <div>
              <div style={{ background: '#131c2e', borderRadius: 16, border: '1px solid #1e293b', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ background: '#1e293b', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 20px' }}>Tx ID</th>
                      <th style={{ padding: '14px 20px' }}>Type</th>
                      <th style={{ padding: '14px 20px' }}>Description</th>
                      <th style={{ padding: '14px 20px' }}>Amount</th>
                      <th style={{ padding: '14px 20px' }}>Idempotency Key</th>
                      <th style={{ padding: '14px 20px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#38bdf8' }}>{t.id}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 700 }}>{t.type}</td>
                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{t.description}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 800, color: t.amountCents > 0 ? '#10b981' : '#f87171' }}>
                          {t.amountCents > 0 ? `+¥${t.amountFormatted}` : `-¥${Math.abs(t.amountFormatted)}`}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                          {t.idempotencyKey.slice(0, 16)}...
                        </td>
                        <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{new Date(t.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: 16 }}>Verified Mini Programs (小程序)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { name: "Jump 2048 (跳一跳)", category: "Games", users: "12.4M", status: "Active" },
                  { name: "OmniRide (滴滴出行)", category: "Mobility", users: "45.1M", status: "Active" },
                  { name: "OmniEats (美团外卖)", category: "Food Delivery", users: "68.3M", status: "Active" },
                  { name: "SkyCast Weather (天气通)", category: "Utilities", users: "18.2M", status: "Active" }
                ].map((app, idx) => (
                  <div key={idx} style={{ background: '#131c2e', padding: 18, borderRadius: 14, border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{app.name}</div>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '3px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
                        {app.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>{app.category} • {app.users} Active Users</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
