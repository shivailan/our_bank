const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Expressions régulières pour les validations demandées par le cahier des charges
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
// Minimum 8 caractères, 1 majuscule, 1 chiffre
const PWD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.getRegister = (req, res) => {
    res.render('register', { error: null });
};

exports.postRegister = async (req, res) => {
    const { nom, prenom, email, telephone, adresse_postale, date_naissance, password } = req.body;

    // 1. Validations strictes (Règles de gestion)
    if (!EMAIL_REGEX.test(email)) {
        return res.render('register', { error: 'Format d\'email invalide.' });
    }
    if (!PHONE_REGEX.test(telephone)) {
        return res.render('register', { error: 'Le numéro de téléphone doit contenir exactement 10 chiffres.' });
    }
    if (!PWD_REGEX.test(password)) {
        return res.render('register', { error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.' });
    }

    try {
        // 2. Vérifier si l'email existe déjà
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.render('register', { error: 'Cet email est déjà utilisé.' });
        }

        // 3. Hachage automatique du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Création de l'utilisateur
        await UserModel.create({
            nom, prenom, email, telephone, adresse_postale, date_naissance,
            password: hashedPassword
        });

        // Redirection vers la page de connexion après inscription réussie
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Une erreur est survenue lors de l\'inscription.' });
    }
};

exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.render('login', { error: 'Identifiants incorrects.' });
        }

        // Vérification du mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Identifiants incorrects.' });
        }

        // Stockage des infos utilisateurs dans la session
        req.session.user = {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            is_admin: user.is_admin
        };

        // Redirection selon le rôle (Admin ou Client)
        if (user.is_admin === 1) {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/client/dashboard');
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Une erreur est survenue.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};