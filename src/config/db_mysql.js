const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Exporte une fonction qui vérifie la connexion
const connectMySQL = async () => {
    try {
        await pool.query('SELECT 1'); // Test de connexion
        console.log('✅ Connecté à MySQL');
    } catch (err) {
        console.error('❌ Erreur MySQL:', err);
    }
};

// Exporte à la fois la fonction ET le pool
module.exports = connectMySQL;
module.exports.pool = pool; 