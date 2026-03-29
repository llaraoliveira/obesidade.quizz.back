const fs = require('fs');

// Ler o arquivo e mostrar exatamente a linha
const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

// Encontrar a linha específica
const targetLine = lines.find(line => line.includes('INSERT INTO game_results') && line.includes('VALUES'));

console.log('=== LINHA EXATA ===');
console.log('Linha:', JSON.stringify(targetLine));

// Contar caracteres e placeholders
console.log('Comprimento:', targetLine.length);
console.log('Placeholders:', (targetLine.match(/\?/g) || []).length);

// Mostrar cada caractere
Array.from(targetLine).forEach((char, index) => {
  if (char === '?') {
    console.log(`Caractere ${index}: '?' (placeholder ${index})`);
  } else if (char === '\t') {
    console.log(`Caractere ${index}: '\\t' (TAB)`);
  } else if (char === ' ') {
    console.log(`Caractere ${index}: ' ' (SPACE)`);
  } else {
    console.log(`Caractere ${index}: '${char}' (${char.charCodeAt(0)})`);
  }
});
