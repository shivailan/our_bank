const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/authMiddleware');

// Applique la protection Admin sur l'ensemble de ces routes
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboard);
router.post('/compte/:id/toggle', adminController.postToggleCompte);

module.exports = router;