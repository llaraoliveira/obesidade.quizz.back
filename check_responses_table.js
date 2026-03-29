const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== VERIFICANDO ESTRUTURA DA TABELA QUESTION_RESPONSES ===');

db.all('PRAGMA table_info(question_responses)', (err, columns) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log('📋 Estrutura atual:');
  columns.forEach(col => {
    console.log(`- ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
  });
  
  // Verificar dados existentes
  db.all('SELECT * FROM question_responses LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log('\n📊 Dados existentes:');
      if (rows.length === 0) {
        console.log('Nenhum dado encontrado');
      } else {
        rows.forEach((row, index) => {
          console.log(`${index + 1}. ID: ${row.id}, Question: ${row.question_id}, Correct: ${row.is_correct}`);
        });
      }
    }
    
    db.close();
  });
});
