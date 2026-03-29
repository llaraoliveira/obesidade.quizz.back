const fs = require('fs');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

console.log('=== VERIFICANDO VALORES DO INSERT ===');

// Encontrar a seção do INSERT
let inInsertSection = false;
let valueLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('VALUES')) {
    inInsertSection = true;
    console.log(`\nLinha ${i + 1} (Query):`);
    console.log('Placeholders:', (lines[i].match(/\?/g) || []).length);
  }
  
  if (inInsertSection && lines[i].includes('[')) {
    // Início dos valores
    let j = i + 1;
    while (j < lines.length && !lines[j].includes(']')) {
      valueLines.push(lines[j]);
      j++;
    }
    break;
  }
}

console.log('\nValores encontrados:');
valueLines.forEach((line, index) => {
  console.log(`${index + 1}. ${line.trim()}`);
});

console.log(`\nTotal de valores: ${valueLines.length}`);
