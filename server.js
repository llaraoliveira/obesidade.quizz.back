const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_temporario';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./obesidade_quiz.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        alternatives TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        difficulty TEXT NOT NULL CHECK(difficulty IN ('facil', 'medio', 'dificil')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        correct_answers INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        easy_correct INTEGER DEFAULT 0,
        medium_correct INTEGER DEFAULT 0,
        hard_correct INTEGER DEFAULT 0,
        easy_total INTEGER DEFAULT 0,
        medium_total INTEGER DEFAULT 0,
        hard_total INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS dicas_content (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        content TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    createAdminUser();
    insertSampleQuestions();
    insertDefaultDicassContent();
  });
}

function createAdminUser() {
  const adminUsername = 'admin';
  const adminPassword = 'NotPass';
  
  db.get('SELECT * FROM users WHERE username = ?', [adminUsername], (err, row) => {
    if (err) {
      console.error('Erro ao verificar usuário admin:', err);
      return;
    }
    
    if (!row) {
      bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Erro ao criptografar senha:', err);
          return;
        }
        
        db.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [adminUsername, hashedPassword, 'admin'],
          (err) => {
            if (err) {
              console.error('Erro ao criar usuário admin:', err);
            } else {
              console.log('Usuário admin criado com sucesso!');
            }
          }
        );
      });
    }
  });
}

function insertDefaultDicassContent() {
  const defaultContent = `
    <h2>🍎 Alimentação Saudável</h2>
    <p>Uma alimentação equilibrada é fundamental para o crescimento saudável das crianças. Ofereça uma variedade de alimentos ricos em nutrientes:</p>
    <ul>
      <li><strong>Frutas e vegetais:</strong> Pelo menos 5 porções por dia</li>
      <li><strong>Proteínas:</strong> Carnes magras, ovos, legumes e feijão</li>
      <li><strong>Grãos integrais:</strong> Arroz integral, pães integrais, aveia</li>
      <li><strong>Laticínios:</strong> Leite, iogurte e queijos com baixo teor de gordura</li>
    </ul>

    <h2>🏃‍♂️ Atividade Física</h2>
    <p>Crianças precisam se movimentar! A recomendação é de pelo menos 60 minutos de atividade física por dia:</p>
    <ul>
      <li>Brincar ao ar livre</li>
      <li>Praticar esportes</li>
      <li>Andar de bicicleta</li>
      <li>Dançar</li>
    </ul>

    <h2>😴 Sono Adequado</h2>
    <p>O sono é crucial para o desenvolvimento infantil:</p>
    <ul>
      <li><strong>Crianças em idade escolar:</strong> 9-11 horas por noite</li>
      <li><strong>Adolescentes:</strong> 8-10 horas por noite</li>
      <li>Mantenha um horário regular de sono</li>
      <li>Evite telas antes de dormir</li>
    </ul>

    <h2>💧 Hidratação</h2>
    <p>A água é essencial para o bom funcionamento do corpo:</p>
    <ul>
      <li>Beba água ao longo do dia</li>
      <li>Evite refrigerantes e sucos artificiais</li>
      <li>Leve uma garrafa de água para a escola</li>
      <li>Beba mais água durante atividades físicas</li>
    </ul>

    <h2>📱 Tempo de Tela</h2>
    <p>O uso excessivo de eletrônicos pode prejudicar a saúde:</p>
    <ul>
      <li>Limite a 2 horas por dia de entretenimento em tela</li>
      <li>Faça pausas regulares</li>
      <li>Priorize atividades ao ar livre</li>
      <li>Mantenha os dispositivos fora do quarto à noite</li>
    </ul>

    <p><em>Lembre-se: Pequenos hábitos saudáveis criam grandes resultados ao longo do tempo!</em></p>
  `;

  db.get('SELECT * FROM dicas_content WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Erro ao verificar conteúdo de dicas:', err);
      return;
    }
    
    if (!row) {
      db.run(
        'INSERT INTO dicas_content (id, content) VALUES (?, ?)',
        [1, defaultContent.trim()],
        (err) => {
          if (err) {
            console.error('Erro ao inserir conteúdo padrão de dicas:', err);
          } else {
            console.log('Conteúdo padrão de dicas inserido com sucesso!');
          }
        }
      );
    }
  });
}

