module.exports = {
  swaggerDefinition: {
    info: {
      title: 'Votre API',
      description: 'Documentation de votre API pour le POC.',
      version: '1.0.0',
    },
    host: 'localhost:5001',
    basePath: '/',
    schemes: ['http'],
  },
  apis: ['./routes/**/*.route.js'], // Scanne tous les fichiers de route
};