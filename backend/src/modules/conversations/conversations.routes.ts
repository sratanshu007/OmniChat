import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET ALL CONVERSATIONS
// GET /api/v1/conversations
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const userMemberships = dbStore.conversationMembers.filter(m => m.userId === userId);
  const convIds = userMemberships.map(m => m.conversationId);

  const list = dbStore.conversations
    .filter(c => convIds.includes(c.id))
    .map(c => {
      const membership = userMemberships.find(m => m.conversationId === c.id);
      let targetUser = null;
      let title = c.title;
      let avatarUrl = c.avatarUrl;

      if (c.type === 'DIRECT') {
        const otherMember = dbStore.conversationMembers.find(m => m.conversationId === c.id && m.userId !== userId);
        if (otherMember) {
          const user = dbStore.users.find(u => u.id === otherMember.userId);
          const profile = dbStore.profiles.find(p => p.userId === otherMember.userId);
          targetUser = {
            id: user?.id,
            username: user?.username,
            displayName: profile?.displayName || user?.username,
            avatarUrl: profile?.avatarUrl,
            status: 'online'
          };
          title = targetUser.displayName;
          avatarUrl = targetUser.avatarUrl;
        }
      }

      return {
        id: c.id,
        type: c.type,
        title,
        avatarUrl,
        targetUser,
        lastMessageText: c.lastMessageText,
        lastMessageAt: c.lastMessageAt,
        unreadCount: membership?.unreadCount || 0,
        isPinned: membership?.isPinned || false,
        isMuted: membership?.isMuted || false
      };
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  res.json({ success: true, conversations: list });
});

// 2. CREATE CONVERSATION (Direct or Group)
// POST /api/v1/conversations
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user.id;
  const { type = 'DIRECT', targetUserId, title, memberIds = [] } = req.body;

  if (type === 'DIRECT') {
    if (!targetUserId) return res.status(400).json({ error: 'Target user ID is required' });

    // Check existing
    const existing = dbStore.conversations.find(c => {
      if (c.type !== 'DIRECT') return false;
      const members = dbStore.conversationMembers.filter(m => m.conversationId === c.id).map(m => m.userId);
      return members.includes(currentUserId) && members.includes(targetUserId);
    });

    if (existing) {
      return res.json({ success: true, conversation: existing });
    }

    const convId = `conv-${uuidv4().slice(0, 8)}`;
    const newConv = {
      id: convId,
      type: 'DIRECT',
      title: null,
      lastMessageText: 'Say hello!',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    dbStore.conversations.push(newConv);
    dbStore.conversationMembers.push(
      { id: `cm-${uuidv4().slice(0, 6)}`, conversationId: convId, userId: currentUserId, role: 'MEMBER' },
      { id: `cm-${uuidv4().slice(0, 6)}`, conversationId: convId, userId: targetUserId, role: 'MEMBER' }
    );
    return res.status(201).json({ success: true, conversation: newConv });
  }

  // Group Conversation
  const convId = `conv-grp-${uuidv4().slice(0, 8)}`;
  const allMembers = Array.from(new Set([currentUserId, ...memberIds]));
  const newGroup = {
    id: convId,
    type: 'GROUP',
    title: title || 'New Group Chat',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    lastMessageText: 'Group chat created',
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  dbStore.conversations.push(newGroup);
  allMembers.forEach(mId => {
    dbStore.conversationMembers.push({
      id: `cm-${uuidv4().slice(0, 6)}`,
      conversationId: convId,
      userId: mId,
      role: mId === currentUserId ? 'ADMIN' : 'MEMBER'
    });
  });

  res.status(201).json({ success: true, conversation: newGroup });
});

// 3. GET MESSAGES IN CONVERSATION (Cursor-based pagination)
// GET /api/v1/conversations/:id/messages
router.get('/:id/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const convId = req.params.id;
  const userId = req.user.id;

  // Clear unread count for current user
  const member = dbStore.conversationMembers.find(m => m.conversationId === convId && m.userId === userId);
  if (member) member.unreadCount = 0;

  const messages = dbStore.messages
    .filter(m => m.conversationId === convId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(m => {
      const sender = dbStore.users.find(u => u.id === m.senderId);
      const profile = dbStore.profiles.find(p => p.userId === m.senderId);
      return {
        ...m,
        sender: {
          id: sender?.id,
          username: sender?.username,
          displayName: profile?.displayName || sender?.username,
          avatarUrl: profile?.avatarUrl
        }
      };
    });

  res.json({ success: true, messages });
});

// 4. SEND MESSAGE (Persists before broadcast)
// POST /api/v1/conversations/:id/messages
router.post('/:id/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const convId = req.params.id;
  const senderId = req.user.id;
  const { type = 'TEXT', content, metadata } = req.body;

  const conv = dbStore.conversations.find(c => c.id === convId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const messageId = `msg-${uuidv4().slice(0, 8)}`;
  const now = new Date().toISOString();

  const newMessage = {
    id: messageId,
    conversationId: convId,
    senderId,
    type,
    content: content || '',
    metadata: metadata || null,
    isEdited: false,
    isDeleted: false,
    createdAt: now,
    updatedAt: now
  };
  dbStore.messages.push(newMessage);

  // Update conversation last message
  conv.lastMessageText = type === 'LUCKY_PACKET' ? `[Lucky Money 🧧] ${content}` : content;
  conv.lastMessageAt = now;

  // Increment unread count for other members
  dbStore.conversationMembers
    .filter(m => m.conversationId === convId && m.userId !== senderId)
    .forEach(m => { m.unreadCount = (m.unreadCount || 0) + 1; });

  const sender = dbStore.users.find(u => u.id === senderId);
  const profile = dbStore.profiles.find(p => p.userId === senderId);

  const fullMessage = {
    ...newMessage,
    sender: {
      id: sender?.id,
      username: sender?.username,
      displayName: profile?.displayName || sender?.username,
      avatarUrl: profile?.avatarUrl
    }
  };

  res.status(201).json({ success: true, message: fullMessage });
});

export default router;
