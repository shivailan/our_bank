const { pool } = require('../config/db_mysql'); // On récupère uniquement le pool
const db = pool; // On assigne à db pour garder ton code fonctionnel

const TransactionModel = {
    // Récupérer l'historique des transactions d'un compte spécifique
    findByCompteId: async (compteId) => {
        const [rows] = await db.query(
            `SELECT * FROM transactions 
             WHERE compte_source_id = ? OR compte_destinataire_id = ? 
             ORDER BY date_transaction DESC`, 
            [compteId, compteId]
        );
        return rows;
    },

    // Enregistrer une nouvelle opération (Dépôt ou Retrait) avec transaction sécurisée
    createOp: async (compteId, type, montant, libelle) => {
        const connection = await db.getConnection(); // On demande une connexion unique pour la transaction
        try {
            await connection.beginTransaction(); 

            if (type === 'dépôt') {
                await connection.query('UPDATE comptes_bancaires SET solde = solde + ? WHERE id = ?', [montant, compteId]);
                await connection.query(
                    `INSERT INTO transactions (compte_source_id, compte_destinataire_id, type_transaction, montant, libelle) 
                     VALUES (NULL, ?, 'dépôt', ?, ?)`, [compteId, montant, libelle]
                );
            } else if (type === 'retrait') {
                await connection.query('UPDATE comptes_bancaires SET solde = solde - ? WHERE id = ?', [montant, compteId]);
                await connection.query(
                    `INSERT INTO transactions (compte_source_id, compte_destinataire_id, type_transaction, montant, libelle) 
                     VALUES (?, NULL, 'retrait', ?, ?)`, [compteId, montant, libelle]
                );
            }

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback(); // Annule tout en cas d'erreur
            throw err;
        } finally {
            connection.release(); // Libère la connexion pour le pool
        }
    },

    // Trouver un compte par son IBAN
    findByIban: async (iban) => {
        const [rows] = await db.query('SELECT * FROM comptes_bancaires WHERE iban = ?', [iban]);
        return rows[0];
    },

    // Enregistrer un virement (Interne ou Externe) avec transaction sécurisée
createVirement: async (compteSourceId, compteDestId, montant, libelle) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('UPDATE comptes_bancaires SET solde = solde - ? WHERE id = ?', [montant, compteSourceId]);
            await connection.query('UPDATE comptes_bancaires SET solde = solde + ? WHERE id = ?', [montant, compteDestId]);

            // Insertion avec log
            const sql = `INSERT INTO transactions (compte_source_id, compte_destinataire_id, type_transaction, montant, libelle) VALUES (?, ?, 'virement émis', ?, ?)`;
            const params = [compteSourceId, compteDestId, montant, libelle];
            
            console.log("SQL exécuté :", sql, params); // Affiche la requête
            await connection.query(sql, params);

            await connection.commit();
            return true;
        } catch (err) {
            console.error("ERREUR DÉTAILLÉE :", err.sqlMessage || err); // Affiche l'erreur MySQL réelle
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
};

module.exports = TransactionModel;