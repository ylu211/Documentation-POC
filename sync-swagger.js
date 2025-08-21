const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'backend', 'swagger.json');
const destDir = path.join(__dirname, 'docs', 'api');
const dest = path.join(destDir, 'swagger.json');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

fs.copyFileSync(source, dest);
console.log('✅ swagger.json copié dans docs/api/');
