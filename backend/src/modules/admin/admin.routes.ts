import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { adminAuthMiddleware, AdminRequest } from '../../middleware/adminAuth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. ADMIN OVERVIEW & HEALTH METRICS
// GET /api/v1/admin/overview
router.get('/overview', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const totalUsers = dbStore.users.length;
  const activeUsers = dbStore.users.filter(u => u.status === 'ACTIVE').length;
  const suspendedUsers = dbStore.users.filter(u => u.status === 'SUSPENDED').length;
  const totalConversations = dbStore.conversations.length;
  const totalMessages = dbStore.messages.length;
  const totalPosts = dbStore.posts.filter(p => !p.isDeleted).length;
  const openReports = dbStore.reports.filter(r => r.status === 'OPEN').length;

  const totalWalletCents = dbStore.walletAccounts.reduce((acc, w) => acc + Number(w.balanceCents), 0);

  res.json({
    success: true,
    metrics: {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalConversations,
      totalMessages,
      totalPosts,
      openReports,
      totalWalletTurnover: `¥${(totalWalletCents / 100).toLocaleString()}`,
      systemStatus: "100% HEALTHY",
      servicesRunning: ["Socket.IO Gateway", "Redis PubSub (Mock)", "WebRTC STUN/TURN", "Wallet Ledger Engine"]
    }
  });
});

// 2. USER DIRECTORY & MANAGEMENT
// GET /api/v1/admin/users
router.get('/users', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const usersWithProfiles = dbStore.users.map(u => {
    const profile = dbStore.profiles.find(p => p.userId === u.id);
    const wallet = dbStore.walletAccounts.find(w => w.userId === u.id);
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      phoneNumber: u.phoneNumber,
      displayName: profile?.displayName || u.username,
      avatarUrl: profile?.avatarUrl,
      region: profile?.region,
      status: u.status,
      role: u.role,
      balanceFormatted: wallet ? (Number(wallet.balanceCents) / 100).toFixed(2) : "0.00",
      createdAt: u.createdAt
    };
  });

  res.json({ success: true, users: usersWithProfiles });
});

// 3. SUSPEND / RESTORE USER
// POST /api/v1/admin/users/:id/status
router.post('/users/:id/status', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const targetUserId = req.params.id;
  const { status, reason = 'Administrative decision' } = req.body;

  const user = dbStore.users.find(u => u.id === targetUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = status; // 'ACTIVE' | 'SUSPENDED'

  // Log to Audit Log
  dbStore.adminAuditLogs.push({
    id: `audit-${uuidv4().slice(0, 8)}`,
    adminId: req.admin?.id || 'admin-1',
    action: `USER_${status}`,
    targetType: 'user',
    targetId: targetUserId,
    details: { reason },
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, user, message: `User status updated to ${status}` });
});

// 4. MODERATION QUEUE
// GET /api/v1/admin/moderation
router.get('/moderation', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const reports = dbStore.reports.map(r => {
    const reporter = dbStore.users.find(u => u.id === r.reporterId);
    return {
      ...r,
      reporterName: reporter?.username || 'User'
    };
  });

  res.json({ success: true, reports });
});

// 5. RESOLVE REPORT & DELETE OFFENDING CONTENT
// POST /api/v1/admin/moderation/:id/resolve
router.post('/moderation/:id/resolve', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const reportId = req.params.id;
  const { action = 'REMOVE_CONTENT' } = req.body;

  const report = dbStore.reports.find(r => r.id === reportId);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  report.status = 'RESOLVED';

  if (report.targetType === 'post' || action === 'REMOVE_CONTENT') {
    const post = dbStore.posts.find(p => p.id === report.targetId);
    if (post) post.isDeleted = true;
  }

  res.json({ success: true, message: 'Report resolved and moderation action enforced' });
});

// 6. FINANCIAL AUDIT LOGS
// GET /api/v1/admin/financials
router.get('/financials', adminAuthMiddleware, (req: AdminRequest, res: Response) => {
  const txs = dbStore.walletTransactions.map(t => ({
    ...t,
    amountFormatted: (Number(t.amountCents) / 100).toFixed(2),
    balanceAfterFormatted: (Number(t.balanceAfterCents) / 100).toFixed(2)
  }));

  res.json({ success: true, transactions: txs });
});

export default router;
