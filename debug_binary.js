const fs = require('fs');

// Ler o arquivo como buffer
const buffer = fs.readFileSync('server.js');
console.log('Tamanho do arquivo:', buffer.length, 'bytes');

// Converter para string e mostrar os primeiros 1000 caracteres
const content = buffer.toString('utf8');
const preview = content.substring(0, 1000);
console.log('\n=== PRIMEIROS 1000 CARACTERES ===');
console.log(preview);

// Encontrar a linha problemática
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('VALUES')) {
    console.log(`\n=== LINHA ${i+1} ===`);
    console.log('Comprimento:', lines[i].length);
    console.log('Bytes:', Buffer.from(lines[i], 'utf8').length);
    console.log('Placeholders:', (lines[i].match(/\?/g) || []).length);
    console.log('Conteúdo:', JSON.stringify(lines[i]));
    break;
  }
}
