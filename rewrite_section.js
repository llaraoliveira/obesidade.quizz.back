const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');
const lines = content.split('\n');

// Encontrar o início e fim da seção problemática
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('app.post(\'/api/results\'')) {
    startIdx = i;
  }
  if (lines[i].includes('} catch (error) {') && startIdx > -1) {
    endIdx = i;
    break;
  }
}

if (startIdx > -1 && endIdx > -1) {
  console.log(`Reescrevendo linhas ${startIdx + 1} a ${endIdx + 1}`);
  
  // Reescrever a seção com a query correta
  const newSection = `app.post('/api/results', (req, res) => {
  const { 
    player_name, 
    correct_answers, 
    difficulty, 
    total_questions, 
    easy_correct, 
    medium_correct, 
    hard_correct, 
    easy_total, 
    medium_total, 
    hard_total 
  } = req.body;
  
  if (!player_name || correct_answers === undefined || !difficulty || !total_questions) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  // Verificar se os novos campos existem
  const hasNewFields = easy_correct !== undefined || medium_correct !== undefined || hard_correct !== undefined;
  
  if (hasNewFields) {
    // Tentar salvar com todos os campos
    db.run(
      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        player_name, 
        correct_answers, 
        total_questions, 
        difficulty, 
        easy_correct || 0, 
        medium_correct || 0, 
        hard_correct || 0, 
        easy_total || 0, 
        medium_total || 0, 
        hard_total || 0
      ],
      function(err) {
        if (err) {
          console.error('❌ Erro ao salvar resultado com campos novos:', err);
          // Fallback: salvar sem os campos novos
          db.run(
            'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty) VALUES (?, ?, ?, ?)',
            [player_name, correct_answers, total_questions, difficulty],
            function(fallbackErr) {
              if (fallbackErr) {
                console.error('❌ Erro ao salvar resultado (fallback):', fallbackErr);
                return res.status(500).json({ error: 'Erro interno do servidor' });
              }
              
              res.json({ 
                success: true, 
                id: this.lastID,
                message: 'Resultado salvo com sucesso (modo compatibilidade)'
              });
            }
          );
        } else {
          res.json({ 
            success: true, 
            id: this.lastID,
            message: 'Resultado salvo com sucesso'
          });
        }
      }
    );
  } else {
    // Salvar apenas com os campos básicos (compatibilidade)
    db.run(
      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty) VALUES (?, ?, ?, ?)',
      [player_name, correct_answers, total_questions, difficulty],
      function(err) {
        if (err) {
          console.error('Erro ao salvar resultado:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        res.json({ 
          success: true, 
          id: this.lastID,
          message: 'Resultado salvo com sucesso'
        });
      }
    );
  }
});`;

  // Substituir a seção
  const newLines = [
    ...lines.slice(0, startIdx),
    ...newSection.split('\n'),
    ...lines.slice(endIdx)
  ];
  
  // Escrever de volta
  fs.writeFileSync('server.js', newLines.join('\n'));
  
  console.log('Seção reescrita com sucesso!');
  console.log('Placeholders na nova query:', (newSection.match(/\?/g) || []).length);
} else {
  console.log('Não foi possível encontrar a seção para reescrever');
}
