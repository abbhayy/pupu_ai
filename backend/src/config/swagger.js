const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Generation Code Copilot API',
      version: '1.0.0',
      description: 'AI-powered code generation API using Gemini API',
      contact: {
        name: 'Arvind Kumar',
        url: 'https://github.com/akcthecoder200/GenerativeAI-Code-Copilot',
      },
    },
    servers: [
      {
        url: 'https://generative-code-copilot-backend.onrender.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Languages',
        description: 'Supported programming languages',
      },
      {
        name: 'Generate',
        description: 'Code generation endpoints',
      },
      {
        name: 'History',
        description: 'Generation history endpoints',
      },
    ],
  },
  apis: ['./src/controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
