const sqlite3 = require('sqlite3').verbose();

console.log('=== TESTANDO INSERT DIRETO NO SQLITE ===');

const db = new sqlite3.Database('obesidade_quiz.db');

// Testar o INSERT exato igual ao backend
const query = 'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const values = [
  'Teste Direto',
  7,
  8,
  'misto',
  2,
  3,
  2,
  2,
  4,
  2
];

console.log('Query:', query);
console.log('Placeholders:', (query.match(/\?/g) || []).length);
console.log('Valores:', values.length);
console.log('Correspondem:', (query.match(/\?/g) || []).length === values.length ? 'SIM' : 'NÃO');

db.run(query, values, function(err) {
  if (err) {
    console.error('❌ Erro no INSERT:', err);
    console.error('Código:', err.code);
    console.error('Mensagem:', err.message);
  } else {
    console.log('✅ INSERT executado com sucesso!');
    console.log('ID:', this.lastID);
  }
  
  db.close();
});
