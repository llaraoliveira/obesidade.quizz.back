const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

console.log('=== VERIFICANDO RESULTADOS SALVOS ===');

db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log(`\n📋 Total de registros: ${rows.length}`);
  
  if (rows.length === 0) {
    console.log('- Nenhum registro encontrado');
  } else {
    rows.forEach((row, index) => {
      console.log(`\n🎮 Registro ${index + 1}:`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Jogador: ${row.player_name}`);
      console.log(`  Acertos: ${row.correct_answers}/${row.total_questions}`);
      console.log(`  Dificuldade: ${row.difficulty}`);
      console.log(`  Fácil: ${row.easy_correct}/${row.easy_total}`);
      console.log(`  Médio: ${row.medium_correct}/${row.medium_total}`);
      console.log(`  Difícil: ${row.hard_correct}/${row.hard_total}`);
      console.log(`  Data: ${row.created_at}`);
    });
  }
  
  db.close();
});
