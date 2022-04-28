const { Pool } = require('pg');
const dbData = {
    host: 'localhost',
    user: 'alphauser',
    password: process.env.BD_PASS,
    database: process.env.BD_NAME,
    max: process.env.BD_MAX||20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// ==> Conexão com a Base de Dados:
const pool = new Pool(dbData);

pool.on('connect', () => 
{
  console.log('Base de Dados conectado com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};