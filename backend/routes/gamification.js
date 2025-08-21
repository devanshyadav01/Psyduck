const express = require('express');
const router = express.Router();
const { 
  getUserStats, 
  getLeaderboard, 
  getBadges, 
  dailyCheckin, 
  getAchievements 
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/badges', getBadges);

// Protected routes
router.get('/stats', protect, getUserStats);
router.post('/checkin', protect, dailyCheckin);
router.get('/achievements', protect, getAchievements);

module.exports = router;

