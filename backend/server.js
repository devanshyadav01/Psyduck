const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/projects');
const gamificationRoutes = require('./routes/gamification');
const notificationRoutes = require('./routes/notifications');
const codeRoutes = require('./routes/code');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON bodies

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running!' });
});

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/projects', projectRoutes);
app.use('/gamification', gamificationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/code', codeRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