function insertSampleQuestions() {
  const questions = [
    {
      question: "Qual fator mais contribui para a obesidade infantil?",
      alternatives: JSON.stringify(["Falta de exercício", "Consumo de fast food", "Dormir cedo", "Brincar ao ar livre"]),
      correct_answer: 1,
      difficulty: "facil"
    },
    {
      question: "Quantas porções de frutas uma criança deve comer por dia?",
      alternatives: JSON.stringify(["1-2 porções", "3-4 porções", "5-6 porções", "7-8 porções"]),
      correct_answer: 1,
      difficulty: "facil"
    },
    {
      question: "Qual bebida é mais saudável para crianças?",
      alternatives: JSON.stringify(["Refrigerante", "Suco artificial", "Água", "Energético"]),
      correct_answer: 2,
      difficulty: "facil"
    },
    {
      question: "Quantas horas de atividade física infantil são recomendadas por dia?",
      alternatives: JSON.stringify(["30 minutos", "60 minutos", "90 minutos", "2 horas"]),
      correct_answer: 1,
      difficulty: "medio"
    },
    {
      question: "Qual alimento é rico em cálcio e essencial para ossos fortes?",
      alternatives: JSON.stringify(["Pão", "Leite", "Arroz", "Feijão"]),
      correct_answer: 1,
      difficulty: "facil"
    },
    {
      question: "O que é IMC (Índice de Massa Corporal)?",
      alternatives: JSON.stringify([
        "Índice de Massa Corporal",
        "Índice de Metabolismo Cardíaco",
        "Índice de Musculatura Corporal",
        "Índice de Medida Corporal"
      ]),
      correct_answer: 0,
      difficulty: "medio"
    },
    {
      question: "Qual é a principal causa do aumento da obesidade infantil?",
      alternatives: JSON.stringify([
        "Genética apenas",
        "Estilo de vida sedentário e má alimentação",
        "Falta de vacinação",
        "Clima tropical"
      ]),
      correct_answer: 1,
      difficulty: "medio"
    },
    {
      question: "Quantas horas de sono uma criança em idade escolar precisa?",
      alternatives: JSON.stringify(["6-7 horas", "8-9 horas", "9-11 horas", "12-14 horas"]),
      correct_answer: 2,
      difficulty: "medio"
    },
    {
      question: "Qual vitamina é essencial para a absorção de cálcio?",
      alternatives: JSON.stringify(["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"]),
      correct_answer: 2,
      difficulty: "dificil"
    },
    {
      question: "Qual é a recomendação da OMS para tempo de tela em crianças?",
      alternatives: JSON.stringify(["Não há limite", "Máximo 1 hora por dia", "Máximo 2 horas por dia", "Máximo 4 horas por dia"]),
      correct_answer: 2,
      difficulty: "dificil"
    }
  ];

  db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
    if (err) {
      console.error('Erro ao contar perguntas:', err);
      return;
    }
    
    if (row.count === 0) {
      questions.forEach((q, index) => {
        db.run(
          'INSERT INTO questions (question, alternatives, correct_answer, difficulty) VALUES (?, ?, ?, ?)',
          [q.question, q.alternatives, q.correct_answer, q.difficulty],
          (err) => {
            if (err) {
              console.error(`Erro ao inserir pergunta ${index + 1}:`, err);
            }
          }
        );
      });
      console.log('Perguntas de exemplo inseridas com sucesso!');
    }
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

app.get('/api/questions', (req, res) => {
  const difficulty = req.query.difficulty;
  
  let query = 'SELECT * FROM questions';
  let params = [];
  
  if (difficulty && ['facil', 'medio', 'dificil'].includes(difficulty)) {
    query += ' WHERE difficulty = ?';
    params.push(difficulty);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar perguntas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    const questions = rows.map(row => ({
      ...row,
      alternatives: row.alternatives
    }));
    
    res.json({ success: true, questions });
  });
});

app.post('/api/results', (req, res) => {
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
      'INSERT INTO game_results (player_name, correct_answers, total_questions, difficulty, easy_correct, medium_correct, hard_correct, easy_total, medium_total, hard_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
          console.error('❌ Erro ao salvar resultado:', err);
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
});

