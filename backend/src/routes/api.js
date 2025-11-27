const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// API root - welcome message
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Code Generation Copilot API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      languages: 'GET /api/languages',
      generate: 'POST /api/generate',
      history: 'GET /api/history'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check
router.get('/health', codeController.healthCheck);

// Get supported languages
router.get('/languages', codeController.getLanguages);

// Generate code
router.post('/generate', codeController.generate);

// Get generation history
router.get('/history', codeController.getHistory);

module.exports = router;
