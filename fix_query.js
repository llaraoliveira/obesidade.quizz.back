const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Encontrar e substituir a linha problemática
const oldQuery = "      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',";
const newQuery = "      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'";

// Substituir
content = content.replace(oldQuery, newQuery);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Query corrigida!');
console.log('Placeholders:', (newQuery.match(/\?/g) || []).length);
