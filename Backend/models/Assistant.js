const mongoose = require('mongoose');
const Compte = require('./Compte'); // Importer le modèle Compte

const AssistantSchema = new mongoose.Schema({
  consultations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation', // Référence au modèle Consultation
    },
  ],
});

// Utiliser le schéma de Assistant comme discriminant de Compte
const Assistant = Compte.discriminator('Assistant', AssistantSchema);

module.exports = Assistant;
