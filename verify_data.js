const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== VERIFICANDO DADOS ATUAIS ===');

// Verificar o resultado mais recente
db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 1', (err, rows) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  if (rows.length > 0) {
    const result = rows[0];
    console.log('\n📋 Resultado mais recente:');
    console.log(`ID: ${result.id}`);
    console.log(`Jogador: ${result.player_name}`);
    console.log(`Total: ${result.correct_answers}/${result.total_questions}`);
    console.log(`Fáceis: ${result.easy_correct}/${result.easy_total}`);
    console.log(`Médias: ${result.medium_correct}/${result.medium_total}`);
    console.log(`Difíceis: ${result.hard_correct}/${result.hard_total}`);
    console.log(`Data: ${result.created_at}`);
  } else {
    console.log('Nenhum resultado encontrado');
  }
  
  db.close();
});
