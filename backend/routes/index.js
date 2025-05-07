const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Property Listing API' });
});

module.exports = router; 