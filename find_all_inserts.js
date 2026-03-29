const fs = require('fs');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

console.log('=== TODAS AS LINHAS COM INSERT ===');
lines.forEach((line, index) => {
  if (line.includes('INSERT INTO game_results')) {
    const placeholders = (line.match(/\?/g) || []).length;
    console.log(`\nLinha ${index + 1}:`);
    console.log('Conteúdo:', line.trim());
    console.log('Placeholders:', placeholders);
  }
});
