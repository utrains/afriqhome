const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

const authController = {
  async register(req, res) {
    try {
      console.log('Received registration request:', req.body); // Debug log

      const { name, email, password, phone, role, agency } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        console.log('Missing required fields:', { name, email, password }); // Debug log
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
          details: {
            name: !name ? 'Name is required' : undefined,
            email: !email ? 'Email is required' : undefined,
            password: !password ? 'Password is required' : undefined
          }
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      console.log('Creating new user with data:', { // Debug log
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: '***', // Don't log actual password
        phone: phone?.trim(),
        role: role || 'user',
        agency: agency ? {
          name: agency.name?.trim(),
          license: agency.license?.trim(),
          address: agency.address?.trim()
        } : null
      });

      // Create new user
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone?.trim(),
        role: role || 'user',
        agency: agency ? {
          name: agency.name?.trim(),
          license: agency.license?.trim(),
          address: agency.address?.trim()
        } : null
      });

      console.log('User created successfully:', { // Debug log
        id: user.id,
        name: user.name,
        email: user.email
      });

      // Create JWT token
      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          agency: user.agency ? {
            name: user.agency_name,
            license: user.agency_license,
            address: user.agency_address
          } : null
        }
      });
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message,
        details: error.detail // Include PostgreSQL error details if available
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          agency: {
            name: user.agency_name,
            license: user.agency_license,
            address: user.agency_address
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          agency: {
            name: user.agency_name,
            license: user.agency_license,
            address: user.agency_address
          }
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = authController; 