const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const authController = {
  async register(req, res) {
    try {
      console.log('Received registration request:', req.body);

      const { name, email, password, phone, role, agency } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        console.log('Missing required fields:', { name, email, password });
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

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user.verification_token}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to Property Listing!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.is_verified,
          agency: user.agency ? {
            name: user.agency_name,
            license: user.agency_license,
            address: user.agency_address
          } : null
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message,
        details: error.detail
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

      // Check if email is verified
      if (!user.is_verified) {
        return res.status(400).json({
          success: false,
          message: 'Please verify your email before logging in'
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
          isVerified: user.is_verified,
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

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await User.verifyEmail(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.generateNewVerificationToken(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User not found or already verified'
        });
      }

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user.verification_token}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to Property Listing!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });

      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      console.error('Resend verification error:', error);
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
          isVerified: user.is_verified,
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