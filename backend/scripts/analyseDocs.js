const fs = require('fs');
const path = require('path');
const axios = require('axios');

const LLM_API_URL = 'https://pleiade.mi.parisdescartes.fr/api'; 
const LLM_MODEL = 'llama3.3:latest';

const SWAGGER_JSON_PATH = path.join(__dirname, '../../docs/static/swagger.json');
const PR_REPORT_PATH = 'pr_report.md';

async function callLLM(prompt) {
    try {
        const response = await axios.post(LLM_API_URL, {
            model: LLM_MODEL,
            prompt: prompt,
            stream: false,
            format: 'json'
        });
        return response.data;
    } catch (error) {
        console.error(`❌ Erreur lors de l'appel à l'API du LLM :`, error.message);
        return null;
    }
}

async function generateAnalysisReport() {
    let reportContent = '';
    reportContent += `### 🤖 Rapport de l'IA sur la documentation\n\n`;
    reportContent += `Ce rapport a été généré automatiquement par un modèle LLM pour enrichir la documentation de votre Pull Request. Les suggestions ne sont pas intégrées directement mais servent de guide pour une meilleure qualité de la documentation.\n\n`;
    reportContent += `---\n\n`;

    try {
        const swaggerSpec = JSON.parse(fs.readFileSync(SWAGGER_JSON_PATH, 'utf8'));
        const paths = swaggerSpec.paths;

        if (!paths) {
            reportContent += `⚠️ Aucuns chemins d'API n'ont été trouvés dans le swagger.json.\n`;
        } else {
            for (const [apiPath, methods] of Object.entries(paths)) {
                for (const [method, spec] of Object.entries(methods)) {
                    const requestSchema = spec.requestBody?.content?.['application/json']?.schema;
                    
                    if (requestSchema && requestSchema.properties) {
                        const fields = Object.entries(requestSchema.properties).map(([name, prop]) => ({
                            name,
                            type: prop.type,
                            format: prop.format,
                        }));
                        
                        const dtoJson = JSON.stringify({ name: "RequestBodyDTO", fields });
                        
                        const prompt = `Tu es un expert en documentation technique. Ton objectif est d'enrichir une spécification OpenAPI. Pour chaque champ du DTO fourni en JSON ci-dessous, tu dois générer une description concise et claire en français. La description doit être pertinente et se baser uniquement sur le nom du champ et le nom du DTO, sans inventer de fonctionnalité. Le DTO est : ${dtoJson}. Le format de sortie attendu est un objet JSON : { "fields_descriptions": [ { "name": "...", "description": "...", "example": "..." } ] }.`;
                        
                        const aiResponse = await callLLM(prompt);
                        
                        if (aiResponse && aiResponse.fields_descriptions) {
                            reportContent += `### 📖 Enrichissement pour l'endpoint \`${method.toUpperCase()} ${apiPath}\` (Body)\n`;
                            aiResponse.fields_descriptions.forEach(field => {
                                reportContent += `- **${field.name}** : ${field.description}`;
                                if (field.example) {
                                    reportContent += `\n    - _Exemple :_ \`${field.example}\``;
                                }
                                reportContent += `\n`;
                            });
                            reportContent += `\n---\n\n`;
                        }
                    }
                    
                    for (const [statusCode, responseSpec] of Object.entries(spec.responses)) {
                        const responseSchema = responseSpec.content?.['application/json']?.schema;
                        
                        if (responseSchema && responseSchema.properties) {
                            const fields = Object.entries(responseSchema.properties).map(([name, prop]) => ({
                                name,
                                type: prop.type,
                                format: prop.format,
                            }));

                            const dtoJson = JSON.stringify({ name: "ResponseBodyDTO", fields });
                            
                            const prompt = `Tu es un expert en documentation technique. Ton objectif est d'enrichir une spécification OpenAPI. Pour chaque champ du DTO fourni en JSON ci-dessous, tu dois générer une description concise et claire en français. La description doit être pertinente et se baser uniquement sur le nom du champ et le nom du DTO, sans inventer de fonctionnalité. Le DTO est : ${dtoJson}. Le format de sortie attendu est un objet JSON : { "fields_descriptions": [ { "name": "...", "description": "...", "example": "..." } ] }.`;
                            
                            const aiResponse = await callLLM(prompt);

                            if (aiResponse && aiResponse.fields_descriptions) {
                                reportContent += `### 📖 Enrichissement pour l'endpoint \`${method.toUpperCase()} ${apiPath}\` (Réponse ${statusCode})\n`;
                                aiResponse.fields_descriptions.forEach(field => {
                                    reportContent += `- **${field.name}** : ${field.description}`;
                                    if (field.example) {
                                        reportContent += `\n    - _Exemple :_ \`${field.example}\``;
                                    }
                                    reportContent += `\n`;
                                });
                                reportContent += `\n---\n\n`;
                            }
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error(`❌ Erreur fatale :`, error.message);
        reportContent += `Une erreur est survenue lors de la génération du rapport.\n`;
    }

    fs.writeFileSync(PR_REPORT_PATH, reportContent);
    console.log(`✅ Rapport d'analyse généré : ${PR_REPORT_PATH}`);
}

generateAnalysisReport();