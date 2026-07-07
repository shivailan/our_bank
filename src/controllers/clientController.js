const CompteModel = require('../models/compteModel');
const TransactionModel = require('../models/transactionModel');

// 1. Générateur d'IBAN
const generateIBAN = () => {
    const randomDigits = (length) => {
        let result = '';
        for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 10);
        return result;
    };
    return `FR76-YBNK-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(3)}`;
};

// 2. Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const comptes = await CompteModel.findByUserId(userId);
        
        // Récupérer toutes les transactions des comptes de l'utilisateur
        let toutesLesTransactions = [];
        for (const compte of comptes) {
            const trans = await TransactionModel.findByCompteId(compte.id);
            toutesLesTransactions = [...toutesLesTransactions, ...trans];
        }
        // Trier par date et prendre les 5 dernières
        toutesLesTransactions.sort((a, b) => new Date(b.date_transaction) - new Date(a.date_transaction));
        const transactionsRecentes = toutesLesTransactions.slice(0, 5);

        res.render('client/dashboard', { user: req.session.user, comptes, transactions: transactionsRecentes, error: null, success: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur tableau de bord.');
    }
};

// 3. Création de compte
// 3. Création de compte (version sécurisée)
exports.postCreateCompte = async (req, res) => {
    const { type_compte, solde_initial } = req.body;
    const userId = req.session.user.id;
    const initialDeposit = parseFloat(solde_initial) || 0;

    try {
        // 1. Vérifier si l'utilisateur possède déjà ce type de compte
        const comptesExistants = await CompteModel.findByUserId(userId);
        const dejaPossede = comptesExistants.find(c => c.type_compte === type_compte);

        if (dejaPossede) {
            return res.render('client/dashboard', { 
                user: req.session.user, 
                comptes: comptesExistants, 
                error: `Vous possédez déjà un compte de type : ${type_compte}.`, 
                success: null 
            });
        }

        // 2. Si aucun compte de ce type, on crée
        if (initialDeposit < 0) {
            return res.render('client/dashboard', { user: req.session.user, comptes: comptesExistants, error: 'Solde négatif interdit.', success: null });
        }

        const newIban = generateIBAN();
        await CompteModel.create(userId, newIban, type_compte, initialDeposit);
        res.redirect('/client/dashboard');

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur création compte.');
    }
};

// 4. Détails d'un compte (Vérifie bien cette ligne !)
exports.getCompteDetails = async (req, res) => {
    const compteId = req.params.id;
    try {
        const compte = await CompteModel.findById(compteId);
        if (!compte || compte.user_id !== req.session.user.id) {
            return res.redirect('/client/dashboard');
        }
        const transactions = await TransactionModel.findByCompteId(compteId);
        res.render('client/compte_details', { user: req.session.user, compte, transactions, error: null, success: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur détails.');
    }
};

// 5. Opérations (Dépôt / Retrait)
exports.postOperation = async (req, res) => {
    const compteId = req.params.id;
    const { type_transaction, montant, libelle } = req.body;
    const val = parseFloat(montant);

    try {
        const compte = await CompteModel.findById(compteId);
        if (!compte || compte.user_id !== req.session.user.id) return res.redirect('/client/dashboard');

        if (compte.statut === 'bloqué') {
            return res.render('client/compte_details', { user: req.session.user, compte, transactions: await TransactionModel.findByCompteId(compteId), error: "Compte bloqué.", success: null });
        }
        if (isNaN(val) || val < 1) {
            return res.render('client/compte_details', { user: req.session.user, compte, transactions: await TransactionModel.findByCompteId(compteId), error: "Minimum 1 €.", success: null });
        }
        if (type_transaction === 'retrait') {
            if (val > 1000) return res.render('client/compte_details', { user: req.session.user, compte, transactions: await TransactionModel.findByCompteId(compteId), error: "Maximum 1000 €.", success: null });
            if (compte.solde - val < 0) return res.render('client/compte_details', { user: req.session.user, compte, transactions: await TransactionModel.findByCompteId(compteId), error: "Solde insuffisant.", success: null });
        }

        await TransactionModel.createOp(compteId, type_transaction, val, libelle);
        res.redirect(`/client/compte/${compteId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur opération.');
    }
};

// 6. Suppression du compte
exports.getDeleteCompte = async (req, res) => {
    const compteId = req.params.id;
    try {
        const compte = await CompteModel.findById(compteId);
        if (!compte || compte.user_id !== req.session.user.id) return res.redirect('/client/dashboard');

        if (parseFloat(compte.solde) !== 0) {
            const comptes = await CompteModel.findByUserId(req.session.user.id);
            return res.render('client/dashboard', { user: req.session.user, comptes, error: "Le solde doit être à 0 €.", success: null });
        }

        await CompteModel.delete(compteId);
        res.redirect('/client/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur suppression.');
    }
};

exports.postVirement = async (req, res) => {
    const compteSourceId = req.params.id;
    const { iban_destinataire, montant, libelle } = req.body;
    const val = parseFloat(montant);

    try {
        const compteSource = await CompteModel.findById(compteSourceId);
        if (!compteSource || compteSource.user_id !== req.session.user.id) {
            return res.redirect('/client/dashboard');
        }

        const transactions = await TransactionModel.findByCompteId(compteSourceId);

        // RG : Vérifications de sécurité
        if (compteSource.statut === 'bloqué') {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "Votre compte est bloqué. Virement impossible.", success: null });
        }
        if (isNaN(val) || val < 1) {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "Le montant minimum du virement est de 1 €.", success: null });
        }
        if (compteSource.solde - val < 0) {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "Solde insuffisant pour effectuer ce virement.", success: null });
        }

        // Vérifier si l'IBAN destinataire existe en base de données
        const compteDest = await TransactionModel.findByIban(iban_destinataire.trim());
        if (!compteDest) {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "L'IBAN destinataire n'existe pas.", success: null });
        }
        if (compteDest.id === compteSource.id) {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "Impossible d'effectuer un virement sur le même compte.", success: null });
        }
        if (compteDest.statut === 'bloqué') {
            return res.render('client/compte_details', { user: req.session.user, compte: compteSource, transactions, error: "Le compte destinataire est bloqué par l'administration.", success: null });
        }

        // Exécuter le virement
        await TransactionModel.createVirement(compteSource.id, compteDest.id, val, libelle);

        // Recharger les données à jour
        const compteMisAJour = await CompteModel.findById(compteSourceId);
        const transactionsMisesAJour = await TransactionModel.findByCompteId(compteSourceId);

        res.render('client/compte_details', {
            user: req.session.user,
            compte: compteMisAJour,
            transactions: transactionsMisesAJour,
            error: null,
            success: `Virement de ${val.toFixed(2)} € envoyé avec succès vers l'IBAN ${iban_destinataire} !`
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du virement bancaire.');
    }
};