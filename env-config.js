const fs = require('fs');
const path = require('path');

const environmentFilePath = path.resolve(__dirname, 'src/environments/environment.ts');
let content = fs.readFileSync(environmentFilePath, 'utf8');

// Substitui as variáveis de ambiente
content = content.replace('${api}', process.env.api || 'http://localhost');
content = content.replace('${API_WS}', process.env.API_WS || 'ws://localhost/ws');

fs.writeFileSync(environmentFilePath, content);
console.log('Environment variables configured');
