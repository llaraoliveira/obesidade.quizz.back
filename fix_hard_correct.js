const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir todas as ocorrências da query quebrada
const brokenQuery = /hard_cor\s*rect/g;
const fixedQuery = 'hard_correct';

// Corrigir todas as quebras
content = content.replace(brokenQuery, fixedQuery);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Query "hard_correct" corrigida!');
console.log('Todas as quebras de linha foram removidas!');
