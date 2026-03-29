const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir exatamente a linha com 11 placeholders pela linha com 10 placeholders
content = content.replace(
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Query corrigida para exatamente 10 placeholders!');
