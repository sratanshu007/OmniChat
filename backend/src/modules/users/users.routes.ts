import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET ME
// GET /api/v1/users/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const user = dbStore.users.find(u => u.id === userId);
  const profile = dbStore.profiles.find(p => p.userId === userId);
  const wallet = dbStore.walletAccounts.find(w => w.userId === userId);

  res.json({
    success: true,
    user: {
      ...user,
      profile,
      wallet: wallet ? {
        balanceCents: Number(wallet.balanceCents),
        balanceFormatted: (Number(wallet.balanceCents) / 100).toFixed(2),
        currency: wallet.currency
      } : null
    }
  });
});

// 2. UPDATE PROFILE
// PATCH /api/v1/users/me
router.patch('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { displayName, bio, region, avatarUrl, gender } = req.body;

  let profile = dbStore.profiles.find(p => p.userId === userId);
  if (!profile) {
    profile = {
      id: `prof-${userId}`,
      userId,
      displayName: displayName || req.user.username,
      avatarUrl: null,
      bio: null,
      region: null,
      publicQrId: `qr-${userId}`,
      createdAt: new Date().toISOString()
    };
    dbStore.profiles.push(profile);
  }

  if (displayName) profile.displayName = displayName;
  if (bio !== undefined) profile.bio = bio;
  if (region !== undefined) profile.region = region;
  if (avatarUrl) profile.avatarUrl = avatarUrl;
  if (gender) profile.gender = gender;

  res.json({ success: true, profile });
});

// 3. SEARCH USERS
// GET /api/v1/users/search?q=...
router.get('/search', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const currentUserId = req.user.id;

  if (!query) return res.json({ success: true, users: [] });

  const matched = dbStore.users
    .filter(u => u.id !== currentUserId && (
      u.username.toLowerCase().includes(query) ||
      (u.phoneNumber && u.phoneNumber.includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    ))
    .map(u => {
      const profile = dbStore.profiles.find(p => p.userId === u.id);
      return {
        id: u.id,
        username: u.username,
        displayName: profile?.displayName || u.username,
        avatarUrl: profile?.avatarUrl,
        region: profile?.region
      };
    });

  res.json({ success: true, users: matched });
});

export default router;
