const mongoose = require('mongoose');
const Compte = require('./Compte'); // Importer le modèle Compte

// Définir le schéma spécifique à Docteur
const DocteurSchema = new mongoose.Schema({
  specialite: {
    type: String,
    required: true,
  },
  rendezvous: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rendezvous', // Référence au modèle Rendezvous
    },
  ],
});

// Utiliser le schéma de Docteur comme discriminant de Compte
const Docteur = Compte.discriminator('Docteur', DocteurSchema);

module.exports = Docteur;
