const AdminModel = require('../models/adminModel');

exports.getDashboard = async (req, res) => {
    try {
        const stats = await AdminModel.getStats();
        const clients = await AdminModel.getAllClients();
        const comptes = await AdminModel.getAllComptes();

        res.render('admin/dashboard', {
            user: req.session.user,
            stats,
            clients,
            comptes
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement du tableau de bord admin.');
    }
};

exports.postToggleCompte = async (req, res) => {
    const compteId = req.params.id;
    const { statut_actuel } = req.body;
    const nouveauStatut = statut_actuel === 'actif' ? 'bloqué' : 'actif';

    try {
        await AdminModel.toggleCompteStatut(compteId, nouveauStatut);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du changement de statut du compte.');
    }
};