app.get('/api/results', (req, res) => {
  const query = `
    SELECT player_name, correct_answers, total_questions, difficulty, created_at
    FROM game_results 
    ORDER BY correct_answers DESC, difficulty DESC, created_at DESC
    LIMIT 50
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar resultados:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, results: rows });
  });
});

// Rota de login do backoffice
app.post('/api/backoffice/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.error('Erro ao comparar senha:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!isValid) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!result) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    });
  });
});

app.get('/api/backoffice/dashboard', authenticateToken, (req, res) => {
  console.log('Dashboard endpoint called');
  
  // Query para estatísticas básicas
  const statsQuery = `
    SELECT 
      COUNT(*) as total_games,
      AVG(correct_answers) as avg_correct,
      SUM(CASE WHEN difficulty = 'facil' THEN 1 ELSE 0 END) as easy_games,
      SUM(CASE WHEN difficulty = 'medio' THEN 1 ELSE 0 END) as medium_games,
      SUM(CASE WHEN difficulty = 'dificil' THEN 1 ELSE 0 END) as hard_games
    FROM game_results
  `;
  
  db.get(statsQuery, (err, stats) => {
    if (err) {
      console.error('Erro ao buscar estatísticas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    // Query para estatísticas por dificuldade (voltando para a versão que funcionava)
    const difficultyStatsQuery = `
      SELECT 
        difficulty,
        SUM(total_correct) as total_correct,
        SUM(total_questions) as total_questions,
        CASE 
          WHEN SUM(total_questions) > 0 THEN ROUND((SUM(total_correct) * 100.0) / SUM(total_questions), 2)
          ELSE 0 
        END as avg_correct
      FROM (
        SELECT 'facil' as difficulty, easy_correct as total_correct, easy_total as total_questions
        FROM game_results WHERE easy_total > 0
        
        UNION ALL
        
        SELECT 'medio' as difficulty, medium_correct as total_correct, medium_total as total_questions
        FROM game_results WHERE medium_total > 0
        
        UNION ALL
        
        SELECT 'dificil' as difficulty, hard_correct as total_correct, hard_total as total_questions
        FROM game_results WHERE hard_total > 0
      )
      GROUP BY difficulty
    `;
    
    db.all(difficultyStatsQuery, (err, difficultyStats) => {
      if (err) {
        console.error('Erro ao buscar estatísticas por dificuldade:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      // Query para acertos totais
      const accuracyQuery = `
        SELECT 
          SUM(correct_answers) as total_correct,
          SUM(total_questions) as total_questions
        FROM game_results
      `;
      
      db.get(accuracyQuery, (err, accuracyData) => {
        if (err) {
          console.error('Erro ao buscar taxa de acerto:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        const overallAccuracy = accuracyData.total_questions > 0 
          ? (accuracyData.total_correct / accuracyData.total_questions) * 100 
          : 0;
        
        // Query para top 3 perguntas com maior índice de erro (usando nova tabela)
        const wrongAnswersQuery = `
          SELECT 
            q.question,
            q.difficulty,
            COUNT(*) as times_appeared,
            SUM(CASE WHEN qr.is_correct = 0 THEN 1 ELSE 0 END) as times_wrong,
            CASE 
              WHEN COUNT(*) > 0 THEN ROUND((SUM(CASE WHEN qr.is_correct = 0 THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 2)
              ELSE 0 
            END as error_rate
          FROM questions q
          INNER JOIN question_responses qr ON q.id = qr.question_id
          GROUP BY q.id, q.question, q.difficulty
          HAVING COUNT(*) > 0
          ORDER BY error_rate DESC, times_wrong DESC
          LIMIT 3
        `;
        
        // Query para resultados recentes (limitar para 5)
        const recentResultsQuery = `
          SELECT id, player_name, correct_answers, total_questions, difficulty, created_at
          FROM game_results 
          ORDER BY created_at DESC
          LIMIT 5
        `;
        
        // Executar query de top perguntas com erro
        db.all(wrongAnswersQuery, (err, wrongAnswers) => {
          if (err) {
            console.error('Erro ao buscar top perguntas com erro:', err);
            // Se der erro, continua sem os dados
            wrongAnswers = [];
          }
          
          // Query para resultados recentes (limitar para 5)
          const recentResultsQuery = `
            SELECT id, player_name, correct_answers, total_questions, difficulty, created_at
            FROM game_results 
            ORDER BY created_at DESC
            LIMIT 5
          `;
          
          db.all(recentResultsQuery, (err, recentResults) => {
            if (err) {
              console.error('Erro ao buscar resultados recentes:', err);
              return res.status(500).json({ error: 'Erro interno do servidor' });
            }
          
          // Formatar difficulty_stats para o frontend
          const formattedDifficultyStats = difficultyStats.map(stat => ({
            difficulty: stat.difficulty,
            total_games: stat.total_games,
            total_correct: Math.round((stat.avg_correct || 0) * (stat.total_games || 0)),
            total_questions: stat.total_games,
            avg_correct: stat.avg_correct || 0
          }));
          
          res.json({
            success: true,
            stats: {
              ...stats,
              difficulty_stats: formattedDifficultyStats,
              overall_accuracy: overallAccuracy,
              total_correct: accuracyData.total_correct || 0,
              total_questions: accuracyData.total_questions || 0
            },
            recentResults,
            wrongAnswers
          });
        });
      });
    });
  });
});
});

app.get('/api/backoffice/questions', authenticateToken, (req, res) => {
  db.all('SELECT * FROM questions ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar perguntas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    const questions = rows.map(row => ({
      ...row,
      alternatives: row.alternatives
    }));
    
    res.json({ success: true, questions });
  });
});

app.post('/api/backoffice/questions', authenticateToken, (req, res) => {
  const { question, alternatives, correct_answer, difficulty } = req.body;
  
  if (!question || !alternatives || correct_answer === undefined || !difficulty) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  if (!['facil', 'medio', 'dificil'].includes(difficulty)) {
    return res.status(400).json({ error: 'Dificuldade inválida' });
  }
  
  if (correct_answer < 0 || correct_answer >= alternatives.length) {
    return res.status(400).json({ error: 'Resposta correta inválida' });
  }
  
  db.run(
    'INSERT INTO questions (question, alternatives, correct_answer, difficulty) VALUES (?, ?, ?, ?)',
    [question, JSON.stringify(alternatives), correct_answer, difficulty],
    function(err) {
      if (err) {
        console.error('Erro ao criar pergunta:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      res.json({
        success: true,
        id: this.lastID,
        message: 'Pergunta criada com sucesso'
      });
    }
  );
});

app.put('/api/backoffice/questions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { question, alternatives, correct_answer, difficulty } = req.body;
  
  if (!question || !alternatives || correct_answer === undefined || !difficulty) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  if (!['facil', 'medio', 'dificil'].includes(difficulty)) {
    return res.status(400).json({ error: 'Dificuldade inválida' });
  }
  
  if (correct_answer < 0 || correct_answer >= alternatives.length) {
    return res.status(400).json({ error: 'Resposta correta inválida' });
  }
  
  db.run(
    'UPDATE questions SET question = ?, alternatives = ?, correct_answer = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [question, JSON.stringify(alternatives), correct_answer, difficulty, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar pergunta:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pergunta não encontrada' });
      }
      
      res.json({
        success: true,
        message: 'Pergunta atualizada com sucesso'
      });
    }
  );
});

app.delete('/api/backoffice/questions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM questions WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao deletar pergunta:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Pergunta deletada com sucesso'
    });
  });
});

app.get('/api/backoffice/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  db.all('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, users: rows });
  });
});

app.post('/api/backoffice/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const { username, password, role = 'user' } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Função inválida' });
  }
  
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar senha:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Usuário já existe' });
          }
          console.error('Erro ao criar usuário:', err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        res.json({
          success: true,
          id: this.lastID,
          message: 'Usuário criado com sucesso'
        });
      }
    );
  });
});

app.get('/api/dicas', (req, res) => {
  db.get('SELECT content FROM dicas_content WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Erro ao buscar conteúdo de dicas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }
    
    res.json({ 
      success: true, 
      content: row.content 
    });
  });
});

app.put('/api/backoffice/dicas', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Conteúdo é obrigatório' });
  }
  
  db.run(
    'UPDATE dicas_content SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
    [content],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar conteúdo de dicas:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (this.changes === 0) {
        // Se não existir, cria
        db.run(
          'INSERT INTO dicas_content (id, content) VALUES (?, ?)',
          [1, content],
          (err) => {
            if (err) {
              console.error('Erro ao criar conteúdo de dicas:', err);
              return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            res.json({
              success: true,
              message: 'Conteúdo de dicas criado com sucesso'
            });
          }
        );
      } else {
        res.json({
          success: true,
          message: 'Conteúdo de dicas atualizado com sucesso'
        });
      }
    }
  );
});

// Rota para remover resultados (admin only)
app.delete('/api/backoffice/results/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const { id } = req.params;
  
  db.run('DELETE FROM game_results WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao remover resultado:', err);
      return res.status(500).json({ error: 'Erro ao remover resultado' });
    }
    
    // Por enquanto, não remove respostas individuais na exclusão de um único resultado
    // Isso pode ser implementado futuramente com uma relação mais complexa
    
    res.json({ success: true, message: 'Resultado removido com sucesso' });
  });
});

// Rota para atualizar usuário (admin only)
app.put('/api/backoffice/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const { id } = req.params;
  const { username, password, role } = req.body;
  
  // Não permite alterar o usuário admin principal (ID 1)
  if (parseInt(id) === 1) {
    return res.status(400).json({ error: 'Não é possível alterar o usuário administrador principal' });
  }
  
  if (!username || !role) {
    return res.status(400).json({ error: 'Usuário e função são obrigatórios' });
  }
  
  let query, params;
  if (password) {
    // Se tiver senha, faz hash e atualiza tudo
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Erro ao criptografar senha:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
      params = [username, hashedPassword, role, id];
      
      db.run(query, params, function(err) {
        if (err) {
          console.error('Erro ao atualizar usuário:', err);
          return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
        
        res.json({ success: true, message: 'Usuário atualizado com sucesso' });
      });
    });
  } else {
    // Se não tiver senha, atualiza apenas username e role
    query = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
    params = [username, role, id];
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
      }
      
      res.json({ success: true, message: 'Usuário atualizado com sucesso' });
    });
  }
});

// Rota para remover usuário (admin only)
app.delete('/api/backoffice/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const { id } = req.params;
  
  // Não permite remover o usuário admin principal (ID 1)
  if (parseInt(id) === 1) {
    return res.status(400).json({ error: 'Não é possível remover o usuário administrador principal' });
  }
  
  // Não permite remover o próprio usuário logado
  if (req.user.id === parseInt(id)) {
    return res.status(400).json({ error: 'Não é possível remover seu próprio usuário' });
  }
  
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao remover usuário:', err);
      return res.status(500).json({ error: 'Erro ao remover usuário' });
    }
    
    res.json({ success: true, message: 'Usuário removido com sucesso' });
  });
});

// Rota para buscar todos os resultados (admin only)
app.get('/api/backoffice/results', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const query = `
    SELECT id, player_name, correct_answers, total_questions, difficulty, 
           easy_correct, medium_correct, hard_correct,
           easy_total, medium_total, hard_total,
           created_at
    FROM game_results 
    ORDER BY created_at DESC
    LIMIT 100
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar resultados:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, results: rows });
  });
});

