const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versi OpenAPI
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API menggunakan Swagger',
    },
    servers: [
      {
        url: 'http://localhost:4000', // URL server Anda
      },
    ],
  },
  apis: ['./routes/*.js'], // Lokasi file untuk dokumentasi
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpec;
