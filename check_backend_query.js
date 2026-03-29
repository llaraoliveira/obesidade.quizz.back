const fs = require('fs');

console.log('=== VERIFICANDO QUERY NO BACKEND ===');

// Ler o arquivo
const content = fs.readFileSync('server.js', 'utf8');

// Encontrar todas as queries INSERT
const insertQueries = content.match(/'INSERT INTO game_results[^']*VALUES[^']*'/g);

console.log('Queries encontradas:');
insertQueries.forEach((query, index) => {
  const placeholders = (query.match(/\?/g) || []).length;
  console.log(`\n${index + 1}. Placeholders: ${placeholders}`);
  console.log(`   Query: ${query.substring(0, 100)}...`);
});
