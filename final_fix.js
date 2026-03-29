const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Encontrar e substituir a linha específica com regex mais precisa
const regex = /'INSERT INTO game_results \(player_name, correct_answers, total_questions,[\s\S]*hard_cor\s*rect[\s\S]*hard_total\) VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)'/g;
const replacement = "'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'";

content = content.replace(regex, replacement);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Query final corrigida!');
console.log('Placeholders:', (replacement.match(/\?/g) || []).length);
