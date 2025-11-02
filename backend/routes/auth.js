import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock database (in production, use a real database)
const users = [
  { id: '1', name: 'Admin User', email: 'admin@legalchicks.vip', password: 'admin', role: 'admin', visibility: 'public' },
  { id: '2', name: 'Alice Johnson', email: 'alice.j@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '3', name: 'Brenda Smith', email: 'brenda.s@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '4', name: 'Carla Davis', email: 'carla.d@example.com', password: 'password', role: 'member', visibility: 'private' },
  { id: '5', name: 'Diana Miller', email: 'diana.m@example.com', password: 'password', role: 'member', visibility: 'public' },
  { id: '6', name: 'Eva Wilson', email: 'eva.w@example.com', password: 'password', role: 'member', visibility: 'private' },
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    { expiresIn: '7d' }
  );
};

// Helper function to exclude password from user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    if (!email || !password) {
      console.warn('[Auth] Login attempt with missing credentials:', {
        email: email || 'not provided',
        ip: clientIp,
        timestamp
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email first
    const user = users.find(u => u.email === email);

    if (!user) {
      console.warn('[Auth] Login failed - user not found:', {
        email,
        ip: clientIp,
        timestamp,
        errorType: 'USER_NOT_FOUND'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please try again.'
      });
    }

    // Check password
    if (user.password !== password) {
      console.warn('[Auth] Login failed - invalid password:', {
        email,
        userId: user.id,
        ip: clientIp,
        timestamp,
        errorType: 'INVALID_PASSWORD'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please try again.'
      });
    }

    // Generate token
    const token = generateToken(user);

    console.log('[Auth] Login successful:', {
      email,
      userId: user.id,
      role: user.role,
      ip: clientIp,
      timestamp
    });

    // Return user data (without password) and token
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('[Auth] Login server error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    if (!name || !email || !password) {
      console.warn('[Auth] Registration attempt with missing fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password,
        ip: clientIp,
        timestamp
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      console.warn('[Auth] Registration failed - email already exists:', {
        email,
        ip: clientIp,
        timestamp,
        errorType: 'EMAIL_EXISTS'
      });
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Create new user with clear profile data
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password, // In production, hash this password!
      role: 'member',
      visibility: 'public' // Default to public so new members appear in directory
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    console.log('[Auth] Registration successful:', {
      email,
      userId: newUser.id,
      ip: clientIp,
      timestamp
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for a verification link.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('[Auth] Registration server error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Public (but requires valid token)
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const clientIp = req.ip || req.connection.remoteAddress;

    if (!token) {
      console.warn('[Auth] Token verification failed - no token provided:', {
        ip: clientIp,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );

    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      console.warn('[Auth] Token verification failed - user not found:', {
        userId: decoded.id,
        email: decoded.email,
        ip: clientIp,
        timestamp: new Date().toISOString(),
        errorType: 'USER_NOT_FOUND'
      });
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    const errorType = error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 
                     error.name === 'JsonWebTokenError' ? 'INVALID_TOKEN' : 'TOKEN_ERROR';
    
    console.warn('[Auth] Token verification failed:', {
      errorType,
      errorMessage: error.message,
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    });

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

export default router;

