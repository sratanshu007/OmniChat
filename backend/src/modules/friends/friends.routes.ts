import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET ACCEPTED FRIENDS
// GET /api/v1/friends
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const friendIds = dbStore.friendships
    .filter(f => f.userId1 === userId || f.userId2 === userId)
    .map(f => (f.userId1 === userId ? f.userId2 : f.userId1));

  const friends = friendIds.map(fId => {
    const user = dbStore.users.find(u => u.id === fId);
    const profile = dbStore.profiles.find(p => p.userId === fId);
    return {
      id: user?.id,
      username: user?.username,
      displayName: profile?.displayName || user?.username,
      avatarUrl: profile?.avatarUrl,
      bio: profile?.bio,
      region: profile?.region,
      status: 'online'
    };
  }).filter(Boolean);

  res.json({ success: true, friends });
});

// 2. SEND FRIEND REQUEST (e.g. from QR Scan public profile preview)
// POST /api/v1/friend-requests
router.post('/requests', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const senderId = req.user.id;
  const { recipientId, source = 'qr_scan', message = "Hi! Let's connect on OmniChat." } = req.body;

  if (!recipientId) return res.status(400).json({ error: 'Recipient ID is required' });
  if (senderId === recipientId) return res.status(400).json({ error: 'Cannot send friend request to yourself' });

  // Check if already friends
  const alreadyFriends = dbStore.friendships.some(f =>
    (f.userId1 === senderId && f.userId2 === recipientId) ||
    (f.userId1 === recipientId && f.userId2 === senderId)
  );
  if (alreadyFriends) {
    return res.status(400).json({ error: 'You are already friends with this user' });
  }

  // Check existing pending request
  let reqRecord = dbStore.friendRequests.find(r =>
    r.status === 'PENDING' &&
    ((r.senderId === senderId && r.recipientId === recipientId) ||
     (r.senderId === recipientId && r.recipientId === senderId))
  );

  if (reqRecord) {
    if (reqRecord.senderId === recipientId) {
      // Recipient already requested us -> auto-accept!
      reqRecord.status = 'ACCEPTED';
      dbStore.friendships.push({
        id: `f-${uuidv4().slice(0, 8)}`,
        userId1: senderId,
        userId2: recipientId,
        createdAt: new Date().toISOString()
      });
      return res.json({ success: true, status: 'ACCEPTED', message: 'Friend request accepted mutually!' });
    }
    return res.status(409).json({ error: 'A pending friend request already exists between you two' });
  }

  const newRequest = {
    id: `fr-${uuidv4().slice(0, 8)}`,
    senderId,
    recipientId,
    source,
    message,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  dbStore.friendRequests.push(newRequest);

  // Add notification
  const senderProfile = dbStore.profiles.find(p => p.userId === senderId);
  dbStore.notifications.push({
    id: `notif-${uuidv4().slice(0, 8)}`,
    userId: recipientId,
    title: 'New Friend Request',
    body: `${senderProfile?.displayName || 'Someone'} sent you a friend request via ${source === 'qr_scan' ? 'QR Code' : 'search'}.`,
    type: 'friend_request',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    request: newRequest,
    message: 'Friend request sent successfully!'
  });
});

// 3. GET FRIEND REQUESTS (Incoming & Outgoing)
// GET /api/v1/friend-requests
router.get('/requests', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const incoming = dbStore.friendRequests
    .filter(r => r.recipientId === userId && r.status === 'PENDING')
    .map(r => {
      const sender = dbStore.users.find(u => u.id === r.senderId);
      const profile = dbStore.profiles.find(p => p.userId === r.senderId);
      return {
        ...r,
        sender: {
          id: sender?.id,
          username: sender?.username,
          displayName: profile?.displayName,
          avatarUrl: profile?.avatarUrl,
          region: profile?.region
        }
      };
    });

  const outgoing = dbStore.friendRequests
    .filter(r => r.senderId === userId && r.status === 'PENDING')
    .map(r => {
      const recipient = dbStore.users.find(u => u.id === r.recipientId);
      const profile = dbStore.profiles.find(p => p.userId === r.recipientId);
      return {
        ...r,
        recipient: {
          id: recipient?.id,
          username: recipient?.username,
          displayName: profile?.displayName,
          avatarUrl: profile?.avatarUrl
        }
      };
    });

  res.json({ success: true, incoming, outgoing });
});

// 4. ACCEPT FRIEND REQUEST
// POST /api/v1/friend-requests/:id/accept
router.post('/requests/:id/accept', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const requestId = req.params.id;

  const request = dbStore.friendRequests.find(r => r.id === requestId && r.recipientId === userId);
  if (!request) return res.status(404).json({ error: 'Friend request not found' });

  request.status = 'ACCEPTED';

  // Create Friendship
  dbStore.friendships.push({
    id: `f-${uuidv4().slice(0, 8)}`,
    userId1: request.senderId,
    userId2: request.recipientId,
    createdAt: new Date().toISOString()
  });

  // Check / Initialize 1-on-1 Conversation
  let conversation = dbStore.conversations.find(c => {
    if (c.type !== 'DIRECT') return false;
    const memberIds = dbStore.conversationMembers.filter(m => m.conversationId === c.id).map(m => m.userId);
    return memberIds.includes(request.senderId) && memberIds.includes(request.recipientId);
  });

  if (!conversation) {
    const convId = `conv-${uuidv4().slice(0, 8)}`;
    conversation = {
      id: convId,
      type: 'DIRECT',
      title: null,
      lastMessageText: 'You are now connected on OmniChat!',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    dbStore.conversations.push(conversation);
    dbStore.conversationMembers.push(
      { id: `cm-${uuidv4().slice(0, 6)}`, conversationId: convId, userId: request.senderId, role: 'MEMBER' },
      { id: `cm-${uuidv4().slice(0, 6)}`, conversationId: convId, userId: request.recipientId, role: 'MEMBER' }
    );
    dbStore.messages.push({
      id: `m-${uuidv4().slice(0, 8)}`,
      conversationId: convId,
      senderId: 'system',
      type: 'SYSTEM',
      content: 'You are now friends! Say hello.',
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: 'Friend request accepted',
    conversationId: conversation.id
  });
});

// 5. REJECT FRIEND REQUEST
// POST /api/v1/friend-requests/:id/reject
router.post('/requests/:id/reject', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const request = dbStore.friendRequests.find(r => r.id === req.params.id && r.recipientId === userId);
  if (!request) return res.status(404).json({ error: 'Friend request not found' });

  request.status = 'REJECTED';
  res.json({ success: true, message: 'Friend request rejected' });
});

// 6. REMOVE FRIEND
// DELETE /api/v1/friends/:userId
router.delete('/:targetUserId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const targetId = req.params.targetUserId;

  dbStore.friendships = dbStore.friendships.filter(f =>
    !((f.userId1 === userId && f.userId2 === targetId) ||
      (f.userId1 === targetId && f.userId2 === userId))
  );

  res.json({ success: true, message: 'Friend removed' });
});

// 7. REPORT USER
// POST /api/v1/friends/:userId/report
router.post('/:targetUserId/report', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const reporterId = req.user.id;
  const targetUserId = req.params.targetUserId;
  const { reason, details } = req.body;

  const report = {
    id: `rep-${uuidv4().slice(0, 8)}`,
    reporterId,
    targetType: 'user',
    targetId: targetUserId,
    targetUserId,
    reason: reason || 'Inappropriate behavior',
    details: details || '',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };
  dbStore.reports.push(report);

  res.json({ success: true, message: 'Report submitted to moderation queue' });
});

export default router;
