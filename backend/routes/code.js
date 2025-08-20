const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

// Code execution should be protected to prevent abuse
router.post('/execute', protect, executeCode);

module.exports = router;

