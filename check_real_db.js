const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== VERIFICANDO BANCO REAL (obesidade_quiz.db) ===');

db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 10', (err, rows) => {
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
      console.log(`  Fácil: ${row.easy_correct || 0}/${row.easy_total || 0}`);
      console.log(`  Médio: ${row.medium_correct || 0}/${row.medium_total || 0}`);
      console.log(`  Difícil: ${row.hard_correct || 0}/${row.hard_total || 0}`);
      console.log(`  Data: ${row.created_at}`);
    });
    
    // Verificar duplicações
    const duplications = {};
    rows.forEach(row => {
      const key = `${row.player_name}-${row.correct_answers}-${row.total_questions}-${row.difficulty}`;
      duplications[key] = (duplications[key] || 0) + 1;
    });
    
    console.log('\n🔍 Verificando duplicações:');
    let hasDuplication = false;
    Object.keys(duplications).forEach(key => {
      if (duplications[key] > 1) {
        console.log(`🚨 DUPLICAÇÃO: ${key} (${duplications[key]} vezes)`);
        hasDuplication = true;
      }
    });
    
    if (!hasDuplication) {
      console.log('✅ Nenhuma duplicação encontrada');
    }
  }
  
  db.close();
});
