const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

console.log('=== TESTANDO INSERT MANUAL ===');

const testQuery = `
  INSERT INTO game_results 
  (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const testData = [
  'Teste Manual',
  7,
  8,
  'misto',
  2,  // easy_correct
  3,  // medium_correct
  2,  // hard_correct
  2,  // easy_total
  3,  // medium_total
  2   // hard_total
];

console.log('Query:', testQuery);
console.log('Dados:', testData);
console.log('Total de placeholders:', (testQuery.match(/\?/g) || []).length);
console.log('Total de dados:', testData.length);

db.run(testQuery, testData, function(err) {
  if (err) {
    console.error('❌ ERRO NO INSERT:', err);
    console.error('Código SQL:', err.code);
    console.error('Mensagem:', err.message);
    
    // Tentar com INSERT básico
    console.log('\n🔄 Tentando INSERT básico...');
    
    const basicQuery = `
      INSERT INTO game_results 
      (player_name, correct_answers, total_questions, difficulty) 
      VALUES (?, ?, ?, ?)
    `;
    
    const basicData = ['Teste Manual', 7, 8, 'misto'];
    
    db.run(basicQuery, basicData, function(basicErr) {
      if (basicErr) {
        console.error('❌ ERRO NO INSERT BÁSICO:', basicErr);
      } else {
        console.log('✅ INSERT BÁSICO FUNCIONOU! ID:', this.lastID);
      }
      
      // Verificar resultados
      db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 3', (err, rows) => {
        if (err) {
          console.error('Erro ao verificar:', err);
        } else {
          console.log('\n📋 Registros no banco:', rows.length);
          rows.forEach((row, index) => {
            console.log(`\nRegistro ${index + 1}:`);
            console.log(`  ID: ${row.id}`);
            console.log(`  Jogador: ${row.player_name}`);
            console.log(`  Acertos: ${row.correct_answers}/${row.total_questions}`);
          });
        }
        
        db.close();
      });
    });
    
  } else {
    console.log('✅ INSERT COMPLETO FUNCIONOU! ID:', this.lastID);
    
    // Verificar resultados
    db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 3', (err, rows) => {
      if (err) {
        console.error('Erro ao verificar:', err);
      } else {
        console.log('\n📋 Registros no banco:', rows.length);
        rows.forEach((row, index) => {
          console.log(`\nRegistro ${index + 1}:`);
          console.log(`  ID: ${row.id}`);
          console.log(`  Jogador: ${row.player_name}`);
          console.log(`  Acertos: ${row.correct_answers}/${row.total_questions}`);
        });
      }
      
      db.close();
    });
  }
});
