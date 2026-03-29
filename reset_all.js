const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('obesidade_quiz.db');

console.log('=== RESET COMPLETO DO BANCO DE DADOS ===');

// Limpar todas as tabelas
const queries = [
  'DELETE FROM question_responses',
  'DELETE FROM game_results'
];

let completed = 0;

queries.forEach((query, index) => {
  db.run(query, function(err) {
    if (err) {
      console.error(`❌ Erro ao executar query ${index + 1}:`, err);
    } else {
      console.log(`✅ Query ${index + 1} executada: ${query}`);
      console.log(`   Linhas afetadas: ${this.changes}`);
    }
    
    completed++;
    if (completed === queries.length) {
      // Verificar se está tudo limpo
      console.log('\n📋 Verificando tabelas após limpeza:');
      
      db.all('SELECT COUNT(*) as count FROM game_results', (err, result) => {
        if (err) {
          console.error('Erro ao verificar game_results:', err);
        } else {
          console.log(`📊 game_results: ${result[0].count} registros`);
        }
      });
      
      db.all('SELECT COUNT(*) as count FROM question_responses', (err, result) => {
        if (err) {
          console.error('Erro ao verificar question_responses:', err);
        } else {
          console.log(`📊 question_responses: ${result[0].count} registros`);
        }
        
        console.log('\n🎉 RESET COMPLETO FINALIZADO!');
        console.log('📋 Sistema pronto para novos testes!');
        
        db.close();
      });
    }
  });
});
