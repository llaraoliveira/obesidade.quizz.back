const http = require('http');

// Testar salvamento com dados de dificuldade completos
console.log('=== TESTANDO SALVAMENTO COM DADOS DE DIFICULDADE ===');

const testData = JSON.stringify({
  player_name: 'Teste Dificuldade Completa',
  correct_answers: 7,
  difficulty: 'misto',
  total_questions: 8,
  easy_correct: 2,
  medium_correct: 3,
  hard_correct: 2,
  easy_total: 2,
  medium_total: 4,
  hard_total: 2
});

console.log('Dados enviados:');
console.log('- Jogador: Teste Dificuldade Completa');
console.log('- Total: 7/8');
console.log('- Fáceis: 2/2');
console.log('- Médias: 3/4');
console.log('- Difíceis: 2/2');

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/results',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
}, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n📤 Resposta do servidor:');
      console.log('- Status:', res.statusCode);
      console.log('- Success:', result.success);
      console.log('- ID:', result.id);
      console.log('- Message:', result.message);
      
      // Verificar se salvou com sucesso ou modo compatibilidade
      if (result.message.includes('compatibilidade')) {
        console.log('❌ CAIU NO MODO COMPATIBILIDADE!');
      } else {
        console.log('✅ SALVOU COM DADOS DE DIFICULDADE!');
      }
      
    } catch (error) {
      console.error('Erro na resposta:', error);
    }
  });
});

req.on('error', (err) => {
  console.error('Erro na requisição:', err);
});

req.write(testData);
req.end();
