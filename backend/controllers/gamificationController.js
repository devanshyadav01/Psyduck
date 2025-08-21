const { users, userStats, leaderboard, badges, achievements } = require('../data/db');

// Helper to initialize stats for a user if they don't exist
const ensureUserStats = (userId) => {
  if (!userStats[userId]) {
    const user = users.find(u => u.id === userId);
    userStats[userId] = {
      level: user ? user.level : 1,
      xp: user ? user.xp : 0,
      xpToNextLevel: 100, // Simplified logic
      totalProjectsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      badges: [],
      achievements: [],
    };
  }
};

exports.getUserStats = (req, res) => {
  const userId = req.user.id;
  ensureUserStats(userId);
  res.json(userStats[userId]);
};

exports.getLeaderboard = (req, res) => {
  // In a real app, this would be calculated and sorted.
  // For now, we'll return a static or pre-sorted list.
  const sortedUsers = [...users]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10) // Top 10
    .map(u => ({ id: u.id, username: u.username, xp: u.xp, level: u.level }));
  
  res.json(sortedUsers);
};

exports.getBadges = (req, res) => {
  // Returns all available badges
  res.json(badges);
};

exports.dailyCheckin = (req, res) => {
  const userId = req.user.id;
  ensureUserStats(userId);

  // This is a simplified check-in. A real app would check the last check-in date.
  userStats[userId].currentStreak += 1;
  if (userStats[userId].currentStreak > userStats[userId].longestStreak) {
    userStats[userId].longestStreak = userStats[userId].currentStreak;
  }
  
  const xpGained = 10 + (userStats[userId].currentStreak * 2); // Bonus for streak
  userStats[userId].xp += xpGained;
  
  const user = users.find(u => u.id === userId);
  if (user) {
      user.xp = userStats[userId].xp;
  }

  res.json({
    message: 'Check-in successful!',
    xpGained,
    currentStreak: userStats[userId].currentStreak,
  });
};

exports.getAchievements = (req, res) => {
  const userId = req.user.id;
  ensureUserStats(userId);
  res.json(userStats[userId].achievements);
};

