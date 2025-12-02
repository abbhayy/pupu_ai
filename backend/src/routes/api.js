const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// API root - welcome message
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Code Generation Copilot API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getCurrentUser: 'GET /api/auth/me'
      },
      languages: 'GET /api/languages',
      generate: 'POST /api/generate',
      history: 'GET /api/history'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check
router.get('/health', codeController.healthCheck);

// Authentication routes (public)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Protected routes - require authentication
router.get('/auth/me', authMiddleware, authController.getCurrentUser);

// Get supported languages
router.get('/languages', codeController.getLanguages);

// Generate code - requires authentication
router.post('/generate', authMiddleware, codeController.generate);

// Get generation history - requires authentication
router.get('/history', authMiddleware, codeController.getHistory);

module.exports = router;
