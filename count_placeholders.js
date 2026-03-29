const query = 'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const values = [
  'player_name', 
  'correct_answers', 
  'total_questions', 
  'difficulty', 
  'easy_correct || 0', 
  'medium_correct || 0', 
  'hard_correct || 0', 
  'easy_total || 0', 
  'medium_total || 0', 
  'hard_total || 0'
];

console.log('=== VERIFICANDO PLACEHOLDERS ===');
console.log('Query:', query);
console.log('Placeholders encontrados:', (query.match(/\?/g) || []).length);
console.log('Valores no array:', values.length);
console.log('Diferença:', values.length - (query.match(/\?/g) || []).length);

// Colunas na query
const columns = query.match(/\([^)]+\)/)[0];
console.log('Colunas:', columns);
console.log('Colunas encontradas:', columns.split(',').length);
