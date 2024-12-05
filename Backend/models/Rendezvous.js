const mongoose = require('mongoose');

const RendezvousSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  heure: {
    type: String, // Vous pouvez utiliser une chaîne ou un autre type selon vos besoins (ex. 'HH:mm')
    required: true,
  },
  etat: {
    type: String,
    enum: ['programmé', 'annulé', 'terminé','confirmé'], // Exemple d'états possibles
    default: 'programmé',
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Référence au modèle Patient
    required: true,
  },
  docteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Docteur', // Référence au modèle Patient
    required: true,
  },
  consultations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation', // Référence au modèle Consultation
    },
  ],
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);
module.exports = Rendezvous;
