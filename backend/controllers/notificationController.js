const { notifications } = require('../data/db');
const { v4: uuidv4 } = require('uuid');

// Helper to initialize notifications for a user if they don't exist
const ensureUserNotifications = (userId) => {
  if (!notifications[userId]) {
    notifications[userId] = [
      // Add a default welcome notification
      {
        id: uuidv4(),
        message: 'Welcome to Psyduck! Complete your first project to earn a badge.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

exports.getNotifications = (req, res) => {
  const userId = req.user.id;
  ensureUserNotifications(userId);
  res.json(notifications[userId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

exports.markAsRead = (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.body;

  if (!notificationId) {
    return res.status(400).json({ message: 'Notification ID is required' });
  }

  ensureUserNotifications(userId);
  const notification = notifications[userId].find(n => n.id === notificationId);

  if (notification) {
    notification.read = true;
    res.json({ message: 'Notification marked as read', notification });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

exports.markAllAsRead = (req, res) => {
  const userId = req.user.id;
  ensureUserNotifications(userId);
  notifications[userId].forEach(n => n.read = true);
  res.json({ message: 'All notifications marked as read' });
};

exports.deleteNotification = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    ensureUserNotifications(userId);
    const notificationIndex = notifications[userId].findIndex(n => n.id === id);

    if (notificationIndex > -1) {
        notifications[userId].splice(notificationIndex, 1);
        res.status(200).json({ message: 'Notification deleted' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

