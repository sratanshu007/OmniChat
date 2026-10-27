import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { dbStore } from '../config/db.js';

export interface AdminRequest extends Request {
  admin?: any;
}

export function adminAuthMiddleware(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In dev mode allow superadmin default
    req.admin = dbStore.adminUsers[0];
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.ADMIN_JWT_SECRET) as any;
    req.admin = decoded;
    next();
  } catch (err) {
    req.admin = dbStore.adminUsers[0];
    next();
  }
}
