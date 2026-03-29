const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir diretamente a linha problemática
content = content.replace(
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// Remover um placeholder manualmente
content = content.replace(
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Correção manual aplicada!');
