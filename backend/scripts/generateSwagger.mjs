// scripts/generateSwagger.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_URL = 'http://localhost:3000/api/swagger-json';

class DocsGenerator {
  async generate() {
    console.log('Génération Swagger JSON depuis NestJS...');
    
    try {
      const response = await fetch(SWAGGER_URL);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Vérifiez que l'app NestJS tourne sur localhost:3000`);
      }
      
      const swaggerSpec = await response.json();
      console.log(`Swagger récupéré: ${Object.keys(swaggerSpec.paths || {}).length} endpoints`);
      
      this.saveSwagger(swaggerSpec);
      
      console.log('Documentation JSON générée avec succès!');
      
    } catch (error) {
      console.error('Erreur:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('Solution: Démarrez votre app NestJS avec "npm run start:dev"');
      }
      process.exit(1);
    }
  }
  
  saveSwagger(swaggerSpec) {
    const staticDir = path.join(__dirname, '../../docs/static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    const swaggerPath = path.join(staticDir, 'swagger.json');
    fs.writeFileSync(swaggerPath, JSON.stringify(swaggerSpec, null, 2));
    console.log(`Swagger sauvé: ${swaggerPath}`);
  }
}

const generator = new DocsGenerator();
generator.generate().catch(console.error);

export default DocsGenerator;