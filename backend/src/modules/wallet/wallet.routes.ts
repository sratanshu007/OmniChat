import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { dbStore } from '../../config/db.js';

const router = Router();

// 1. GET WALLET OVERVIEW
// GET /api/v1/wallet
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  let wallet = dbStore.walletAccounts.find(w => w.userId === userId);
  if (!wallet) {
    wallet = {
      id: `wal-${userId}`,
      userId,
      balanceCents: 100000, // Default 1000.00
      currency: "CNY",
      createdAt: new Date().toISOString()
    };
    dbStore.walletAccounts.push(wallet);
  }

  res.json({
    success: true,
    wallet: {
      id: wallet.id,
      balanceCents: Number(wallet.balanceCents),
      balanceFormatted: (Number(wallet.balanceCents) / 100).toFixed(2),
      currency: wallet.currency
    }
  });
});

// 2. GET TRANSACTION LEDGER
// GET /api/v1/wallet/transactions
router.get('/transactions', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const wallet = dbStore.walletAccounts.find(w => w.userId === userId);
  if (!wallet) return res.json({ success: true, transactions: [] });

  const txs = dbStore.walletTransactions
    .filter(t => t.walletId === wallet.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(t => ({
      ...t,
      amountFormatted: (Number(t.amountCents) / 100).toFixed(2)
    }));

  res.json({ success: true, transactions: txs });
});

// 3. PAYMENT CHECKOUT / TRANSFER (WITH IDEMPOTENCY)
// POST /api/v1/payments/checkout
router.post('/checkout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { amountCents, recipient, description = 'Payment checkout', idempotencyKey } = req.body;

  const key = idempotencyKey || uuidv4();
  const existingTx = dbStore.walletTransactions.find(t => t.idempotencyKey === key);
  if (existingTx) {
    return res.json({ success: true, transaction: existingTx, note: 'Idempotent request matched' });
  }

  const wallet = dbStore.walletAccounts.find(w => w.userId === userId);
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const amt = Number(amountCents);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid payment amount' });

  if (wallet.balanceCents < amt) {
    return res.status(400).json({ error: 'Insufficient wallet balance' });
  }

  // Deduct balance
  wallet.balanceCents -= amt;

  // Record Immutable Ledger
  const tx = {
    id: `tx-${uuidv4().slice(0, 8)}`,
    walletId: wallet.id,
    type: 'DEBIT_PAYMENT',
    amountCents: -amt,
    balanceAfterCents: wallet.balanceCents,
    idempotencyKey: key,
    reference: recipient || 'Vendor',
    description,
    createdAt: new Date().toISOString()
  };
  dbStore.walletTransactions.push(tx);

  res.json({
    success: true,
    newBalanceFormatted: (wallet.balanceCents / 100).toFixed(2),
    transaction: tx
  });
});

// 4. SEND LUCKY RED PACKET (微信红包)
// POST /api/v1/payments/lucky-packet/send
router.post('/lucky-packet/send', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { conversationId, amountCents, greeting = "大吉大利，恭喜发财！🧧" } = req.body;

  const wallet = dbStore.walletAccounts.find(w => w.userId === userId);
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const amt = Number(amountCents);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid red packet amount' });

  if (wallet.balanceCents < amt) {
    return res.status(400).json({ error: 'Insufficient wallet balance to send lucky packet' });
  }

  wallet.balanceCents -= amt;

  const tx = {
    id: `tx-${uuidv4().slice(0, 8)}`,
    walletId: wallet.id,
    type: 'LUCKY_PACKET_SEND',
    amountCents: -amt,
    balanceAfterCents: wallet.balanceCents,
    idempotencyKey: uuidv4(),
    reference: conversationId,
    description: `Lucky Packet: ${greeting}`,
    createdAt: new Date().toISOString()
  };
  dbStore.walletTransactions.push(tx);

  // Send message in conversation
  const senderProfile = dbStore.profiles.find(p => p.userId === userId);
  const msg = {
    id: `msg-${uuidv4().slice(0, 8)}`,
    conversationId,
    senderId: userId,
    type: 'LUCKY_PACKET',
    content: greeting,
    metadata: {
      amountCents: amt,
      amountFormatted: (amt / 100).toFixed(2),
      isClaimed: false,
      senderName: senderProfile?.displayName || req.user.username
    },
    createdAt: new Date().toISOString()
  };
  dbStore.messages.push(msg);

  res.json({
    success: true,
    message: msg,
    newBalanceFormatted: (wallet.balanceCents / 100).toFixed(2)
  });
});

// 5. CLAIM LUCKY RED PACKET
// POST /api/v1/payments/lucky-packet/claim
router.post('/lucky-packet/claim', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { messageId } = req.body;

  const msg = dbStore.messages.find(m => m.id === messageId);
  if (!msg || msg.type !== 'LUCKY_PACKET') {
    return res.status(404).json({ error: 'Lucky red packet not found' });
  }

  if (msg.metadata?.isClaimed) {
    return res.status(400).json({ error: 'Red packet has already been opened' });
  }

  msg.metadata.isClaimed = true;
  msg.metadata.claimedByUserId = userId;

  const claimAmt = msg.metadata.amountCents || 8888;
  const wallet = dbStore.walletAccounts.find(w => w.userId === userId);
  if (wallet) {
    wallet.balanceCents += claimAmt;

    dbStore.walletTransactions.push({
      id: `tx-${uuidv4().slice(0, 8)}`,
      walletId: wallet.id,
      type: 'LUCKY_PACKET_CLAIM',
      amountCents: claimAmt,
      balanceAfterCents: wallet.balanceCents,
      idempotencyKey: uuidv4(),
      reference: messageId,
      description: `Claimed Red Packet from ${msg.metadata.senderName || 'Friend'}`,
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    amountFormatted: (claimAmt / 100).toFixed(2),
    newBalanceFormatted: ((wallet?.balanceCents || 0) / 100).toFixed(2)
  });
});

export default router;
