import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import propertyRoutes from './properties';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);

export default router; 