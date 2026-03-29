const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

console.log('=== VERIFICANDO BANCOS DE DADOS ===');

// Verificar arquivos .db no diretório atual
const files = fs.readdirSync('.');
const dbFiles = files.filter(file => file.endsWith('.db'));

console.log('\n📂 Arquivos .db encontrados:');
dbFiles.forEach(file => {
  console.log(`- ${file}`);
});

if (dbFiles.length === 0) {
  console.log('- Nenhum arquivo .db encontrado');
} else {
  // Para cada arquivo, verificar conteúdo
  dbFiles.forEach(dbFile => {
    console.log(`\n=== VERIFICANDO ${dbFile.toUpperCase()} ===`);
    
    try {
      const db = new sqlite3.Database(dbFile);
      
      // Verificar tabelas
      db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
        if (err) {
          console.error(`Erro em ${dbFile}:`, err);
          return;
        }
        
        console.log(`\n📋 Tabelas em ${dbFile}:`);
        tables.forEach(table => {
          console.log(`  - ${table.name}`);
        });
        
        // Verificar game_results
        if (tables.some(t => t.name === 'game_results')) {
          db.all('SELECT COUNT(*) as count FROM game_results', (err, result) => {
            if (err) {
              console.error(`Erro ao contar em ${dbFile}:`, err);
              return;
            }
            
            console.log(`\n📊 game_results em ${dbFile}: ${result[0].count} registros`);
            
            if (result[0].count > 0) {
              db.all('SELECT * FROM game_results ORDER BY created_at DESC LIMIT 5', (err, rows) => {
                if (err) {
                  console.error(`Erro ao buscar em ${dbFile}:`, err);
                  return;
                }
                
                console.log('\n📋 Últimos registros:');
                rows.forEach((row, index) => {
                  console.log(`  ${index + 1}. ID: ${row.id}, Jogador: ${row.player_name}, Acertos: ${row.correct_answers}/${row.total_questions}`);
                });
                
                db.close();
              });
            } else {
              db.close();
            }
          });
        } else {
          console.log(`\n❌ ${dbFile} não tem tabela game_results`);
          db.close();
        }
      });
    } catch (error) {
      console.error(`Erro ao abrir ${dbFile}:`, error);
    }
  });
}
