const fs = require('fs');

console.log('=== VERIFICANDO SINTAXE DA QUERY ===');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');

// Encontrar a query principal
const lines = content.split('\n');
let queryLine = '';

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('easy_correct')) {
    queryLine = lines[i];
    break;
  }
}

console.log('Query encontrada:');
console.log('Comprimento:', queryLine.length);
console.log('Conteúdo bruto:', JSON.stringify(queryLine));

// Verificar caracteres problemáticos
const problematicChars = ['\n', '\r', '\t', '\0', '\u0000', '\uFEFF'];
problematicChars.forEach(char => {
  if (queryLine.includes(char)) {
    console.log(`❌ Caractere problemático encontrado: ${JSON.stringify(char)}`);
  }
});

// Mostrar cada caractere com seu código
console.log('\nAnálise de caracteres:');
Array.from(queryLine).forEach((char, index) => {
  if (char === 'S' || char === 's') {
    console.log(`Pos ${index}: "${char}" (${char.charCodeAt(0)})`);
  }
});
