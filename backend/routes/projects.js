const express = require('express');
const router = express.Router();
const { getAvailableProjects, getEnrolledProjects, enrollInProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAvailableProjects); // This can be a public route
router.get('/available', getAvailableProjects); // Alias

// These routes should be protected
router.get('/enrolled', protect, getEnrolledProjects);
router.post('/enroll', protect, enrollInProject);

module.exports = router;

