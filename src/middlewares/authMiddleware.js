// Empêche un utilisateur non connecté d'accéder à l'espace client
exports.isClient = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// Empêche un non-admin d'accéder à l'espace admin
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.is_admin === 1) {
        return next();
    }
    res.status(403).send('Accès refusé. Réservé aux administrateurs.');
};