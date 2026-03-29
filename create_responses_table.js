const sqlite3 = require('sqlite3').verbose();

console.log('=== CRIANDO TABELA QUESTION_RESPONSES ===');

const db = new sqlite3.Database('obesidade_quiz.db');

// Criar tabela para registrar cada resposta
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS question_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_result_id INTEGER,
    question_id INTEGER,
    selected_answer INTEGER,
    correct_answer INTEGER,
    is_correct BOOLEAN,
    difficulty TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_result_id) REFERENCES game_results (id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela:', err);
  } else {
    console.log('✅ Tabela question_responses criada com sucesso!');
    
    // Verificar estrutura
    db.all('PRAGMA table_info(question_responses)', (err, columns) => {
      if (err) {
        console.error('Erro ao verificar estrutura:', err);
      } else {
        console.log('\n📋 Estrutura da tabela:');
        columns.forEach(col => {
          console.log(`- ${col.name}: ${col.type}`);
        });
      }
      
      db.close();
    });
  }
});
