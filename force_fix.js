const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

// Encontrar todas as linhas com INSERT e corrigir
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('INSERT INTO game_results') && lines[i].includes('VALUES')) {
    // Verificar se é a linha principal (com todos os campos)
    if (lines[i].includes('easy_correct') && lines[i].includes('medium_correct') && lines[i].includes('hard_correct')) {
      // Substituir com a query perfeita
      lines[i] = "      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'";
      console.log(`Linha ${i+1} corrigida com 10 placeholders!`);
      break;
    }
  }
}

// Escrever de volta
fs.writeFileSync('server.js', lines.join('\n'));
console.log('Query corrigida definitivamente!');
