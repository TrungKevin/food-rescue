const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Rescue API Documentation',
      version: '1.0.0',
      description: 'Hệ thống giải cứu món ăn sắp hết hạn với sự hỗ trợ của AI Gemini',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file chứa ghi chú API
};

const specs = swaggerJsdoc(options);
module.exports = specs;
