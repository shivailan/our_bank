const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/our_bank_logs');
        console.log('✅ Connecté à MongoDB (Logs & Services)');
    } catch (err) {
        console.error('❌ Erreur connexion MongoDB:', err);
    }
};

module.exports = connectMongo;