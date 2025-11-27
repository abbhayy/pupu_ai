const { body, query, validationResult } = require('express-validator');
const { Generation, Language, User } = require('../models');
const { generateCode } = require('../services/aiService');

/**
 * @swagger
 * /api/generate:
 *   post:
 *     summary: Generate code from natural language prompt
 *     tags: [Generate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - language
 *             properties:
 *               prompt:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *                 description: Natural language description of code to generate
 *                 example: Write a Python function to reverse a string
 *               language:
 *                 type: string
 *                 description: Programming language (must match supported languages)
 *                 example: Python
 *               userId:
 *                 type: integer
 *                 description: Optional user ID
 *                 example: 1
 *     responses:
 *       201:
 *         description: Code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     prompt:
 *                       type: string
 *                     language:
 *                       type: string
 *                     code:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or unsupported language
 *       500:
 *         description: Server error
 */
exports.generate = [
  // Validation
  body('prompt')
    .notEmpty().withMessage('Prompt is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Prompt must be between 10 and 5000 characters')
    .trim(),
  body('language')
    .notEmpty().withMessage('Language is required')
    .trim(),
  body('userId')
    .optional()
    .isInt().withMessage('User ID must be an integer'),

  // Handler
  async (req, res, next) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        console.log('Request body:', req.body);
        return res.status(400).json({
          success: false,
          errors: errors.array().map(err => err.msg)
        });
      }

      const { prompt, language, userId } = req.body;

      // Find language in database
      const languageRecord = await Language.findOne({
        where: { name: language }
      });

      if (!languageRecord) {
        return res.status(400).json({
          success: false,
          error: `Language "${language}" is not supported. Please choose from available languages.`
        });
      }

      // Verify user exists if userId provided
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(400).json({
            success: false,
            error: 'Invalid user ID'
          });
        }
      }

      // Generate code using AI
      const code = await generateCode(prompt, language);

      // Save to database
      const generation = await Generation.create({
        prompt,
        languageId: languageRecord.id,
        userId: userId || null,
        code
      });

      // Fetch complete record with associations
      const result = await Generation.findByPk(generation.id, {
        include: [
          {
            model: Language,
            as: 'language',
            attributes: ['name', 'extension']
          },
          {
            model: User,
            as: 'user',
            attributes: ['username', 'email'],
            required: false
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: {
          id: result.id,
          prompt: result.prompt,
          language: result.language.name,
          code: result.code,
          createdAt: result.createdAt,
          user: result.user ? {
            username: result.user.username,
            email: result.user.email
          } : null
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get paginated history of code generations
 *     tags: [History]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language name
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Generation history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     generations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *       400:
 *         description: Validation error
 */
exports.getHistory = [
  // Validation
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
    .toInt(),
  query('language')
    .optional()
    .trim(),
  query('userId')
    .optional()
    .isInt().withMessage('User ID must be an integer')
    .toInt(),

  // Handler
  async (req, res, next) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(err => err.msg)
        });
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;
      const { language, userId } = req.query;

      // Build where clause for filtering
      const where = {};
      if (userId) {
        where.userId = userId;
      }

      // Build include clause for language filtering
      const include = [
        {
          model: Language,
          as: 'language',
          attributes: ['name', 'extension'],
          ...(language && { where: { name: language } })
        },
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email'],
          required: false
        }
      ];

      // Fetch generations with pagination
      const { count, rows: generations } = await Generation.findAndCountAll({
        where,
        include,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      res.json({
        success: true,
        data: {
          generations: generations.map(gen => ({
            id: gen.id,
            prompt: gen.prompt,
            language: gen.language.name,
            code: gen.code,
            createdAt: gen.createdAt,
            user: gen.user ? {
              username: gen.user.username,
              email: gen.user.email
            } : null
          })),
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage,
            hasPreviousPage
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Get all supported programming languages
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: List of supported languages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       extension:
 *                         type: string
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: Python
 *                   extension: .py
 *                 - id: 2
 *                   name: JavaScript
 *                   extension: .js
 */
exports.getLanguages = async (req, res, next) => {
  try {
    const languages = await Language.findAll({
      attributes: ['id', 'name', 'extension'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: languages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
exports.healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
};
