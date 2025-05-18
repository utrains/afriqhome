import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, isAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        agency_name: true,
        agency_license: true,
        agency_address: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        agency_name: true,
        agency_license: true,
        agency_address: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, role } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is updating their own profile or is admin
    if (user.id !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        role
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        agency_name: true,
        agency_license: true,
        agency_address: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Update user verification status (admin only)
// @access  Private/Admin
router.put('/:id/verify', auth, isAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { is_verified } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        is_verified
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        agency_name: true,
        agency_license: true,
        agency_address: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', auth, isAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await prisma.user.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 