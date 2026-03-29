const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('server.js', 'utf8');

// Substituir diretamente a string problemática
const oldString = "hard_cor\n      rect";
const newString = "hard_correct";

content = content.replace(oldString, newString);

// Escrever de volta
fs.writeFileSync('server.js', content);

console.log('Substituição direta realizada!');
console.log('De:', JSON.stringify(oldString));
console.log('Para:', JSON.stringify(newString));
