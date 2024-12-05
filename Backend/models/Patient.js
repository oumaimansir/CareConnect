const mongoose = require('mongoose');
const Compte = require('./Compte'); // Importer le modèle Compte

const PatientSchema = new mongoose.Schema({
  rendezvous: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rendezvous', // Référence au modèle Rendezvous
    },
  ],
});

// Utiliser le schéma de Patient comme discriminant de Compte
const Patient = Compte.discriminator('Patient', PatientSchema);

module.exports = Patient;
