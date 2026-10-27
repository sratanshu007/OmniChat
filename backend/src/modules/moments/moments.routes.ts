import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET MOMENTS FEED
// GET /api/v1/moments/feed
router.get('/feed', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const friendIds = dbStore.friendships
    .filter(f => f.userId1 === userId || f.userId2 === userId)
    .map(f => (f.userId1 === userId ? f.userId2 : f.userId1));

  const allowedAuthorIds = [userId, ...friendIds];

  const feed = dbStore.posts
    .filter(p => !p.isDeleted && allowedAuthorIds.includes(p.authorId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(p => {
      const author = dbStore.users.find(u => u.id === p.authorId);
      const profile = dbStore.profiles.find(prof => prof.userId === p.authorId);
      return {
        ...p,
        author: {
          id: author?.id,
          username: author?.username,
          displayName: profile?.displayName || author?.username,
          avatarUrl: profile?.avatarUrl
        }
      };
    });

  res.json({ success: true, posts: feed });
});

// 2. CREATE POST
// POST /api/v1/posts
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const authorId = req.user.id;
  const { content, media = [], locationName, audience = 'FRIENDS_ONLY' } = req.body;

  if (!content && media.length === 0) {
    return res.status(400).json({ error: 'Post must contain text content or media' });
  }

  const newPost = {
    id: `post-${uuidv4().slice(0, 8)}`,
    authorId,
    content: content || '',
    locationName: locationName || null,
    audience,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    media: media.map((m: any, idx: number) => ({
      id: `m-${uuidv4().slice(0, 6)}`,
      mediaUrl: typeof m === 'string' ? m : m.mediaUrl,
      mediaType: m.mediaType || 'IMAGE',
      order: idx
    })),
    likes: [],
    comments: []
  };

  dbStore.posts.unshift(newPost);

  const author = dbStore.users.find(u => u.id === authorId);
  const profile = dbStore.profiles.find(prof => prof.userId === authorId);

  res.status(201).json({
    success: true,
    post: {
      ...newPost,
      author: {
        id: author?.id,
        username: author?.username,
        displayName: profile?.displayName,
        avatarUrl: profile?.avatarUrl
      }
    }
  });
});

// 3. TOGGLE LIKE
// POST /api/v1/posts/:id/likes
router.post('/:id/likes', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const post = dbStore.posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const profile = dbStore.profiles.find(prof => prof.userId === userId);
  const displayName = profile?.displayName || req.user.username;

  const existingIdx = post.likes.findIndex((l: any) => l.userId === userId);
  if (existingIdx !== -1) {
    post.likes.splice(existingIdx, 1);
  } else {
    post.likes.push({ userId, displayName });
  }

  res.json({ success: true, likes: post.likes });
});

// 4. ADD COMMENT
// POST /api/v1/posts/:id/comments
router.post('/:id/comments', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Comment content is required' });

  const post = dbStore.posts.find(p => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const profile = dbStore.profiles.find(prof => prof.userId === userId);
  const authorName = profile?.displayName || req.user.username;

  const newComment = {
    id: `c-${uuidv4().slice(0, 6)}`,
    authorName,
    content,
    createdAt: new Date().toISOString()
  };
  post.comments.push(newComment);

  res.status(201).json({ success: true, comment: newComment });
});

// 5. DELETE POST
// DELETE /api/v1/posts/:id
router.delete('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const post = dbStore.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== userId && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized to delete this post' });
  }

  post.isDeleted = true;
  res.json({ success: true, message: 'Post deleted' });
});

export default router;
