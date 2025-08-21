const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/db'); // Using require for CJS

// A simple in-memory store for refresh tokens
const refreshTokens = [];
const JWT_SECRET = 'your_super_secret_key'; // In production, use environment variables
const JWT_REFRESH_SECRET = 'your_super_secret_refresh_key';

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Please provide email, password, and username' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: String(users.length + 1),
    email,
    username,
    password: hashedPassword,
    level: 1,
    xp: 0,
    subscription: 'free',
    membership: 'free',
  };

  users.push(newUser);

  // Sign tokens on successful registration
  const userToSign = { id: newUser.id, email: newUser.email };
  const accessToken = jwt.sign(userToSign, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(userToSign, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  refreshTokens.push(refreshToken);

  // Exclude password from the returned user object
  const userToReturn = { ...newUser };
  delete userToReturn.password;
  // Normalize naming for frontend expectations
  if (!userToReturn.membership) {
    userToReturn.membership = userToReturn.subscription || 'free';
  }

  res.status(201).json({ 
    message: 'User registered successfully', 
    accessToken, 
    refreshToken,
    user: userToReturn 
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const userToSign = { id: user.id, email: user.email };

  const accessToken = jwt.sign(userToSign, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(userToSign, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  refreshTokens.push(refreshToken);

  const userToReturn = { ...user };
  delete userToReturn.password;
  if (!userToReturn.membership) {
    userToReturn.membership = userToReturn.subscription || 'free';
  }

  res.json({ 
    message: "Login successful",
    accessToken, 
    refreshToken,
    user: userToReturn
  });
};

exports.logout = (req, res) => {
    // In a real app, you'd invalidate the token, e.g., by using a blocklist.
    // For this simple implementation, we'll just send a success message.
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = (req, res) => {
  // This function assumes that authentication middleware has already run
  // and attached the user object to the request.
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userToReturn = { ...user };
  delete userToReturn.password;

  res.json(userToReturn);
};

