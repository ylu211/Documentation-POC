import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const diagramsDir = path.join(process.cwd(), '../docs/docs/diagrams')

async function queryOllama(prompt) {
  console.log('🔹 Envoi de la requête au LLM...')
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama2', prompt })
  })
  console.log('🔹 Requête envoyée, attente réponse...')
  
  const data = await response.json()
  console.log('🔹 Réponse reçue !')
  return data.text
}

async function generateDescriptions() {
  const files = fs.readdirSync(diagramsDir).filter(f => f.endsWith('.mmd'))

  for (const file of files) {
    const diagramPath = path.join(diagramsDir, file)
    console.log(`📂 Lecture du fichier ${file}`)
    const diagram = fs.readFileSync(diagramPath, 'utf-8')
    console.log(`📝 Diagramme lu, longueur : ${diagram.length} caractères`)

    console.log('💬 Envoi au LLM...')
    const prompt = `
    Génère une description concise pour une documentation technique à partir d'un diagramme de séquence Mermaid.
    La description doit expliquer le flux et les composants principaux, en évitant les détails superflus.
    Diagramme :
    ${diagram}
    `

    console.log(`⚡ Génération description pour ${file}...`)
    const description = await queryOllama(prompt)
    console.log('Finir la generation')

    const outputFile = diagramPath.replace('.mmd', '-description.md')
    console.log('Creation du fichier');
    fs.writeFileSync(outputFile, description, 'utf-8')
    console.log(`✅ Fichier généré : ${outputFile}`)
  }
}

generateDescriptions()
