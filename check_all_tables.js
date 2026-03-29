const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

console.log('=== TODAS AS TABELAS DO BANCO ===');

db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  
  console.log(`\n📋 Encontradas ${rows.length} tabelas:`);
  rows.forEach((row, index) => {
    console.log(`${index + 1}. ${row.name}`);
  });
  
  // Para cada tabela, mostrar estrutura e contagem
  let tablesProcessed = 0;
  
  rows.forEach((tableRow) => {
    const tableName = tableRow.name;
    
    console.log(`\n=== TABELA: ${tableName.toUpperCase()} ===`);
    
    // Estrutura da tabela
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        console.error(`Erro na estrutura de ${tableName}:`, err);
        return;
      }
      
      console.log('\n📋 Estrutura:');
      columns.forEach(col => {
        const nullable = col.notnull ? 'NOT NULL' : 'NULL';
        const defaultValue = col.dflt_value ? `DEFAULT ${col.dflt_value}` : '';
        console.log(`  - ${col.name}: ${col.type} ${nullable} ${defaultValue}`);
      });
      
      // Contagem de registros
      db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, result) => {
        if (err) {
          console.error(`Erro ao contar ${tableName}:`, err);
          return;
        }
        
        console.log(`\n📊 Total de registros: ${result.count}`);
        
        // Se tiver dados, mostrar alguns exemplos
        if (result.count > 0 && result.count <= 10) {
          db.all(`SELECT * FROM ${tableName} LIMIT 5`, (err, rows) => {
            if (err) {
              console.error(`Erro ao buscar dados de ${tableName}:`, err);
              return;
            }
            
            console.log('\n📋 Dados (primeiros 5):');
            rows.forEach((row, index) => {
              console.log(`\n  Registro ${index + 1}:`);
              Object.keys(row).forEach(key => {
                console.log(`    ${key}: ${row[key]}`);
              });
            });
            
            tablesProcessed++;
            if (tablesProcessed === rows.length) {
              db.close();
            }
          });
        } else if (result.count > 10) {
          console.log(`\n📋 Muitos registros (${result.count}). Mostrando apenas os 3 primeiros:`);
          db.all(`SELECT * FROM ${tableName} LIMIT 3`, (err, sampleRows) => {
            if (err) {
              console.error(`Erro ao buscar amostra de ${tableName}:`, err);
              return;
            }
            
            sampleRows.forEach((row, index) => {
              console.log(`\n  Amostra ${index + 1}:`);
              Object.keys(row).forEach(key => {
                const value = row[key];
                const displayValue = String(value).length > 50 
                  ? String(value).substring(0, 50) + '...' 
                  : value;
                console.log(`    ${key}: ${displayValue}`);
              });
            });
            
            tablesProcessed++;
            if (tablesProcessed === rows.length) {
              db.close();
            }
          });
        } else {
          console.log('\n📋 Sem registros para mostrar');
          
          tablesProcessed++;
          if (tablesProcessed === rows.length) {
            db.close();
          }
        }
      });
    });
  });
});
