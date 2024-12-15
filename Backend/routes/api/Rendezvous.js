const router = require("express").Router();
const Rendezvous = require("../../models/Rendezvous");
const Patient = require("../../models/Patient");
const Docteur=require("../../models/Docteur");



router.post("/registerRDV", async (req, res) => {
    try {
        const { patientId, docteurId, date, heure, etat } = req.body;

        console.log("Received data:", req.body);

        // Vérifier les champs requis
        if (!patientId || !date || !heure || !docteurId) {
            console.log("Missing required fields");
            return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
        }

        // Vérifier si le patient existe
        const patient = await Patient.findById(patientId);
        if (!patient) {
            console.log("Patient not found");
            return res.status(404).send({ status: "notok", msg: "Patient not found" });
        }
        const docteur = await Docteur.findById(docteurId);
        if (!docteur) {
            console.log("Docteur not found");
            return res.status(404).send({ status: "notok", msg: "Docteur not found" });
        }

        // Créer une nouvelle instance de Rendezvous
        const newRendezvous = new Rendezvous({
            patient: patientId,
            docteur: docteurId,
            date,
            heure,
            etat: etat || "programmé", // Utiliser une valeur par défaut si non spécifié
        });

        console.log("New rendezvous object:", newRendezvous);

        // Sauvegarder le rendezvous dans la base de données
        const savedRendezvous = await newRendezvous.save();

        // Ajouter l'ID du rendezvous au tableau `rendezvous` du patient
        patient.rendezvous.push(savedRendezvous._id);
        await patient.save();

         // Ajouter l'ID du rendezvous au tableau `rendezvous` du docteur
         docteur.rendezvous.push(savedRendezvous._id);
         await docteur.save();

        console.log("Rendezvous saved successfully:", savedRendezvous);

        res.status(200).send({ status: "ok", msg: "Rendezvous successfully registered", rendezvous: savedRendezvous });
    } catch (err) {
        console.error("Error during rendezvous registration:", err);
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Mettre à jour uniquement l'état d'un RDV par ID
router.put('/:id/etat', async (req, res) => {
    const { id } = req.params;
    const { etat } = req.body; // Only expect 'etat' in the body

    try {
        // Trouver le compte à mettre à jour
        const rdv = await Rendezvous.findById(id);
        if (!rdv) {
            return res.status(404).json({ message: 'RDV non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            rdv.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedRDV = await rdv.save();
        res.status(200).json({ message: 'État du RDV mis à jour avec succès', updatedRDV });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du RDV', error });
    }
});



// Mettre à jour un RDV par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { patientId, docteurId, date, heure, etat } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const rdv = await Rendezvous.findById(id);
        if (!rdv) {
            return res.status(404).json({ message: 'RDV non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (patientId) rdv.patientId = patientId;
        if (docteurId) rdv.docteurId = docteurId;
        if (date) rdv.date = date;
        if (heure) rdv.heure = heure;
        if (etat) rdv.etat = etat;


        // Sauvegarder les modifications
        const updatedRDV = await rdv.save();
        res.status(200).json({ message: 'RDV mis à jour avec succès', updatedRDV });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du RDV', error });
    }
});

 // Supprimer un RDV par ID (DELETE)
 /*router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedRDV = await Rendezvous.findByIdAndDelete(id);
      if (!deletedRDV) {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }
      res.status(200).json({ message: 'RDV supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de RDV', error });
    }
  });*/

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the RDV by ID
      const rdv = await Rendezvous.findById(id);
      if (!rdv) {
        return res.status(404).json({ message: 'RDV not found' });
      }
  
      // Remove the RDV reference from the Patient
      const patient = await Patient.findById(rdv.patient);
      if (patient) {
        patient.rendezvous = patient.rendezvous.filter(
          (rendezvousId) => rendezvousId.toString() !== id
        );
        await patient.save();
      }
  
      // Remove the RDV reference from the Docteur
      const docteur = await Docteur.findById(rdv.docteur);
      if (docteur) {
        docteur.rendezvous = docteur.rendezvous.filter(
          (rendezvousId) => rendezvousId.toString() !== id
        );
        await docteur.save();
      }
  
      // Finally, delete the RDV itself
      await Rendezvous.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'RDV supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de RDV', error });
    }
  });
// Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
  try {
    const rdv = await Rendezvous.find();
    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
});



// Fonction pour générer tous les créneaux horaires possibles
const generateTimeSlots = (start, end, interval) => {
    const slots = [];
    let currentTime = start;

    while (currentTime < end) {
        slots.push(currentTime);
        const [hours, minutes] = currentTime.split(":").map(Number);
        currentTime = new Date(0, 0, 0, hours, minutes + interval)
            .toTimeString()
            .slice(0, 5);
    }

    return slots;
};

// Route pour récupérer les créneaux disponibles
router.post("/available-slots", async (req, res) => {
    try {
        const { date, docteurId } = req.body;

        if (!date || !docteurId) {
            return res.status(400).send({ status: "notok", msg: "Date et Docteur sont obligatoires" });
        }

        // Convertir la date entrée pour qu'elle corresponde au format "YYYY-MM-DD"
        const requestedDate = new Date(date).toISOString().split("T")[0];  // Format "YYYY-MM-DD"

        // Récupérer tous les rendez-vous pour cette date et ce docteur (en ignorants les heures)
        const appointments = await Rendezvous.find({
            date: { 
                $gte: new Date(`${requestedDate}T00:00:00Z`), 
                $lt: new Date(`${requestedDate}T23:59:59Z`) 
            },
            docteur: docteurId,
           // etat: { $ne: "annulé" } // Exclure les rendez-vous annulés
           etat: { $nin: ["annulé", "programmé","terminé"] }
        });

        // Plages horaires de la journée (ex: de 08:00 à 18:00 avec un intervalle de 30 minutes)
        const workingHours = { start: "09:00", end: "17:00", interval: 30 };

        // Générer tous les créneaux horaires possibles pour la journée
        const allSlots = generateTimeSlots(workingHours.start, workingHours.end, workingHours.interval);

        // Récupérer les créneaux déjà réservés
        const takenSlots = appointments.map(appointment => {
            // Extraire l'heure en format "HH:mm" pour être compatible avec le format des créneaux
            return new Date(`1970-01-01T${appointment.heure}Z`).toISOString().slice(11, 16);
        });

        // Filtrer les créneaux disponibles
        const availableSlots = allSlots.filter(slot => !takenSlots.includes(slot));

        // Si aucun créneau n'est disponible
        if (availableSlots.length === 0) {
            return res.status(404).json({ message: "Aucun créneau disponible pour cette date." });
        }

        // Renvoyer les créneaux disponibles
        return res.status(200).json({
            message: "Créneaux disponibles récupérés avec succès.",
            availableSlots,
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des créneaux:", error);
        return res.status(500).send({ status: "error", msg: "Erreur serveur interne" });
    }
});


module.exports = router;



