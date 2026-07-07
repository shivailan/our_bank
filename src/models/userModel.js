// ❌ AVANT : const db = require('../config/db_mysql'); 
// ✅ MAINTENANT : on déstructure l'objet pour récupérer le pool
const { pool } = require('../config/db_mysql'); // On extrait la propriété 'pool'
const db = pool; // On redonne le nom 'db' pour ne pas avoir à changer tout ton code en dessous
const UserModel = {
    findByEmail: async (email) => {
        // ✅ On utilise maintenant 'pool' à la place de 'db'
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    create: async (userData) => {
        const { nom, prenom, email, telephone, adresse_postale, date_naissance, password } = userData;
        // ✅ On utilise maintenant 'pool' à la place de 'db'
        const [result] = await pool.query(
            `INSERT INTO users (nom, prenom, email, telephone, adresse_postale, date_naissance, password, is_admin) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
            [nom, prenom, email, telephone, adresse_postale, date_naissance, password]
        );
        return result.insertId;
    }
};

module.exports = UserModel;