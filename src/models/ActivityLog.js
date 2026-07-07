const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user_id: Number, // Lien vers ID MySQL
    action: String,   // "Connexion", "Virement", etc.
    ip: String,
    date: { type: Date, default: Date.now },
    details: Object   
});

module.exports = mongoose.model('ActivityLog', LogSchema);