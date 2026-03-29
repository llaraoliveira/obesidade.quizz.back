const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

// Encontrar a linha problemática e substituir completamente
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('VALUES')) {
    // Substituir com a query correta em uma linha só
    lines[i] = "      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'";
    console.log('Linha', i, 'corrigida');
    break;
  }
}

// Escrever de volta
fs.writeFileSync('server.js', lines.join('\n'));

console.log('Query reescrita com 10 placeholders!');
