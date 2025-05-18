import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/properties/');
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get all properties
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        user: true
      }
    });

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch properties' 
    });
  }
});

// Get properties by user
router.get('/user/:userId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        userId: parseInt(req.params.userId)
      },
      include: {
        user: true
      }
    });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        user: true
      }
    });
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }
    
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new property
router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await prisma.property.create({
      data: {
        ...req.body,
        userId: req.user.id
      },
      include: {
        user: true
      }
    });
    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
});

// Update property
router.put('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if user is owner or admin
    if (property.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: {
        id: req.params.id
      },
      data: req.body,
      include: {
        user: true
      }
    });
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(400).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
});

// Upload property images
router.post('/:id/images', auth, upload.array('images', 5), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if user is owner or admin
    if (property.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
    const updatedProperty = await prisma.property.update({
      where: {
        id: req.params.id
      },
      data: {
        images: imageUrls
      },
      include: {
        user: true
      }
    });
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error uploading images:', err);
    res.status(400).json({ message: err instanceof Error ? err.message : 'Server error' });
  }
});

// Delete property
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: req.params.id
      }
    });
    
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if user is owner or admin
    if (property.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await prisma.property.delete({
      where: {
        id: req.params.id
      }
    });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 