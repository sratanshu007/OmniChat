import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. INITIATE CALL SESSION
// POST /api/v1/calls
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const callerId = req.user.id;
  const { receiverId, callType = 'VOICE' } = req.body;

  if (!receiverId) return res.status(400).json({ error: 'Receiver ID is required' });

  const callId = `call-${uuidv4().slice(0, 8)}`;
  const newCall = {
    id: callId,
    callerId,
    type: callType,
    status: 'RINGING',
    durationSec: 0,
    startedAt: new Date().toISOString(),
    endedAt: null,
    participants: [callerId, receiverId]
  };
  dbStore.calls.push(newCall);

  // STUN/TURN ICE Servers config
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  res.status(201).json({
    success: true,
    call: newCall,
    iceServers
  });
});

// 2. ACCEPT CALL
// POST /api/v1/calls/:id/accept
router.post('/:id/accept', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const call = dbStore.calls.find(c => c.id === req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  call.status = 'ACCEPTED';
  res.json({ success: true, call });
});

// 3. END CALL
// POST /api/v1/calls/:id/end
router.post('/:id/end', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { durationSec = 0 } = req.body;
  const call = dbStore.calls.find(c => c.id === req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  call.status = 'ENDED';
  call.durationSec = durationSec;
  call.endedAt = new Date().toISOString();

  res.json({ success: true, call });
});

// 4. CALL HISTORY
// GET /api/v1/calls/history
router.get('/history', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const history = dbStore.calls
    .filter(c => c.callerId === userId || c.participants.includes(userId))
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  res.json({ success: true, calls: history });
});

export default router;
