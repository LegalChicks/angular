import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// @route   GET /api/analytics
// @desc    Get analytics data
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate forecast data
    const forecast = days.map(day => ({
      day,
      predictedYield: Math.floor(Math.random() * (135 - 110 + 1)) + 110, // Random yield between 110 and 135
    }));

    // Generate feed efficiency score
    const feedEfficiencyScore = parseFloat((Math.random() * (95 - 80) + 80).toFixed(2));

    const analyticsData = {
      eggYieldForecast: forecast,
      feedEfficiencyScore,
      mortalityRisk: {
        level: 'Low',
        reason: 'Flock health metrics are stable. Weather conditions are optimal. No immediate concerns detected.'
      }
    };

    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
});

export default router;

