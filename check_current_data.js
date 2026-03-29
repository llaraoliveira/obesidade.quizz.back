const sqlite3 = require('sqlite3').verbose');
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
  
  // Verificar todos os resultados
  db.all('SELECT id, player_name, easy_correct, easy_total, medium_correct, medium_total, hard_correct, hard_total FROM game_results', (err, allResults) => {
    if (err) {
      console.error('Erro:', err);
      return;
    }
    
    console.log('\n📊 Todos os resultados:');
    allResults.forEach((row, index) => {
      console.log(`${index + 1}. ID ${row.id}: ${row.player_name}`);
      console.log(`   Fáceis: ${row.easy_correct}/${row.easy_total}`);
      console.log(`   Médias: ${row.medium_correct}/${row.medium_total}`);
      console.log(`   Difíceis: ${row.hard_correct}/${row.hard_total}`);
    });
    
    db.close();
  });
});
