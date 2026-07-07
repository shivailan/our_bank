const { pool } = require('../config/db_mysql'); // On extrait la propriété 'pool'
const db = pool; // On redonne le nom 'db' pour ne pas avoir à changer tout ton code en dessous
const CompteModel = {
    // Trouver tous les comptes d'un utilisateur spécifié
    findByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM comptes_bancaires WHERE user_id = ?', [userId]);
        return rows;
    },

    // Trouver un compte précis par son ID
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM comptes_bancaires WHERE id = ?', [id]);
        return rows[0];
    },

    // Créer un nouveau compte bancaire
    create: async (userId, iban, typeCompte, soldeInitial) => {
        const [result] = await db.query(
            `INSERT INTO comptes_bancaires (user_id, iban, type_compte, solde, statut) 
             VALUES (?, ?, ?, ?, 'actif')`,
            [userId, iban, typeCompte, soldeInitial]
        );
        return result.insertId;
    },

    // Supprimer un compte (uniquement si le solde est égal à 0)
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM comptes_bancaires WHERE id = ? AND solde = 0.00', [id]);
        return result.affectedRows > 0; // Renvoie true si la suppression a réussi
    }
};

module.exports = CompteModel;