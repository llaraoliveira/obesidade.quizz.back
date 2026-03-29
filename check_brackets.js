const fs = require('fs');

console.log('=== VERIFICANDO ESTRUTURA DE CHAVES ===');

const content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

let braceLevel = 0;
let parenLevel = 0;
let bracketLevel = 0;

lines.forEach((line, index) => {
  for (let char of line) {
    if (char === '{') braceLevel++;
    if (char === '}') braceLevel--;
    if (char === '(') parenLevel++;
    if (char === ')') parenLevel--;
    if (char === '[') bracketLevel++;
    if (char === ']') bracketLevel--;
    
    if (braceLevel < 0) {
      console.log(`❌ Chave fechando demais na linha ${index + 1}: ${line.trim()}`);
    }
  }
  
  // Mostrar linhas importantes
  if (line.includes('res.json') || line.includes('});') || line.includes('});')) {
    console.log(`Linha ${index + 1}: ${line.trim()} (Chaves: ${braceLevel})`);
  }
});

console.log(`\nNível final de chaves: ${braceLevel}`);
console.log(`Nível final de parênteses: ${parenLevel}`);
console.log(`Nível final de colchetes: ${bracketLevel}`);
