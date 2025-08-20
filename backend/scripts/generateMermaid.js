const fs = require('fs');
const path = require('path');
const glob = require('glob');

// --- Configuration des chemins
const ROUTES_DIR = path.join(__dirname, '../routes');
const DIAGRAMS_DIR = path.join(__dirname, '../../docs/docs/diagrams');
const OUTPUT_MD_FILE = path.join(__dirname, '../../docs/docs/architecture.md');

const initialContent = `# Architecture de l'API

Cette page est générée automatiquement à partir du code source du projet. Elle présente les principaux diagrammes d'architecture, assurant ainsi une documentation toujours à jour.

---

`;

const MERMAID_STYLES = `
classDef GET fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef POST fill:#2196f3,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef PUT fill:#ff9800,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef DELETE fill:#f44346,stroke:#333,stroke-width:1px,color:#fff,rx:10,ry:10;
classDef LAYER fill:#b3e5fc,stroke:#333,stroke-width:1px,color:#333;
`;

const ROUTE_REGEX = /\.(get|post|put|delete)\(['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g;

if (!fs.existsSync(DIAGRAMS_DIR)) {
  fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}

let finalMarkdown = initialContent;
const files = glob.sync(`${ROUTES_DIR}/*.route.js`);

if (files.length === 0) {
  console.warn('⚠️ Aucun fichier de route trouvé. Le fichier architecture.md ne sera pas mis à jour.');
  fs.writeFileSync(OUTPUT_MD_FILE, initialContent);
} else {
  files.forEach((file) => {
    const serviceName = path.basename(file, '.route.js');
    const fileContent = fs.readFileSync(file, 'utf8');
    let match;

    while ((match = ROUTE_REGEX.exec(fileContent)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      const functionsString = match[3];

      const functions = functionsString.split(',').map(f => f.trim()).filter(Boolean);
      
      const routeId = `${method}_${serviceName}_${ROUTE_REGEX.lastIndex}`;
      let diagram = `graph LR\n${MERMAID_STYLES}\n\n`;
      let prevNodeId = `Client_${serviceName}`;
      
      const layerNodes = [];

      // Définition des sous-graphes pour une meilleure clarté
      diagram += `subgraph Endpoints\n`;
      diagram += `  ${routeId}(("${method} ${serviceName}${routePath}"))\n`;
      diagram += `end\n\n`;
      
      diagram += `subgraph Logic\n`;
      functions.forEach((func, index) => {
          const isController = func.includes('Controller') || index === functions.length - 1;
          const nodeLabel = isController ? `${func}` : `${func}`;
          const nodeId = `${isController ? 'Controller' : 'Middleware'}_${func.replace(/[^a-zA-Z0-9_.]/g, '')}_${index}`;
          
          diagram += `  ${nodeId}[/${nodeLabel}/]\n`;
          layerNodes.push(nodeId);
      });
      diagram += `end\n\n`;

      diagram += `subgraph Data Layer\n`;
      const databaseId = `database_${serviceName}`;
      diagram += `  ${databaseId}[/Database/]\n`;
      diagram += `end\n\n`;

      // Chaînage des nœuds
      diagram += `  Client --> ${routeId}\n`;
      
      let currentChain = [routeId, ...layerNodes];
      for (let i = 0; i < currentChain.length -1; i++) {
        diagram += `  ${currentChain[i]} --> ${currentChain[i+1]}\n`;
      }
      diagram += `  ${layerNodes[layerNodes.length-1]} --> ${databaseId}\n`;

      // Classes de style
      diagram += `\n  class ${routeId} ${method};\n`;
      if (layerNodes.length > 0) {
          diagram += `  class ${layerNodes.join(',')} LAYER;\n`;
      }
      diagram += '\n';

      finalMarkdown += `## Diagramme du service : ${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} - Route ${method} ${routePath}\n\n`;
      finalMarkdown += '```mermaid\n';
      finalMarkdown += diagram;
      finalMarkdown += '```\n\n';
      
      const outputPath = path.join(DIAGRAMS_DIR, `${serviceName}_${method}_${ROUTE_REGEX.lastIndex}.mmd`);
      fs.writeFileSync(outputPath, diagram);
      console.log(`✅ Diagramme généré pour la route ${serviceName}:${method} - ${outputPath}`);
    }
  });

  fs.writeFileSync(OUTPUT_MD_FILE, finalMarkdown);
  console.log(`✅ Fichier de documentation mis à jour: ${OUTPUT_MD_FILE}`);
}