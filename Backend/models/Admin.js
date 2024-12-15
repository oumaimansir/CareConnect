const mongoose = require('mongoose');
const Compte = require('./Compte'); // Importer le modèle Compte

const AdminSchema = new mongoose.Schema({

});

// Utiliser le schéma de Assistant comme discriminant de Compte
const Admin = Compte.discriminator('Admin', AdminSchema);

module.exports = Admin;
