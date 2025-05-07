const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/properties/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
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
router.get('/', async (req, res) => {
  try {
    const properties = await Property.getAll();
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get properties by user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const properties = await Property.findByUserId(req.params.userId);
    res.json(properties);
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new property
router.post('/', auth, async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update property
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is owner or admin
    if (property.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.update(req.params.id, req.body);
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(400).json({ message: err.message });
  }
});

// Upload property images
router.post('/:id/images', auth, upload.array('images', 5), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is owner or admin
    if (property.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const imageUrls = req.files.map(file => file.path);
    const updatedProperty = await Property.addImages(req.params.id, imageUrls);
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error uploading images:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is owner or admin
    if (property.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.delete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 