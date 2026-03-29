const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

// Substituir a linha 351 (índice 350) com a query correta
lines[350] = "      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'";

// Escrever de volta
fs.writeFileSync('server.js', lines.join('\n'));

console.log('Linha 351 corrigida!');
console.log('Query sem quebra de linha!');
