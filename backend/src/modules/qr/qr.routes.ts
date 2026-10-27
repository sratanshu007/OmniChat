import { Router, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// Helper to hash tokens with SHA-256
function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// 1. GENERATE / REFRESH MY QR TOKEN
// POST /api/v1/qr-tokens
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  // Revoke existing active tokens for this user
  dbStore.qrTokens
    .filter(t => t.userId === userId && !t.isRevoked)
    .forEach(t => { t.isRevoked = true; });

  // Generate cryptographically unguessable token
  const rawToken = `omnichat_qr_${crypto.randomBytes(24).toString('hex')}`;
  const tokenHash = hashToken(rawToken);

  const qrRecord = {
    id: `qrt-${uuidv4().slice(0, 8)}`,
    userId,
    tokenHash,
    isRevoked: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    scanCount: 0,
    createdAt: new Date().toISOString()
  };
  dbStore.qrTokens.push(qrRecord);

  const user = dbStore.users.find(u => u.id === userId);
  const profile = dbStore.profiles.find(p => p.userId === userId);

  res.json({
    success: true,
    token: rawToken,
    qrPayload: `omnichat://profile?token=${rawToken}`,
    user: {
      id: user?.id,
      username: user?.username,
      displayName: profile?.displayName,
      avatarUrl: profile?.avatarUrl,
      region: profile?.region
    },
    expiresAt: qrRecord.expiresAt
  });
});

// 2. RESOLVE SCANNED QR TOKEN (DOES NOT AUTO-FRIEND - RETURNS PUBLIC PROFILE)
// POST /api/v1/qr-tokens/resolve
router.post('/resolve', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { token } = req.body;
  const currentUserId = req.user.id;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Valid QR token is required' });
  }

  // Clean raw token if passed as deep link URI
  const rawToken = token.startsWith('omnichat://')
    ? (new URL(token).searchParams.get('token') || token)
    : token;

  const tokenHash = hashToken(rawToken);
  const qrRecord = dbStore.qrTokens.find(t => t.tokenHash === tokenHash);

  // Fallback check: if token equals user ID directly in demo mode
  let targetUser: any = null;
  if (qrRecord) {
    if (qrRecord.isRevoked) {
      return res.status(410).json({ error: 'This QR code has been revoked by the owner' });
    }
    if (qrRecord.expiresAt && new Date(qrRecord.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This QR code has expired' });
    }
    qrRecord.scanCount += 1;
    targetUser = dbStore.users.find(u => u.id === qrRecord.userId);
  } else {
    // Check fallback user ID or publicQrId
    targetUser = dbStore.users.find(u =>
      u.id === rawToken ||
      u.username === rawToken ||
      rawToken.includes(u.id)
    );
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'Invalid QR code. No user identity found.' });
  }

  // Prevent self-scanning
  if (targetUser.id === currentUserId) {
    return res.status(400).json({
      error: 'This is your own QR code',
      isSelf: true
    });
  }

  const profile = dbStore.profiles.find(p => p.userId === targetUser.id);

  // Check relationship status
  const isFriend = dbStore.friendships.some(f =>
    (f.userId1 === currentUserId && f.userId2 === targetUser.id) ||
    (f.userId1 === targetUser.id && f.userId2 === currentUserId)
  );

  const pendingRequest = dbStore.friendRequests.find(r =>
    r.status === 'PENDING' &&
    ((r.senderId === currentUserId && r.recipientId === targetUser.id) ||
     (r.senderId === targetUser.id && r.recipientId === currentUserId))
  );

  // Return public profile preview ONLY (No automatic friending)
  res.json({
    success: true,
    targetUser: {
      id: targetUser.id,
      username: targetUser.username,
      displayName: profile?.displayName || targetUser.username,
      avatarUrl: profile?.avatarUrl,
      bio: profile?.bio,
      region: profile?.region,
      isFriend,
      hasPendingRequest: !!pendingRequest,
      pendingDirection: pendingRequest
        ? (pendingRequest.senderId === currentUserId ? 'OUTGOING' : 'INCOMING')
        : null
    }
  });
});

// 3. REVOKE QR TOKEN
// DELETE /api/v1/qr-tokens/current
router.delete('/current', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  dbStore.qrTokens
    .filter(t => t.userId === userId && !t.isRevoked)
    .forEach(t => { t.isRevoked = true; });

  res.json({ success: true, message: 'Current QR code identity revoked' });
});

export default router;
