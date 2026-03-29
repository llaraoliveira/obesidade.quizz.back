const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

console.log('=== VERIFICANDO TABELAS ===');

db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log('Tabelas encontradas:');
  rows.forEach(row => {
    console.log(`- ${row.name}`);
  });
  
  // Verificar se game_results existe
  db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="game_results"', (err, table) => {
    if (err) {
      console.error('Erro:', err);
      return;
    }
    
    if (table) {
      console.log('\n✅ Tabela game_results existe!');
      
      // Verificar dados
      db.all('SELECT COUNT(*) as count FROM game_results', (err, result) => {
        if (err) {
          console.error('Erro ao contar:', err);
          return;
        }
        
        console.log(`📊 Total de registros: ${result[0].count}`);
        
        if (result[0].count > 0) {
          db.all('SELECT * FROM game_results LIMIT 3', (err, rows) => {
            if (err) {
              console.error('Erro ao buscar:', err);
              return;
            }
            
            console.log('\n📋 Exemplos de registros:');
            rows.forEach((row, index) => {
              console.log(`\nRegistro ${index + 1}:`);
              Object.keys(row).forEach(key => {
                console.log(`  ${key}: ${row[key]}`);
              });
            });
            
            db.close();
          });
        } else {
          console.log('⚠️  Nenhum registro encontrado');
          db.close();
        }
      });
    } else {
      console.log('\n❌ Tabela game_results NÃO existe!');
      db.close();
    }
  });
});
