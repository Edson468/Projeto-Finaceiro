// c:\Users\GAMER\Desktop\FINANCEIRO\Projeto-Finaceiro\config\db.js

const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria um "pool" de conexões, que é mais eficiente que criar uma nova conexão a cada requisição.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conexão com o MySQL estabelecida com sucesso!');
    conn.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => console.error('❌ Erro ao conectar com o MySQL:', err.code));

module.exports = pool;
