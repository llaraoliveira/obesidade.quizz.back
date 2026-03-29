const fs = require('fs');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');

// Regex para encontrar a linha problemática
const regex = /'INSERT INTO game_results \(player_name, correct_answers, total_questions,[\s\S]*hard_cor\s*rect[\s\S]*hard_total\) VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)'/g;

console.log('=== TESTE DE REGEX ===');
console.log('Procurando por:', regex.toString());

// Encontrar correspondências
const matches = content.match(regex);
console.log('Correspondências encontradas:', matches ? matches.length : 0);

if (matches) {
  matches.forEach((match, index) => {
    console.log(`\nMatch ${index + 1}:`);
    console.log('Conteúdo:', JSON.stringify(match));
    console.log('Placeholders:', (match.match(/\?/g) || []).length);
  });
}
