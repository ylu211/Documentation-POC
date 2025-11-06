// scripts/generateDocs.mjs
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const __dirname = path.resolve();

const SWAGGER_PATH = path.join(__dirname, '../docs/static/swagger.json');
const OUTPUT_DOCS_DIR = path.join(__dirname, '../docs/docs/api');
const OLLAMA_URL = 'http://localhost:11434/api/generate';

[OUTPUT_DOCS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Génération Mermaid améliorée
function generateMermaid(endpoint, method, hasAuth = false, hasValidation = false) {
  const steps = [
    '```mermaid',
    'sequenceDiagram',
    '  actor Client',
    '  participant API',
    '  participant Controller', 
    '  participant Service',
  ];
  
  if (hasAuth) steps.push('  participant Auth');
  if (hasValidation) steps.push('  participant Validator');
  steps.push('  participant DB as Database');
  steps.push('');
  
  steps.push(`  Client ->> API: ${method.toUpperCase()} ${endpoint}`);
  
  if (hasAuth) {
    steps.push('  API ->> Auth: Vérifier token');
    steps.push('  Auth -->> API: ✅ Valide');
  }
  
  if (hasValidation && method !== 'GET') {
    steps.push('  API ->> Validator: Valider données');
    steps.push('  Validator -->> API: ✅ OK');
  }
  
  steps.push('  API ->> Controller: Traiter requête');
  steps.push('  Controller ->> Service: Logique métier');
  steps.push('  Service ->> DB: Accès données');
  steps.push('  DB -->> Service: Résultat');
  steps.push('  Service -->> Controller: Données');
  steps.push('  Controller -->> API: Réponse');
  
  const statusCode = method === 'POST' ? '201' : '200';
  steps.push(`  API -->> Client: ${statusCode} Success`);
  steps.push('```');
  
  return steps.join('\n');
}

async function generateDescription(endpoint, method, summary) {
  const prompt = `Tu documentes une API REST. Voici un endpoint :

Méthode: ${method.toUpperCase()}
Route: ${endpoint}
Résumé Swagger: ${summary || 'Non spécifié'}

Écris une description claire et concise en français de ce que fait cet endpoint du point de vue fonctionnel. Une phrase ou deux maximum sans phrase de politesse.

Description:`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'llama3', 
        prompt, 
        stream: false,
        options: { 
          temperature: 0.7,
          max_tokens: 100
        }
      })
    });
    
    const data = await response.json();
    let description = data.response?.trim() || '';
    
    description = description
      .replace(/^Description:\s*/i, '')
      .replace(/^\s*[-•]\s*/, '')
      .trim();
    
    return description;
    
  } catch (error) {
    console.warn(`LLM indisponible pour ${endpoint}`);
    const action = method === 'GET' ? 'récupère' : 'crée';
    const resource = endpoint.split('/').pop();
    return `Endpoint qui ${action} des ${resource}.`;
  }
}

async function main() {
  console.log('🚀 Génération documentation avec LLM amélioré...');
  
  const swagger = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
  const modules = {};

  for (const [endpoint, methods] of Object.entries(swagger.paths)) {
    for (const [method, spec] of Object.entries(methods)) {
      const tag = spec.tags?.[0] || 'default';
      const summary = spec.summary || '';
      
      // Détection des fonctionnalités
      const hasAuth = !!(spec.security?.length || spec.responses?.['401']);
      const hasValidation = !!(spec.requestBody || spec.responses?.['400']);
      
      console.log(`🔍 Traitement ${method.toUpperCase()} ${endpoint}...`);
      
      const description = await generateDescription(endpoint, method, summary);
      
      const diagram = generateMermaid(endpoint, method, hasAuth, hasValidation);
      
      if (!modules[tag]) modules[tag] = [];
      modules[tag].push({ 
        method: method.toUpperCase(), 
        route: endpoint, 
        description,
        summary,
        diagram,
        hasAuth,
        hasValidation
      });
    }
  }

  // Génération Markdown épuré
  for (const [moduleName, endpoints] of Object.entries(modules)) {
    let content = `---
id: ${moduleName}
title: Module ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
sidebar_label: ${moduleName}
---

# Module ${moduleName}

## Vue d'ensemble

| Méthode | Route | Description |
|---------|-------|-------------|
`;

    endpoints.forEach(e => {
      const icon = e.method === 'GET' ? '📖' : '➕';
      // Description épurée pour le tableau
      content += `| ${icon} **${e.method}** | \`${e.route}\` | ${e.description} |\n`;
    });

    content += `\n---\n\n`;

    endpoints.forEach(e => {
      const icon = e.method === 'GET' ? '📖' : '➕';
      const features = [];
      if (e.hasAuth) features.push('🔐 Authentification');
      if (e.hasValidation) features.push('✅ Validation');
      
      content += `## ${icon} ${e.method} ${e.route}\n\n`;
      content += `**Description:** ${e.description}\n\n`;
      
      content += `**Flux d'exécution:**\n\n${e.diagram}\n\n`;
      content += `---\n\n`;
    });

    const filePath = path.join(OUTPUT_DOCS_DIR, `${moduleName}.md`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`📝 Module ${moduleName}: ${endpoints.length} endpoints → ${filePath}`);
  }

  // Génération sidebar.js
  const SIDEBAR_PATH = path.join(__dirname, '../docs/sidebar.js');
  const sidebarContent = `module.exports = {
    tutorialSidebar: [
      {
        type: 'doc',
        id: 'intro',
        label: 'Introduction',
      },
      {
        type: 'category',
        label: 'API',
        items: [{ type: 'autogenerated', dirName: 'api' }],
      },
      {
        type: 'category',
        label: '📚 API Modules',
        items: [
  ${Object.keys(modules).map(m => `        'api/${m}'`).join(',\n')}
        ],
      },
    ],
  };
  `;

  fs.writeFileSync(SIDEBAR_PATH, sidebarContent, 'utf-8');
  console.log(`📝 Sidebar mis à jour: ${SIDEBAR_PATH}`);
  console.log('✅ Documentation générée avec succès!');
}

main().catch(console.error);