// Rota para remover todos os resultados (admin only)
app.delete('/api/backoffice/results', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  db.run('DELETE FROM game_results', function(err) {
    if (err) {
      console.error('Erro ao remover todos os resultados:', err);
      return res.status(500).json({ error: 'Erro ao remover todos os resultados' });
    }
    
    // Também remover todas as respostas individuais
    db.run('DELETE FROM question_responses', function(err) {
      if (err) {
        console.error('Erro ao remover todas as respostas:', err);
        // Não retorna erro, apenas loga, pois os resultados principais já foram removidos
      }
    });
    
    res.json({ success: true, message: 'Todos os resultados removidos com sucesso' });
  });
});

app.get('/api/backoffice/dicas', authenticateToken, (req, res) => {
  db.get('SELECT content FROM dicas_content WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Erro ao buscar conteúdo de dicas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!row) {
      return res.json({ 
        success: true, 
        content: '' 
      });
    }
    
    res.json({ 
      success: true, 
      content: row.content 
    });
  });
});

// Endpoint para salvar respostas individuais das perguntas
app.post('/api/question-responses', (req, res) => {
  const { 
    question_id, 
    selected_answer, 
    correct_answer, 
    is_correct, 
    difficulty 
  } = req.body;
  
  if (!question_id || selected_answer === undefined || correct_answer === undefined) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  const query = `
    INSERT INTO question_responses (question_id, selected_answer, correct_answer, is_correct, difficulty)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [question_id, selected_answer, correct_answer, is_correct, difficulty], function(err) {
    if (err) {
      console.error('Erro ao salvar resposta da pergunta:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Resposta salva com sucesso'
    });
  });
});

// Endpoint de teste para dificuldade
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
