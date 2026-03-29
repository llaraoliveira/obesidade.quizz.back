const fs = require('fs');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

console.log('=== VERIFICANDO QUERY ATUAL ===');

// Encontrar a linha com INSERT
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('VALUES')) {
    console.log(`\nLinha ${i + 1}:`);
    console.log('Conteúdo:', JSON.stringify(lines[i]));
    console.log('Placeholders:', (lines[i].match(/\?/g) || []).length);
    
    // Contar colunas
    const colMatch = lines[i].match(/\(([^)]+)\)/);
    if (colMatch) {
      const columns = colMatch[1].split(',').map(col => col.trim());
      console.log('Colunas:', columns.length);
      console.log('Lista:', columns);
    }
    break;
  }
}
