const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== VERIFICANDO DADOS DE DIFICULDADE ===');

// Verificar estrutura da tabela
db.all('PRAGMA table_info(game_results)', (err, columns) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log('\n📋 Estrutura da tabela:');
  columns.forEach(col => {
    console.log(`- ${col.name}: ${col.type}`);
  });
  
  // Verificar últimos registros
  db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return;
    }
    
    console.log('\n📊 Últimos 5 registros:');
    if (rows.length === 0) {
      console.log('- Nenhum registro encontrado');
    } else {
      rows.forEach((row, index) => {
        console.log(`\n${index + 1}. ID: ${row.id}`);
        console.log(`   Jogador: ${row.player_name}`);
        console.log(`   Total: ${row.correct_answers}/${row.total_questions}`);
        console.log(`   Fáceis: ${row.easy_correct || 0}/${row.easy_total || 0}`);
        console.log(`   Médias: ${row.medium_correct || 0}/${row.medium_total || 0}`);
        console.log(`   Difíceis: ${row.hard_correct || 0}/${row.hard_total || 0}`);
        console.log(`   Data: ${row.created_at}`);
        console.log(`   Tem dados de dificuldade: ${!!(row.easy_correct !== undefined || row.medium_correct !== undefined || row.hard_correct !== undefined)}`);
      });
    }
    
    db.close();
  });
});
