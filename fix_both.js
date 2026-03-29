const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir ambas as quebras
content = content.replace(/medium_cor\s*rect/g, 'medium_correct');
content = content.replace(/hard_cor\s*rect/g, 'hard_correct');

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Ambas as palavras corrigidas!');
console.log('medium_cor + rect → medium_correct');
console.log('hard_cor + rect → hard_correct');
