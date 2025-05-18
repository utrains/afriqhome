import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret as Secret) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }
  next();
};

// Middleware to check if user is agent
export const isAgent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'AGENT') {
    res.status(403).json({ success: false, message: 'Access denied. Agent privileges required.' });
    return;
  }
  next();
};

// Middleware to check if user is verified
export const isVerified = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.is_verified) {
    res.status(403).json({ success: false, message: 'Please verify your email address to access this resource.' });
    return;
  }
  next();
}; 