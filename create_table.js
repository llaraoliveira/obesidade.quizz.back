const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

console.log('=== CRIANDO TABELA GAME_RESULTS ===');

db.run(`
  CREATE TABLE IF NOT EXISTS game_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    easy_correct INTEGER DEFAULT 0,
    medium_correct INTEGER DEFAULT 0,
    hard_correct INTEGER DEFAULT 0,
    easy_total INTEGER DEFAULT 0,
    medium_total INTEGER DEFAULT 0,
    hard_total INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err);
  } else {
    console.log('✅ Tabela game_results criada com sucesso!');
  }
  
  // Verificar se foi criada
  db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="game_results"', (err, table) => {
    if (err) {
      console.error('Erro:', err);
      return;
    }
    
    if (table) {
      console.log('✅ Confirmação: Tabela game_results existe!');
      
      // Verificar estrutura
      db.all('PRAGMA table_info(game_results)', (err, columns) => {
        if (err) {
          console.error('Erro:', err);
          return;
        }
        
        console.log('\n📋 Estrutura da tabela:');
        columns.forEach(col => {
          console.log(`- ${col.name}: ${col.type}`);
        });
        
        db.close();
      });
    } else {
      console.log('❌ Ainda não existe!');
      db.close();
    }
  });
});
