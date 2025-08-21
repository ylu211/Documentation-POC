import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.join(__dirname, '../routes');
const CONTROLLERS_DIR = path.join(__dirname, '../controllers');
const SERVICES_DIR = path.join(__dirname, '../services');
const MIDDLEWARES_DIR = path.join(__dirname, '../middlewares');
const DOCS_DIR = path.join(__dirname, '../../docs/docs');
const MODULES_DIR = path.join(DOCS_DIR, 'modules');
const SWAGGER_FILE = path.join(__dirname, '../../docs/static/swagger.json');
const CACHE_FILE = path.join(__dirname, '.doc-cache.json');

// Configuration Ollama
const OLLAMA_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3';

const HTTP_METHOD_INFO = {
  GET: { action: "récupère", color: "#4caf50", icon: "📖" },
  POST: { action: "crée", color: "#2196f3", icon: "➕" },
  PUT: { action: "met à jour", color: "#ff9800", icon: "✏️" },
  PATCH: { action: "modifie", color: "#ff9800", icon: "🔧" },
  DELETE: { action: "supprime", color: "#f44336", icon: "🗑️" }
};

// Cache pour éviter la regénération inutile
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Appel à Ollama pour générer des descriptions
async function generateWithOllama(prompt) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.warn(`⚠️ Ollama indisponible (${error.message}), utilisation du fallback`);
    return null;
  }
}

