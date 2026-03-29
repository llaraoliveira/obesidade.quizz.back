const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== ADICIONANDO COLUNAS NOVAS ===');

// Adicionar colunas novas se não existirem
const alterQueries = [
  'ALTER TABLE game_results ADD COLUMN easy_correct INTEGER DEFAULT 0',
  'ALTER TABLE game_results ADD COLUMN medium_correct INTEGER DEFAULT 0',
  'ALTER TABLE game_results ADD COLUMN hard_correct INTEGER DEFAULT 0',
  'ALTER TABLE game_results ADD COLUMN easy_total INTEGER DEFAULT 0',
  'ALTER TABLE game_results ADD COLUMN medium_total INTEGER DEFAULT 0',
  'ALTER TABLE game_results ADD COLUMN hard_total INTEGER DEFAULT 0'
];

let completedQueries = 0;

alterQueries.forEach((query, index) => {
  console.log(`\nExecutando query ${index + 1}: ${query}`);
  
  db.run(query, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log(`✅ Coluna já existe (ignorado)`);
      } else {
        console.error(`❌ Erro na query ${index + 1}:`, err);
      }
    } else {
      console.log(`✅ Query ${index + 1} executada com sucesso`);
    }
    
    completedQueries++;
    
    if (completedQueries === alterQueries.length) {
      console.log('\n=== VERIFICANDO ESTRUTURA FINAL ===');
      
      db.all('PRAGMA table_info(game_results)', (err, columns) => {
        if (err) {
          console.error('Erro:', err);
          return;
        }
        
        console.log('\n📋 Estrutura final da tabela:');
        columns.forEach(col => {
          console.log(`- ${col.name}: ${col.type}`);
        });
        
        db.close();
      });
    }
  });
});
