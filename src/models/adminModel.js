const { pool } = require('../config/db_mysql'); // On extrait la propriété 'pool'
const db = pool; // On redonne le nom 'db' pour ne pas avoir à changer tout ton code en dessous
const AdminModel = {
    // Obtenir les statistiques globales (RG 2.1.B.Statistiques)
    getStats: async () => {
        const [users] = await db.query('SELECT COUNT(*) as total_clients FROM users WHERE is_admin = 0');
        const [comptes] = await db.query('SELECT COUNT(*) as total_comptes FROM comptes_bancaires');
        const [solde] = await db.query('SELECT SUM(solde) as total_depots FROM comptes_bancaires');
        
        return {
            total_clients: users[0].total_clients,
            total_comptes: comptes[0].total_comptes,
            total_depots: solde[0].total_depots || 0
        };
    },

    // Lister tous les clients avec le nombre de comptes qu'ils possèdent
    getAllClients: async () => {
        const [rows] = await db.query(`
            SELECT u.id, u.nom, u.prenom, u.email, u.telephone, COUNT(c.id) as nb_comptes 
            FROM users u
            LEFT JOIN comptes_bancaires c ON u.id = c.user_id
            WHERE u.is_admin = 0
            GROUP BY u.id
        `);
        return rows;
    },

    // Lister tous les comptes de la banque
    getAllComptes: async () => {
        const [rows] = await db.query(`
            SELECT c.*, u.nom, u.prenom 
            FROM comptes_bancaires c
            JOIN users u ON c.user_id = u.id
        `);
        return rows;
    },

    // Bloquer ou débloquer un compte bancaire
    toggleCompteStatut: async (compteId, nouveauStatut) => {
        await db.query('UPDATE comptes_bancaires SET statut = ? WHERE id = ?', [nouveauStatut, compteId]);
    }
};

module.exports = AdminModel;