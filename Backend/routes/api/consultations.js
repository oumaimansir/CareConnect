const express = require("express");
const router = express.Router(); // Initialisation du router

const Consultation = require("../../models/Consultation");
const Assistant = require("../../models/Assistant");
const Rendezvous = require("../../models/Rendezvous");

// Votre route ici
router.post("/registerConsultation", async (req, res) => {
  try {
    const { dateConsultation, assistant, rendezvous } = req.body;

    if (!dateConsultation || !assistant || !rendezvous) {
      return res.status(400).send({ status: "notok", msg: "All fields are required" });
    }

    // Vérification de l'existence de l'assistant et du rendezvous
    const assistantDoc = await Assistant.findById(assistant);
    if (!assistantDoc) {
      return res.status(404).send({ status: "notok", msg: "Assistant not found" });
    }

    const rendezvousDoc = await Rendezvous.findById(rendezvous);
    if (!rendezvousDoc) {
      return res.status(404).send({ status: "notok", msg: "Rendezvous not found" });
    }

    const newConsultation = new Consultation({
      dateConsultation,
      assistant,
      rendezvous,
    });

    const savedConsultation = await newConsultation.save();
    res.status(200).send({
      status: "ok",
      msg: "Consultation successfully registered",
      consultation: savedConsultation,
    });
  } catch (err) {
    console.error("Error during consultation registration:", err);
    res.status(500).send({ status: "error", msg: "Internal server error" });
  }
});

module.exports = router;
