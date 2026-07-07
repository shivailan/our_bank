const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user_id: Number, // Lien vers ton ID MySQL
    action: String,   // "Connexion", "Virement", etc.
    ip: String,
    date: { type: Date, default: Date.now },
    details: Object   // Très flexible, c'est là que le NoSQL brille
});

module.exports = mongoose.model('ActivityLog', LogSchema);