import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock database (same as auth.js - in production, use a shared database)
const users = [
  { id: '1', name: 'Admin User', email: 'admin@legalchicks.vip', password: 'admin', role: 'admin', visibility: 'public' },
  { id: '2', name: 'Alice Johnson', email: 'alice.j@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '3', name: 'Brenda Smith', email: 'brenda.s@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '4', name: 'Carla Davis', email: 'carla.d@example.com', password: 'password', role: 'member', visibility: 'private' },
  { id: '5', name: 'Diana Miller', email: 'diana.m@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '6', name: 'Eva Wilson', email: 'eva.w@example.com', password: 'password', role: 'member', visibility: 'private' },
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Helper function to exclude password from user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// @route   GET /api/users/members
// @desc    Get all members
// @access  Private
router.get('/members', verifyToken, async (req, res) => {
  try {
    const members = users.map(user => sanitizeUser(user));
    res.json(members);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching members'
    });
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile/:id
// @desc    Update user profile
// @access  Private
router.put('/profile/:id', verifyToken, async (req, res) => {
  try {
    const { name, email, visibility } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only allow users to update their own profile (or admin to update anyone)
    const currentUser = users.find(u => u.id === req.userId);
    if (currentUser?.role !== 'admin' && currentUser?.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Update user
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (visibility) users[userIndex].visibility = visibility;

    res.json({
      success: true,
      user: sanitizeUser(users[userIndex])
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

export default router;

