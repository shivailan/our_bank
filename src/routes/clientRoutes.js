const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { isClient } = require('../middlewares/authMiddleware');

// Applique le middleware de protection sur toutes les routes de ce fichier
router.use(isClient);

router.get('/dashboard', clientController.getDashboard);
router.post('/compte/create', clientController.postCreateCompte);

// Voir le détail d'un compte
router.get('/compte/:id', clientController.getCompteDetails);

// Faire un dépôt ou un retrait
router.post('/compte/:id/operation', clientController.postOperation);

// Supprimer un compte
router.get('/compte/:id/delete', clientController.getDeleteCompte);

router.post('/compte/:id/virement', clientController.postVirement);

module.exports = router;