const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  assistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistant', // Référence au modèle Assistant
    required: true,
  },
  rendezvous: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rendezvous', // Référence au modèle Rendezvous
    required: true,
  },

  dateConsultation: {
    type: Date,
    required: true,
  },
});

const Consultation = mongoose.model('Consultation', ConsultationSchema);

module.exports = Consultation;
