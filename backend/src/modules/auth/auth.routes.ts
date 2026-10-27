import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../config/db.js';
import { config } from '../../config/env.js';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  identifier: z.string().min(3), // phone or email
  displayName: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).optional()
});

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().optional(),
  otpCode: z.string().optional()
});

// 1. REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { identifier, displayName, username, password } = registerSchema.parse(req.body);

    const isEmail = identifier.includes('@');
    const existing = dbStore.users.find(u =>
      u.username === username || (isEmail ? u.email === identifier : u.phoneNumber === identifier)
    );

    if (existing) {
      return res.status(409).json({ error: 'Username or identifier already exists' });
    }

    const userId = `user-${uuidv4().slice(0, 8)}`;
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = {
      id: userId,
      phoneNumber: isEmail ? null : identifier,
      email: isEmail ? identifier : null,
      username,
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    dbStore.users.push(newUser);

    const newProfile = {
      id: `prof-${uuidv4().slice(0, 8)}`,
      userId,
      displayName,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      bio: "Just joined OmniChat!",
      region: "Global",
      publicQrId: `qr-${userId}`,
      createdAt: new Date().toISOString()
    };
    dbStore.profiles.push(newProfile);

    // Initial Wallet with 500.00 CNY
    dbStore.walletAccounts.push({
      id: `wal-${userId}`,
      userId,
      balanceCents: 50000,
      currency: "CNY",
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign({ id: userId, username, role: 'USER' }, config.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: userId }, config.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      user: { ...newUser, profile: newProfile },
      tokens: { accessToken: token, refreshToken }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message || 'Validation failed' });
  }
});

// 2. LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password, otpCode } = loginSchema.parse(req.body);
    const user = dbStore.users.find(u =>
      u.phoneNumber === identifier || u.email === identifier || u.username === identifier
    );

    if (!user) {
      return res.status(404).json({ error: 'Account not found with this identifier' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'This account has been suspended by administration' });
    }

    // OTP verification or password check
    if (otpCode) {
      if (otpCode !== '888888' && config.MOCK_OTP_MODE !== 'true') {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
    } else if (password && user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ error: 'Incorrect password' });
    }

    const profile = dbStore.profiles.find(p => p.userId === user.id);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: { ...user, profile },
      tokens: { accessToken: token, refreshToken }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// 3. VERIFY OTP
router.post('/verify-otp', (req: Request, res: Response) => {
  const { identifier, code } = req.body;
  if (!identifier || !code) {
    return res.status(400).json({ error: 'Identifier and OTP code required' });
  }
  // Mock mode accepts '888888' or any 6-digit code for quick verification
  res.json({ success: true, verified: true, message: 'OTP verified successfully' });
});

// 4. SWITCH ACCOUNT (FOR TESTING 2-WAY PEER CHAT)
router.post('/switch-account', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = dbStore.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const profile = dbStore.profiles.find(p => p.userId === user.id);
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    user: { ...user, profile },
    accessToken: token
  });
});

export default router;
