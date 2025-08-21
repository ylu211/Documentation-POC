// backend/scripts/generateSwagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerDefinition from '../docs.config.js';

// équivalent __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/product.route.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const outputPath = path.join(__dirname, '../../docs/static/swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`✅ Swagger spec généré dans ${outputPath}`);
