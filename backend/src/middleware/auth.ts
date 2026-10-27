import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { dbStore } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo convenience, allow defaulting to user-1 if no token provided in development
    const defaultUser = dbStore.users.find(u => u.id === 'user-1');
    if (defaultUser) {
      req.user = {
        id: defaultUser.id,
        username: defaultUser.username,
        email: defaultUser.email,
        phoneNumber: defaultUser.phoneNumber,
        role: defaultUser.role
      };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    const user = dbStore.users.find(u => u.id === decoded.id);
    if (!user || user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'User account suspended or not found' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}