// Analyse avancée du code pour détecter les services utilisés
function analyzeCodeFlow(routeFile, controllerFile, serviceFile) {
  const analysis = {
    hasAuth: false,
    hasValidation: false,
    hasDatabase: false,
    hasCaching: false,
    hasEmail: false,
    hasFileUpload: false,
    hasExternalAPI: false,
    middlewares: [],
    services: [],
    complexity: 'simple'
  };

  // Analyser le fichier de route
  if (fs.existsSync(routeFile)) {
    const routeContent = fs.readFileSync(routeFile, 'utf8');
    
    // Détection des middlewares
    const middlewareMatches = routeContent.match(/require\(['"]\.\.\/middlewares\/([^'"]+)['"]\)/g);
    if (middlewareMatches) {
      analysis.middlewares = middlewareMatches.map(m => 
        m.replace(/require\(['"]\.\.\/middlewares\/([^'"]+)['"].*/, '$1')
      );
    }
    
    // Détection d'authentification
    analysis.hasAuth = /auth|Auth|authenticate|jwt|token|middleware/i.test(routeContent);
    analysis.hasValidation = /valid|Valid|joi|yup|schema/i.test(routeContent);
  }

  // Analyser le fichier controller
  if (fs.existsSync(controllerFile)) {
    const controllerContent = fs.readFileSync(controllerFile, 'utf8');
    analysis.hasDatabase = /db|DB|query|model|repository|findAll|create|update|delete/i.test(controllerContent);
    analysis.hasEmail = /mail|email|sendgrid|nodemailer/i.test(controllerContent);
    analysis.hasFileUpload = /upload|multer|file/i.test(controllerContent);
  }

  // Analyser le fichier service
  if (fs.existsSync(serviceFile)) {
    const serviceContent = fs.readFileSync(serviceFile, 'utf8');
    analysis.hasCaching = /cache|Cache|redis/i.test(serviceContent);
    analysis.hasExternalAPI = /axios|fetch|http|api/i.test(serviceContent);
    
    // Détecter les services utilisés
    const serviceMatches = serviceContent.match(/require\(['"][^'"]*service[^'"]*['"]\)/g);
    if (serviceMatches) {
      analysis.services = serviceMatches.map(s => 
        s.replace(/.*\/([^\/'"]+)\.service.*/, '$1')
      );
    }
  }

  // Déterminer la complexité
  const complexityScore = 
    (analysis.hasAuth ? 1 : 0) +
    (analysis.hasValidation ? 1 : 0) +
    (analysis.hasDatabase ? 1 : 0) +
    (analysis.hasCaching ? 1 : 0) +
    (analysis.hasEmail ? 1 : 0) +
    (analysis.hasExternalAPI ? 1 : 0) +
    analysis.middlewares.length +
    analysis.services.length;

  analysis.complexity = complexityScore <= 2 ? 'simple' : complexityScore <= 4 ? 'medium' : 'complex';

  return analysis;
}

// Génération du diagramme Mermaid basé sur l'analyse du code
function generateSequenceDiagram(method, routePath, serviceName, analysis, swaggerOperation) {
  let diagram = `sequenceDiagram
    actor User as 👤 Utilisateur
    participant API as 🌐 API ${serviceName.toUpperCase()}`;
  
  // Ajouter les participants selon l'analyse réelle
  if (analysis.hasAuth) {
    diagram += `\n    participant Auth as 🔐 Service Auth`;
  }
  if (analysis.hasValidation) {
    diagram += `\n    participant Valid as ✅ Validation`;
  }
  if (analysis.hasDatabase) {
    diagram += `\n    participant DB as 💾 Base de données`;
  }
  if (analysis.hasCaching) {
    diagram += `\n    participant Cache as ⚡ Cache Redis`;
  }
  if (analysis.hasEmail) {
    diagram += `\n    participant Mail as 📧 Service Email`;
  }
  if (analysis.hasExternalAPI) {
    diagram += `\n    participant ExtAPI as 🌍 API Externe`;
  }

  diagram += `\n\n    User ->> API: ${method} ${routePath}`;
  
  // Flux basé sur l'analyse réelle
  if (analysis.hasAuth) {
    diagram += `\n    API ->> Auth: Vérification token JWT`;
    diagram += `\n    Auth -->> API: ✅ Token valide`;
  }
  
  if (analysis.hasValidation) {
    diagram += `\n    API ->> Valid: Validation des données`;
    diagram += `\n    Valid -->> API: ✅ Données valides`;
  }
  
  // Cache pour GET uniquement
  if (method === 'GET' && analysis.hasCaching) {
    diagram += `\n    API ->> Cache: Recherche en cache`;
    diagram += `\n    alt Données en cache`;
    diagram += `\n        Cache -->> API: 📦 Données trouvées`;
    diagram += `\n        API -->> User: 200 OK + données`;
    diagram += `\n    else Cache manqué`;
  }
  
  // API externe si nécessaire
  if (analysis.hasExternalAPI) {
    diagram += `\n    API ->> ExtAPI: Appel API externe`;
    diagram += `\n    ExtAPI -->> API: 📊 Données reçues`;
  }
  
  // Opération base de données
  if (analysis.hasDatabase) {
    let dbAction = "SELECT";
    switch (method) {
      case 'POST': dbAction = "INSERT"; break;
      case 'PUT': case 'PATCH': dbAction = "UPDATE"; break;
      case 'DELETE': dbAction = "DELETE"; break;
    }
    diagram += `\n    API ->> DB: ${dbAction} ${serviceName}`;
    diagram += `\n    DB -->> API: 📋 Résultat`;
    
    // Mise en cache après lecture DB
    if (method === 'GET' && analysis.hasCaching) {
      diagram += `\n    API ->> Cache: Mise en cache des résultats`;
    }
  }
  
  // Email pour les créations/modifications
  if (analysis.hasEmail && ['POST', 'PUT'].includes(method)) {
    diagram += `\n    API ->> Mail: 📧 Notification ${method === 'POST' ? 'création' : 'modification'}`;
    diagram += `\n    Mail -->> API: ✅ Email envoyé`;
  }
  
  // Fermer le cache alt si ouvert
  if (method === 'GET' && analysis.hasCaching) {
    diagram += `\n    end`;
  }
  
  // Réponse finale
  const responseCode = method === 'POST' ? '201' : '200';
  const responseText = method === 'POST' ? 'Created' : 'OK';
  diagram += `\n    API -->> User: ${responseCode} ${responseText}`;
  
  return diagram;
}

// Génération de la description avec Ollama
async function generateEndpointDescription(method, routePath, serviceName, analysis, swaggerOperation) {
  const contextPrompt = `
Tu es un expert en documentation API. Génère une description claire et concise pour cet endpoint:

Méthode: ${method}
Route: ${routePath}
Service: ${serviceName}
Complexité: ${analysis.complexity}
Services détectés: ${analysis.services.join(', ') || 'Aucun'}
Middlewares: ${analysis.middlewares.join(', ') || 'Aucun'}
Fonctionnalités: ${[
  analysis.hasAuth ? 'Authentification' : '',
  analysis.hasValidation ? 'Validation' : '',
  analysis.hasDatabase ? 'Base de données' : '',
  analysis.hasCaching ? 'Cache' : '',
  analysis.hasEmail ? 'Email' : '',
  analysis.hasExternalAPI ? 'API externe' : ''
].filter(Boolean).join(', ')}

Swagger description: ${swaggerOperation?.summary || 'Non disponible'}

Génère une description en français de maximum 100 caractères qui explique ce que fait cet endpoint de manière claire et professionnelle.
Réponse attendue: Une seule phrase descriptive, sans emoji ni caractères spéciaux.
`;

  const ollamaDescription = await generateWithOllama(contextPrompt);
  
  if (ollamaDescription) {
    return ollamaDescription;
  }
  
  // Fallback si Ollama n'est pas disponible
  const methodInfo = HTTP_METHOD_INFO[method];
  let fallback = `Endpoint qui ${methodInfo.action} `;
  
  if (routePath.includes(':id') || routePath.includes('{id}')) {
    fallback += `un(e) ${serviceName} spécifique`;
  } else if (routePath === '/' || routePath === '') {
    fallback += method === 'GET' ? `la liste des ${serviceName}s` : `un(e) nouveau/elle ${serviceName}`;
  } else {
    fallback += `des données ${serviceName}`;
  }
  
  return fallback;
}

// Génération des étapes détaillées avec Ollama
async function generateDetailedSteps(method, routePath, analysis, description) {
  const stepsPrompt = `
Basé sur cette analyse technique d'un endpoint ${method} ${routePath}:

Description: ${description}
Authentification: ${analysis.hasAuth ? 'Oui' : 'Non'}
Validation: ${analysis.hasValidation ? 'Oui' : 'Non'}
Base de données: ${analysis.hasDatabase ? 'Oui' : 'Non'}
Cache: ${analysis.hasCaching ? 'Oui' : 'Non'}
Email: ${analysis.hasEmail ? 'Oui' : 'Non'}
API externe: ${analysis.hasExternalAPI ? 'Oui' : 'Non'}
Middlewares: ${analysis.middlewares.join(', ') || 'Aucun'}

Génère une liste de 3-5 étapes techniques précises que suit cet endpoint, dans l'ordre chronologique.
Format: "Étape X: Action précise"
Exemples: "Étape 1: Vérification du token JWT", "Étape 2: Validation des données d'entrée"

Réponse en français, une étape par ligne, numérotées de 1 à N.
`;

  const ollamaSteps = await generateWithOllama(stepsPrompt);
  
  if (ollamaSteps) {
    return ollamaSteps.split('\n').filter(line => line.trim().startsWith('Étape'));
  }
  
  // Fallback basé sur l'analyse
  const steps = [];
  let stepNum = 1;
  
  if (analysis.hasAuth) steps.push(`Étape ${stepNum++}: Vérification de l'authentification`);
  if (analysis.hasValidation) steps.push(`Étape ${stepNum++}: Validation des données d'entrée`);
  if (method === 'GET' && analysis.hasCaching) steps.push(`Étape ${stepNum++}: Vérification du cache`);
  if (analysis.hasExternalAPI) steps.push(`Étape ${stepNum++}: Appel vers l'API externe`);
  if (analysis.hasDatabase) {
    const action = method === 'GET' ? 'Lecture' : method === 'POST' ? 'Insertion' : 'Modification';
    steps.push(`Étape ${stepNum++}: ${action} en base de données`);
  }
  if (analysis.hasEmail && ['POST', 'PUT'].includes(method)) steps.push(`Étape ${stepNum++}: Envoi de notification email`);
  steps.push(`Étape ${stepNum++}: Retour de la réponse HTTP`);
  
  return steps;
}

async function generateDocumentationForEndpoint(method, routePath, serviceName, swaggerOperation, analysis) {
  const methodInfo = HTTP_METHOD_INFO[method];
  
  // Description générée par Ollama
  const description = await generateEndpointDescription(method, routePath, serviceName, analysis, swaggerOperation);
  
  // Paramètres depuis Swagger
  const parametres = [];
  if (swaggerOperation?.parameters) {
    swaggerOperation.parameters.forEach(param => {
      parametres.push({
        nom: param.name,
        type: param.schema?.type || param.type || 'string',
        description: param.description || `Paramètre ${param.in}`,
        obligatoire: param.required || false,
        localisation: param.in
      });
    });
  }
  
  if (swaggerOperation?.requestBody) {
    parametres.push({
      nom: 'body',
      type: 'object',
      description: swaggerOperation.requestBody.description || 'Corps de requête JSON',
      obligatoire: swaggerOperation.requestBody.required || false,
      localisation: 'body'
    });
  }
  
  // Étapes détaillées générées par Ollama
  const flux = await generateDetailedSteps(method, routePath, analysis, description);
  
  return { description: `${methodInfo.icon} ${description}`, parametres, flux };
}

function generateModulePage(moduleName, endpoints) {
  const moduleTitle = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  
  let content = `---
id: ${moduleName}
title: 📦 Module ${moduleTitle}
sidebar_label: ${moduleTitle}
---

# Module ${moduleTitle}

Ce module gère les opérations liées aux **${moduleName}s**. Il contient ${endpoints.length} endpoint(s).

## Vue d'ensemble

`;

  // Table des endpoints
  content += `| Méthode | Route | Description |\n`;
  content += `|---------|-------|-------------|\n`;
  
  endpoints.forEach(endpoint => {
    const icon = HTTP_METHOD_INFO[endpoint.method]?.icon || '📌';
    const desc = endpoint.documentation.description.length > 80 
      ? endpoint.documentation.description.substring(0, 77) + '...'
      : endpoint.documentation.description;
    content += `| ${icon} **${endpoint.method}** | \`${endpoint.route}\` | ${desc} |\n`;
  });

  content += `\n---\n\n`;

  // Détail de chaque endpoint
  endpoints.forEach((endpoint, index) => {
    const methodInfo = HTTP_METHOD_INFO[endpoint.method];
    
    content += `## ${methodInfo.icon} ${endpoint.method} ${endpoint.route}\n\n`;
    
    // Description
    content += `### 📋 Description\n\n${endpoint.documentation.description}\n\n`;
    
    // Badge de complexité
    const complexityBadge = endpoint.analysis.complexity === 'complex' ? '🔴 Complexe' : 
                           endpoint.analysis.complexity === 'medium' ? '🟡 Moyen' : '🟢 Simple';
    content += `**Complexité:** ${complexityBadge}\n\n`;
    
    // Services utilisés
    if (endpoint.analysis.services.length > 0 || endpoint.analysis.middlewares.length > 0) {
      content += `**Services utilisés:** ${[...endpoint.analysis.services, ...endpoint.analysis.middlewares].join(', ')}\n\n`;
    }
    
    // Diagramme de séquence
    content += `### 🔄 Flux d'exécution\n\n`;
    content += `\`\`\`mermaid\n${endpoint.sequenceDiagram}\n\`\`\`\n\n`;
    
    // Paramètres si présents
    if (endpoint.documentation.parametres.length > 0) {
      content += `### 📝 Paramètres\n\n`;
      content += `| Nom | Type | Obligatoire | Localisation | Description |\n`;
      content += `|-----|------|-------------|--------------|-------------|\n`;
      
      endpoint.documentation.parametres.forEach(param => {
        const required = param.obligatoire ? '✅' : '❌';
        const location = param.localisation === 'path' ? '🛤️ Path' : 
                        param.localisation === 'query' ? '❓ Query' :
                        param.localisation === 'body' ? '📦 Body' : '📋 ' + param.localisation;
        content += `| **${param.nom}** | \`${param.type}\` | ${required} | ${location} | ${param.description} |\n`;
      });
      content += `\n`;
    }
    
    // Étapes détaillées
    content += `### 📋 Étapes détaillées\n\n`;
    endpoint.documentation.flux.forEach(step => {
      content += `- ${step}\n`;
    });
    content += `\n`;
    
    if (index < endpoints.length - 1) {
      content += `---\n\n`;
    }
  });
  
  return content;
}

async function generateDocusaurusPages() {
  console.log('📚 Génération des pages Docusaurus avec Ollama...');

  // Test de connexion Ollama
  try {
    const testResponse = await fetch(`${OLLAMA_URL}/api/tags`);
    if (testResponse.ok) {
      console.log('✅ Ollama connecté');
    }
  } catch (error) {
    console.log('⚠️ Ollama non disponible, utilisation du mode fallback');
  }

  if (!fs.existsSync(SWAGGER_FILE)) {
    console.error(`❌ Fichier Swagger manquant: ${SWAGGER_FILE}`);
    return;
  }

  // Créer les répertoires
  if (!fs.existsSync(MODULES_DIR)) {
    fs.mkdirSync(MODULES_DIR, { recursive: true });
  }

  const cache = loadCache();
  const files = glob.sync(`${ROUTES_DIR}/*.route.js`);
  const loadedSwaggerSpec = JSON.parse(fs.readFileSync(SWAGGER_FILE, 'utf8'));
  
  // Grouper par module
  const moduleData = {};
  let hasChanges = false;
  
  for (const file of files) {
    const serviceName = path.basename(file, '.route.js');
    const fileHash = getFileHash(file);
    
    // Vérifier si le fichier a changé
    const cacheKey = `${serviceName}_${fileHash}`;
    if (cache[cacheKey] && !process.argv.includes('--force')) {
      console.log(`⏭️ ${serviceName} inchangé, skip...`);
      continue;
    }
    
    hasChanges = true;
    const controllerFile = path.join(CONTROLLERS_DIR, `${serviceName}.controller.js`);
    const serviceFile = path.join(SERVICES_DIR, `${serviceName}.service.js`);
    
    // Analyse du code
    const analysis = analyzeCodeFlow(file, controllerFile, serviceFile);
    
    if (!moduleData[serviceName]) {
      moduleData[serviceName] = [];
    }
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const ROUTE_REGEX = /\.(get|post|put|delete)\(['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g;
    
    let match;
    while ((match = ROUTE_REGEX.exec(fileContent)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      
      // Correspondance Swagger
      const swaggerPath = routePath.replace(/:([^/]+)/g, '{$1}');
      const swaggerOperation = loadedSwaggerSpec.paths?.[swaggerPath]?.[method.toLowerCase()];
      
      // Générer la documentation avec Ollama
      const documentation = await generateDocumentationForEndpoint(
        method, routePath, serviceName, swaggerOperation, analysis
      );
      
      // Générer le diagramme de séquence
      const sequenceDiagram = generateSequenceDiagram(
        method, routePath, serviceName, analysis, swaggerOperation
      );
      
      moduleData[serviceName].push({
        method,
        route: routePath,
        documentation,
        sequenceDiagram,
        analysis
      });
    }
    
    // Mettre à jour le cache
    cache[cacheKey] = Date.now();
  }
  
  if (!hasChanges) {
    console.log('✅ Aucun changement détecté, documentation à jour');
    return;
  }
  
  // Générer les pages
  const moduleNames = [];
  for (const [moduleName, endpoints] of Object.entries(moduleData)) {
    if (endpoints.length === 0) continue;
    
    const pageContent = generateModulePage(moduleName, endpoints);
    const filePath = path.join(MODULES_DIR, `${moduleName}.md`);
    
    fs.writeFileSync(filePath, pageContent);
    moduleNames.push(moduleName);
    
    console.log(`✅ Page générée: ${moduleName} (${endpoints.length} endpoints)`);
  }
  
  // Sauvegarder le cache
  saveCache(cache);
  
  console.log(`\n🎉 ${moduleNames.length} pages générées dans ${MODULES_DIR}`);
  console.log('📁 Structure créée:');
  moduleNames.forEach(name => console.log(`   📄 ${name}.md`));
}

function updateSidebar(modules) {
  const sidebarPath = path.join(DOCS_DIR, '../sidebars.js');
  
  if (!fs.existsSync(sidebarPath)) {
    console.warn('⚠️ sidebars.js non trouvé');
    return;
  }
  
  let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  console.log('📋 Mise à jour du tutorialSidebar...');
  
  if (modules.length > 0) {
    const moduleItems = modules.map(m => `'modules/${m}'`).join(',\n        ');
    const moduleSection = `    {
      type: 'category',
      label: '📚 API Modules',
      items: [
        ${moduleItems}
      ],
    }`;
    
    // Vérifier si la section modules existe déjà
    const hasModulesSection = sidebarContent.includes('📚 API Modules');
    
    if (hasModulesSection) {
      // Remplacer la section existante
      sidebarContent = sidebarContent.replace(
        /\s*{\s*type:\s*['"]category['"],\s*label:\s*['"]📚 API Modules['"][^}]*items:\s*\[[^\]]*\][^}]*},?/gs,
        '\n' + moduleSection + ','
      );
      console.log('🔄 Section modules mise à jour');
    } else {
      // Ajouter la nouvelle section à la fin du tutorialSidebar
      const tutorialSidebarRegex = /(tutorialSidebar:\s*\[[\s\S]*?)(\s*\],?\s*})/;
      const match = sidebarContent.match(tutorialSidebarRegex);
      
      if (match) {
        const beforeClosing = match[1];
        const closing = match[2];
        
        // Ajouter une virgule si nécessaire avant la nouvelle section
        const needsComma = beforeClosing.trim().endsWith('},') || beforeClosing.trim().endsWith('}');
        const comma = needsComma ? '' : ',';
        
        sidebarContent = sidebarContent.replace(
          tutorialSidebarRegex,
          beforeClosing + comma + '\n' + moduleSection + ',' + closing
        );
        console.log('➕ Section modules ajoutée au tutorialSidebar');
      }
    }
  }
  
  fs.writeFileSync(sidebarPath, sidebarContent);
}