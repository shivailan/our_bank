const express = require('express');
const session = require('express-session'); 
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const connectMySQL = require('./config/db_mysql'); 
const connectMongo = require('./config/db_mongo'); 

// 1. Connexion MySQL (Obligatoire)
connectMySQL(); 

// 2. Connexion MongoDB (Optionnelle et sécurisée)
connectMongo().catch(err => {
    console.error("⚠️ MongoDB est tombé, mais le site reste en ligne.");
});

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares de base (Analyse des requêtes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


app.use(session({
    secret: process.env.SESSION_SECRET || 'un_secret_par_defaut',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Déclaration des routes
app.use('/auth', authRoutes); 
app.use('/client', clientRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});