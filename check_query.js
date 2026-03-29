const fs = require('fs');

// Ler o arquivo exato
const content = fs.readFileSync('server.js', 'utf8');

// Encontrar a linha com INSERT
const lines = content.split('\n');
const insertLine = lines.find(line => line.includes('INSERT INTO game_results'));

console.log('=== LINHA COM INSERT ===');
console.log('Linha bruta:', insertLine);

// Contar placeholders
const placeholders = (insertLine.match(/\?/g) || []).length;
console.log('Placeholders encontrados:', placeholders);

// Verificar se há caracteres estranhos
const cleanLine = insertLine.replace(/\s+/g, ' ').trim();
console.log('Linha limpa:', cleanLine);
console.log('Placeholders na linha limpa:', (cleanLine.match(/\?/g) || []).length);
