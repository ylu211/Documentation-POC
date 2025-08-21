// backend/scripts/generateSwagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const swaggerDefinition = require('../docs.config');

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/user.route.js'), 
    path.join(__dirname, '../routes/product.route.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync(
  path.join(__dirname, '../../docs/static/swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);