const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir a query com 11 placeholders pela query correta com 10 placeholders
const oldQuery = 'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const newQuery = 'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

// Remover um placeholder
const correctedQuery = newQuery.replace(/\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?/, '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?');

content = content.replace(oldQuery, correctedQuery);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Query corrigida!');
console.log('Placeholders:', (correctedQuery.match(/\?/g) || []).length);
