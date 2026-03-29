// Adicionar ao server.js - endpoint de teste
app.post('/api/test-difficulty', (req, res) => {
  console.log('=== ENDPOINT DE TESTE ===');
  console.log('Dados recebidos:', req.body);
  
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
  
  // Query simples e direta
  const query = 'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
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
  ];
  
  console.log('Query:', query);
  console.log('Placeholders:', (query.match(/\?/g) || []).length);
  console.log('Valores:', values.length);
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('❌ Erro no INSERT:', err);
      console.error('Código:', err.code);
      console.error('Mensagem:', err.message);
      return res.status(500).json({ 
        error: 'Erro ao salvar resultado de teste',
        details: err.message 
      });
    }
    
    console.log('✅ INSERT executado com sucesso!');
    console.log('ID:', this.lastID);
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Resultado de teste salvo com sucesso!'
    });
  });
});
