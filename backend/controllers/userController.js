const { users } = require('../data/db');

exports.getUserProfile = (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userToReturn = { ...user };
  delete userToReturn.password;

  res.json(userToReturn);
};

exports.updateUserProfile = (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update only the fields that are provided
  users[userIndex] = { ...users[userIndex], ...req.body };
  
  const userToReturn = { ...users[userIndex] };
  delete userToReturn.password;

  res.json({ message: 'Profile updated successfully', user: userToReturn });
};

