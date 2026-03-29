const fs = require('fs');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');

// Encontrar a linha problemática
const lines = content.split('\n');
const targetLine = lines.find(line => line.includes('INSERT INTO game_results') && line.includes('hard_correct'));

if (targetLine) {
  console.log('=== LINHA PROBLEMÁTICA ===');
  console.log('Linha completa:', JSON.stringify(targetLine));
  
  // Encontrar a posição de "hard_cor"
  const hardCorPos = targetLine.indexOf('hard_cor');
  console.log('Posição de "hard_cor":', hardCorPos);
  
  // Mostrar 20 caracteres antes e depois
  const start = Math.max(0, hardCorPos - 10);
  const end = Math.min(targetLine.length, hardCorPos + 20);
  const context = targetLine.substring(start, end);
  
  console.log('Contexto:', JSON.stringify(context));
  
  // Mostrar cada caractere com seu código
  Array.from(context).forEach((char, index) => {
    const actualPos = start + index;
    console.log(`Pos ${actualPos}: "${char}" (${char.charCodeAt(0)})`);
  });
}
