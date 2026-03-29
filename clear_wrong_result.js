const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== LIMPANDO RESULTADO INCORRETO ===');

// Remover o resultado com dados inconsistentes
db.run('DELETE FROM game_results WHERE id = 78', function(err) {
  if (err) {
    console.error('Erro ao remover resultado:', err);
  } else {
    console.log(`✅ Resultado 78 removido com sucesso!`);
    console.log(`Linhas afetadas: ${this.changes}`);
    
    // Verificar resultados restantes
    db.all('SELECT id, player_name, easy_correct, easy_total, medium_correct, medium_total, hard_correct, hard_total FROM game_results', (err, results) => {
      if (err) {
        console.error('Erro:', err);
      } else {
        console.log('\n📋 Resultados restantes:');
        if (results.length === 0) {
          console.log('Nenhum resultado encontrado');
        } else {
          results.forEach((row, index) => {
            console.log(`${index + 1}. ID ${row.id}: ${row.player_name}`);
            console.log(`   Fáceis: ${row.easy_correct}/${row.easy_total}`);
            console.log(`   Médias: ${row.medium_correct}/${row.medium_total}`);
            console.log(`   Difíceis: ${row.hard_correct}/${row.hard_total}`);
          });
        }
      }
      
      db.close();
    });
  }
});
